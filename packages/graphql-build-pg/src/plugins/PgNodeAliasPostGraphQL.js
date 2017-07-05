// Use of this plugin is not recommended; it's only included for backwards compatibility with PostGraphQL

const pluralize = require("pluralize");

module.exports = async function PgNodeAliasPostGraphQL(builder) {
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
};
