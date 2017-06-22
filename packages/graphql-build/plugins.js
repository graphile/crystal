const { GraphQLObjectType, GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const QueryPlugin = async builder => {
  builder.hook("schema", (spec, { buildObjectWithHooks, extend }) => {
    const queryType = buildObjectWithHooks(
      GraphQLObjectType,
      {
        name: "Query",
        fields: {},
      },
      { isRootQuery: true }
    );
    return extend(spec, {
      query: queryType,
    });
  });
};

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

const StandardTypesPlugin = async builder => {
  builder.hook("build", build => {
    const Cursor = stringType("Cursor");
    build.addType(Cursor);
    const UUID = stringType("UUID");
    build.addType(UUID);
    return build;
  });
};

exports.QueryPlugin = QueryPlugin;
exports.StandardTypesPlugin = StandardTypesPlugin;
