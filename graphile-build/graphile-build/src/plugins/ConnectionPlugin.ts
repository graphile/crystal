import "graphile-config";

import type { Step } from "grafast";
import { ConnectionStep } from "grafast";

import { EXPORTABLE } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      ConnectionPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface RegisterCursorConnectionOptions {
      typeName: string;
      connectionTypeName?: string;
      edgeTypeName?: string;
      scope?: GraphileBuild.ScopeObject;
      nonNullNode?: boolean;
    }

    interface ScopeObject {
      isConnectionType?: true;
      isConnectionEdgeType?: true;
      isPageInfo?: boolean;
    }
    interface ScopeObjectFieldsField {
      isPageInfoHasNextPageField?: boolean;
      isPageInfoHasPreviousPageField?: boolean;
    }
    interface Build {
      registerCursorConnection(options: RegisterCursorConnectionOptions): void;
    }
  }
}

export const ConnectionPlugin: GraphileConfig.Plugin = {
  name: "ConnectionPlugin",
  description: "Plugin to make constructing cursor connections easier",
  version,
  schema: {
    hooks: {
      build(build) {
        const {
          nullableIf,
          grafast: { get },
        } = build;
        return build.extend(
          build,
          {
            registerCursorConnection(
              options: GraphileBuild.RegisterCursorConnectionOptions,
            ) {
              const {
                typeName,
                scope = Object.create(null),
                nonNullNode = false,
              } = options;
              if (
                (options.connectionTypeName || options.edgeTypeName) &&
                !(options.connectionTypeName && options.edgeTypeName)
              ) {
                throw new Error(
                  `You should either specify both connectionTypeName and edgeTypeName or neither (${JSON.stringify(
                    {
                      connectionTypeName: options.connectionTypeName,
                      edgeTypeName: options.edgeTypeName,
                    },
                  )}).`,
                );
              }

              if (!build.getTypeMetaByName(typeName)) {
                throw new Error(
                  `There's no type registered called '${typeName}'; please register this type before attempting to create a connection for it - you might need to change your plugin's before/after`,
                );
              }

              const connectionTypeName =
                options.connectionTypeName ??
                build.inflection.connectionType(typeName);
              if (build.getTypeMetaByName(connectionTypeName)) {
                throw new Error(
                  `A type named ${connectionTypeName} already exists`,
                );
              }
              const edgeTypeName =
                options.edgeTypeName ?? build.inflection.edgeType(typeName);
              if (build.getTypeMetaByName(edgeTypeName)) {
                throw new Error(`A type named ${edgeTypeName} already exists.`);
              }

              build.registerObjectType(
                edgeTypeName,
                {
                  ...scope,
                  isConnectionEdgeType: true,
                },
                () => ({
                  description: build.wrapDescription(
                    `A \`${typeName}\` edge in the connection.`,
                    "type",
                  ),
                  fields: ({ fieldWithHooks }) => {
                    const Cursor = build.getOutputTypeByName(
                      build.inflection.builtin("Cursor"),
                    );
                    const NodeType = build.getOutputTypeByName(typeName);

                    return {
                      cursor: fieldWithHooks(
                        {
                          fieldName: "cursor",
                          isCursorField: true,
                        },
                        () => ({
                          description: build.wrapDescription(
                            "A cursor for use in pagination.",
                            "field",
                          ),
                          type: Cursor,
                          plan: EXPORTABLE(
                            (get) => ($edge: Step) => get($edge, "cursor"),
                            [get],
                          ),
                        }),
                      ),
                      node: fieldWithHooks(
                        {
                          fieldName: "node",
                        },
                        () => ({
                          description: build.wrapDescription(
                            `The \`${typeName}\` at the end of the edge.`,
                            "field",
                          ),
                          type: nullableIf(!nonNullNode, NodeType),
                          plan: EXPORTABLE(
                            (get) => ($edge: Step) => get($edge, "node"),
                            [get],
                          ),
                        }),
                      ),
                    };
                  },
                }),
                `ConnectionStep building edge type for ${typeName}`,
              );

              // Register connection
              build.registerObjectType<
                ConnectionStep<any, any, any, any, any, any>
              >(
                connectionTypeName,
                {
                  ...scope,
                  isConnectionType: true,
                },
                () => {
                  return {
                    assertStep: ConnectionStep,
                    description: build.wrapDescription(
                      `A connection to a list of \`${typeName}\` values.`,
                      "type",
                    ),
                    fields: ({ fieldWithHooks }) => {
                      const NodeType = build.getOutputTypeByName(typeName);
                      const EdgeType = build.getOutputTypeByName(edgeTypeName);
                      const PageInfo = build.getOutputTypeByName(
                        build.inflection.builtin("PageInfo"),
                      );
                      return {
                        nodes: fieldWithHooks(
                          {
                            fieldName: "nodes",
                          },
                          () => ({
                            description: build.wrapDescription(
                              `A list of \`${typeName}\` objects.`,
                              "field",
                            ),
                            type: new build.graphql.GraphQLNonNull(
                              new build.graphql.GraphQLList(
                                nullableIf(!nonNullNode, NodeType),
                              ),
                            ),
                          }),
                        ),
                        edges: fieldWithHooks(
                          {
                            fieldName: "edges",
                          },
                          () => ({
                            description: build.wrapDescription(
                              `A list of edges which contains the \`${typeName}\` and cursor to aid in pagination.`,
                              "field",
                            ),
                            type: nullableIf(
                              false,
                              new build.graphql.GraphQLList(
                                nullableIf(!nonNullNode, EdgeType),
                              ),
                            ),
                          }),
                        ),
                        pageInfo: fieldWithHooks(
                          {
                            fieldName: "pageInfo",
                          },
                          () => ({
                            description: build.wrapDescription(
                              "Information to aid in pagination.",
                              "field",
                            ),
                            type: new build.graphql.GraphQLNonNull(PageInfo),
                          }),
                        ),
                      };
                    },
                  };
                },
                `ConnectionPlugin connection type for ${typeName}`,
              );
            },
          },
          "ConnectionPlugin",
        );
      },
      init: {
        callback: (_, build) => {
          const {
            registerObjectType,
            inflection,
            graphql: { GraphQLNonNull, GraphQLBoolean },
          } = build;

          registerObjectType(
            inflection.builtin("PageInfo"),
            { isPageInfo: true },
            () => ({
              description: build.wrapDescription(
                "Information about pagination in a connection.",
                "type",
              ),
              fields: ({ fieldWithHooks }) => ({
                hasNextPage: fieldWithHooks(
                  {
                    isPageInfoHasNextPageField: true,
                    fieldName: "hasNextPage",
                  },
                  () => ({
                    description: build.wrapDescription(
                      "When paginating forwards, are there more items?",
                      "field",
                    ),
                    type: new GraphQLNonNull(GraphQLBoolean),
                  }),
                ),
                hasPreviousPage: fieldWithHooks(
                  {
                    isPageInfoHasPreviousPageField: true,
                    fieldName: "hasPreviousPage",
                  },
                  () => ({
                    description: build.wrapDescription(
                      "When paginating backwards, are there more items?",
                      "field",
                    ),
                    type: new GraphQLNonNull(GraphQLBoolean),
                  }),
                ),
              }),
            }),
            "graphile-build built-in (Cursor type)",
          );

          return _;
        },
        provides: ["Cursor"],
      },
    },
  },
};
