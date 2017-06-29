module.exports = function PageInfoStartEndCursor(builder) {
  builder.hook(
    "objectType:fields",
    (fields, { extend, getTypeByName }, { Self }) => {
      if (Self.name !== "PageInfo") {
        return fields;
      }
      const Cursor = getTypeByName("Cursor");
      return extend(fields, {
        startCursor: {
          type: Cursor,
        },
        endCursor: {
          type: Cursor,
        },
      });
    }
  );
};
