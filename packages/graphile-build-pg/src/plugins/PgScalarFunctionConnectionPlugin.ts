const base64 = (str: string) => Buffer.from(String(str)).toString("base64");

export default (function PgScalarFunctionConnectionPlugin(builder) {
  builder.hook(
    "init",
    (_, build) => {
      const {
        newWithHooks,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        getTypeByName,
        pgGetGqlTypeByTypeIdAndModifier,
        graphql: {
          GraphQLObjectType,
          GraphQLNonNull,
          GraphQLList,
          GraphQLString,
          GraphQLScalarType,
          getNamedType,
          isOutputType,
        },

        inflection,
        pgOmit: omit,
        describePgEntity,
        sqlCommentByAddingTags,
        pgField,
      } = build;

      const Cursor = getTypeByName("Cursor");
      introspectionResultsByKind.procedure.forEach((proc) => {
        // PERFORMANCE: These used to be .filter(...) calls
        if (!proc.returnsSet) return;
        if (!proc.namespace) return;
        if (omit(proc, "execute")) return;

        const returnType =
          introspectionResultsByKind.typeById[proc.returnTypeId];
        const returnTypeTable = returnType.classId
          ? introspectionResultsByKind.classById[returnType.classId]
          : null;
        if (returnTypeTable) {
          // Just use the standard table connection from PgTablesPlugin
          return;
        }
        if (returnType.id === "2249") {
          // Defer handling to PgRecordFunctionConnectionPlugin
          return;
        }

        if (!Cursor || !(Cursor instanceof GraphQLScalarType)) {
          throw new Error("Expected 'Cursor' type to exist");
        }

        // TODO: PG10 doesn't support the equivalent of pg_attribute.atttypemod
        // on function arguments and return types, however maybe a later
        // version of PG will?
        const NodeType =
          pgGetGqlTypeByTypeIdAndModifier(returnType.id, null) || GraphQLString;
        if (!NodeType || !isOutputType(NodeType)) {
          throw new Error(
            `Could not retrieve NodeType for type with oid '${returnType.id}'`,
          );
        }

        const edgeSpec: GraphileEngine.GraphileObjectTypeConfig<any, any> = {
          name: inflection.scalarFunctionEdge(proc),
          description: `A \`${
            getNamedType(NodeType).name
          }\` edge in the connection.`,
          fields: ({ fieldWithHooks }) => {
            return {
              cursor: fieldWithHooks(
                "cursor",
                ({
                  addDataGenerator,
                }): import("graphql").GraphQLFieldConfig<any, any> => {
                  addDataGenerator(() => ({
                    usesCursor: true,
                  }));

                  return {
                    description: "A cursor for use in pagination.",
                    type: Cursor,
                    resolve(data) {
                      return base64(JSON.stringify(data.__cursor));
                    },
                  };
                },
                {
                  isCursorField: true,
                },
              ),

              node: {
                description: `The \`${
                  getNamedType(NodeType).name
                }\` at the end of the edge.`,
                type: NodeType,
                resolve(data) {
                  return data.value;
                },
              },
            };
          },
        };
        const edgeScope: GraphileEngine.ScopeGraphQLObjectType = {
          __origin: `Adding function result edge type for ${describePgEntity(
            proc,
          )}. You can rename the function's GraphQL field (and its dependent types) via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
            proc,
            {
              name: "newNameHere",
            },
          )}`,
          isEdgeType: true,
          nodeType: NodeType,
          pgIntrospection: proc,
        };
        const EdgeType = newWithHooks(
          GraphQLObjectType,
          edgeSpec,

          edgeScope,
        );

        if (!EdgeType) {
          throw new Error(
            `Failed to construct EdgeType for '${edgeSpec.name}'`,
          );
        }

        /*const ConnectionType = */
        newWithHooks(
          GraphQLObjectType,
          {
            name: inflection.scalarFunctionConnection(proc),
            description: `A connection to a list of \`${
              getNamedType(NodeType).name
            }\` values.`,
            fields: ({ fieldWithHooks }) => {
              return {
                nodes: pgField(build, fieldWithHooks, "nodes", {
                  description: `A list of \`${
                    getNamedType(NodeType).name
                  }\` objects.`,
                  type: new GraphQLNonNull(new GraphQLList(NodeType)),
                  resolve(data) {
                    return data.data.map(
                      (entry: { value: any }) => entry.value,
                    );
                  },
                }),

                edges: pgField(
                  build,
                  fieldWithHooks,
                  "edges",
                  {
                    description: `A list of edges which contains the \`${
                      getNamedType(NodeType).name
                    }\` and cursor to aid in pagination.`,
                    type: new GraphQLNonNull(
                      new GraphQLList(new GraphQLNonNull(EdgeType)),
                    ),

                    resolve(data) {
                      return data.data;
                    },
                  },

                  {},
                  false,
                  {
                    hoistCursor: true,
                  },
                ),
              };
            },
          },

          {
            __origin: `Adding function connection type for ${describePgEntity(
              proc,
            )}. You can rename the function's GraphQL field (and its dependent types) via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
              proc,
              {
                name: "newNameHere",
              },
            )}`,
            isConnectionType: true,
            isPgRowConnectionType: true,
            edgeType: EdgeType,
            nodeType: NodeType,
            pgIntrospection: proc,
          },
        );
      });
      return _;
    },
    ["PgScalarFunctionConnection"],
    [],
    ["PgTypes"],
  );
} as GraphileEngine.Plugin);
