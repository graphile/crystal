// @flow
import type { Plugin } from "graphile-build";
const base64 = str => Buffer.from(String(str)).toString("base64");

const hasNonNullKey = row => {
  if (
    Array.isArray(row.__identifiers) &&
    row.__identifiers.every(i => i != null)
  ) {
    return true;
  }
  for (const k in row) {
    if (row.hasOwnProperty(k)) {
      if ((k[0] !== "_" || k[1] !== "_") && row[k] !== null) {
        return true;
      }
    }
  }
  return false;
};

export default (function PgTablesPlugin(
  builder,
  { pgForbidSetofFunctionsToReturnNull = false }
) {
  const handleNullRow = pgForbidSetofFunctionsToReturnNull
    ? row => row
    : row => {
        if (hasNonNullKey(row)) {
          return row;
        } else {
          return null;
        }
      };

  builder.hook("init", (_, build) => {
    const {
      getNodeIdForTypeAndIdentifiers,
      nodeIdFieldName,
      newWithHooks,
      getSafeAliasFromResolveInfo,
      pgSql: sql,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      getTypeByName,
      pgGetGqlTypeByTypeIdAndModifier,
      pgGetGqlInputTypeByTypeIdAndModifier,
      pgRegisterGqlTypeByTypeId,
      pgRegisterGqlInputTypeByTypeId,
      pg2GqlMapper,
      gql2pg,
      graphql: {
        GraphQLObjectType,
        GraphQLNonNull,
        GraphQLID,
        GraphQLList,
        GraphQLInputObjectType,
      },
      inflection,
      describePgEntity,
      sqlCommentByAddingTags,
      pgField,
    } = build;

    const nullableIf = (condition, Type) =>
      condition ? Type : new GraphQLNonNull(Type);
    const Cursor = getTypeByName("Cursor");

    introspectionResultsByKind.class.forEach(table => {
      const tablePgType = table.type;
      if (!tablePgType) {
        throw new Error("Could not determine the type for this table");
      }
      const arrayTablePgType = tablePgType.arrayType;
      const primaryKeyConstraint = table.primaryKeyConstraint;
      const primaryKeys =
        primaryKeyConstraint && primaryKeyConstraint.keyAttributes;
      const attributes = table.attributes;
      const tableTypeName = inflection.tableType(table);
      const shouldHaveNodeId: boolean =
        nodeIdFieldName &&
        table.isSelectable &&
        table.namespace &&
        primaryKeys &&
        primaryKeys.length
          ? true
          : false;
      let TableType;
      let TablePatchType;
      let TableBaseInputType;
      pgRegisterGqlTypeByTypeId(
        tablePgType.id,
        cb => {
          if (TableType) {
            return TableType;
          }
          if (pg2GqlMapper[tablePgType.id]) {
            // Already handled
            throw new Error(
              `Register was called but there's already a mapper in place for '${
                tablePgType.id
              }'!`
            );
          }
          TableType = newWithHooks(
            GraphQLObjectType,
            {
              description: table.description || tablePgType.description,
              name: tableTypeName,
              interfaces: () => {
                if (shouldHaveNodeId) {
                  return [getTypeByName(inflection.builtin("Node"))];
                } else {
                  return [];
                }
              },
              fields: ({ addDataGeneratorForField, Self }) => {
                const fields = {};
                if (shouldHaveNodeId) {
                  // Enable nodeId interface
                  addDataGeneratorForField(nodeIdFieldName, () => {
                    return {
                      pgQuery: queryBuilder => {
                        queryBuilder.selectIdentifiers(table);
                      },
                    };
                  });
                  fields[nodeIdFieldName] = {
                    description:
                      "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
                    type: new GraphQLNonNull(GraphQLID),
                    resolve(data) {
                      return (
                        data.__identifiers &&
                        getNodeIdForTypeAndIdentifiers(
                          Self,
                          ...data.__identifiers
                        )
                      );
                    },
                  };
                }
                return fields;
              },
            },
            {
              __origin: `Adding table type for ${describePgEntity(
                table
              )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
                table,
                {
                  name: "newNameHere",
                }
              )}`,
              pgIntrospection: table,
              isPgRowType: table.isSelectable,
              isPgCompoundType: !table.isSelectable,
            }
          );
          cb(TableType);
          const pgCreateInputFields = {};
          const pgPatchInputFields = {};
          const pgBaseInputFields = {};
          newWithHooks(
            GraphQLInputObjectType,
            {
              description: `An input for mutations affecting \`${tableTypeName}\``,
              name: inflection.inputType(TableType),
            },
            {
              __origin: `Adding table input type for ${describePgEntity(
                table
              )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
                table,
                {
                  name: "newNameHere",
                }
              )}`,
              pgIntrospection: table,
              isInputType: true,
              isPgRowType: table.isSelectable,
              isPgCompoundType: !table.isSelectable,
              pgAddSubfield(fieldName, attrName, pgType, spec, typeModifier) {
                pgCreateInputFields[fieldName] = {
                  name: attrName,
                  type: pgType,
                  typeModifier,
                };
                return spec;
              },
            },
            true // If no fields, skip type automatically
          );

          if (table.isSelectable) {
            // XXX: these don't belong here; but we have to keep them here
            // because third-party code depends on `getTypeByName` to find
            // them; so we have to register them ahead of time. A better
            // approach is to use the modifier to specify the type you need,
            // 'patch' or 'base', so they can be registered just in time.
            TablePatchType = newWithHooks(
              GraphQLInputObjectType,
              {
                description: `Represents an update to a \`${tableTypeName}\`. Fields that are set will be updated.`,
                name: inflection.patchType(TableType),
              },
              {
                __origin: `Adding table patch type for ${describePgEntity(
                  table
                )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
                  table,
                  {
                    name: "newNameHere",
                  }
                )}`,
                pgIntrospection: table,
                isPgRowType: table.isSelectable,
                isPgCompoundType: !table.isSelectable,
                isPgPatch: true,
                pgAddSubfield(fieldName, attrName, pgType, spec, typeModifier) {
                  pgPatchInputFields[fieldName] = {
                    name: attrName,
                    type: pgType,
                    typeModifier,
                  };
                  return spec;
                },
              },
              true // Safe to skip this if no fields support updating
            );
            TableBaseInputType = newWithHooks(
              GraphQLInputObjectType,
              {
                description: `An input representation of \`${tableTypeName}\` with nullable fields.`,
                name: inflection.baseInputType(TableType),
              },
              {
                __origin: `Adding table base input type for ${describePgEntity(
                  table
                )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
                  table,
                  {
                    name: "newNameHere",
                  }
                )}`,
                pgIntrospection: table,
                isPgRowType: table.isSelectable,
                isPgCompoundType: !table.isSelectable,
                isPgBaseInput: true,
                pgAddSubfield(fieldName, attrName, pgType, spec, typeModifier) {
                  pgBaseInputFields[fieldName] = {
                    name: attrName,
                    type: pgType,
                    typeModifier,
                  };
                  return spec;
                },
              }
            );
          }

          pg2GqlMapper[tablePgType.id] = {
            map: _ => _,
            unmap: (obj, modifier) => {
              let fieldLookup;
              if (modifier === "patch") {
                fieldLookup = pgPatchInputFields;
              } else if (modifier === "base") {
                fieldLookup = pgBaseInputFields;
              } else {
                fieldLookup = pgCreateInputFields;
              }

              const attr2sql = attr => {
                // TODO: this should use `fieldInput[*].name` to find the attribute
                const fieldName = inflection.column(attr);
                const inputField = fieldLookup[fieldName];
                const v = obj[fieldName];
                if (inputField && v != null) {
                  const { type, typeModifier } = inputField;
                  return sql.fragment`${gql2pg(
                    v,
                    type,
                    typeModifier
                  )}::${sql.identifier(type.namespaceName, type.name)}`;
                } else {
                  return sql.null; // TODO: return default instead.
                }
              };

              return sql.fragment`row(${sql.join(
                attributes.map(attr2sql),
                ","
              )})::${sql.identifier(
                tablePgType.namespaceName,
                tablePgType.name
              )}`;
            },
          };

          const EdgeType = newWithHooks(
            GraphQLObjectType,
            {
              description: `A \`${tableTypeName}\` edge in the connection.`,
              name: inflection.edge(TableType.name),
              fields: ({ fieldWithHooks }) => {
                return {
                  cursor: fieldWithHooks(
                    "cursor",
                    ({ addDataGenerator }) => {
                      addDataGenerator(() => ({
                        usesCursor: [true],
                        pgQuery: queryBuilder => {
                          if (primaryKeys) {
                            queryBuilder.selectIdentifiers(table);
                          }
                        },
                      }));
                      return {
                        description: "A cursor for use in pagination.",
                        type: Cursor,
                        resolve(data) {
                          return (
                            data.__cursor &&
                            base64(JSON.stringify(data.__cursor))
                          );
                        },
                      };
                    },
                    {
                      isCursorField: true,
                    }
                  ),
                  node: pgField(
                    build,
                    fieldWithHooks,
                    "node",
                    {
                      description: `The \`${tableTypeName}\` at the end of the edge.`,
                      type: nullableIf(
                        !pgForbidSetofFunctionsToReturnNull,
                        TableType
                      ),
                      resolve(data, _args, resolveContext, resolveInfo) {
                        const safeAlias = getSafeAliasFromResolveInfo(
                          resolveInfo
                        );
                        const record = handleNullRow(data[safeAlias]);
                        if (
                          record &&
                          primaryKeys &&
                          resolveContext.liveRecord &&
                          data.__identifiers
                        ) {
                          resolveContext.liveRecord(
                            "pg",
                            table,
                            data.__identifiers
                          );
                        }
                        return record;
                      },
                    },
                    {},
                    false
                  ),
                };
              },
            },
            {
              __origin: `Adding table edge type for ${describePgEntity(
                table
              )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
                table,
                {
                  name: "newNameHere",
                }
              )}`,
              isEdgeType: true,
              isPgRowEdgeType: true,
              nodeType: TableType,
              pgIntrospection: table,
            }
          );
          const PageInfo = getTypeByName(inflection.builtin("PageInfo"));

          /*const ConnectionType = */
          newWithHooks(
            GraphQLObjectType,
            {
              description: `A connection to a list of \`${tableTypeName}\` values.`,
              name: inflection.connection(TableType.name),
              fields: ({ recurseDataGeneratorsForField, fieldWithHooks }) => {
                recurseDataGeneratorsForField("pageInfo", true);
                return {
                  nodes: pgField(
                    build,
                    fieldWithHooks,
                    "nodes",
                    {
                      description: `A list of \`${tableTypeName}\` objects.`,
                      type: new GraphQLNonNull(
                        new GraphQLList(
                          nullableIf(
                            !pgForbidSetofFunctionsToReturnNull,
                            TableType
                          )
                        )
                      ),
                      resolve(data, _args, resolveContext, resolveInfo) {
                        const safeAlias = getSafeAliasFromResolveInfo(
                          resolveInfo
                        );
                        return data.data.map(entry => {
                          const record = handleNullRow(entry[safeAlias]);
                          if (
                            record &&
                            resolveContext.liveRecord &&
                            primaryKeys &&
                            entry.__identifiers
                          ) {
                            resolveContext.liveRecord(
                              "pg",
                              table,
                              entry.__identifiers
                            );
                          }

                          return record;
                        });
                      },
                    },
                    {},
                    false
                  ),
                  edges: pgField(
                    build,
                    fieldWithHooks,
                    "edges",
                    {
                      description: `A list of edges which contains the \`${tableTypeName}\` and cursor to aid in pagination.`,
                      type: new GraphQLNonNull(
                        new GraphQLList(new GraphQLNonNull(EdgeType))
                      ),
                      resolve(data, _args, _context, resolveInfo) {
                        const safeAlias = getSafeAliasFromResolveInfo(
                          resolveInfo
                        );
                        return data.data.map(entry => ({
                          ...entry,
                          ...entry[safeAlias],
                        }));
                      },
                    },
                    {},
                    false,
                    {
                      hoistCursor: true,
                    }
                  ),
                  pageInfo: PageInfo && {
                    description: "Information to aid in pagination.",
                    type: new GraphQLNonNull(PageInfo),
                    resolve(data) {
                      return data;
                    },
                  },
                };
              },
            },
            {
              __origin: `Adding table connection type for ${describePgEntity(
                table
              )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
                table,
                {
                  name: "newNameHere",
                }
              )}`,
              isConnectionType: true,
              isPgRowConnectionType: true,
              edgeType: EdgeType,
              nodeType: TableType,
              pgIntrospection: table,
            }
          );
        },
        true
      );
      pgRegisterGqlInputTypeByTypeId(
        tablePgType.id,
        (_set, modifier) => {
          // This must come first, it triggers creation of all the types
          const TableType = pgGetGqlTypeByTypeIdAndModifier(
            tablePgType.id,
            null
          );
          // This must come after the pgGetGqlTypeByTypeIdAndModifier call
          if (modifier === "patch") {
            // TODO: v5: move the definition from above down here
            return TablePatchType;
          }
          if (modifier === "base") {
            // TODO: v5: move the definition from above down here
            return TableBaseInputType;
          }
          if (TableType) {
            return getTypeByName(inflection.inputType(TableType));
          }
          return null;
        },
        true
      );

      if (arrayTablePgType) {
        // Note: these do not return
        //
        // `new GraphQLList(new GraphQLNonNull(...))`
        //
        // because it's possible to return null entries from postgresql
        // functions. We should probably add a flag to instead export
        // the non-null version as that's more typical.
        pgRegisterGqlTypeByTypeId(
          arrayTablePgType.id,
          () => {
            const TableType = pgGetGqlTypeByTypeIdAndModifier(
              tablePgType.id,
              null
            );
            return new GraphQLList(TableType);
          },
          true
        );
        pgRegisterGqlInputTypeByTypeId(
          arrayTablePgType.id,
          (_set, modifier) => {
            const RelevantTableInputType = pgGetGqlInputTypeByTypeIdAndModifier(
              tablePgType.id,
              modifier
            );
            if (RelevantTableInputType) {
              return new GraphQLList(RelevantTableInputType);
            }
          },
          true
        );
      }
    });
    return _;
  });
}: Plugin);
