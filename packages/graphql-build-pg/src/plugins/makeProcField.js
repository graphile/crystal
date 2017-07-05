const {
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLInputObjectType,
  getNamedType,
} = require("graphql");
const debugSql = require("debug")("graphql-build-pg:sql");
const camelcase = require("lodash/camelcase");
const pluralize = require("pluralize");
const queryFromResolveData = require("../queryFromResolveData");
const firstValue = obj => {
  let firstKey;
  for (const k in obj) {
    firstKey = k;
  }
  return obj[firstKey];
};
const addStartEndCursor = require("./addStartEndCursor");

function getResultFieldName(gqlType, type, returnsSet) {
  const gqlNamedType = getNamedType(gqlType);
  let name;
  if (gqlNamedType === GraphQLInt) {
    name = "integer";
  } else if (gqlNamedType === GraphQLFloat) {
    name = "float";
  } else if (gqlNamedType === GraphQLBoolean) {
    name = "boolean";
  } else if (gqlNamedType === GraphQLString) {
    name = "string";
  } else {
    name = camelcase(gqlNamedType.name);
  }
  return returnsSet ? pluralize(name) : name;
}
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
    $$isQuery,
    buildObjectWithHooks,
  },
  isMutation = false
) {
  if (computed && isMutation) {
    throw new Error("Mutation procedure cannot be computed");
  }
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
      inflection.tableType(
        returnTypeTable.name,
        returnTypeTable.namespace && returnTypeTable.namespace.name
      )
    );
    if (proc.returnsSet) {
      if (isMutation) {
        type = new GraphQLList(TableType);
      } else {
        const ConnectionType = getTypeByName(
          inflection.connection(TableType.name)
        );
        type = new GraphQLNonNull(ConnectionType);
        scope.isPgConnectionField = true;
      }
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
        if (isMutation) {
          // Cannot return a connection because it would have to run the mutation again
          type = new GraphQLList(Type);
          returnFirstValueAsValue = true;
        } else {
          type = new GraphQLNonNull(ConnectionType);
          scope.isPgConnectionField = true;
        }
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
      if (
        proc.returnsSet &&
        !returnTypeTable &&
        !returnFirstValueAsValue &&
        !isMutation
      ) {
        // Natural ordering
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
        const { args: rawArgs = {} } = parsedResolveInfoFragment;
        const args = isMutation ? rawArgs.input : rawArgs;
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
          )}(${sql.join([...implicitArgs, ...sqlArgValues], ", ")})`,
          functionAlias,
          resolveData,
          {
            withPagination: !isMutation && proc.returnsSet,
            withPaginationAsFields: !isMutation && proc.returnsSet && !computed,
            asJson: !proc.returnsSet && computed && !returnFirstValueAsValue,
            addNullCase: !proc.returnsSet && returnTypeTable,
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
        return query;
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

      let ReturnType = type;
      let PayloadType;
      let args = argNames.reduce((memo, argName, argIndex) => {
        const gqlArgName = inflection.argument(argName, argIndex);
        memo[gqlArgName] = {
          type: argGqlTypes[argIndex],
        };
        return memo;
      }, {});
      if (isMutation) {
        const resultFieldName = getResultFieldName(
          type,
          returnType,
          proc.returnsSet
        );
        const isNotVoid = String(returnType.id) !== "2278";
        // If set then plural name
        PayloadType = buildObjectWithHooks(
          GraphQLObjectType,
          {
            name: inflection.functionPayloadType(
              proc.name,
              proc.namespace.name
            ),
            fields: ({ recurseDataGeneratorsForField }) => {
              if (isNotVoid) {
                recurseDataGeneratorsForField(resultFieldName);
              }
              return Object.assign(
                {
                  clientMutationId: {
                    type: GraphQLString,
                    resolve(data) {
                      return data.__clientMutationId;
                    },
                  },
                },
                isNotVoid && {
                  [resultFieldName]: {
                    type: type,
                    resolve(data) {
                      return data.data;
                    },
                  },
                  // Result
                }
              );
            },
          },
          Object.assign(
            {
              isMutationPayload: true,
            },
            scope
          )
        );
        ReturnType = new GraphQLNonNull(PayloadType);
        const InputType = buildObjectWithHooks(GraphQLInputObjectType, {
          name: inflection.functionInputType(proc.name, proc.namespace.name),
          fields: Object.assign(
            {
              clientMutationId: {
                type: GraphQLString,
              },
            },
            args
          ),
        });
        args = {
          input: {
            type: new GraphQLNonNull(InputType),
          },
        };
      }

      return {
        type: ReturnType,
        args: args,
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
                if (proc.returnsSet && !isMutation) {
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
              const { rows } = await pgClient.query(text, values);
              const [row] = rows;
              const result = (() => {
                if (returnFirstValueAsValue) {
                  if (proc.returnsSet && !isMutation) {
                    return row.data
                      .map(firstValue)
                      .map(v => pg2gql(v, returnType));
                  } else if (proc.returnsSet) {
                    return rows.map(firstValue).map(v => pg2gql(v, returnType));
                  } else {
                    return pg2gql(firstValue(row), returnType);
                  }
                } else {
                  if (proc.returnsSet && !isMutation) {
                    // Connection
                    return addStartEndCursor(row);
                  } else if (proc.returnsSet) {
                    return rows;
                  } else {
                    return row;
                  }
                }
              })();
              if (isMutation) {
                return {
                  __clientMutationId: args.input.clientMutationId,
                  data: result,
                };
              } else {
                return result;
              }
            },
      };
    },
    scope
  );
};
