const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType,
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
        buildObjectWithHooks,
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        getTypeByName,
        pgGqlTypeByTypeId,
      }
    ) => {
      const Cursor = getTypeByName("Cursor");
      introspectionResultsByKind.class.map(table => {
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
        const TableType = buildObjectWithHooks(
          GraphQLObjectType,
          {
            name: inflection.tableType(table.name, schema.name),
            fields: {},
          },
          {
            pgIntrospection: table,
            isPgRowType: true,
          }
        );

        /*
      const primaryKeyConstraint = introspectionResultsByKind.constraint
        .filter(con => con.classId === table.id)
        .filter(con => ["p"].includes(con.type))[0];
      const primaryKeys =
        primaryKeyConstraint &&
        primaryKeyConstraint.keyAttributeNums.map(
          num =>
            introspectionResultsByKind.attributeByClassIdAndNum[table.id][num]
        );
      */

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
                  type: new GraphQLList(TableType),
                  resolve(data) {
                    return data;
                  },
                },
                edges: {
                  type: new GraphQLList(new GraphQLNonNull(EdgeType)),
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
        pgGqlTypeByTypeId[tablePgType.id] = TableType;
      });
      return _;
    }
  );
};
