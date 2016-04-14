import expect from 'expect'
import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { TestSchema } from './helpers'
import { createGraphqlSchema } from '../src/graphql/index'

describe('createGraphqlSchema', () => {
  it('creates a schema', () => {
    const schema = createGraphqlSchema(new TestSchema())
    expect(schema).toBeA(GraphQLSchema)
    expect(schema.getQueryType()).toBeA(GraphQLObjectType)
  })
})
