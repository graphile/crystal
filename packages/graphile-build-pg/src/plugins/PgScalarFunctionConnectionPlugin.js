// @flow
import type { Plugin } from "graphile-build";
const base64 = str => Buffer.from(String(str)).toString("base64");

export default (function PgScalarFunctionConnectionPlugin(
  builder,
  { pgForbidSetofFunctionsToReturnNull = false }
) {
  builder.hook("init", (_, build) => {
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
      },
      inflection,
      pgOmit: omit,
      describePgEntity,
      sqlCommentByAddingTags,
    } = build;
    const nullableIf = (condition, Type) =>
      condition ? Type : new GraphQLNonNull(Type);
    const Cursor = getTypeByName("Cursor");
    introspectionResultsByKind.procedure
      .filter(proc => proc.returnsSet)
      .filter(proc => !!proc.namespace)
      .filter(proc => !omit(proc, "execute"))
      .forEach(proc => {
        const returnType =
          introspectionResultsByKind.typeById[proc.returnTypeId];
        const returnTypeTable =
          introspectionResultsByKind.classById[returnType.classId];
        if (returnTypeTable) {
          // Just use the standard table connection from PgTablesPlugin
          return;
        }
        // TODO: PG10 doesn't support the equivalent of pg_attribute.atttypemod
        // on function arguments and return types, however maybe a later
        // version of PG will?
        const NodeType =
          pgGetGqlTypeByTypeIdAndModifier(returnType.id, null) || GraphQLString;
        const EdgeType = newWithHooks(
          GraphQLObjectType,
          {
            name: inflection.scalarFunctionEdge(proc),
            description: `A \`${NodeType.name}\` edge in the connection.`,
            fields: ({ fieldWithHooks }) => {
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
                        return base64(JSON.stringify(data.__cursor));
                      },
                    };
                  },
                  {
                    isCursorField: true,
                  }
                ),
                node: {
                  description: `The \`${
                    NodeType.name
                  }\` at the end of the edge.`,
                  type: NodeType,
                  resolve(data) {
                    return data.value;
                  },
                },
              };
            },
          },
          {
            __origin: `Adding function result edge type for ${describePgEntity(
              proc
            )}. You can rename the function's GraphQL field (and its dependent types) via:\n\n  ${sqlCommentByAddingTags(
              proc,
              {
                name: "newNameHere",
              }
            )}`,
            isEdgeType: true,
            nodeType: NodeType,
            pgIntrospection: proc,
          }
        );
        /*const ConnectionType = */
        newWithHooks(
          GraphQLObjectType,
          {
            name: inflection.scalarFunctionConnection(proc),
            description: `A connection to a list of \`${
              NodeType.name
            }\` values.`,
            fields: ({ recurseDataGeneratorsForField }) => {
              recurseDataGeneratorsForField("edges");
              recurseDataGeneratorsForField("nodes");
              return {
                nodes: {
                  description: `A list of \`${NodeType.name}\` objects.`,
                  type: new GraphQLNonNull(
                    new GraphQLList(
                      nullableIf(!pgForbidSetofFunctionsToReturnNull, NodeType)
                    )
                  ),
                  resolve(data) {
                    return data.data.map(entry => entry.value);
                  },
                },
                edges: {
                  description: `A list of edges which contains the \`${
                    NodeType.name
                  }\` and cursor to aid in pagination.`,
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
            __origin: `Adding function connection type for ${describePgEntity(
              proc
            )}. You can rename the function's GraphQL field (and its dependent types) via:\n\n  ${sqlCommentByAddingTags(
              proc,
              {
                name: "newNameHere",
              }
            )}`,
            isConnectionType: true,
            edgeType: EdgeType,
            nodeType: NodeType,
            pgIntrospection: proc,
          }
        );
      });
    return _;
  });
}: Plugin);
