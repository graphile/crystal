// @flow
import type { Plugin } from "graphile-build";

export default (function PgRecordReturnTypesPlugin(builder) {
  builder.hook(
    "init",
    (_, build) => {
      const {
        newWithHooks,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgGetGqlTypeByTypeIdAndModifier,
        graphql: { GraphQLObjectType },
        inflection,
        pgOmit: omit,
        describePgEntity,
        sqlCommentByAddingTags,
        pgSql: sql,
        pgGetSelectValueForFieldAndTypeAndModifier: getSelectValueForFieldAndTypeAndModifier,
        getSafeAliasFromResolveInfo,
        getSafeAliasFromAlias,
      } = build;

      introspectionResultsByKind.procedure.forEach(proc => {
        // PERFORMANCE: These used to be .filter(...) calls
        if (!proc.namespace) return;
        if (omit(proc, "execute")) return;

        const returnType =
          introspectionResultsByKind.typeById[proc.returnTypeId];
        if (returnType.id !== "2249") {
          return;
        }
        const argTypes = proc.argTypeIds.reduce((prev, typeId, idx) => {
          if (
            proc.argModes.length === 0 || // all args are `in`
            proc.argModes[idx] === "i" || // this arg is `in`
            proc.argModes[idx] === "b" // this arg is `inout`
          ) {
            prev.push(introspectionResultsByKind.typeById[typeId]);
          }
          return prev;
        }, []);
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
        }, []);
        const outputArgTypes = proc.argTypeIds.reduce((prev, typeId, idx) => {
          if (argModesWithOutput.includes(proc.argModes[idx])) {
            prev.push(introspectionResultsByKind.typeById[typeId]);
          }
          return prev;
        }, []);
        const isMutation = !proc.isStable;
        const firstArgType = argTypes[0];
        const computed =
          firstArgType &&
          firstArgType.type === "c" &&
          firstArgType.class &&
          firstArgType.namespaceId === proc.namespaceId &&
          proc.name.startsWith(`${firstArgType.name}_`);
        const procFieldName = isMutation
          ? inflection.functionMutationName(proc)
          : computed
          ? inflection.computedColumn(
              proc.name.substr(firstArgType.name.length + 1),
              proc
            )
          : inflection.functionQueryName(proc);
        newWithHooks(
          GraphQLObjectType,
          {
            name: inflection.recordFunctionReturnType(proc),
            description: `The return type of our \`${procFieldName}\` ${
              isMutation ? "mutation" : "query"
            }.`,
            fields: ({ fieldWithHooks }) => {
              return outputArgNames.reduce((memo, outputArgName, idx) => {
                const fieldName = inflection.functionOutputFieldName(
                  proc,
                  outputArgName,
                  idx + 1
                );
                const fieldType = pgGetGqlTypeByTypeIdAndModifier(
                  outputArgTypes[idx].id,
                  null
                );
                if (memo[fieldName]) {
                  throw new Error(
                    `Tried to register field name '${fieldName}' twice in '${describePgEntity(
                      proc
                    )}'; the argument names are too similar.`
                  );
                }
                memo[fieldName] = fieldWithHooks(
                  fieldName,
                  fieldContext => {
                    const { addDataGenerator } = fieldContext;
                    addDataGenerator(parsedResolveInfoFragment => {
                      const safeAlias = getSafeAliasFromAlias(
                        parsedResolveInfoFragment.alias
                      );
                      return {
                        pgQuery: queryBuilder => {
                          queryBuilder.select(
                            getSelectValueForFieldAndTypeAndModifier(
                              fieldType,
                              fieldContext,
                              parsedResolveInfoFragment,
                              sql.fragment`(${queryBuilder.getTableAlias()}.${sql.identifier(
                                // According to https://www.postgresql.org/docs/10/static/sql-createfunction.html,
                                // "If you omit the name for an output argument, the system will choose a default column name."
                                // In PG 9.x and 10, the column names appear to be assigned with a `column` prefix.
                                outputArgName !== ""
                                  ? outputArgName
                                  : `column${idx + 1}`
                              )})`,
                              outputArgTypes[idx],
                              null
                            ),
                            safeAlias
                          );
                        },
                      };
                    });
                    return {
                      type: fieldType,
                      resolve(data, _args, _context, resolveInfo) {
                        const safeAlias = getSafeAliasFromResolveInfo(
                          resolveInfo
                        );
                        return data[safeAlias];
                      },
                    };
                  },
                  {}
                );
                return memo;
              }, {});
            },
          },
          {
            __origin: `Adding record return type for ${describePgEntity(
              proc
            )}. You can rename the function's GraphQL field (and its dependent types) via:\n\n  ${sqlCommentByAddingTags(
              proc,
              {
                name: "newNameHere",
              }
            )}\n\nYou can rename just the function's GraphQL result type via:\n\n  ${sqlCommentByAddingTags(
              proc,
              {
                resultTypeName: "newNameHere",
              }
            )}`,
            isRecordReturnType: true,
            pgIntrospection: proc,
          }
        );
      });
      return _;
    },
    ["PgRecordReturnTypes"]
  );
}: Plugin);
