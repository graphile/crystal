const { GraphQLObjectType } = require("graphql");

module.exports = async function QueryPlugin(builder) {
  builder.hook("build", build =>
    build.extend(build, {
      $$isQuery: Symbol("isQuery"),
    })
  );
  builder.hook(
    "GraphQLSchema",
    (spec, { $$isQuery, buildObjectWithHooks, extend }) => {
      const queryType = buildObjectWithHooks(
        GraphQLObjectType,
        {
          description:
            "The root query type which gives access points into the data universe.",
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
