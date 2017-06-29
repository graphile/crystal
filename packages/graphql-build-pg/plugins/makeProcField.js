const { GraphQLNonNull, GraphQLList, GraphQLString } = require("graphql");
const debugSql = require("debug")("graphql-build-pg:sql");
const queryFromResolveData = require("../queryFromResolveData");
const firstValue = obj => {
  let firstKey;
  for (const k in obj) {
    firstKey = k;
  }
  return obj[firstKey];
};
const addStartEndCursor = require("./addStartEndCursor");

module.exports = function makeProcField(
  fieldName,
  proc,
  {
    buildFieldWithHooks,
    computed,
    strictFunctions,
    introspectionResultsByKind,
    gqlTypeByTypeId,
    gqlInputTypeByTypeId,
    getTypeByName,
    inflection,
    sql,
    parseResolveInfo,
    gql2pg,
    pg2gql,
    pgAddPaginationToQuery,
  }
) {
  const sliceAmount = computed ? 1 : 0;
  const argNames = proc.argTypeIds
    .map((_, idx) => proc.argNames[idx] || "")
    .slice(sliceAmount);
  const argTypes = proc.argTypeIds
    .slice(sliceAmount)
    .map(typeId => introspectionResultsByKind.typeById[typeId]);
  const requiredArgCount = Math.max(
    0,
    proc.isStrict
      ? argNames.length - sliceAmount
      : argNames.length - sliceAmount - proc.argDefaultsNum
  );
  const notNullArgCount = proc.isStrict || strictFunctions
    ? requiredArgCount
    : 0;
  const argGqlTypes = argTypes.map((type, idx) => {
    const Type = gqlInputTypeByTypeId[type.id] || GraphQLString;
    if (idx >= notNullArgCount) {
      return Type;
    } else {
      return new GraphQLNonNull(Type);
    }
  });

  const returnType = introspectionResultsByKind.typeById[proc.returnTypeId];
  const returnTypeTable =
    introspectionResultsByKind.classById[returnType.classId];
  if (!returnType) {
    throw new Error(
      `Could not determine return type for function '${proc.name}'`
    );
  }
  let type;
  const scope = {};
  let returnFirstValueAsValue = false;
  if (returnTypeTable) {
    const TableType = getTypeByName(
      inflection.tableType(returnTypeTable.name, returnTypeTable.namespace.name)
    );
    if (proc.returnsSet) {
      const ConnectionType = getTypeByName(
        inflection.connection(TableType.name)
      );
      type = new GraphQLNonNull(ConnectionType);
      scope.isPgConnectionField = true;
      scope.pgIntrospection = returnTypeTable;
    } else {
      type = TableType;
      scope.pgIntrospection = returnTypeTable;
    }
  } else {
    const Type = gqlTypeByTypeId[returnType.id] || GraphQLString;
    if (proc.returnsSet) {
      const connectionTypeName = inflection.scalarFunctionConnection(
        proc.name,
        proc.namespace.name
      );
      const ConnectionType = getTypeByName(connectionTypeName);
      if (ConnectionType) {
        type = new GraphQLNonNull(ConnectionType);
        scope.isPgConnectionField = true;
        scope.pgIntrospection = proc;
      } else {
        returnFirstValueAsValue = true;
        type = new GraphQLList(Type);
      }
    } else {
      returnFirstValueAsValue = true;
      type = Type;
    }
  }
  return buildFieldWithHooks(
    fieldName,
    ({
      addDataGenerator,
      getDataFromParsedResolveInfoFragment,
      addArgDataGenerator,
    }) => {
      if (proc.returnsSet && !returnTypeTable && !returnFirstValueAsValue) {
        addArgDataGenerator(function addPgCursorPrefix() {
          return {
            pgCursorPrefix: sql.literal("natural"),
          };
        });
      }
      function makeQuery(
        parsedResolveInfoFragment,
        ReturnType,
        { implicitArgs = [] } = {}
      ) {
        const resolveData = getDataFromParsedResolveInfoFragment(
          parsedResolveInfoFragment,
          ReturnType
        );
        const { args = {} } = parsedResolveInfoFragment;
        const sqlArgValues = argNames.map((argName, argIndex) => {
          const gqlArgName = inflection.argument(argName, argIndex);
          return gql2pg(args[gqlArgName], argTypes[argIndex]);
        });
        while (
          sqlArgValues.length > requiredArgCount &&
          args[argNames[sqlArgValues.length - 1]] == null
        ) {
          sqlArgValues.pop();
        }
        const functionAlias = sql.identifier(Symbol());
        const query = queryFromResolveData(
          sql.fragment`${sql.identifier(
            proc.namespace.name,
            proc.name
          )}(${sql.join([...implicitArgs, ...sqlArgValues], ",")})`,
          functionAlias,
          resolveData,
          {
            asJsonAggregate: proc.returnsSet,
            asJson: computed && !returnFirstValueAsValue,
            addNullCase: returnTypeTable,
          },
          innerQueryBuilder => {
            if (!returnTypeTable) {
              innerQueryBuilder.select(
                sql.fragment`${functionAlias}.${functionAlias}`,
                "value"
              );
            }
          }
        );
        if (proc.returnsSet) {
          return pgAddPaginationToQuery(query, resolveData, {
            asFields: !computed,
          });
        } else {
          return query;
        }
      }
      if (computed) {
        addDataGenerator((parsedResolveInfoFragment, ReturnType) => {
          return {
            pgQuery: queryBuilder => {
              queryBuilder.select(() => {
                const parentTableAlias = queryBuilder.getTableAlias();
                const query = makeQuery(parsedResolveInfoFragment, ReturnType, {
                  implicitArgs: [parentTableAlias],
                });
                return sql.fragment`(${query})`;
              }, parsedResolveInfoFragment.alias);
            },
          };
        });
      }
      return {
        type: type,
        args: argNames.reduce((memo, argName, argIndex) => {
          const gqlArgName = inflection.argument(argName, argIndex);
          memo[gqlArgName] = {
            type: argGqlTypes[argIndex],
          };
          return memo;
        }, {}),
        resolve: computed
          ? (data, _args, _context, resolveInfo) => {
              const alias = parseResolveInfo(resolveInfo, { aliasOnly: true });
              const value = data[alias];
              if (returnFirstValueAsValue) {
                if (proc.returnsSet) {
                  return value.data
                    .map(firstValue)
                    .map(v => pg2gql(v, returnType));
                } else {
                  return pg2gql(value, returnType);
                }
              } else {
                if (proc.returnsSet) {
                  return addStartEndCursor(value);
                } else {
                  return value;
                }
              }
            }
          : async (data, args, { pgClient }, resolveInfo) => {
              const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
              const query = makeQuery(
                parsedResolveInfoFragment,
                resolveInfo.returnType,
                {}
              );

              const { text, values } = sql.compile(query);
              if (debugSql.enabled)
                debugSql(require("sql-formatter").format(text));
              const { rows: [row] } = await pgClient.query(text, values);
              if (returnFirstValueAsValue) {
                if (proc.returnsSet) {
                  return row.data
                    .map(firstValue)
                    .map(v => pg2gql(v, returnType));
                } else {
                  return pg2gql(firstValue(row), returnType);
                }
              } else {
                if (proc.returnsSet) {
                  // Connection
                  return addStartEndCursor(row);
                } else {
                  return row;
                }
              }
            },
      };
    },
    scope
  );
};
