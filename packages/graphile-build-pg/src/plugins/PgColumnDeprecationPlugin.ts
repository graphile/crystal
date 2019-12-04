import { Plugin } from "graphile-build";

export default (function PgColumnDeprecationPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields:field",
    (field, build, context) => {
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
    ["PgColumnDeprecation"]
  );
} as Plugin);
