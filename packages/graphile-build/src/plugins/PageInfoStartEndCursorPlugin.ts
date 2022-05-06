import type { PageInfoCapablePlan } from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import type { Plugin } from "graphile-plugin";

import { version } from "../index.js";

declare global {
  namespace GraphileBuild {
    interface ScopeObjectFieldsField {
      isPageInfoStartCursorField?: boolean;
      isPageInfoEndCursorField?: boolean;
    }
  }
}

export const PageInfoStartEndCursorPlugin: Plugin = {
  name: "PageInfoStartEndCursorPlugin",
  description: "Add startCursor/endCursor to the PageInfo type",
  version,
  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          extend,
          getOutputTypeByName,
          inflection,
          graphql: { GraphQLString },
        } = build;
        const { Self, fieldWithHooks } = context;
        if (Self.name !== inflection.builtin("PageInfo")) {
          return fields;
        }
        const Cursor = getOutputTypeByName("Cursor") ?? GraphQLString;
        return extend(
          fields,
          {
            startCursor: fieldWithHooks(
              {
                isPageInfoStartCursorField: true,
                fieldName: "startCursor",
              },
              () => ({
                description: build.wrapDescription(
                  "When paginating backwards, the cursor to continue.",
                  "field",
                ),
                type: Cursor,
                plan: EXPORTABLE(
                  () => ($pageInfo: PageInfoCapablePlan) =>
                    $pageInfo.startCursor(),
                  [],
                ),
              }),
            ),
            endCursor: fieldWithHooks(
              {
                isPageInfoEndCursorField: true,
                fieldName: "endCursor",
              },
              () => ({
                description: build.wrapDescription(
                  "When paginating forwards, the cursor to continue.",
                  "field",
                ),
                type: Cursor,
                plan: EXPORTABLE(
                  () => ($pageInfo: PageInfoCapablePlan) =>
                    $pageInfo.endCursor(),
                  [],
                ),
              }),
            ),
          },
          `Adding startCursor/endCursor to ${Self.name}`,
        );
      },
    },
  },
};
