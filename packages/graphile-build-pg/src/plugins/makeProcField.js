// @flow
import debugFactory from "debug";

import type { Build, FieldWithHooksFunction } from "graphile-build";
import type { PgProc } from "./PgIntrospectionPlugin";
import type { SQL } from "pg-sql2";

const debugSql = debugFactory("graphile-build-pg:sql");
const firstValue = obj => {
  let firstKey;
  for (const k in obj) {
    if (k[0] !== "_" && k[1] !== "_") {
      firstKey = k;
    }
  }
  return obj[firstKey];
};

export default function makeProcField(
  fieldName: string,
  proc: PgProc,
  {
    pgIntrospectionResultsByKind: introspectionResultsByKind,
    pgGetGqlTypeByTypeIdAndModifier,
    pgGetGqlInputTypeByTypeIdAndModifier,
    getTypeByName,
    pgSql: sql,
    parseResolveInfo,
    getSafeAliasFromResolveInfo,
    getSafeAliasFromAlias,
    gql2pg,
    pg2gql,
    newWithHooks,
    pgStrictFunctions: strictFunctions,
    pgTweakFragmentForTypeAndModifier,
    graphql: {
      GraphQLNonNull,
      GraphQLList,
      GraphQLString,
      GraphQLInt,
      GraphQLFloat,
      GraphQLBoolean,
      GraphQLObjectType,
      GraphQLInputObjectType,
      getNamedType,
      isCompositeType,
    },
    inflection,
    pgQueryFromResolveData: queryFromResolveData,
    pgAddStartEndCursor: addStartEndCursor,
    pgViaTemporaryTable: viaTemporaryTable,
  }: {| ...Build |},
  {
    fieldWithHooks,
    computed = false,
    isMutation = false,
    forceList = false,
  }: {
    fieldWithHooks: FieldWithHooksFunction,
    computed?: boolean,
    isMutation?: boolean,
    forceList?: boolean,
  }
) {
  const { pluralize, camelCase } = inflection;
  function getResultFieldName(proc, gqlType, type, returnsSet) {
    if (proc.tags.resultFieldName) {
      return proc.tags.resultFieldName;
    }
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
      name = camelCase(gqlNamedType.name);
    }
    return returnsSet || type.isPgArray ? pluralize(name) : name;
  }
  if (computed && isMutation) {
    throw new Error("Mutation procedure cannot be computed");
  }
  const sliceAmount = computed ? 1 : 0;
  const argNames = proc.argTypeIds
    .slice(sliceAmount)
    .map((_, idx) => proc.argNames[idx + sliceAmount] || "");
  const argTypes = proc.argTypeIds
    .slice(sliceAmount)
    .map(typeId => introspectionResultsByKind.typeById[typeId]);
  const requiredArgCount = Math.max(0, argNames.length - proc.argDefaultsNum);
  const variantFromName = (name, _type) => {
    if (name.match(/(_p|P)atch$/)) {
      return "patch";
    }
    return null;
  };
  const variantFromTags = (tags, idx) => {
    const variant = tags[`arg${idx}variant`];
    if (variant && variant.match && variant.match(/^[0-9]+$/)) {
      return parseInt(variant, 10);
    }
    return variant;
  };
  const notNullArgCount =
    proc.isStrict || strictFunctions ? requiredArgCount : 0;
  const argGqlTypes = argTypes.map((type, idx) => {
    // TODO: PG10 doesn't support the equivalent of pg_attribute.atttypemod on function return values, but maybe a later version might
    const variant =
      variantFromTags(proc.tags, idx) || variantFromName(argNames[idx], type);
    const Type = pgGetGqlInputTypeByTypeIdAndModifier(type.id, variant);
    if (!Type) {
      const hint = type.class
        ? `; you might want to use smart comments, e.g. 'COMMENT ON FUNCTION "${
            proc.namespace.name
          }"."${proc.name}"(${argTypes
            .map(t => `"${t.namespaceName}"."${t.name}"`)
            .join(", ")}) IS E'@arg${idx}variant base';"`
        : "";
      throw new Error(
        `Could not determine type for argument ${idx} ('${
          argNames[idx]
        }') of function '${proc.name}'${hint}`
      );
    }
    if (idx >= notNullArgCount) {
      return Type;
    } else {
      return new GraphQLNonNull(Type);
    }
  });

  const rawReturnType = introspectionResultsByKind.typeById[proc.returnTypeId];
  const returnType = rawReturnType.isPgArray
    ? rawReturnType.arrayItemType
    : rawReturnType;
  const returnTypeTable =
    introspectionResultsByKind.classById[returnType.classId];
  if (!returnType) {
    throw new Error(
      `Could not determine return type for function '${proc.name}'`
    );
  }
  let type;
  const fieldScope = {};
  const payloadTypeScope = {};
  fieldScope.pgFieldIntrospection = proc;
  payloadTypeScope.pgIntrospection = proc;
  let returnFirstValueAsValue = false;
  const TableType =
    returnTypeTable &&
    pgGetGqlTypeByTypeIdAndModifier(returnTypeTable.type.id, null);

  const isTableLike: boolean =
    (TableType && isCompositeType(TableType)) || false;
  if (isTableLike) {
    if (proc.returnsSet) {
      if (isMutation) {
        type = new GraphQLList(TableType);
      } else if (forceList) {
        type = new GraphQLList(TableType);
        fieldScope.isPgFieldSimpleCollection = true;
      } else {
        const ConnectionType = getTypeByName(
          inflection.connection(TableType.name)
        );
        if (!ConnectionType) {
          throw new Error(
            `Do not have a connection type '${inflection.connection(
              TableType.name
            )}' for '${TableType.name}' so cannot create procedure field`
          );
        }
        type = new GraphQLNonNull(ConnectionType);
        fieldScope.isPgFieldConnection = true;
      }
      fieldScope.pgFieldIntrospectionTable = returnTypeTable;
      payloadTypeScope.pgIntrospectionTable = returnTypeTable;
    } else {
      type = TableType;
      if (rawReturnType.isPgArray) {
        type = new GraphQLList(type);
      }
      fieldScope.pgFieldIntrospectionTable = returnTypeTable;
      payloadTypeScope.pgIntrospectionTable = returnTypeTable;
    }
  } else {
    // TODO: PG10 doesn't support the equivalent of pg_attribute.atttypemod on function return values, but maybe a later version might
    const Type =
      pgGetGqlTypeByTypeIdAndModifier(returnType.id, null) || GraphQLString;
    if (proc.returnsSet) {
      const connectionTypeName = inflection.scalarFunctionConnection(proc);
      const ConnectionType = getTypeByName(connectionTypeName);
      if (isMutation) {
        // Cannot return a connection because it would have to run the mutation again
        type = new GraphQLList(Type);
        returnFirstValueAsValue = true;
      } else if (forceList || !ConnectionType) {
        type = new GraphQLList(Type);
        returnFirstValueAsValue = true;
        fieldScope.isPgFieldSimpleCollection = true;
      } else {
        type = new GraphQLNonNull(ConnectionType);
        fieldScope.isPgFieldConnection = true;
        // We don't return the first value as the value here because it gets
        // sent down into PgScalarFunctionConnectionPlugin so the relevant
        // EdgeType can return cursor / node; i.e. we might want to add an
        // `__cursor` field so we can't just use a scalar.
      }
    } else {
      returnFirstValueAsValue = true;
      type = Type;
      if (rawReturnType.isPgArray) {
        type = new GraphQLList(type);
      }
    }
  }
  return fieldWithHooks(
    fieldName,
    ({
      addDataGenerator,
      getDataFromParsedResolveInfoFragment,
      addArgDataGenerator,
    }) => {
      if (
        proc.returnsSet &&
        !isTableLike &&
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
      function makeMutationCall(
        parsedResolveInfoFragment,
        ReturnType,
        { implicitArgs = [] } = {}
      ): SQL {
        const { args: rawArgs = {} } = parsedResolveInfoFragment;
        const args = isMutation ? rawArgs.input : rawArgs;
        const sqlArgValues = [];
        let haveNames = true;
        for (let argIndex = argNames.length - 1; argIndex >= 0; argIndex--) {
          const argName = argNames[argIndex];
          const gqlArgName = inflection.argument(argName, argIndex);
          const value = args[gqlArgName];
          const sqlValue = gql2pg(value, argTypes[argIndex]);
          if (argIndex + 1 > requiredArgCount && haveNames && value == null) {
            // No need to pass argument to function
            continue;
          } else if (argIndex + 1 > requiredArgCount && haveNames) {
            const sqlArgName = argName ? sql.identifier(argName) : null;
            if (sqlArgName) {
              sqlArgValues.unshift(sql.fragment`${sqlArgName} := ${sqlValue}`);
            } else {
              haveNames = false;
              sqlArgValues.unshift(sqlValue);
            }
          } else {
            sqlArgValues.unshift(sqlValue);
          }
        }
        const functionCall = sql.fragment`${sql.identifier(
          proc.namespace.name,
          proc.name
        )}(${sql.join([...implicitArgs, ...sqlArgValues], ", ")})`;
        return rawReturnType.isPgArray
          ? sql.fragment`unnest(${functionCall})`
          : functionCall;
      }
      function makeQuery(
        parsedResolveInfoFragment,
        ReturnType,
        sqlMutationQuery,
        functionAlias
      ) {
        const resolveData = getDataFromParsedResolveInfoFragment(
          parsedResolveInfoFragment,
          ReturnType
        );
        const query = queryFromResolveData(
          sqlMutationQuery,
          functionAlias,
          resolveData,
          {
            withPagination: !forceList && !isMutation && proc.returnsSet,
            withPaginationAsFields:
              !forceList && !isMutation && proc.returnsSet && !computed,
            asJson:
              computed &&
              (forceList || (!proc.returnsSet && !returnFirstValueAsValue)),
            asJsonAggregate:
              computed &&
              (forceList || (!proc.returnsSet && rawReturnType.isPgArray)),
            addNullCase:
              !proc.returnsSet && !rawReturnType.isPgArray && isTableLike,
          },
          innerQueryBuilder => {
            if (!isTableLike) {
              if (returnTypeTable) {
                innerQueryBuilder.select(
                  pgTweakFragmentForTypeAndModifier(
                    sql.fragment`${functionAlias}`,
                    returnTypeTable.type,
                    null,
                    resolveData
                  ),
                  "value"
                );
              } else {
                innerQueryBuilder.select(
                  pgTweakFragmentForTypeAndModifier(
                    sql.fragment`${functionAlias}.${functionAlias}`,
                    returnType,
                    null, // We can't determine a type modifier for functions
                    resolveData
                  ),
                  "value"
                );
              }
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
                const functionAlias = sql.identifier(Symbol());
                const sqlMutationQuery = makeMutationCall(
                  parsedResolveInfoFragment,
                  ReturnType,
                  {
                    implicitArgs: [parentTableAlias],
                  }
                );
                const query = makeQuery(
                  parsedResolveInfoFragment,
                  ReturnType,
                  sqlMutationQuery,
                  functionAlias
                );
                return sql.fragment`(${query})`;
              }, getSafeAliasFromAlias(parsedResolveInfoFragment.alias));
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
          proc,
          type,
          rawReturnType,
          proc.returnsSet
        );
        const isNotVoid = String(returnType.id) !== "2278";
        // If set then plural name
        PayloadType = newWithHooks(
          GraphQLObjectType,
          {
            name: inflection.functionPayloadType(proc),
            description: `The output of our \`${inflection.functionMutationName(
              proc
            )}\` mutation.`,
            fields: ({ recurseDataGeneratorsForField }) => {
              if (isNotVoid) {
                recurseDataGeneratorsForField(resultFieldName);
              }
              return Object.assign(
                {},
                {
                  clientMutationId: {
                    type: GraphQLString,
                  },
                },
                isNotVoid
                  ? {
                      [resultFieldName]: {
                        type: type,
                        resolve(data) {
                          return data.data;
                        },
                      },
                      // Result
                    }
                  : null
              );
            },
          },
          Object.assign(
            {},
            {
              isMutationPayload: true,
            },
            payloadTypeScope
          )
        );
        ReturnType = PayloadType;
        const InputType = newWithHooks(
          GraphQLInputObjectType,
          {
            name: inflection.functionInputType(proc),
            description: `All input for the \`${inflection.functionMutationName(
              proc
            )}\` mutation.`,
            fields: Object.assign(
              {
                clientMutationId: {
                  type: GraphQLString,
                },
              },
              args
            ),
          },
          {
            isMutationInput: true,
          }
        );
        args = {
          input: {
            type: new GraphQLNonNull(InputType),
          },
        };
      }
      // If this is a table we can process it directly; but if it's a scalar
      // setof function we must dereference '.value' from it, because this
      // makes space for '__cursor' to exist alongside it (whereas on a table
      // the '__cursor' can just be on the table object itself)
      const scalarAwarePg2gql = v =>
        isTableLike
          ? pg2gql(v, returnType)
          : {
              ...v,
              value: pg2gql(v.value, returnType),
            };

      return {
        description: proc.description
          ? proc.description
          : isTableLike && proc.returnsSet
            ? `Reads and enables pagination through a set of \`${
                TableType.name
              }\`.`
            : null,
        type: ReturnType,
        args: args,
        resolve: computed
          ? (data, _args, _context, resolveInfo) => {
              const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
              const value = data[safeAlias];
              if (returnFirstValueAsValue) {
                if (proc.returnsSet && !forceList) {
                  // EITHER `isMutation` is true, or `ConnectionType` does not
                  // exist - either way, we're not returning a connection.
                  return value.data
                    .map(firstValue)
                    .map(v => pg2gql(v, returnType));
                } else if (proc.returnsSet || rawReturnType.isPgArray) {
                  return value.map(firstValue).map(v => pg2gql(v, returnType));
                } else {
                  return pg2gql(value, returnType);
                }
              } else {
                if (proc.returnsSet && !isMutation && !forceList) {
                  return addStartEndCursor({
                    ...value,
                    data: value.data ? value.data.map(scalarAwarePg2gql) : null,
                  });
                } else if (proc.returnsSet || rawReturnType.isPgArray) {
                  return value.map(v => pg2gql(v, returnType));
                } else {
                  return pg2gql(value, returnType);
                }
              }
            }
          : async (data, args, { pgClient }, resolveInfo) => {
              const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
              const functionAlias = sql.identifier(Symbol());
              const sqlMutationQuery = makeMutationCall(
                parsedResolveInfoFragment,
                resolveInfo.returnType,
                {}
              );

              let queryResultRows;
              if (isMutation) {
                const query = makeQuery(
                  parsedResolveInfoFragment,
                  resolveInfo.returnType,
                  functionAlias,
                  functionAlias
                );
                const intermediateIdentifier = sql.identifier(Symbol());
                const isVoid = returnType.id === "2278";
                const isPgClass =
                  !returnFirstValueAsValue || returnTypeTable || false;
                try {
                  await pgClient.query("SAVEPOINT graphql_mutation");
                  queryResultRows = await viaTemporaryTable(
                    pgClient,
                    isVoid
                      ? null
                      : sql.identifier(
                          returnType.namespaceName,
                          returnType.name
                        ),
                    sql.query`select ${
                      isPgClass
                        ? sql.query`${intermediateIdentifier}.*`
                        : sql.query`${intermediateIdentifier}.${intermediateIdentifier} as ${functionAlias}`
                    } from ${sqlMutationQuery} ${intermediateIdentifier}`,
                    functionAlias,
                    query,
                    isPgClass
                  );
                  await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
                } catch (e) {
                  await pgClient.query(
                    "ROLLBACK TO SAVEPOINT graphql_mutation"
                  );
                  throw e;
                }
              } else {
                const query = makeQuery(
                  parsedResolveInfoFragment,
                  resolveInfo.returnType,
                  sqlMutationQuery,
                  functionAlias
                );
                const { text, values } = sql.compile(query);
                if (debugSql.enabled) debugSql(text);
                const queryResult = await pgClient.query(text, values);
                queryResultRows = queryResult.rows;
              }
              const rows = queryResultRows;
              const [row] = rows;
              const result = (() => {
                if (returnFirstValueAsValue) {
                  if (proc.returnsSet && !isMutation && !forceList) {
                    // EITHER `isMutation` is true, or `ConnectionType` does
                    // not exist - either way, we're not returning a
                    // connection.
                    return row.data
                      .map(firstValue)
                      .map(v => pg2gql(v, returnType));
                  } else if (proc.returnsSet || rawReturnType.isPgArray) {
                    return rows.map(firstValue).map(v => pg2gql(v, returnType));
                  } else {
                    return pg2gql(firstValue(row), returnType);
                  }
                } else {
                  if (proc.returnsSet && !isMutation && !forceList) {
                    // Connection
                    return addStartEndCursor({
                      ...row,
                      data: row.data ? row.data.map(scalarAwarePg2gql) : null,
                    });
                  } else if (proc.returnsSet || rawReturnType.isPgArray) {
                    return rows.map(row => pg2gql(row, returnType));
                  } else {
                    return pg2gql(row, returnType);
                  }
                }
              })();
              if (isMutation) {
                return {
                  clientMutationId: args.input.clientMutationId,
                  data: result,
                };
              } else {
                return result;
              }
            },
      };
    },
    fieldScope
  );
}
