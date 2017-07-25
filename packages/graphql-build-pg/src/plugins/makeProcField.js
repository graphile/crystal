// @flow
import debugFactory from "debug";
import camelCase from "lodash/camelCase";
import pluralize from "pluralize";
import queryFromResolveData from "../queryFromResolveData";
import addStartEndCursor from "./addStartEndCursor";

import type { Build, FieldWithHooksFunction } from "graphql-build";
import type { Proc } from "./PgIntrospectionPlugin";

const debugSql = debugFactory("graphql-build-pg:sql");
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
    pgGqlTypeByTypeId,
    pgGqlInputTypeByTypeId,
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
    return returnsSet || type.arrayItemType ? pluralize(name) : name;
  }
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
  const notNullArgCount =
    proc.isStrict || strictFunctions ? requiredArgCount : 0;
  const argGqlTypes = argTypes.map((type, idx) => {
    const Type = pgGqlInputTypeByTypeId[type.id] || GraphQLString;
    if (idx >= notNullArgCount) {
      return Type;
    } else {
      return new GraphQLNonNull(Type);
    }
  });

  const rawReturnType = introspectionResultsByKind.typeById[proc.returnTypeId];
  const returnType = rawReturnType.arrayItemType || rawReturnType;
  const returnTypeTable =
    introspectionResultsByKind.classById[returnType.classId];
  if (!returnType) {
    throw new Error(
      `Could not determine return type for function '${proc.name}'`
    );
  }
  let type;
  const scope = {};
  scope.pgIntrospection = proc;
  let returnFirstValueAsValue = false;
  const TableType =
    returnTypeTable &&
    getTypeByName(
      inflection.tableType(
        returnTypeTable.name,
        returnTypeTable.namespace && returnTypeTable.namespace.name
      )
    );

  const isTableLike = TableType && isCompositeType(TableType);
  if (isTableLike) {
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
      scope.pgIntrospectionTable = returnTypeTable;
    } else {
      type = TableType;
      if (rawReturnType.arrayItemType) {
        type = new GraphQLList(type);
      }
      scope.pgIntrospectionTable = returnTypeTable;
    }
  } else {
    const Type = pgGqlTypeByTypeId[returnType.id] || GraphQLString;
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
      } else {
        returnFirstValueAsValue = true;
        type = new GraphQLList(Type);
      }
    } else {
      returnFirstValueAsValue = true;
      type = Type;
      if (rawReturnType.arrayItemType) {
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
            scope
          )
        );
        ReturnType = new GraphQLNonNull(PayloadType);
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
        description:
          proc.description ||
          (isTableLike &&
            `Reads and enables pagination through a set of \`${TableType.name}\`.`),
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
              const query = makeQuery(
                parsedResolveInfoFragment,
                resolveInfo.returnType,
                {}
              );

              const { text, values } = sql.compile(query);
              if (debugSql.enabled) debugSql(text);
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
                  clientMutationId: args.input.clientMutationId,
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
}
