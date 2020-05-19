import { PgType, PgAttribute } from "./PgIntrospectionPlugin";
import { PgTypeModifier } from "./PgBasicsPlugin";
import { nullableIf, base64 } from "../utils";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLObjectType {
      isPgRowType?: boolean;
      isPgCompoundType?: boolean;
      isPgCompositeType?: boolean;

      /* Connections */
      isEdgeType?: boolean;
      isPgRowEdgeType?: boolean;
      isConnectionType?: boolean;
      isPgRowConnectionType?: boolean;
      nodeType?: import("graphql").GraphQLType /* But not a list */;
      edgeType?: import("graphql").GraphQLObjectType;
    }

    interface ScopeGraphQLInputObjectType {
      /** Mutation input type? */
      isInputType?: boolean;

      /** Mutation input for 'update' mutations */
      isPgPatch?: boolean;

      /** Mutation input for the 'base' variant */
      isPgBaseInput?: boolean;

      isPgRowType?: boolean;
      isPgCompoundType?: boolean;
      pgAddSubfield?: (
        fieldName: string,
        attrName: string,
        pgType: PgType,
        spec: import("graphql").GraphQLInputFieldConfig,
        typeModifier?: PgTypeModifier,
      ) => import("graphql").GraphQLInputFieldConfig;
    }
  }
}

const hasNonNullKey = (row: { [key: string]: unknown }) => {
  if (
    Array.isArray(row.__identifiers) &&
    row.__identifiers.every((i) => i != null)
  ) {
    return true;
  }
  for (const k in row) {
    if (Object.prototype.hasOwnProperty.call(row, k)) {
      if ((k[0] !== "_" || k[1] !== "_") && row[k] !== null) {
        return true;
      }
    }
  }
  return false;
};

interface FieldSpecMap {
  [fieldName: string]: {
    name: string;
    type: PgType;
    typeModifier: string | number | null | undefined;
  };
}

