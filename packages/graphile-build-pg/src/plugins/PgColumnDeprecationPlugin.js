// @flow
import type { Plugin } from "graphile-build";

export default (function PgColumnDeprecationPlugin(builder) {
  builder.hook("GraphQLObjectType:fields:field", (field, build, context) => {
    const {
      scope: {
        isPgRowType,
        isPgCompoundType,
        pgIntrospection: table,
        pgFieldIntrospection,
      },
    } = context;
    if (
      !(isPgRowType || isPgCompoundType) ||
      !table ||
      table.kind !== "class" ||
      !pgFieldIntrospection ||
      !pgFieldIntrospection.tags
    ) {
      return field;
    }
    return pgFieldIntrospection.tags.deprecated
      ? Object.assign({}, field, {
          deprecationReason: Array.isArray(pgFieldIntrospection.tags.deprecated)
            ? pgFieldIntrospection.tags.deprecated.join("\n")
            : pgFieldIntrospection.tags.deprecated,
        })
      : field;
  });
}: Plugin);
