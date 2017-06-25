const { GraphQLScalarType } = require("graphql");
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
};
