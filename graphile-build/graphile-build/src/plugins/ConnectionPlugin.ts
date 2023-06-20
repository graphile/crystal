import "graphile-config";

import type { EdgeCapableStep } from "grafast";
import {
  assertEdgeCapableStep,
  assertPageInfoCapableStep,
  ConnectionStep,
} from "grafast";

import { EXPORTABLE } from "../utils.js";
import { version } from "../version.js";

declare global {
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
        const { nullableIf } = build;
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
                  assertStep: assertEdgeCapableStep,
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
                            () => ($edge: EdgeCapableStep<any>) =>
                              $edge.cursor(),
                            [],
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
                            () => ($edge: EdgeCapableStep<any>) => $edge.node(),
                            [],
                          ),
                        }),
                      ),
                    };
                  },
                }),
                `ConnectionStep building edge type for ${typeName}`,
              );

              // Register connection
              build.registerObjectType<ConnectionStep<any, any, any>>(
                connectionTypeName,
                {
                  ...scope,
                  isConnectionType: true,
                },
                () => {
                  const NodeType = build.getOutputTypeByName(typeName);
                  const EdgeType = build.getOutputTypeByName(edgeTypeName);
                  const PageInfo = build.getOutputTypeByName(
                    build.inflection.builtin("PageInfo"),
                  );
                  return {
                    assertStep: ConnectionStep,
                    description: build.wrapDescription(
                      `A connection to a list of \`${typeName}\` values.`,
                      "type",
                    ),
                    fields: ({ fieldWithHooks }) => ({
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
                          plan: EXPORTABLE(
                            () =>
                              function plan(
                                $connection: ConnectionStep<any, any, any>,
                              ) {
                                return $connection.nodes();
                              },
                            [],
                          ) as any,
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
                          plan: EXPORTABLE(
                            () =>
                              function plan(
                                $connection: ConnectionStep<any, any, any>,
                              ) {
                                return $connection.edges();
                              },
                            [],
                          ) as any,
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
                          plan: EXPORTABLE(
                            () =>
                              function plan(
                                $connection: ConnectionStep<any, any, any>,
                              ) {
                                // TODO: why is this a TypeScript issue without the 'any'?
                                return $connection.pageInfo() as any;
                              },
                            [],
                          ),
                        }),
                      ),
                    }),
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
              assertStep: assertPageInfoCapableStep,
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
                    plan: EXPORTABLE(
                      () =>
                        function plan($pageInfo) {
                          return $pageInfo.hasNextPage() as any;
                        },
                      [],
                    ),
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
                    plan: EXPORTABLE(
                      () =>
                        function plan($pageInfo) {
                          return $pageInfo.hasPreviousPage() as any;
                        },
                      [],
                    ),
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
