export default function PageInfoStartEndCursor(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, { extend, getTypeByName }, { Self }) => {
      if (Self.name !== "PageInfo") {
        return fields;
      }
      const Cursor = getTypeByName("Cursor");
      return extend(fields, {
        startCursor: {
          description: "When paginating backwards, the cursor to continue.",
          type: Cursor,
        },
        endCursor: {
          description: "When paginating forwards, the cursor to continue.",
          type: Cursor,
        },
      });
    }
  );
}
