// @flow
import type { Plugin } from "graphile-build";

import pluralize from "pluralize";

export default (async function PgNodeAliasPostGraphile(builder) {
  builder.hook(
    "GraphQLObjectType",
    (
      object,
      { setNodeAlias },
      { scope: { isPgRowType, isPgCompoundType, pgIntrospection: table } }
    ) => {
      if (isPgRowType || isPgCompoundType) {
        setNodeAlias(object.name, pluralize(table.name));
      }
      return object;
    }
  );
}: Plugin);
