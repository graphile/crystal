// @flow
import debugFactory from "debug";
import camelCase from "lodash/camelCase";
import pluralize from "pluralize";
import queryFromResolveData from "../queryFromResolveData";
import addStartEndCursor from "./addStartEndCursor";
import viaTemporaryTable from "./viaTemporaryTable";

import type { Build, FieldWithHooksFunction } from "graphile-build";
import type { Proc } from "./PgIntrospectionPlugin";
import type { SQL } from "pg-sql2";

const debugSql = debugFactory("graphile-build-pg:sql");
const firstValue = obj => {
  let firstKey;
  for (const k in obj) {
    firstKey = k;
  }
  return obj[firstKey];
};

export default function makeProcField(
  fieldName: string,
  proc: Proc,
  {
    pgIntrospectionResultsByKind: introspectionResultsByKind,
    pgGetGqlTypeByTypeId,
    pgGetGqlInputTypeByTypeId,
    getTypeByName,
    pgSql: sql,
    parseResolveInfo,
    getAliasFromResolveInfo,
    gql2pg,
    pg2gql,
    newWithHooks,
    pgInflection: inflection,
    pgStrictFunctions: strictFunctions,
    pgTweakFragmentForType,
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
  }: {| ...Build |},
  {
    fieldWithHooks,
    computed = false,
    isMutation = false,
  }: {
    fieldWithHooks: FieldWithHooksFunction,
    computed?: boolean,
    isMutation?: boolean,
  }
) {
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
  const notNullArgCount =
    proc.isStrict || strictFunctions ? requiredArgCount : 0;
  const argGqlTypes = argTypes.map((type, idx) => {
    const Type = pgGetGqlInputTypeByTypeId(type.id) || GraphQLString;
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
    returnTypeTable && pgGetGqlTypeByTypeId(returnTypeTable.type.id);

  const isTableLike: boolean =
    (TableType && isCompositeType(TableType)) || false;
  if (isTableLike) {
    if (proc.returnsSet) {
      if (isMutation) {
        type = new GraphQLList(TableType);
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
    const Type = pgGetGqlTypeByTypeId(returnType.id) || GraphQLString;
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
          fieldScope.isPgFieldConnection = true;
        }
      } else {
        returnFirstValueAsValue = true;
        type = new GraphQLList(Type);
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
        return sql.fragment`${sql.identifier(
          proc.namespace.name,
          proc.name
        )}(${sql.join([...implicitArgs, ...sqlArgValues], ", ")})`;
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
            withPagination: !isMutation && proc.returnsSet,
            withPaginationAsFields: !isMutation && proc.returnsSet && !computed,
            asJson: !proc.returnsSet && computed && !returnFirstValueAsValue,
            addNullCase: !proc.returnsSet && isTableLike,
          },
          innerQueryBuilder => {
            if (!isTableLike) {
              if (returnTypeTable) {
                innerQueryBuilder.select(
                  pgTweakFragmentForType(
                    sql.fragment`${functionAlias}`,
                    returnTypeTable.type
                  ),
                  "value"
                );
              } else {
                innerQueryBuilder.select(
                  sql.fragment`${functionAlias}.${functionAlias}`,
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
          rawReturnType,
          proc.returnsSet
        );
        const isNotVoid = String(returnType.id) !== "2278";
        // If set then plural name
        PayloadType = newWithHooks(
          GraphQLObjectType,
          {
            name: inflection.functionPayloadType(
              proc.name,
              proc.namespace.name
            ),
            description: `The output of our \`${inflection.functionName(
              proc.name,
              proc.namespace.name
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
            name: inflection.functionInputType(proc.name, proc.namespace.name),
            description: `All input for the \`${inflection.functionName(
              proc.name,
              proc.namespace.name
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

      return {
        description: proc.description
          ? proc.description
          : isTableLike
            ? `Reads and enables pagination through a set of \`${
                TableType.name
              }\`.`
            : null,
        type: ReturnType,
        args: args,
        resolve: computed
          ? (data, _args, _context, resolveInfo) => {
              const alias = getAliasFromResolveInfo(resolveInfo);
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
              const functionAlias = sql.identifier(Symbol());
              const sqlMutationQuery = makeMutationCall(
                parsedResolveInfoFragment,
                resolveInfo.returnType,
                {}
              );

              let queryResult;
              if (isMutation) {
                const query = makeQuery(
                  parsedResolveInfoFragment,
                  resolveInfo.returnType,
                  functionAlias,
                  functionAlias
                );
                const returnType = rawReturnType;
                const intermediateIdentifier = sql.identifier(Symbol());
                const isVoid = returnType.id === "2278";
                const isPgClass =
                  !returnFirstValueAsValue || returnTypeTable || false;
                try {
                  await pgClient.query("SAVEPOINT graphql_mutation");
                  queryResult = await viaTemporaryTable(
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
                queryResult = await pgClient.query(text, values);
              }
              const { rows } = queryResult;
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
