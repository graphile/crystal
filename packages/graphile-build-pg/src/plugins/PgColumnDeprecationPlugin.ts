export default (function PgColumnDeprecationPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields:field",
    (field, _build, context) => {
      const {
        scope: { pgFieldIntrospection },
      } = context;
      if (
        !pgFieldIntrospection ||
        !pgFieldIntrospection.tags ||
        !pgFieldIntrospection.tags.deprecated
      ) {
        return field;
      }
      return {
        ...field,
        deprecationReason: Array.isArray(pgFieldIntrospection.tags.deprecated)
          ? pgFieldIntrospection.tags.deprecated.join("\n")
          : String(pgFieldIntrospection.tags.deprecated),
      };
    },
    ["PgColumnDeprecation"],
  );
} as GraphileEngine.Plugin);
