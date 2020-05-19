export default (async function PgNodeAliasPostGraphile(builder) {
  builder.hook(
    "GraphQLObjectType",
    (object, build, context) => {
      const {
        setNodeAlias,
        inflection: { pluralize },
      } = build;
      if (!setNodeAlias) {
        // Node plugin must be disabled.
        return object;
      }
      const {
        scope: { isPgRowType, isPgCompoundType, pgIntrospection: table },
      } = context;
      if (table && (isPgRowType || isPgCompoundType)) {
        setNodeAlias(object.name, pluralize(table.name));
      }
      return object;
    },
    ["PgNodeAliasPostGraphile"],
  );
} as GraphileEngine.Plugin);
