const { buildSchema, defaultPlugins } = require("../");

const InvalidSchemaPlugin = builder => {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    if (!context.scope.isRootQuery) {
      return fields;
    }
    return build.extend(fields, {
      invalidField: {
        type: build.graphql.GraphQLInt,
        args: {
          invalidArgument: {
            // Output types cannot be used as argument types
            type: new build.graphql.GraphQLObjectType({
              name: "OutputType",
              fields: {
                anything: {
                  type: build.graphql.GraphQLInt,
                },
              },
            }),
          },
        },
      },
    });
  });
};

test("throws error on invalid schema", async () => {
  let error;
  try {
    await buildSchema([...defaultPlugins, InvalidSchemaPlugin]);
  } catch (err) {
    error = err;
  }
  expect(error).toBeTruthy();
  expect(error).toMatchInlineSnapshot(`
    [Error: GraphQL schema is invalid:
    - The type of Query.invalidField(invalidArgument:) must be Input Type but got: OutputType.]
  `);
});
