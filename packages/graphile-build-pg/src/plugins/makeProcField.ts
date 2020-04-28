import {
  Build,
  FieldWithHooksFunction,
  ScopeGraphQLObjectTypeFieldsField,
  ScopeGraphQLObjectType,
  GraphileInputObjectTypeConfig,
} from "graphile-build";
import { PgProc, PgType, SmartTags } from "./PgIntrospectionPlugin";
import { SQL } from "pg-sql2";
import debugSql from "./debugSql";
import chalk from "chalk";
import { ResolveTree } from "graphql-parse-resolve-info";
import QueryBuilder, { GraphileResolverContext } from "../QueryBuilder";
import { nullableIf } from "../utils";

declare module "graphile-build" {
  interface GraphileBuildOptions {
    pgForbidSetofFunctionsToReturnNull?: boolean;
  }
}

const firstValue = (obj: { [key: string]: any }): any => {
  let firstKey;
  for (const k in obj) {
    if (k[0] !== "_" && k[1] !== "_") {
      firstKey = k;
    }
  }
  return firstKey != null ? obj[firstKey] : undefined;
};

export default function makeProcField(
  fieldName: string,
  proc: PgProc,
  build: Build,
  {
    fieldWithHooks,
    computed = false,
    isMutation = false,
    forceList = false,
  }: {
    fieldWithHooks: FieldWithHooksFunction;
    computed?: boolean;
    isMutation?: boolean;
    forceList?: boolean;
  },
) {
  const {
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
      GraphQLObjectType,
      GraphQLInputObjectType,
      getNamedType,
      isCompositeType,
      isOutputType,
    },

    inflection,
    pgQueryFromResolveData: queryFromResolveData,
    pgAddStartEndCursor: addStartEndCursor,
    pgViaTemporaryTable: viaTemporaryTable,
    describePgEntity,
    sqlCommentByAddingTags,
    pgField,
    options: {
      subscriptions = false,
      pgForbidSetofFunctionsToReturnNull = false,
    },

    pgPrepareAndRun,
  } = build;

  if (computed && isMutation) {
    throw new Error("Mutation procedure cannot be computed");
  }
  const sliceAmount = computed ? 1 : 0;
  const argNames = proc.argTypeIds.reduce((prev, _, idx) => {
    if (
      idx >= sliceAmount && // Was a .slice() call
      (proc.argModes.length === 0 || // all args are `in`
      proc.argModes[idx] === "i" || // this arg is `in`
        proc.argModes[idx] === "b") // this arg is `inout`
    ) {
      prev.push(proc.argNames[idx] || "");
    }
    return prev;
  }, [] as string[]);
  const argTypes = proc.argTypeIds.reduce((prev, typeId, idx) => {
    if (
      idx >= sliceAmount && // Was a .slice() call
      (proc.argModes.length === 0 || // all args are `in`
      proc.argModes[idx] === "i" || // this arg is `in`
        proc.argModes[idx] === "b") // this arg is `inout`
    ) {
      prev.push(introspectionResultsByKind.typeById[typeId]);
    }
    return prev;
  }, [] as PgType[]);
  const argModesWithOutput = [
    "o", // OUT,
    "b", // INOUT
    "t", // TABLE
  ];
  const outputArgNames = proc.argTypeIds.reduce((prev, _, idx) => {
    if (argModesWithOutput.includes(proc.argModes[idx])) {
      prev.push(proc.argNames[idx] || "");
    }
    return prev;
  }, [] as string[]);
  const outputArgTypes = proc.argTypeIds.reduce((prev, typeId, idx) => {
    if (argModesWithOutput.includes(proc.argModes[idx])) {
      prev.push(introspectionResultsByKind.typeById[typeId]);
    }
    return prev;
  }, [] as PgType[]);
  const requiredArgCount = Math.max(0, argNames.length - proc.argDefaultsNum);
  const variantFromName = (name: string) => {
    if (name.match(/(_p|P)atch$/)) {
      return "patch";
    }
    return null;
  };
  const variantFromTags = (tags: SmartTags, idx: number) => {
    const variant = tags[`arg${idx}variant`];
    if (typeof variant === "string") {
      if (variant.match(/^[0-9]+$/)) {
        return parseInt(variant, 10);
      } else {
        return variant;
      }
    }
    return null;
  };
  const notNullArgCount =
    proc.isStrict || strictFunctions ? requiredArgCount : 0;
  const argGqlTypes = argTypes.map((type, idx) => {
    // TODO: PG10 doesn't support the equivalent of pg_attribute.atttypemod on function return values, but maybe a later version might
    const variant =
      variantFromTags(proc.tags, idx) || variantFromName(argNames[idx]);
    const Type = pgGetGqlInputTypeByTypeIdAndModifier(type.id, variant);
    if (!Type) {
      const hint = type.class
        ? `; this might be because no INSERT column privileges are granted on ${describePgEntity(
            type.class,
          )}. You can use 'Smart Comments' to tell PostGraphile to instead use the "${chalk.bold.green(
            "base",
          )}" input type which includes all columns:\n\n  ${sqlCommentByAddingTags(
            proc,
            {
              [`arg${idx}variant`]: "base",
            },
          )}\n`
        : "";
      throw new Error(
        `Could not determine type for argument ${idx} ('${
          argNames[idx]
        }') of function ${describePgEntity(proc)}${hint}`,
      );
    }
    if (idx >= notNullArgCount) {
      return Type;
    } else {
      return new GraphQLNonNull(Type);
    }
  });

  const rawReturnType = introspectionResultsByKind.typeById[proc.returnTypeId];
  const returnType = rawReturnType.arrayItemType
    ? rawReturnType.arrayItemType
    : rawReturnType;
  const returnTypeTable = returnType.classId
    ? introspectionResultsByKind.classById[returnType.classId]
    : null;
  if (!returnType) {
    throw new Error(
      `Could not determine return type for function '${proc.name}'`,
    );
  }
  let type: import("graphql").GraphQLOutputType;
  const fieldScope: ScopeGraphQLObjectTypeFieldsField = {
    fieldName,
  };
  const payloadTypeScope: ScopeGraphQLObjectType = {};
  fieldScope.pgFieldIntrospection = proc;
  payloadTypeScope.pgIntrospection = proc;
  let returnFirstValueAsValue = false;
  const TableType =
    returnTypeTable &&
    pgGetGqlTypeByTypeIdAndModifier(returnTypeTable.type.id, null);

  const isTableLike: boolean =
    (TableType && isCompositeType(TableType)) || false;
  const isRecordLike = returnType.id === "2249";
  if (isTableLike && TableType) {
    if (proc.returnsSet) {
      if (isMutation) {
        const innerType = pgForbidSetofFunctionsToReturnNull
          ? new GraphQLNonNull(TableType)
          : TableType;
        type = new GraphQLList(innerType);
      } else if (forceList) {
        const innerType = pgForbidSetofFunctionsToReturnNull
          ? new GraphQLNonNull(TableType)
          : TableType;
        type = new GraphQLList(innerType);
        fieldScope.isPgFieldSimpleCollection = true;
      } else {
        const name = getNamedType(TableType).name;
        const ConnectionType = getTypeByName(inflection.connection(name));

        if (!ConnectionType) {
          throw new Error(
            `Do not have a connection type '${inflection.connection(
              name,
            )}' for '${name}' so cannot create procedure field`,
          );
        }
        type = new GraphQLNonNull(ConnectionType);
        fieldScope.isPgFieldConnection = true;
      }
      if (returnTypeTable) {
        fieldScope.pgFieldIntrospectionTable = returnTypeTable;
        payloadTypeScope.pgIntrospectionTable = returnTypeTable;
      }
    } else {
      type = TableType;
      if (rawReturnType.isPgArray) {
        // Not implementing pgForbidSetofFunctionsToReturnNull here because it's not a set
        type = new GraphQLList(type);
      }
      if (returnTypeTable) {
        fieldScope.pgFieldIntrospectionTable = returnTypeTable;
        payloadTypeScope.pgIntrospectionTable = returnTypeTable;
      }
    }
  } else if (isRecordLike) {
    const tmpRecordType = getTypeByName(
      inflection.recordFunctionReturnType(proc),
    );
    if (!tmpRecordType || !isOutputType(tmpRecordType)) {
      throw new Error(
        `Do not have an output record type '${inflection.recordFunctionReturnType(
          proc,
        )}' for '${proc.name}' so cannot create procedure field`,
      );
    }
    const RecordType = tmpRecordType;
    if (proc.returnsSet) {
      if (isMutation) {
        type = new GraphQLList(RecordType);
      } else if (forceList) {
        type = new GraphQLList(RecordType);
        fieldScope.isPgFieldSimpleCollection = true;
      } else {
        const ConnectionType = getTypeByName(
          inflection.recordFunctionConnection(proc),
        );

        if (!ConnectionType) {
          throw new Error(
            `Do not have a connection type '${inflection.recordFunctionConnection(
              proc,
            )}' for '${
              getNamedType(RecordType).name
            }' so cannot create procedure field`,
          );
        }
        type = new GraphQLNonNull(ConnectionType);
        fieldScope.isPgFieldConnection = true;
      }
    } else {
      type = RecordType;
      if (rawReturnType.isPgArray) {
        type = new GraphQLList(type);
      }
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
    }): import("graphql").GraphQLFieldConfig<any, any> => {
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
        parsedResolveInfoFragment: ResolveTree,
        _ReturnType: import("graphql").GraphQLOutputType,
        { implicitArgs = [] }: { implicitArgs?: SQL[] } = {},
      ): SQL {
        const { args: rawArgs = {} } = parsedResolveInfoFragment;
        const args = isMutation ? rawArgs.input : rawArgs;
        if (typeof args !== "object" || !args) {
          throw new Error("Could not determine arguments");
        }
        const sqlArgValues: SQL[] = [];
        let haveNames = true;
        for (let argIndex = argNames.length - 1; argIndex >= 0; argIndex--) {
          const argName = argNames[argIndex];
          const gqlArgName = inflection.argument(argName, argIndex);
          const value = args[gqlArgName];
          const variant =
            variantFromTags(proc.tags, argIndex) ||
            variantFromName(argNames[argIndex]);

          const sqlValue = gql2pg(value, argTypes[argIndex], variant);

          if (argIndex + 1 > requiredArgCount && haveNames && value == null) {
            // No need to pass argument to function
            continue;
          } else if (argIndex + 1 > requiredArgCount && haveNames) {
            const sqlArgName = argName ? sql.identifier(argName) : null;
            if (sqlArgName) {
              sqlArgValues.unshift(sql`${sqlArgName} := ${sqlValue}`);
            } else {
              haveNames = false;
              sqlArgValues.unshift(sqlValue);
            }
          } else {
            sqlArgValues.unshift(sqlValue);
          }
        }
        const functionCall = sql`${sql.identifier(
          proc.namespace.name,
          proc.name,
        )}(${sql.join([...implicitArgs, ...sqlArgValues], ", ")})`;
        return rawReturnType.isPgArray
          ? sql`unnest(${functionCall})`
          : functionCall;
      }
      function makeQuery(
        parsedResolveInfoFragment: ResolveTree,
        ReturnType: import("graphql").GraphQLOutputType,
        sqlMutationQuery: SQL,
        functionAlias: SQL,
        parentQueryBuilder: QueryBuilder | null,
        resolveContext?: GraphileResolverContext,
        resolveInfo?: import("graphql").GraphQLResolveInfo,
      ) {
        const resolveData = getDataFromParsedResolveInfoFragment(
          parsedResolveInfoFragment,
          ReturnType,
        );

        const isConnection = !forceList && !isMutation && proc.returnsSet;
        const query = queryFromResolveData(
          sqlMutationQuery,
          functionAlias,
          resolveData,
          {
            useAsterisk:
              !isMutation &&
              (isTableLike || isRecordLike) &&
              (forceList || proc.returnsSet || rawReturnType.isPgArray) && // only bother with lists
              proc.language !== "sql", // sql functions can be inlined, so GRANTs still apply
            withPagination: isConnection,
            withPaginationAsFields: isConnection && !computed,
            asJson:
              computed &&
              (forceList || (!proc.returnsSet && !returnFirstValueAsValue)),
            asJsonAggregate:
              computed &&
              (forceList || (!proc.returnsSet && rawReturnType.isPgArray)),
            addNullCase:
              !proc.returnsSet &&
              !rawReturnType.isPgArray &&
              (isTableLike || isRecordLike),
          },

          innerQueryBuilder => {
            if (parentQueryBuilder) {
              innerQueryBuilder.parentQueryBuilder = parentQueryBuilder;
            }
            if (!isTableLike) {
              if (returnTypeTable) {
                innerQueryBuilder.select(
                  pgTweakFragmentForTypeAndModifier(
                    sql`${functionAlias}`,
                    returnTypeTable.type,
                    null,
                    resolveData,
                  ),

                  "value",
                );
              } else {
                innerQueryBuilder.select(
                  pgTweakFragmentForTypeAndModifier(
                    sql`${functionAlias}`,
                    returnType,
                    null, // We can't determine a type modifier for functions
                    resolveData,
                  ),

                  "value",
                );
              }
            } else if (
              subscriptions &&
              returnTypeTable &&
              !isConnection &&
              returnTypeTable.primaryKeyConstraint
            ) {
              innerQueryBuilder.selectIdentifiers(returnTypeTable);
            }
          },
          parentQueryBuilder ? parentQueryBuilder.context! : resolveContext!,
          parentQueryBuilder
            ? parentQueryBuilder.rootValue
            : resolveInfo && resolveInfo.rootValue,
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
                  },
                );

                const query = makeQuery(
                  parsedResolveInfoFragment,
                  ReturnType,
                  sqlMutationQuery,
                  functionAlias,
                  queryBuilder,
                );

                return sql`(${query})`;
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
        const resultFieldName = inflection.functionMutationResultFieldName(
          proc,
          getNamedType(type),
          proc.returnsSet || rawReturnType.isPgArray,
          outputArgNames,
        );

        const isNotVoid = String(returnType.id) !== "2278";
        // If set then plural name
        PayloadType = newWithHooks(
          GraphQLObjectType,
          {
            name: inflection.functionPayloadType(proc),
            description: `The output of our \`${inflection.functionMutationName(
              proc,
            )}\` mutation.`,
            fields: ({ fieldWithHooks }) => {
              return Object.assign(
                {},
                {
                  clientMutationId: {
                    type: GraphQLString,
                  },
                },

                isNotVoid
                  ? {
                      [resultFieldName]: pgField(
                        build,
                        fieldWithHooks,
                        resultFieldName,
                        {
                          type: type,
                          ...(returnFirstValueAsValue
                            ? {
                                resolve(data) {
                                  return data.data;
                                },
                              }
                            : null),
                        },

                        {},
                        false,
                        {
                          pgType: returnType,
                        },
                      ),

                      // Result
                    }
                  : null,
              );
            },
          },

          {
            __origin: `Adding mutation function payload type for ${describePgEntity(
              proc,
            )}. You can rename the function's GraphQL field (and its dependent types) via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
              proc,
              {
                name: "newNameHere",
              },
            )}`,
            isMutationPayload: true,
            ...payloadTypeScope,
          },
        );

        ReturnType = PayloadType;
        const inputTypeSpec: GraphileInputObjectTypeConfig = {
          name: inflection.functionInputType(proc),
          description: `All input for the \`${inflection.functionMutationName(
            proc,
          )}\` mutation.`,
          fields: {
            clientMutationId: {
              type: GraphQLString,
            },

            ...args,
          },
        };
        const InputType = newWithHooks(GraphQLInputObjectType, inputTypeSpec, {
          __origin: `Adding mutation function input type for ${describePgEntity(
            proc,
          )}. You can rename the function's GraphQL field (and its dependent types) via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
            proc,
            {
              name: "newNameHere",
            },
          )}`,
          isMutationInput: true,
        });
        if (!InputType) {
          throw new Error(
            `Failed to construct InputType '${inputTypeSpec.name}'`,
          );
        }

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
      const scalarAwarePg2gql = (v: any) =>
        isTableLike
          ? pg2gql(v, returnType)
          : {
              ...v,
              value: pg2gql(v.value, returnType),
            };

      return {
        description: proc.description
          ? proc.description
          : isMutation
          ? null
          : isTableLike && proc.returnsSet && TableType
          ? `Reads and enables pagination through a set of \`${
              getNamedType(TableType).name
            }\`.`
          : null,
        type: nullableIf(GraphQLNonNull, !proc.tags.notNull, ReturnType),
        args: args,
        resolve: computed
          ? (data, _args, _resolveContext, resolveInfo) => {
              const liveRecord =
                resolveInfo.rootValue && resolveInfo.rootValue.liveRecord;
              const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
              const value = data[safeAlias];
              if (returnFirstValueAsValue) {
                // Is not table like; is not record like.
                if (proc.returnsSet && !forceList) {
                  // EITHER `isMutation` is true, or `ConnectionType` does not
                  // exist - either way, we're not returning a connection.
                  return value.data.map((v: any) =>
                    pg2gql(firstValue(v), returnType),
                  );
                } else if (proc.returnsSet || rawReturnType.isPgArray) {
                  return value.map((v: any) =>
                    pg2gql(firstValue(v), returnType),
                  );
                } else {
                  return pg2gql(value, returnType);
                }
              } else {
                const makeRecordLive: (record: any) => void =
                  subscriptions && isTableLike && returnTypeTable && liveRecord
                    ? record => {
                        if (record) {
                          liveRecord(
                            "pg",
                            returnTypeTable,
                            record.__identifiers,
                          );
                        }
                      }
                    : _record => {};
                if (proc.returnsSet && !isMutation && !forceList) {
                  // Connection - do not make live (the connection will handle this)
                  return addStartEndCursor({
                    ...value,
                    data: value.data ? value.data.map(scalarAwarePg2gql) : null,
                  });
                } else if (proc.returnsSet || rawReturnType.isPgArray) {
                  // List
                  const records = value.map((v: any) => {
                    makeRecordLive(v);
                    return pg2gql(v, returnType);
                  });
                  return records;
                } else {
                  // Object
                  if (value) {
                    makeRecordLive(value);
                  }
                  return pg2gql(value, returnType);
                }
              }
            }
          : async (_data, args, resolveContext, resolveInfo) => {
              const { pgClient } = resolveContext;
              const liveRecord =
                resolveInfo.rootValue && resolveInfo.rootValue.liveRecord;
              const parsedResolveInfoFragment = parseResolveInfo(
                resolveInfo,
                true,
              );
              parsedResolveInfoFragment.args = args; // Allow overriding via makeWrapResolversPlugin
              const functionAlias = sql.identifier(Symbol());
              const sqlMutationQuery = makeMutationCall(
                parsedResolveInfoFragment,
                resolveInfo.returnType,
                {},
              );

              let queryResultRows;
              if (isMutation) {
                const query = makeQuery(
                  parsedResolveInfoFragment,
                  resolveInfo.returnType,
                  functionAlias,
                  functionAlias,
                  null,
                  resolveContext,
                  resolveInfo,
                );

                const intermediateIdentifier = sql.identifier(Symbol());
                const isVoid = returnType.id === "2278";
                const isPgRecord = returnType.id === "2249";
                const isPgClass =
                  !isPgRecord &&
                  !!(!returnFirstValueAsValue || returnTypeTable || false);
                try {
                  await pgClient.query("SAVEPOINT graphql_mutation");
                  queryResultRows = await viaTemporaryTable(
                    pgClient,
                    isVoid
                      ? null
                      : sql.identifier(
                          returnType.namespaceName,
                          returnType.name,
                        ),

                    sql`select ${
                      isPgClass
                        ? sql`${intermediateIdentifier}.*`
                        : isPgRecord
                        ? sql`${intermediateIdentifier}.*`
                        : sql`${intermediateIdentifier} as ${functionAlias}`
                    } from ${sqlMutationQuery} ${intermediateIdentifier}`,
                    functionAlias,
                    query,
                    isPgClass,
                    isPgRecord
                      ? {
                          outputArgTypes,
                          outputArgNames,
                        }
                      : null,
                  );

                  await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
                } catch (e) {
                  await pgClient.query(
                    "ROLLBACK TO SAVEPOINT graphql_mutation",
                  );

                  throw e;
                }
              } else {
                const query = makeQuery(
                  parsedResolveInfoFragment,
                  resolveInfo.returnType,
                  sqlMutationQuery,
                  functionAlias,
                  null,
                  resolveContext,
                  resolveInfo,
                );

                const { text, values } = sql.compile(query);
                if (debugSql.enabled) debugSql(text);
                const queryResult = await pgPrepareAndRun(
                  pgClient,
                  text,
                  values,
                );

                queryResultRows = queryResult.rows;
              }
              const rows = queryResultRows;
              const [row] = rows;
              const result = (() => {
                const makeRecordLive: (record: any) => void =
                  subscriptions && isTableLike && returnTypeTable && liveRecord
                    ? record => {
                        if (record) {
                          liveRecord(
                            "pg",
                            returnTypeTable,
                            record.__identifiers,
                          );
                        }
                      }
                    : _record => {};
                if (returnFirstValueAsValue) {
                  // `returnFirstValueAsValue` implies either `isMutation` is
                  // true, or `ConnectionType` does not exist - either way,
                  // we're not returning a connection.
                  if (proc.returnsSet && !isMutation && !forceList) {
                    return row.data.map((v: any) => {
                      const fv = firstValue(v);
                      makeRecordLive(fv);
                      return pg2gql(fv, returnType);
                    });
                  } else if (proc.returnsSet || rawReturnType.isPgArray) {
                    return rows.map(v => {
                      const fv = firstValue(v);
                      makeRecordLive(fv);
                      return pg2gql(fv, returnType);
                    });
                  } else {
                    const fv = firstValue(row);
                    makeRecordLive(fv);
                    const record = pg2gql(fv, returnType);
                    return record;
                  }
                } else {
                  if (proc.returnsSet && !isMutation && !forceList) {
                    // Connection
                    const data = row.data
                      ? row.data.map(scalarAwarePg2gql)
                      : null;
                    return addStartEndCursor({
                      ...row,
                      data,
                    });
                  } else if (proc.returnsSet || rawReturnType.isPgArray) {
                    // List
                    return rows.map(row => {
                      makeRecordLive(row);
                      return pg2gql(row, returnType);
                    });
                  } else {
                    // Object
                    makeRecordLive(row);
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
    fieldScope,
  );
}
