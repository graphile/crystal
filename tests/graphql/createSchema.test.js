import expect from 'expect'
import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { TestSchema, TestTable } from '../helpers.js'
import createSchema from '#/graphql/createSchema.js'

describe('graphql/createSchema', () => {
  it('creates a schema', () => {
    const graphqlSchema = createSchema(new TestSchema())
    expect(graphqlSchema).toBeA(GraphQLSchema)
    expect(graphqlSchema.getQueryType()).toBeA(GraphQLObjectType)
  })

  it('creates single field and list field', () => {
    const schema = new TestSchema()
    schema.tables = [new TestTable({ name: 'person' })]
    const fields = createSchema(schema).getQueryType().getFields()
    expect(fields).toIncludeKeys(['person', 'personList'])
    expect(fields.person.type.name).toEqual('Person')
    expect(fields.personList.type.name).toEqual('PersonConnection')
  })

  it('camel cases table names in table fields', async () => {
    const schema = new TestSchema()
    schema.tables = [new TestTable({ name: 'camel_case_me' })]
    const fields = createSchema(schema).getQueryType().getFields()
    expect(fields).toExcludeKey('camel_case_me')
    expect(fields).toIncludeKeys(['camelCaseMe', 'camelCaseMeList'])
  })
})
