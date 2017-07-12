const { GraphQLSchema, GraphQLObjectType, GraphQLInt } = require('graphql');

const dummySchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'MockSchemaQuery',
    fields: {
      foo: {
        type: GraphQLInt,
      }
    }
  })
})

module.exports = {
  createPostGraphQLSchema: jest.fn(async (a, b, c) => dummySchema),
  watchPostGraphQLSchema: jest.fn(async (a, b, c, cb) => cb(dummySchema)),
}
