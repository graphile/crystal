const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLEnumType,
  GraphQLInputObjectType,
} = require("graphql");

module.exports = function PgTablesPlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "schema",
    (
      _,
      {
        getNodeIdForTypeAndIdentifiers,
        nodeIdFieldName,
        buildObjectWithHooks,
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        getTypeByName,
        pgGqlTypeByTypeId,
        pgGqlInputTypeByTypeId,
      }
    ) => {
      const Cursor = getTypeByName("Cursor");
      introspectionResultsByKind.class.forEach(table => {
        const tablePgType = introspectionResultsByKind.type.filter(
          type =>
            type.type === "c" &&
            type.category === "C" &&
            type.namespaceId === table.namespaceId &&
            type.classId === table.id
        )[0];
        if (!tablePgType) {
          throw new Error("Could not determine the type for this table");
        }
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
        const schema = table.namespace;
        const primaryKeyConstraint = introspectionResultsByKind.constraint
          .filter(con => con.classId === table.id)
          .filter(con => ["p"].includes(con.type))[0];
        const primaryKeys =
          primaryKeyConstraint &&
          primaryKeyConstraint.keyAttributeNums.map(
            num =>
              introspectionResultsByKind.attributeByClassIdAndNum[table.id][num]
          );
        const TableType = buildObjectWithHooks(
          GraphQLObjectType,
          {
            name: inflection.tableType(table.name, schema.name),
            interfaces: () => {
              if (nodeIdFieldName && table.isSelectable) {
                return [getTypeByName("Node")];
              } else {
                return [];
              }
            },
            fields: ({ addDataGeneratorForField, Self }) => {
              const fields = {};
              if (nodeIdFieldName && table.isSelectable) {
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
                              )} || ''`
                          ),
                          ", "
                        )})`,
                        "__identifiers"
                      );
                    },
                  };
                });
                fields[nodeIdFieldName] = {
                  type: new GraphQLNonNull(GraphQLID),
                  resolve(data) {
                    return getNodeIdForTypeAndIdentifiers(
                      Self,
                      ...data.__identifiers
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
        const TableInputType = buildObjectWithHooks(
          GraphQLInputObjectType,
          {
            name: inflection.inputType(TableType),
          },
          {
            pgIntrospection: table,
            isPgRowType: table.isSelectable,
            isPgCompoundType: !table.isSelectable,
          }
        );

        if (table.isSelectable) {
          /* const TablePatchType = */
          buildObjectWithHooks(
            GraphQLInputObjectType,
            {
              name: inflection.patchType(TableType),
            },
            {
              pgIntrospection: table,
              isPgRowType: table.isSelectable,
              isPgCompoundType: !table.isSelectable,
              isPgPatch: true,
            }
          );
          const EdgeType = buildObjectWithHooks(
            GraphQLObjectType,
            {
              name: inflection.edge(TableType.name),
              fields: ({
                addDataGeneratorForField,
                recurseDataGeneratorsForField,
              }) => {
                recurseDataGeneratorsForField("node");
                addDataGeneratorForField("cursor", () => {
                  return {
                    pgQuery: queryBuilder => {
                      queryBuilder.select(
                        () =>
                          sql.fragment`encode(json_build_array(${sql.join(
                            queryBuilder
                              .getOrderByExpressionsAndDirections()
                              .map(([field]) => field),
                            ","
                          )})::bytea, 'base64')`,
                        "__cursor"
                      );
                    },
                  };
                });
                return {
                  cursor: {
                    type: Cursor,
                    resolve(data) {
                      return data.__cursor;
                    },
                  },
                  node: {
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
          /*const ConnectionType = */
          buildObjectWithHooks(
            GraphQLObjectType,
            {
              name: inflection.connection(TableType.name),
              fields: ({ recurseDataGeneratorsForField }) => {
                recurseDataGeneratorsForField("edges");
                recurseDataGeneratorsForField("nodes");
                return {
                  // XXX: pageInfo
                  // XXX: totalCount
                  nodes: {
                    type: new GraphQLNonNull(new GraphQLList(TableType)),
                    resolve(data) {
                      return data;
                    },
                  },
                  edges: {
                    type: new GraphQLNonNull(
                      new GraphQLList(new GraphQLNonNull(EdgeType))
                    ),
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
        }
        pgGqlTypeByTypeId[tablePgType.id] = TableType;
        pgGqlInputTypeByTypeId[tablePgType.id] = TableInputType;
      });
      return _;
    }
  );
};
