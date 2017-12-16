// @flow
import type { Plugin } from "graphile-build";
const base64 = str => new Buffer(String(str)).toString("base64");

export default (function PgTablesPlugin(builder, { pgInflection: inflection }) {
  builder.hook("init", (_, build) => {
    const {
      getNodeIdForTypeAndIdentifiers,
      nodeIdFieldName,
      newWithHooks,
      pgSql: sql,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      getTypeByName,
      pgGetGqlTypeByTypeId,
      pgGetGqlInputTypeByTypeId,
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
      pgColumnFilter,
    } = build;
    const Cursor = getTypeByName("Cursor");
    introspectionResultsByKind.class.forEach(table => {
      const tablePgType = introspectionResultsByKind.type.find(
        type =>
          type.type === "c" &&
          type.category === "C" &&
          type.namespaceId === table.namespaceId &&
          type.classId === table.id
      );
      if (!tablePgType) {
        throw new Error("Could not determine the type for this table");
      }
      const arrayTablePgType = introspectionResultsByKind.type.find(
        type => type.arrayItemTypeId === tablePgType.id
      );
      /*
        table =
          { kind: 'class',
            id: '6484790',
            name: 'bundle',
            description: null,
            namespaceId: '6484381',
            typeId: '6484792',
            isSelectable: true,
            isInsertable: true,
            isUpdatable: true,
            isDeletable: true }
        */
      const primaryKeyConstraint = introspectionResultsByKind.constraint
        .filter(con => con.classId === table.id)
        .filter(con => con.type === "p")[0];
      const primaryKeys =
        primaryKeyConstraint &&
        primaryKeyConstraint.keyAttributeNums.map(
          num =>
            introspectionResultsByKind.attributeByClassIdAndNum[table.id][num]
        );
      const attributes = introspectionResultsByKind.attribute
        .filter(attr => attr.classId === table.id)
        .sort((a1, a2) => a1.num - a2.num);
      const tableTypeName = inflection.tableType(
        table.name,
        table.namespaceName
      );
      const shouldHaveNodeId: boolean =
        nodeIdFieldName &&
        table.isSelectable &&
        table.namespace &&
        primaryKeys &&
        primaryKeys.length
          ? true
          : false;
      pgRegisterGqlTypeByTypeId(
        tablePgType.id,
        cb => {
          if (pg2GqlMapper[tablePgType.id]) {
            // Already handled
            throw new Error(
              `Register was called but there's already a mapper in place for '${tablePgType.id}'!`
            );
          }
          const TableType = newWithHooks(
            GraphQLObjectType,
            {
              description: table.description || tablePgType.description,
              name: tableTypeName,
              interfaces: () => {
                if (shouldHaveNodeId) {
                  return [getTypeByName("Node")];
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
                        queryBuilder.select(
                          sql.fragment`json_build_array(${sql.join(
                            primaryKeys.map(
                              key =>
                                sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                                  key.name
                                )}`
                            ),
                            ", "
                          )})`,
                          "__identifiers"
                        );
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
              pgIntrospection: table,
              isPgRowType: table.isSelectable,
              isPgCompoundType: !table.isSelectable,
            }
          );
          cb(TableType);
          const pgInputFields = {};
          newWithHooks(
            GraphQLInputObjectType,
            {
              description: `An input for mutations affecting \`${tableTypeName}\``,
              name: inflection.inputType(TableType),
              fields: context => {
                pg2GqlMapper[tablePgType.id] = {
                  map: _ => _,
                  unmap: obj => {
                    return sql.fragment`row(${sql.join(
                      attributes.map(attr => {
                        if (!pgColumnFilter(attr, build, context)) {
                          return sql.null; // TODO: return default instead.
                        }
                        const fieldName = inflection.column(
                          attr.name,
                          table.name,
                          table.namespaceName
                        );
                        const pgInputField = pgInputFields[fieldName];
                        const v = obj[fieldName];
                        if (pgInputField && v != null) {
                          const { type } = pgInputField;
                          return sql.fragment`${gql2pg(
                            v,
                            type
                          )}::${sql.identifier(type.namespaceName, type.name)}`;
                        } else {
                          return sql.null; // TODO: return default instead.
                        }
                      }),
                      ","
                    )})::${sql.identifier(
                      tablePgType.namespaceName,
                      tablePgType.name
                    )}`;
                  },
                };
                return {};
              },
            },
            {
              pgIntrospection: table,
              isInputType: true,
              isPgRowType: table.isSelectable,
              isPgCompoundType: !table.isSelectable,
              pgAddSubfield(fieldName, attrName, pgType, spec) {
                pgInputFields[fieldName] = {
                  name: attrName,
                  type: pgType,
                };
                return spec;
              },
            }
          );

          if (table.isSelectable) {
            /* const TablePatchType = */
            newWithHooks(
              GraphQLInputObjectType,
              {
                description: `Represents an update to a \`${tableTypeName}\`. Fields that are set will be updated.`,
                name: inflection.patchType(TableType),
              },
              {
                pgIntrospection: table,
                isPgRowType: table.isSelectable,
                isPgCompoundType: !table.isSelectable,
                isPgPatch: true,
                pgAddSubfield(fieldName, _attrName, _type, spec) {
                  // We don't use this currently
                  return spec;
                },
              }
            );
          }
          const EdgeType = newWithHooks(
            GraphQLObjectType,
            {
              description: `A \`${tableTypeName}\` edge in the connection.`,
              name: inflection.edge(TableType.name),
              fields: ({ fieldWithHooks, recurseDataGeneratorsForField }) => {
                recurseDataGeneratorsForField("node");
                return {
                  cursor: fieldWithHooks(
                    "cursor",
                    ({ addDataGenerator }) => {
                      addDataGenerator(() => ({
                        usesCursor: [true],
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
                  node: {
                    description: `The \`${tableTypeName}\` at the end of the edge.`,
                    type: new GraphQLNonNull(TableType),
                    resolve(data) {
                      return data;
                    },
                  },
                };
              },
            },
            {
              isEdgeType: true,
              isPgRowEdgeType: true,
              nodeType: TableType,
              pgIntrospection: table,
            }
          );
          const PageInfo = getTypeByName("PageInfo");
          /*const ConnectionType = */
          newWithHooks(
            GraphQLObjectType,
            {
              description: `A connection to a list of \`${tableTypeName}\` values.`,
              name: inflection.connection(TableType.name),
              fields: ({ recurseDataGeneratorsForField }) => {
                recurseDataGeneratorsForField("edges");
                recurseDataGeneratorsForField("nodes");
                recurseDataGeneratorsForField("pageInfo");
                return {
                  nodes: {
                    description: `A list of \`${tableTypeName}\` objects.`,
                    type: new GraphQLNonNull(new GraphQLList(TableType)),
                    resolve(data) {
                      return data.data;
                    },
                  },
                  edges: {
                    description: `A list of edges which contains the \`${tableTypeName}\` and cursor to aid in pagination.`,
                    type: new GraphQLNonNull(
                      new GraphQLList(new GraphQLNonNull(EdgeType))
                    ),
                    resolve(data) {
                      return data.data;
                    },
                  },
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
        () => {
          const TableType = pgGetGqlTypeByTypeId(tablePgType.id);
          return getTypeByName(inflection.inputType(TableType));
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
            const TableType = pgGetGqlTypeByTypeId(tablePgType.id);
            return new GraphQLList(TableType);
          },
          true
        );
        pgRegisterGqlInputTypeByTypeId(
          arrayTablePgType.id,
          () => {
            const TableInputType = pgGetGqlInputTypeByTypeId(tablePgType.id);
            return new GraphQLList(TableInputType);
          },
          true
        );
      }
    });
    return _;
  });
}: Plugin);
