import type { PageInfoCapablePlan } from "graphile-crystal";
import { each, ExecutablePlanResolver } from "graphile-crystal";
import { ConnectionPlan, ExecutablePlan } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLOutputType } from "graphql";

import { version } from "../index.js";
interface RegisterCursorConnectionOptions<
  TItemPlan extends ExecutablePlan<any>,
  TIntermediatePlan extends ExecutablePlan<any>,
> {
  typeName: string;
  scope?: GraphileEngine.ScopeGraphQLObjectType;
  itemPlan?: ($intermediate: TIntermediatePlan) => TItemPlan;
  cursorPlan: (
    $intermediate: TIntermediatePlan,
  ) => ExecutablePlan<string | null>;
  IntermediatePlan: { new (...args: any[]): TIntermediatePlan };
  nonNullNode?: boolean;
}
declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLObjectType {
      isConnectionType?: true;
      isConnectionEdgeType?: true;
      isPageInfo?: boolean;
    }
    interface ScopeGraphQLObjectTypeFieldsField {
      isPageInfoHasNextPageField?: boolean;
      isPageInfoHasPreviousPageField?: boolean;
    }
    interface Build {
      registerCursorConnection<
        TItemPlan extends ExecutablePlan<any>,
        TIntermediatePlan extends ExecutablePlan<any>,
      >(
        options: RegisterCursorConnectionOptions<TItemPlan, TIntermediatePlan>,
      ): void;
    }
  }
}

export const ConnectionPlugin: Plugin = {
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
            registerCursorConnection<
              TItemPlan extends ExecutablePlan<any>,
              TIntermediatePlan extends ExecutablePlan<any>,
            >(
              options: RegisterCursorConnectionOptions<
                TItemPlan,
                TIntermediatePlan
              >,
            ) {
              const {
                typeName,
                scope = {},
                itemPlan = ($item: TIntermediatePlan) =>
                  $item as unknown as TItemPlan,
                cursorPlan,
                IntermediatePlan,
                nonNullNode = false,
              } = options;
              const edgeTypeName = build.inflection.edgeType(typeName);
              build.registerObjectType(
                edgeTypeName,
                {
                  ...scope,
                  isConnectionEdgeType: true,
                },
                IntermediatePlan as any,
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
                          plan: cursorPlan as any,
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
                            (itemPlan) =>
                              function plan($record: TIntermediatePlan) {
                                return itemPlan($record);
                              },
                            [itemPlan],
                          ) as any,
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
              build.registerObjectType<ConnectionPlan<any>>(
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
                            (each, itemPlan) =>
                              function plan($connection: ConnectionPlan<any>) {
                                return each(
                                  $connection.cloneSubplanWithPagination(),
                                  itemPlan,
                                );
                              },
                            [each, itemPlan],
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
                              function plan($connection: ConnectionPlan<any>) {
                                return $connection.cloneSubplanWithPagination();
                              },
                            [],
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
                          plan: EXPORTABLE(
                            () =>
                              function plan($connection: ConnectionPlan<any>) {
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
