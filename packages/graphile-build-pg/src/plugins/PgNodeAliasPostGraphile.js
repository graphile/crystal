// @flow
import type { Plugin } from "graphile-build";

export default (async function PgNodeAliasPostGraphile(builder) {
  builder.hook("GraphQLObjectType", (object, build, context) => {
    const {
      setNodeAlias,
      inflection: { pluralize },
    } = build;
    const {
      scope: { isPgRowType, isPgCompoundType, pgIntrospection: table },
    } = context;
    if (isPgRowType || isPgCompoundType) {
      setNodeAlias(object.name, pluralize(table.name));
    }
    return object;
  });
}: Plugin);
