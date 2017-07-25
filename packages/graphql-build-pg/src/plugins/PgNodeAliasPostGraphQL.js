// @flow
import type { Plugin } from "graphql-build";

import pluralize from "pluralize";

export default (async function PgNodeAliasPostGraphQL(builder) {
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
