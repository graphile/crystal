import type { PageInfoCapablePlan } from "graphile-crystal";
import { ExecutablePlan } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";

import { version } from "../index.js";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLObjectType extends Scope {
      isPageInfo?: boolean;
    }
    interface ScopeGraphQLObjectTypeFieldsField {
      isPageInfoHasNextPageField?: boolean;
      isPageInfoHasPreviousPageField?: boolean;
    }
  }
}

export const PageInfoTypePlugin: Plugin = {
  name: "PageInfoTypePlugin",
  description: "Created the 'PageInfo' type for GraphQL Cursor Connections",
  version,
  schema: {
    hooks: {
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
