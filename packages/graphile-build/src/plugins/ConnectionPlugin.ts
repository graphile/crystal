import "graphile-plugin";

import type { EdgeCapablePlan, PageInfoCapablePlan } from "dataplanner";
import { ConnectionPlan, ExecutablePlan } from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLOutputType } from "graphql";

import { version } from "../index.js";

declare global {
  namespace GraphileBuild {
    interface RegisterCursorConnectionOptions {
      typeName: string;
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

export const ConnectionPlugin: GraphilePlugin.Plugin = {
  name: "ConnectionPlugin",
  description: "Plugin to make constructing cursor connections easier",
  version,
  schema: {
    hooks: {
      build(build) {
        const nullableIf = (condition: boolean, Type: GraphQLOutputType) =>
          condition ? Type : new build.graphql.GraphQLNonNull(Type);
        return build.extend(
          build,
          {
            registerCursorConnection(
              options: GraphileBuild.RegisterCursorConnectionOptions,
            ) {
              const { typeName, scope = {}, nonNullNode = false } = options;
              const edgeTypeName = build.inflection.edgeType(typeName);
              build.registerObjectType(
                edgeTypeName,
                {
                  ...scope,
                  isConnectionEdgeType: true,
                },
                ExecutablePlan as unknown as {
                  new (...args: any[]): EdgeCapablePlan<any>;
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
                            () => ($edge: EdgeCapablePlan<any>) =>
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
                            () => ($edge: EdgeCapablePlan<any>) => $edge.node(),
                            [],
                          ),
                        }),
                      ),
                    };
                  },
                }),
                `ConnectionPlan building edge type for ${typeName}`,
              );

              // Register connection
              const connectionTypeName =
                build.inflection.connectionType(typeName);
              build.registerObjectType<ConnectionPlan<any, any, any>>(
                connectionTypeName,
                {
                  ...scope,
                  isConnectionType: true,
                },
                ConnectionPlan,
                () => {
                  const NodeType = build.getOutputTypeByName(typeName);
                  const EdgeType = build.getOutputTypeByName(
                    build.inflection.edgeType(typeName),
                  );
                  const PageInfo = build.getOutputTypeByName(
                    build.inflection.builtin("PageInfo"),
                  );
                  return {
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
                                $connection: ConnectionPlan<any, any, any>,
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
                          type: new build.graphql.GraphQLNonNull(
                            new build.graphql.GraphQLList(
                              new build.graphql.GraphQLNonNull(EdgeType),
                            ),
                          ),
                          plan: EXPORTABLE(
                            () =>
                              function plan(
                                $connection: ConnectionPlan<any, any, any>,
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
                                $connection: ConnectionPlan<any, any, any>,
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
            ExecutablePlan as unknown as {
              new (...args: any[]): PageInfoCapablePlan;
            },
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
