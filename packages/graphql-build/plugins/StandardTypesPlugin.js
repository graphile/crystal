const {
  GraphQLScalarType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
} = require("graphql");
const { Kind } = require("graphql/language");
const GraphQLJSON = require("graphql-type-json");

const stringType = name =>
  new GraphQLScalarType({
    name,
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
    const UUID = stringType("UUID");
    build.addType(UUID);
    build.addType(GraphQLJSON);
    return build;
  });
  builder.hook("init", (_, { buildObjectWithHooks }) => {
    // https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
    /* const PageInfo = */
    buildObjectWithHooks(GraphQLObjectType, {
      name: "PageInfo",
      fields: {
        hasNextPage: {
          type: new GraphQLNonNull(GraphQLBoolean),
        },
        hasPreviousPage: {
          type: new GraphQLNonNull(GraphQLBoolean),
        },
      },
    });
    return _;
  });
};
