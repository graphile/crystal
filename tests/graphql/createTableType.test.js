import expect from 'expect'
import { GraphQLObjectType } from 'graphql'
import { TestTable, TestColumn } from '../helpers.js'
import createTableType from '#/graphql/createTableType.js'

describe('graphql/createTableType', () => {
  it('creates a table object type', () => {
    const type = createTableType(new TestTable())
    expect(type).toBeA(GraphQLObjectType)
  })

  it('pascal cases table names', async () => {
    const type1 = createTableType(new TestTable({ name: 'camel_case_me' }))
    const type2 = createTableType(new TestTable({ name: 'person' }))
    expect(type1.name).toEqual('CamelCaseMe')
    expect(type2.name).toEqual('Person')
  })

  it('camel cases table columns', async () => {
    const table = new TestTable({ name: 'test', columns: [new TestColumn({ name: 'camel_case_me' })] })
    const type = createTableType(table)
    expect(type.getFields()).toIncludeKey('camelCaseMe')
  })

  it('attaches comment descriptions', async () => {
    const type = await createTableType(new TestTable({ name: 'person', description: 'This is a person' }))
    expect(type.description).toEqual('This is a person')
  })
})