export default (function PgTablesPlugin(
  builder,
  { pgForbidSetofFunctionsToReturnNull = false, subscriptions = false },
) {
  const handleNullRow: <T extends {}>(
    row: T,
    identifiers: unknown[],
  ) => T | null = pgForbidSetofFunctionsToReturnNull
    ? (row, _identifiers) => row
    : (row, identifiers) => {
        if (
          (identifiers &&
            Array.isArray(identifiers) &&
            identifiers.some((i) => i !== null)) ||
          hasNonNullKey(row)
        ) {
          return row;
        } else {
          return null;
        }
      };

  builder.hook(
    "init",
    (_, build) => {
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
          GraphQLInterfaceType,
          GraphQLScalarType,
          isInputType,
        },

        inflection,
        describePgEntity,
        sqlCommentByAddingTags,
        pgField,
      } = build;

      const Cursor = getTypeByName("Cursor");
      if (!Cursor || !(Cursor instanceof GraphQLScalarType)) {
        throw new Error("Expected 'Cursor' type to exist");
      }

      introspectionResultsByKind.class.forEach((table) => {
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
        let TableType: import("graphql").GraphQLObjectType;
        let TablePatchType:
          | import("graphql").GraphQLInputObjectType
          | null = null;
        let TableBaseInputType:
          | import("graphql").GraphQLInputObjectType
          | null = null;
        pgRegisterGqlTypeByTypeId(
          tablePgType.id,
          (cb) => {
            if (TableType) {
              return TableType;
            }
            if (pg2GqlMapper[tablePgType.id]) {
              // Already handled
              throw new Error(
                `Register was called but there's already a mapper in place for '${tablePgType.id}'!`,
              );
            }
            const tableSpec: GraphileEngine.GraphileObjectTypeConfig<
              any,
              any
            > = {
              description: table.description || tablePgType.description || null,
              name: tableTypeName,
              interfaces: () => {
                const NodeInterface =
                  shouldHaveNodeId && getTypeByName(inflection.builtin("Node"));
                if (NodeInterface instanceof GraphQLInterfaceType) {
                  return [NodeInterface];
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
                      pgQuery: (queryBuilder) => {
                        queryBuilder.selectIdentifiers(table);
                      },
                    };
                  });
                  fields[nodeIdFieldName] = {
                    description:
                      "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
                    type: new GraphQLNonNull(GraphQLID),
                    resolve(data: any) {
                      const identifiers: (string | number)[] | null =
                        data.__identifiers;
                      if (!identifiers) {
                        return null;
                      }
                      /*
                       * For bigint we want NodeIDs to be the same as int up
                       * to the limits of int, and only to be strings after
                       * that point.
                       */
                      const finalIdentifiers = identifiers.map(
                        (identifier, idx) => {
                          const key = primaryKeys[idx];
                          const type = key.type.domainBaseType || key.type;
                          if (type.id === "20" /* bigint */) {
                            /*
                             * When migrating from 'int' to 'bigint' we want
                             * to maintain nodeIDs in the safe range before
                             * moving to strings for larger numbers. Since we
                             * can represent ints up to MAX_SAFE_INTEGER
                             * (2^53 - 1) fine, we're using that as the
                             * boundary.
                             */
                            const int = parseInt(String(identifier), 10);
                            if (
                              int >= -Number.MAX_SAFE_INTEGER &&
                              int <= Number.MAX_SAFE_INTEGER
                            ) {
                              return int;
                            }
                          }
                          return identifier;
                        },
                      );

                      return getNodeIdForTypeAndIdentifiers(
                        Self,
                        ...finalIdentifiers,
                      );
                    },
                  };
                }
                return fields;
              },
            };
            const tmpTableType = newWithHooks(
              GraphQLObjectType,
              tableSpec,

              {
                __origin: `Adding table type for ${describePgEntity(
                  table,
                )}. You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                  table,
                  {
                    name: "newNameHere",
                  },
                )}`,
                pgIntrospection: table,
                isPgRowType: table.isSelectable,
                isPgCompoundType: !table.isSelectable, // TODO:v5: remove - typo
                isPgCompositeType: !table.isSelectable,
              },
            );
            if (!tmpTableType) {
              throw new Error(
                `Failed to construct TableType for '${tableSpec.name}'`,
              );
            }
            TableType = tmpTableType;

            cb(TableType);
            const pgCreateInputFields: FieldSpecMap = {};
            const pgPatchInputFields: FieldSpecMap = {};
            const pgBaseInputFields: FieldSpecMap = {};
            newWithHooks(
              GraphQLInputObjectType,
              {
                description: `An input for mutations affecting \`${tableTypeName}\``,
                name: inflection.inputType(TableType.name),
              },

              {
                __origin: `Adding table input type for ${describePgEntity(
                  table,
                )}. You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                  table,
                  {
                    name: "newNameHere",
                  },
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

              true, // If no fields, skip type automatically
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
                  name: inflection.patchType(TableType.name),
                },

                {
                  __origin: `Adding table patch type for ${describePgEntity(
                    table,
                  )}. You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                    table,
                    {
                      name: "newNameHere",
                    },
                  )}`,
                  pgIntrospection: table,
                  isPgRowType: table.isSelectable,
                  isPgCompoundType: !table.isSelectable,
                  isPgPatch: true,
                  pgAddSubfield(
                    fieldName,
                    attrName,
                    pgType,
                    spec,
                    typeModifier,
                  ) {
                    pgPatchInputFields[fieldName] = {
                      name: attrName,
                      type: pgType,
                      typeModifier,
                    };

                    return spec;
                  },
                },

                true, // Safe to skip this if no fields support updating
              );
              TableBaseInputType = newWithHooks(
                GraphQLInputObjectType,
                {
                  description: `An input representation of \`${tableTypeName}\` with nullable fields.`,
                  name: inflection.baseInputType(TableType.name),
                },

                {
                  __origin: `Adding table base input type for ${describePgEntity(
                    table,
                  )}. You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                    table,
                    {
                      name: "newNameHere",
                    },
                  )}`,
                  pgIntrospection: table,
                  isPgRowType: table.isSelectable,
                  isPgCompoundType: !table.isSelectable,
                  isPgBaseInput: true,
                  pgAddSubfield(
                    fieldName,
                    attrName,
                    pgType,
                    spec,
                    typeModifier,
                  ) {
                    pgBaseInputFields[fieldName] = {
                      name: attrName,
                      type: pgType,
                      typeModifier,
                    };

                    return spec;
                  },
                },
              );
            }

            pg2GqlMapper[tablePgType.id] = {
              map: (_) => _,
              unmap: (obj, modifier) => {
                let fieldLookup: FieldSpecMap;
                if (modifier === "patch") {
                  fieldLookup = pgPatchInputFields;
                } else if (modifier === "base") {
                  fieldLookup = pgBaseInputFields;
                } else {
                  fieldLookup = pgCreateInputFields;
                }

                const attr2sql = (attr: PgAttribute) => {
                  // TODO: this should use `fieldInput[*].name` to find the attribute
                  const fieldName = inflection.column(attr);
                  const inputField = fieldLookup[fieldName];
                  const v = obj[fieldName];
                  if (inputField && v != null) {
                    const { type, typeModifier } = inputField;
                    return sql`${gql2pg(
                      v,
                      type,
                      typeModifier,
                    )}::${sql.identifier(type.namespaceName, type.name)}`;
                  } else {
                    return sql.null; // TODO: return default instead.
                  }
                };

                return sql`row(${sql.join(
                  attributes.map(attr2sql),
                  ",",
                )})::${sql.identifier(
                  tablePgType.namespaceName,
                  tablePgType.name,
                )}`;
              },
            };

            const edgeSpec: GraphileEngine.GraphileObjectTypeConfig<
              any,
              any
            > = {
              description: `A \`${tableTypeName}\` edge in the connection.`,
              name: inflection.edge(TableType.name),
              fields: ({ fieldWithHooks }) => {
                return {
                  cursor: fieldWithHooks(
                    "cursor",
                    ({ addDataGenerator }) => {
                      addDataGenerator(() => ({
                        usesCursor: true,
                        pgQuery: (queryBuilder) => {
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
                    },
                  ),

                  node: pgField(
                    build,
                    fieldWithHooks,
                    "node",
                    {
                      description: `The \`${tableTypeName}\` at the end of the edge.`,
                      type: nullableIf(
                        GraphQLNonNull,
                        !pgForbidSetofFunctionsToReturnNull,
                        TableType,
                      ),

                      resolve(data, _args, _resolveContext, resolveInfo) {
                        const safeAlias = getSafeAliasFromResolveInfo(
                          resolveInfo,
                        );

                        const record = handleNullRow(
                          data[safeAlias],
                          data.__identifiers,
                        );

                        const liveRecord =
                          resolveInfo.rootValue &&
                          resolveInfo.rootValue.liveRecord;
                        if (
                          record &&
                          primaryKeys &&
                          liveRecord &&
                          data.__identifiers
                        ) {
                          liveRecord("pg", table, data.__identifiers);
                        }
                        return record;
                      },
                    },

                    {},
                    false,
                    {
                      withQueryBuilder: (queryBuilder) => {
                        if (subscriptions) {
                          queryBuilder.selectIdentifiers(table);
                        }
                      },
                    },
                  ),
                };
              },
            };
            const EdgeType = newWithHooks(GraphQLObjectType, edgeSpec, {
              __origin: `Adding table edge type for ${describePgEntity(
                table,
              )}. You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                table,
                {
                  name: "newNameHere",
                },
              )}`,
              isEdgeType: true,
              isPgRowEdgeType: true,
              nodeType: TableType,
              pgIntrospection: table,
            });

            if (!EdgeType) {
              throw new Error(
                `Failed to construct EdgeType for '${edgeSpec.name}'`,
              );
            }

            const PageInfo = getTypeByName(inflection.builtin("PageInfo"));

            /*const ConnectionType = */
            const connectionSpec: GraphileEngine.GraphileObjectTypeConfig<
              any,
              any
            > = {
              description: `A connection to a list of \`${tableTypeName}\` values.`,
              name: inflection.connection(TableType.name),
              fields: ({
                recurseDataGeneratorsForField,
                fieldWithHooks,
              }): import("graphql").GraphQLFieldConfigMap<any, any> => {
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
                            GraphQLNonNull,
                            !pgForbidSetofFunctionsToReturnNull,
                            TableType,
                          ),
                        ),
                      ),

                      resolve(data, _args, _resolveContext, resolveInfo) {
                        const safeAlias = getSafeAliasFromResolveInfo(
                          resolveInfo,
                        );

                        const liveRecord =
                          resolveInfo.rootValue &&
                          resolveInfo.rootValue.liveRecord;
                        return data.data.map((entry: any) => {
                          const record = handleNullRow(
                            entry[safeAlias],
                            entry[safeAlias].__identifiers,
                          );

                          if (
                            record &&
                            liveRecord &&
                            primaryKeys &&
                            entry[safeAlias].__identifiers
                          ) {
                            liveRecord(
                              "pg",
                              table,
                              entry[safeAlias].__identifiers,
                            );
                          }

                          return record;
                        });
                      },
                    },

                    {},
                    false,
                    {
                      withQueryBuilder: (queryBuilder) => {
                        if (subscriptions) {
                          queryBuilder.selectIdentifiers(table);
                        }
                      },
                    },
                  ),

                  edges: pgField(
                    build,
                    fieldWithHooks,
                    "edges",
                    {
                      description: `A list of edges which contains the \`${tableTypeName}\` and cursor to aid in pagination.`,
                      type: new GraphQLNonNull(
                        new GraphQLList(new GraphQLNonNull(EdgeType)),
                      ),

                      resolve(data, _args, _context, resolveInfo) {
                        const safeAlias = getSafeAliasFromResolveInfo(
                          resolveInfo,
                        );

                        return data.data.map((entry: any) => ({
                          ...entry,
                          ...entry[safeAlias],
                        }));
                      },
                    },

                    {},
                    false,
                    {
                      hoistCursor: true,
                    },
                  ),

                  ...(PageInfo
                    ? {
                        pageInfo: {
                          description: "Information to aid in pagination.",
                          type: new GraphQLNonNull(PageInfo),
                          resolve(data) {
                            return data;
                          },
                        },
                      }
                    : {}),
                };
              },
            };
            const connectionScope: GraphileEngine.ScopeGraphQLObjectType = {
              __origin: `Adding table connection type for ${describePgEntity(
                table,
              )}. You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                table,
                {
                  name: "newNameHere",
                },
              )}`,
              isConnectionType: true,
              isPgRowConnectionType: true,
              edgeType: EdgeType,
              nodeType: TableType,
              pgIntrospection: table,
            };
            newWithHooks(GraphQLObjectType, connectionSpec, connectionScope);
          },
          true,
        );

        pgRegisterGqlInputTypeByTypeId(
          tablePgType.id,
          (_set, modifier): import("graphql").GraphQLInputType | null => {
            // This must come first, it triggers creation of all the types
            const TableType = pgGetGqlTypeByTypeIdAndModifier(
              tablePgType.id,
              null,
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
              const type = getTypeByName(
                inflection.inputType(
                  build.graphql.getNamedType(TableType).name,
                ),
              );
              if (isInputType(type)) {
                return type;
              }
            }
            return null;
          },
          true,
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
                null,
              );
              if (!TableType) {
                throw new Error(
                  `Failed to get table type for id '${arrayTablePgType.id}'`,
                );
              }

              return new GraphQLList(TableType);
            },
            true,
          );

          pgRegisterGqlInputTypeByTypeId(
            arrayTablePgType.id,
            (_set, modifier) => {
              const RelevantTableInputType = pgGetGqlInputTypeByTypeIdAndModifier(
                tablePgType.id,
                modifier,
              );

              if (RelevantTableInputType) {
                return new GraphQLList(RelevantTableInputType);
              }
            },
            true,
          );
        }
      });
      return _;
    },
    ["PgTables"],
    [],
    ["PgTypes"],
  );
} as GraphileEngine.Plugin);
