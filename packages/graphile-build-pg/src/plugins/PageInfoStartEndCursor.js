// @flow
import type { Plugin } from "graphile-build";

export default (function PageInfoStartEndCursor(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const { extend, getTypeByName, inflection } = build;
      const { Self, fieldWithHooks } = context;
      if (Self.name !== inflection.builtin("PageInfo")) {
        return fields;
      }
      const Cursor = getTypeByName("Cursor");
      return extend(
        fields,
        {
          startCursor: fieldWithHooks(
            "startCursor",
            ({ addDataGenerator }) => {
              addDataGenerator(() => ({ usesCursor: [true] }));
              return {
                description: build.wrapDescription(
                  "When paginating backwards, the cursor to continue.",
                  "field"
                ),
                type: Cursor,
              };
            },
            {
              isPageInfoStartCursorField: true,
            }
          ),
          endCursor: fieldWithHooks(
            "endCursor",
            ({ addDataGenerator }) => {
              addDataGenerator(() => ({ usesCursor: [true] }));
              return {
                description: build.wrapDescription(
                  "When paginating forwards, the cursor to continue.",
                  "field"
                ),
                type: Cursor,
              };
            },
            {
              isPageInfoStartCursorField: true,
            }
          ),
        },
        `Adding startCursor/endCursor to ${Self.name}`
      );
    },
    ["PageInfoStartEndCursor"],
    [],
    ["Cursor"]
  );
}: Plugin);
