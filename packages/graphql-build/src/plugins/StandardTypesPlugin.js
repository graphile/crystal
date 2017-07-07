const {
  GraphQLScalarType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
} = require("graphql");
const { Kind } = require("graphql/language");
const GraphQLJSON = require("graphql-type-json");

const stringType = (name, description) =>
  new GraphQLScalarType({
    name,
    description,
    serialize: value => String(value),
    parseValue: value => String(value),
    parseLiteral: ast => {
      if (ast.kind !== Kind.STRING) {
        throw new Error("Can only parse string values");
      }
      return ast.value;
    },
  });

module.exports = function StandardTypesPlugin(builder) {
  builder.hook("build", build => {
    const Cursor = stringType("Cursor");
    build.addType(Cursor);
    const UUID = stringType(
      "UUID",
      "A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122)."
    );
    build.addType(UUID);
    build.addType(GraphQLJSON);
    return build;
  });
  builder.hook("init", (_, { buildObjectWithHooks }) => {
    // https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
    /* const PageInfo = */
    buildObjectWithHooks(GraphQLObjectType, {
      name: "PageInfo",
      fields: ({ buildFieldWithHooks }) => ({
        hasNextPage: buildFieldWithHooks(
          "hasNextPage",
          ({ addDataGenerator }) => {
            addDataGenerator(() => {
              return {
                calculateHasNextPage: true,
              };
            });
            return {
              type: new GraphQLNonNull(GraphQLBoolean),
            };
          }
        ),
        hasPreviousPage: buildFieldWithHooks(
          "hasPreviousPage",
          ({ addDataGenerator }) => {
            addDataGenerator(() => {
              return {
                calculateHasPreviousPage: true,
              };
            });
            return {
              type: new GraphQLNonNull(GraphQLBoolean),
            };
          }
        ),
      }),
    });
    return _;
  });
};
