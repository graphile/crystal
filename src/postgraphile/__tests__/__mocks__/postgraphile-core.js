const { GraphQLSchema, GraphQLObjectType, GraphQLInt } = require('graphql');

const dummySchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'MockSchemaQuery',
    fields: {
      foo: {
        type: GraphQLInt,
      },
    },
  }),
});

module.exports = {
  createPostGraphileSchema: jest.fn(async () => dummySchema),
  watchPostGraphileSchema: jest.fn(async (a, b, c, cb) => cb(dummySchema)),
};
