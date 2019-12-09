import { Plugin } from "graphile-build";

declare module "graphile-build" {
  interface ScopeGraphQLObjectTypeFieldsField {
    isPageInfoStartCursorField?: boolean;
    isPageInfoEndCursorField?: boolean;
  }
}

export default (function PageInfoStartEndCursor(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        extend,
        getTypeByName,
        inflection,
        graphql: { GraphQLScalarType },
      } = build;
      const { Self, fieldWithHooks } = context;
      if (Self.name !== inflection.builtin("PageInfo")) {
        return fields;
      }
      const Cursor = getTypeByName("Cursor");
      if (!Cursor || !(Cursor instanceof GraphQLScalarType)) {
        return fields;
      }
      return extend(
        fields,
        {
          startCursor: fieldWithHooks(
            "startCursor",
            ({ addDataGenerator }) => {
              addDataGenerator(() => ({ usesCursor: true }));
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
              addDataGenerator(() => ({ usesCursor: true }));
              return {
                description:
                  "When paginating forwards, the cursor to continue.",
                type: Cursor,
              };
            },
            {
              isPageInfoEndCursorField: true,
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
} as Plugin);
