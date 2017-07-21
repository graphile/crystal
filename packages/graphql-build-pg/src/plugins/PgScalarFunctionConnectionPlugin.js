const base64 = str => new Buffer(String(str)).toString("base64");

export default function PgTablesPlugin(builder, { pgInflection: inflection }) {
  builder.hook(
    "init",
    (
      _,
      {
        newWithHooks,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        getTypeByName,
        pgGqlTypeByTypeId: gqlTypeByTypeId,
        graphql: {
          GraphQLObjectType,
          GraphQLNonNull,
          GraphQLList,
          GraphQLString,
        },
      }
    ) => {
      const Cursor = getTypeByName("Cursor");
      introspectionResultsByKind.procedure
        .filter(proc => proc.returnsSet)
        .forEach(proc => {
          const returnType =
            introspectionResultsByKind.typeById[proc.returnTypeId];
          const returnTypeTable =
            introspectionResultsByKind.classById[returnType.classId];
          if (returnTypeTable) {
            // Just use the standard table connection from PgTablesPlugin
            return;
          }
          const NodeType = gqlTypeByTypeId[returnType.id] || GraphQLString;
          const EdgeType = newWithHooks(
            GraphQLObjectType,
            {
              name: inflection.scalarFunctionEdge(
                proc.name,
                proc.namespace.name
              ),
              description: `A \`${NodeType.name}\` edge in the connection.`,
              fields: () => {
                return {
                  cursor: {
                    description: "A cursor for use in pagination.",
                    type: Cursor,
                    resolve(data) {
                      return base64(JSON.stringify(data.__cursor));
                    },
                  },
                  node: {
                    description: `The \`${NodeType.name}\` at the end of the edge.`,
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
          newWithHooks(
            GraphQLObjectType,
            {
              name: inflection.scalarFunctionConnection(
                proc.name,
                proc.namespace.name
              ),
              description: `A connection to a list of \`${NodeType.name}\` values.`,
              fields: ({ recurseDataGeneratorsForField }) => {
                recurseDataGeneratorsForField("edges");
                recurseDataGeneratorsForField("nodes");
                return {
                  nodes: {
                    description: `A list of \`${NodeType.name}\` objects.`,
                    type: new GraphQLNonNull(new GraphQLList(NodeType)),
                    resolve(data) {
                      return data.data.map(entry => entry.value);
                    },
                  },
                  edges: {
                    description: `A list of edges which contains the \`${NodeType.name}\` and cursor to aid in pagination.`,
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
}
