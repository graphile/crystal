module.exports = function PgTablesPlugin(listener) {
  listener.on(
    "context",
    (
      context,
      {
        buildObjectWithHooks,
        inflection,
        pg: {
          sql,
          introspectionResultsByKind,
          gqlTypeByTypeId,
          sqlFragmentGeneratorsByClassIdAndFieldName,
          sqlFragmentGeneratorsForConnectionByClassId,
          generateFieldFragments,
        },
      }
    ) => {
      context.pg.introspectionResultsByKind.class.map(table => {
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
        context.pg.sqlFragmentGeneratorsByClassIdAndFieldName[table.id] = {};
        context.pg.gqlTypeByClassId[table.id] = buildObjectWithHooks(
          GraphQLObjectType,
          {
            name: inflection.table(table.name),
            fields: {},
          },
          {
            pg: {
              introspection: table,
              isRowType: true,
            },
          }
        );

        const edgeFragmentGenerators = {};
        const addEdgeFragmentGenerator = (field, generator) => {
          edgeFragmentGenerators[field] = generator;
        };

        const schema = introspectionResultsByKind.namespace.filter(
          n => n.id === table.namespaceId
        )[0];
        const primaryKeyConstraint = introspectionResultsByKind.constraint
          .filter(con => con.classId === table.id)
          .filter(con => ["p"].includes(con.type))[0];
        const attributes = introspectionResultsByKind.attribute
          .filter(attr => attr.classId === table.id)
          .sort((a, b) => a.num - b.num);
        const primaryKeys =
          primaryKeyConstraint &&
          primaryKeyConstraint.keyAttributeNums.map(
            num => attributes.filter(attr => attr.num === num)[0]
          );

        addEdgeFragmentGenerator(
          "node",
          (parsedResolveInfoFragment, { tableAlias }) => {
            return generateFieldFragments(
              parsedResolveInfoFragment,
              sqlFragmentGeneratorsByClassIdAndFieldName[table.id],
              { tableAlias }
            );
          }
        );
        addEdgeFragmentGenerator(
          "cursor",
          (parsedResolveInfoFragment, tableAlias) => {
            if (!primaryKeys) {
              return [];
            }
            return [
              {
                alias: "__cursor",
                sqlFragment: sql.fragment`encode(json_build_array('pg', ${sql.literal(
                  schema.name
                )}, ${sql.literal(table.name)}, ${sql.join(
                  primaryKeys.map(attr =>
                    sql.identifier(tableAlias, attr.name)
                  ),
                  ", "
                )})::bytea, 'base64')`,
              },
            ];
          }
        );
        context.pg.gqlEdgeTypeByClassId[table.id] = buildObjectWithHooks(
          GraphQLObjectType,
          {
            name: inflection.edge(table.name),
            fields: {
              cursor: {
                type: Cursor,
                resolve(data) {
                  return data.__cursor;
                },
              },
              node: {
                type: new GraphQLNonNull(context.pg.gqlTypeByClassId[table.id]),
                resolve(data) {
                  return data;
                },
              },
            },
          },
          {
            isEdgeType: true,
            nodeType: context.pg.gqlTypeByClassId[table.id],
            pg: {
              introspection: table,
            },
          }
        );
        const connectionFragmentGenerators = {};
        sqlFragmentGeneratorsForConnectionByClassId[
          table.id
        ] = connectionFragmentGenerators;
        const addConnectionFragmentGenerator = (field, generator) => {
          connectionFragmentGenerators[field] = generator;
        };
        addConnectionFragmentGenerator(
          "edges",
          (parsedResolveInfoFragment, { tableAlias }) => {
            return generateFieldFragments(
              parsedResolveInfoFragment,
              edgeFragmentGenerators,
              { tableAlias }
            );
          }
        );
        addConnectionFragmentGenerator(
          "nodes",
          (parsedResolveInfoFragment, { tableAlias }) => {
            return generateFieldFragments(
              parsedResolveInfoFragment,
              sqlFragmentGeneratorsByClassIdAndFieldName[table.id],
              { tableAlias }
            );
          }
        );
        context.pg.gqlConnectionTypeByClassId[table.id] = buildObjectWithHooks(
          GraphQLObjectType,
          {
            name: inflection.connection(table.name),
            fields: {
              // XXX: pageInfo
              // XXX: totalCount
              nodes: {
                type: new GraphQLList(context.pg.gqlTypeByClassId[table.id]),
                resolve(data) {
                  return data;
                },
              },
              edges: {
                type: new GraphQLList(
                  new GraphQLNonNull(context.pg.gqlEdgeTypeByClassId[table.id])
                ),
                resolve(data) {
                  return data;
                },
              },
            },
          },
          {
            isConnectionType: true,
            edgeType: context.pg.gqlEdgeTypeByClassId[table.id],
            nodeType: context.pg.gqlTypeByClassId[table.id],
            pg: {
              introspection: table,
              addFragmentGenerator: addConnectionFragmentGenerator,
            },
          }
        );
        const tableType = introspectionResultsByKind.type.filter(
          type =>
            type.type === "c" &&
            type.category === "C" &&
            type.namespaceId === table.namespaceId &&
            type.classId === table.id
        )[0];
        if (!tableType) {
          throw new Error("Could not determine the type for this table");
        }
        context.pg.gqlTypeByTypeId[tableType.id] =
          context.pg.gqlTypeByClassId[table.id];
      });
    }
  );
};
