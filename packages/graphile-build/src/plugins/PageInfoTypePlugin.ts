import { ConnectionPlan } from "graphile-crystal";
import type { Plugin } from "graphile-plugin";

import { version } from "../index.js";
import { stringScalarSpec } from "../utils.js";

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
            ConnectionPlan,
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
                        function plan($connection) {
                          return $connection.hasNextPage() as any;
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
                        function plan($connection) {
                          return $connection.hasPreviousPage() as any;
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
