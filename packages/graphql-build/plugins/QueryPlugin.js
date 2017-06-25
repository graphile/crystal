const { GraphQLNonNull, GraphQLString, GraphQLObjectType } = require("graphql");

module.exports = async function QueryPlugin(builder) {
  builder.hook("build", build =>
    build.extend(build, {
      $$isQuery: Symbol("isQuery"),
    })
  );
  builder.hook(
    "schema",
    (spec, { $$isQuery, buildObjectWithHooks, extend }) => {
      const queryType = buildObjectWithHooks(
        GraphQLObjectType,
        {
          name: "Query",
          isTypeOf: (value, _context, info) =>
            info.parentType == null || value === $$isQuery,
          fields: ({ Self }) => ({
            query: {
              type: Self,
              resolve() {
                return $$isQuery;
              },
            },
          }),
        },
        { isRootQuery: true }
      );
      return extend(spec, {
        query: queryType,
      });
    }
  );
};
