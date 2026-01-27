import "graphile-config";

import { version } from "../version.ts";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PageInfoStartEndCursorPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface ScopeObjectFieldsField {
      isPageInfoStartCursorField?: boolean;
      isPageInfoEndCursorField?: boolean;
    }
  }
}

export const PageInfoStartEndCursorPlugin: GraphileConfig.Plugin = {
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
        const Cursor =
          getOutputTypeByName(inflection.builtin("Cursor")) ?? GraphQLString;
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
              }),
            ),
          },
          `Adding startCursor/endCursor to ${Self.name}`,
        );
      },
    },
  },
};
