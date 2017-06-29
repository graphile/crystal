const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLEnumType,
  GraphQLInputObjectType,
} = require("graphql");

const base64 = str => Buffer.from(String(str)).toString("base64");

module.exports = function PgTablesPlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "init",
    (
      _,
      {
        getNodeIdForTypeAndIdentifiers,
        nodeIdFieldName,
        buildObjectWithHooks,
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        getTypeByName,
        pgGqlTypeByTypeId: gqlTypeByTypeId,
        pg2GqlMapper,
        gql2pg,
      }
    ) => {
      const Cursor = getTypeByName("Cursor");
      introspectionResultsByKind.procedure.forEach(proc => {
        const returnType =
          introspectionResultsByKind.typeById[proc.returnTypeId];
        const returnTypeTable =
          introspectionResultsByKind.classById[returnType.classId];
        if (returnTypeTable) {
          // Just use the standard table connection from PgTablesPlugin
          return;
        }
        const NodeType = gqlTypeByTypeId[returnType.id] || GraphQLString;
        const EdgeType = buildObjectWithHooks(
          GraphQLObjectType,
          {
            name: inflection.scalarFunctionEdge(proc.name, proc.namespace.name),
            fields: ({
              addDataGeneratorForField,
              recurseDataGeneratorsForField,
              buildFieldWithHooks,
            }) => {
              return {
                cursor: {
                  type: Cursor,
                  resolve(data) {
                    return base64(JSON.stringify(data.__cursor));
                  },
                },
                node: {
                  type: NodeType,
                  resolve(data) {
                    return data.value;
                  },
                },
              };
            },
          },
          {
            isEdgeType: true,
            nodeType: NodeType,
            pgIntrospection: proc,
          }
        );
        /*const ConnectionType = */
        buildObjectWithHooks(
          GraphQLObjectType,
          {
            name: inflection.scalarFunctionConnection(
              proc.name,
              proc.namespace.name
            ),
            fields: ({ recurseDataGeneratorsForField }) => {
              recurseDataGeneratorsForField("edges");
              recurseDataGeneratorsForField("nodes");
              return {
                // XXX: pageInfo
                // XXX: totalCount
                nodes: {
                  type: new GraphQLNonNull(new GraphQLList(NodeType)),
                  resolve(data) {
                    return data.data.map(entry => entry.value);
                  },
                },
                edges: {
                  type: new GraphQLNonNull(
                    new GraphQLList(new GraphQLNonNull(EdgeType))
                  ),
                  resolve(data) {
                    return data.data;
                  },
                },
              };
            },
          },
          {
            isConnectionType: true,
            edgeType: EdgeType,
            nodeType: NodeType,
            pgIntrospection: proc,
          }
        );
      });
      return _;
    }
  );
};
