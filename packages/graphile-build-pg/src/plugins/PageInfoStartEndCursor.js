// @flow
import type { Plugin } from "graphile-build";

export default (function PageInfoStartEndCursor(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, { extend, getTypeByName }, { Self, fieldWithHooks }) => {
      if (Self.name !== "PageInfo") {
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
                description:
                  "When paginating backwards, the cursor to continue.",
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
                description:
                  "When paginating forwards, the cursor to continue.",
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
    }
  );
}: Plugin);
