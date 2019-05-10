// @flow
import type { Plugin } from "graphile-build";
import debugFactory from "debug";

const debug = debugFactory("graphile-build-pg");

export default (async function PgMutationUpdateDeletePlugin(
  builder,
  { pgDisableDefaultMutations }
) {
  if (pgDisableDefaultMutations) {
    return;
  }

  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        newWithHooks,
        getNodeIdForTypeAndIdentifiers,
        getTypeAndIdentifiersFromNodeId,
        nodeIdFieldName,
        fieldDataGeneratorsByType,
        extend,
        parseResolveInfo,
        getTypeByName,
        gql2pg,
        pgGetGqlTypeByTypeIdAndModifier,
        pgGetGqlInputTypeByTypeIdAndModifier,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        graphql: {
          GraphQLNonNull,
          GraphQLInputObjectType,
          GraphQLString,
          GraphQLObjectType,
          GraphQLID,
        },
        pgColumnFilter,
        inflection,
        pgQueryFromResolveData: queryFromResolveData,
        pgOmit: omit,
        pgViaTemporaryTable: viaTemporaryTable,
        describePgEntity,
        sqlCommentByAddingTags,
        pgField,
      } = build;
      const {
        scope: { isRootMutation },
        fieldWithHooks,
      } = context;

      if (!isRootMutation) {
        return fields;
      }

      return extend(
        fields,
        ["update", "delete"].reduce(
          (outerMemo, mode) =>
            introspectionResultsByKind.class.reduce((memo, table) => {
              // PERFORMANCE: These used to be .filter(...) calls
              if (!table.namespace) return memo;
              const canUpdate =
                mode === "update" &&
                table.isUpdatable &&
                !omit(table, "update");
              const canDelete =
                mode === "delete" &&
                table.isDeletable &&
                !omit(table, "delete");
              if (!canUpdate && !canDelete) return memo;

              const TableType = pgGetGqlTypeByTypeIdAndModifier(
                table.type.id,
                null
              );
              if (!TableType) {
                return memo;
              }
              async function commonCodeRenameMe(
                pgClient,
                resolveInfo,
                getDataFromParsedResolveInfoFragment,
                PayloadType,
                args,
                condition,
                context,
                resolveContext
              ) {
                const { input } = args;
                const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
                parsedResolveInfoFragment.args = args; // Allow overriding via makeWrapResolversPlugin
                const resolveData = getDataFromParsedResolveInfoFragment(
                  parsedResolveInfoFragment,
                  PayloadType
                );

                const sqlTypeIdentifier = sql.identifier(
                  table.namespace.name,
                  table.name
                );

                let sqlMutationQuery;
                if (mode === "update") {
                  const sqlColumns = [];
                  const sqlValues = [];
                  const inputData =
                    input[
                      inflection.patchField(inflection.tableFieldName(table))
                    ];
                  table.attributes.forEach(attr => {
                    // PERFORMANCE: These used to be .filter(...) calls
                    if (!pgColumnFilter(attr, build, context)) return;
                    if (omit(attr, "update")) return;

                    const fieldName = inflection.column(attr);
                    if (
                      fieldName in inputData /* Because we care about null! */
                    ) {
                      const val = inputData[fieldName];
                      sqlColumns.push(sql.identifier(attr.name));
                      sqlValues.push(gql2pg(val, attr.type, attr.typeModifier));
                    }
                  });
                  if (sqlColumns.length === 0) {
                    return null;
                  }
                  sqlMutationQuery = sql.query`\
update ${sql.identifier(table.namespace.name, table.name)} set ${sql.join(
                    sqlColumns.map(
                      (col, i) => sql.fragment`${col} = ${sqlValues[i]}`
                    ),
                    ", "
                  )}
where ${condition}
returning *`;
                } else {
                  sqlMutationQuery = sql.query`\
delete from ${sql.identifier(table.namespace.name, table.name)}
where ${condition}
returning *`;
                }

                const modifiedRowAlias = sql.identifier(Symbol());
                const query = queryFromResolveData(
                  modifiedRowAlias,
                  modifiedRowAlias,
                  resolveData,
                  {},
                  null,
                  resolveContext,
                  resolveInfo.rootValue
                );
                let row;
                try {
                  await pgClient.query("SAVEPOINT graphql_mutation");
                  const rows = await viaTemporaryTable(
                    pgClient,
                    sqlTypeIdentifier,
                    sqlMutationQuery,
                    modifiedRowAlias,
                    query
                  );
                  row = rows[0];
                  await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
                } catch (e) {
                  await pgClient.query(
                    "ROLLBACK TO SAVEPOINT graphql_mutation"
                  );
                  throw e;
                }
                if (!row) {
                  throw new Error(
                    `No values were ${mode}d in collection '${inflection.pluralize(
                      inflection._singularizedTableName(table)
                    )}' because no values you can ${mode} were found matching these criteria.`
                  );
                }
                return {
                  clientMutationId: input.clientMutationId,
                  data: row,
                };
              }
              if (TableType) {
                const uniqueConstraints = table.constraints.filter(
                  con => con.type === "u" || con.type === "p"
                );
                const Table = pgGetGqlTypeByTypeIdAndModifier(
                  table.type.id,
                  null
                );
                const tableTypeName = Table.name;
                const TablePatch = getTypeByName(
                  inflection.patchType(Table.name)
                );
                const PayloadType = newWithHooks(
                  GraphQLObjectType,
                  {
                    name: inflection[
                      mode === "delete"
                        ? "deletePayloadType"
                        : "updatePayloadType"
                    ](table),
                    description: `The output of our ${mode} \`${tableTypeName}\` mutation.`,
                    fields: ({ fieldWithHooks }) => {
                      const tableName = inflection.tableFieldName(table);
                      // This should really be `-node-id` but for compatibility with PostGraphQL v3 we haven't made that change.
                      const deletedNodeIdFieldName = inflection.deletedNodeId(
                        table
                      );
                      return Object.assign(
                        {
                          clientMutationId: {
                            description:
                              "The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations.",
                            type: GraphQLString,
                          },
                          [tableName]: pgField(
                            build,
                            fieldWithHooks,
                            tableName,
                            {
                              description: `The \`${tableTypeName}\` that was ${mode}d by this mutation.`,
                              type: Table,
                            },
                            {},
                            false
                          ),
                        },
                        mode === "delete"
                          ? {
                              [deletedNodeIdFieldName]: fieldWithHooks(
                                deletedNodeIdFieldName,
                                ({ addDataGenerator }) => {
                                  const fieldDataGeneratorsByTableType = fieldDataGeneratorsByType.get(
                                    TableType
                                  );

                                  const gens =
                                    fieldDataGeneratorsByTableType &&
                                    fieldDataGeneratorsByTableType[
                                      nodeIdFieldName
                                    ];
                                  if (gens) {
                                    gens.forEach(gen => addDataGenerator(gen));
                                  }
                                  return {
                                    type: GraphQLID,
                                    resolve(data) {
                                      return (
                                        data.data.__identifiers &&
                                        getNodeIdForTypeAndIdentifiers(
                                          Table,
                                          ...data.data.__identifiers
                                        )
                                      );
                                    },
                                  };
                                },
                                {
                                  isPgMutationPayloadDeletedNodeIdField: true,
                                }
                              ),
                            }
                          : null
                      );
                    },
                  },
                  {
                    __origin: `Adding table ${mode} mutation payload type for ${describePgEntity(
                      table
                    )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
                      table,
                      {
                        name: "newNameHere",
                      }
                    )}`,
                    isMutationPayload: true,
                    isPgUpdatePayloadType: mode === "update",
                    isPgDeletePayloadType: mode === "delete",
                    pgIntrospection: table,
                  }
                );

                // NodeId
                const primaryKeyConstraint = table.primaryKeyConstraint;
                if (nodeIdFieldName && primaryKeyConstraint) {
                  const primaryKeys =
                    primaryKeyConstraint && primaryKeyConstraint.keyAttributes;
                  const fieldName = inflection[
                    mode === "update" ? "updateNode" : "deleteNode"
                  ](table);
                  const InputType = newWithHooks(
                    GraphQLInputObjectType,
                    {
                      description: `All input for the \`${fieldName}\` mutation.`,
                      name: inflection[
                        mode === "update"
                          ? "updateNodeInputType"
                          : "deleteNodeInputType"
                      ](table),
                      fields: Object.assign(
                        {
                          clientMutationId: {
                            description:
                              "An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client.",
                            type: GraphQLString,
                          },
                          [nodeIdFieldName]: {
                            description: `The globally unique \`ID\` which will identify a single \`${tableTypeName}\` to be ${mode}d.`,
                            type: new GraphQLNonNull(GraphQLID),
                          },
                        },
                        mode === "update"
                          ? {
                              [inflection.patchField(
                                inflection.tableFieldName(table)
                              )]: {
                                description: `An object where the defined keys will be set on the \`${tableTypeName}\` being ${mode}d.`,
                                type: new GraphQLNonNull(TablePatch),
                              },
                            }
                          : null
                      ),
                    },
                    {
                      __origin: `Adding table ${mode} (by node ID) mutation input type for ${describePgEntity(
                        table
                      )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
                        table,
                        {
                          name: "newNameHere",
                        }
                      )}`,
                      isPgUpdateInputType: mode === "update",
                      isPgUpdateNodeInputType: mode === "update",
                      isPgDeleteInputType: mode === "delete",
                      isPgDeleteNodeInputType: mode === "delete",
                      pgInflection: table, // TODO:v5: remove - TYPO!
                      pgIntrospection: table,
                      isMutationInput: true,
                    }
                  );

                  memo = extend(
                    memo,
                    {
                      [fieldName]: fieldWithHooks(
                        fieldName,
                        context => {
                          const {
                            getDataFromParsedResolveInfoFragment,
                          } = context;
                          return {
                            description:
                              mode === "update"
                                ? `Updates a single \`${tableTypeName}\` using its globally unique id and a patch.`
                                : `Deletes a single \`${tableTypeName}\` using its globally unique id.`,
                            type: PayloadType,
                            args: {
                              input: {
                                type: new GraphQLNonNull(InputType),
                              },
                            },
                            async resolve(
                              parent,
                              args,
                              resolveContext,
                              resolveInfo
                            ) {
                              const { input } = args;
                              const { pgClient } = resolveContext;
                              const nodeId = input[nodeIdFieldName];
                              try {
                                const {
                                  Type,
                                  identifiers,
                                } = getTypeAndIdentifiersFromNodeId(nodeId);
                                if (Type !== TableType) {
                                  throw new Error("Mismatched type");
                                }
                                if (identifiers.length !== primaryKeys.length) {
                                  throw new Error("Invalid ID");
                                }

                                return commonCodeRenameMe(
                                  pgClient,
                                  resolveInfo,
                                  getDataFromParsedResolveInfoFragment,
                                  PayloadType,
                                  args,
                                  sql.fragment`(${sql.join(
                                    primaryKeys.map(
                                      (key, idx) =>
                                        sql.fragment`${sql.identifier(
                                          key.name
                                        )} = ${gql2pg(
                                          identifiers[idx],
                                          key.type,
                                          key.typeModifier
                                        )}`
                                    ),
                                    ") and ("
                                  )})`,
                                  context,
                                  resolveContext
                                );
                              } catch (e) {
                                debug(e);
                                return null;
                              }
                            },
                          };
                        },
                        {
                          isPgNodeMutation: true,
                          pgFieldIntrospection: table,
                          [mode === "update"
                            ? "isPgUpdateMutationField"
                            : "isPgDeleteMutationField"]: true,
                        }
                      ),
                    },
                    "Adding ${mode} mutation for ${describePgEntity(table)}"
                  );
                }

                // Unique
                uniqueConstraints.forEach(constraint => {
                  if (omit(constraint, mode)) {
                    return;
                  }
                  const keys = constraint.keyAttributes;
                  if (!keys.every(_ => _)) {
                    throw new Error(
                      `Consistency error: could not find an attribute in the constraint when building the ${mode} mutation for ${describePgEntity(
                        table
                      )}!`
                    );
                  }
                  if (keys.some(key => omit(key, "read"))) {
                    return;
                  }
                  const fieldName = inflection[
                    mode === "update" ? "updateByKeys" : "deleteByKeys"
                  ](keys, table, constraint);
                  const InputType = newWithHooks(
                    GraphQLInputObjectType,
                    {
                      description: `All input for the \`${fieldName}\` mutation.`,
                      name: inflection[
                        mode === "update"
                          ? "updateByKeysInputType"
                          : "deleteByKeysInputType"
                      ](keys, table, constraint),
                      fields: Object.assign(
                        {
                          clientMutationId: {
                            type: GraphQLString,
                          },
                        },
                        mode === "update"
                          ? {
                              [inflection.patchField(
                                inflection.tableFieldName(table)
                              )]: {
                                description: `An object where the defined keys will be set on the \`${tableTypeName}\` being ${mode}d.`,
                                type: new GraphQLNonNull(TablePatch),
                              },
                            }
                          : null,
                        keys.reduce((memo, key) => {
                          memo[inflection.column(key)] = {
                            description: key.description,
                            type: new GraphQLNonNull(
                              pgGetGqlInputTypeByTypeIdAndModifier(
                                key.typeId,
                                key.typeModifier
                              )
                            ),
                          };
                          return memo;
                        }, {})
                      ),
                    },
                    {
                      __origin: `Adding table ${mode} mutation input type for ${describePgEntity(
                        constraint
                      )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
                        table,
                        {
                          name: "newNameHere",
                        }
                      )}`,
                      isPgUpdateInputType: mode === "update",
                      isPgUpdateByKeysInputType: mode === "update",
                      isPgDeleteInputType: mode === "delete",
                      isPgDeleteByKeysInputType: mode === "delete",
                      pgInflection: table, // TODO:v5: remove - TYPO!
                      pgIntrospection: table,
                      pgKeys: keys,
                      isMutationInput: true,
                    }
                  );

                  memo = extend(
                    memo,
                    {
                      [fieldName]: fieldWithHooks(
                        fieldName,
                        context => {
                          const {
                            getDataFromParsedResolveInfoFragment,
                          } = context;
                          return {
                            description:
                              mode === "update"
                                ? `Updates a single \`${tableTypeName}\` using a unique key and a patch.`
                                : `Deletes a single \`${tableTypeName}\` using a unique key.`,
                            type: PayloadType,
                            args: {
                              input: {
                                type: new GraphQLNonNull(InputType),
                              },
                            },
                            async resolve(
                              parent,
                              args,
                              resolveContext,
                              resolveInfo
                            ) {
                              const { input } = args;
                              const { pgClient } = resolveContext;
                              return commonCodeRenameMe(
                                pgClient,
                                resolveInfo,
                                getDataFromParsedResolveInfoFragment,
                                PayloadType,
                                args,
                                sql.fragment`(${sql.join(
                                  keys.map(
                                    key =>
                                      sql.fragment`${sql.identifier(
                                        key.name
                                      )} = ${gql2pg(
                                        input[inflection.column(key)],
                                        key.type,
                                        key.typeModifier
                                      )}`
                                  ),
                                  ") and ("
                                )})`,
                                context,
                                resolveContext
                              );
                            },
                          };
                        },
                        {
                          isPgNodeMutation: false,
                          pgFieldIntrospection: table,
                          pgFieldConstraint: constraint,
                          [mode === "update"
                            ? "isPgUpdateMutationField"
                            : "isPgDeleteMutationField"]: true,
                        }
                      ),
                    },
                    `Adding ${mode} mutation for ${describePgEntity(
                      constraint
                    )}`
                  );
                });
              }
              return memo;
            }, outerMemo),
          {}
        ),
        `Adding default update/delete mutations to root Mutation type`
      );
    },
    ["PgMutationUpdateDelete"]
  );
}: Plugin);
