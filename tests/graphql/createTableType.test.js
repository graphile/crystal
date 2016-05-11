import expect from 'expect'
import { GraphQLObjectType, GraphQLID } from 'graphql'
import { TestTable, TestColumn } from '../helpers.js'
import createTableType from '#/graphql/createTableType.js'

describe('createTableType', () => {
  it('creates a table object type', () => {
    const type = createTableType(new TestTable())
    expect(type).toBeA(GraphQLObjectType)
  })

  it('pascal cases table names', () => {
    const type1 = createTableType(new TestTable({ name: 'camel_case_me' }))
    const type2 = createTableType(new TestTable({ name: 'person' }))
    expect(type1.name).toEqual('CamelCaseMe')
    expect(type2.name).toEqual('Person')
  })

  it('camel cases table columns', () => {
    const table = new TestTable()
    table.schema.catalog.addColumn(new TestColumn({ table, name: 'camel_case_me' }))
    const type = createTableType(table)
    expect(type.getFields()).toIncludeKey('camelCaseMe')
  })

  it('attaches comment descriptions', () => {
    const type = createTableType(new TestTable({ name: 'person', description: 'This is a person' }))
    expect(type.description).toEqual('This is a person')
  })

  it('memoizes results', () => {
    const table1 = new TestTable()
    const table2 = new TestTable()
    const type1a = createTableType(table1)
    const type2a = createTableType(table2)
    const type2b = createTableType(table2)
    const type1b = createTableType(table1)
    expect(type1a).toBe(type1b)
    expect(type2a).toBe(type2b)
    expect(type1a).toNotBe(type2a)
  })

  it('will rename `id` columns to `rowId`', () => {
    const table = new TestTable()
    table.schema.catalog.addColumn(new TestColumn({ table, name: 'id', isPrimaryKey: true }))
    const type = createTableType(table)
    expect(type.getFields().rowId).toExist()
  })

  it('will implement the `Node` type', () => {
    const type = createTableType(new TestTable())
    expect(type.getInterfaces()[0].name).toEqual('Node')
    expect(type.getFields()).toIncludeKey('id')
    expect(type.getFields().id.type).toBe(GraphQLID)
  })

  it('will not implement the `Node` type for tables without primary keys', () => {
    const table = new TestTable()
    table.schema.catalog.addColumn(new TestColumn({ table }))
    const type = createTableType(table)
    expect(type.getInterfaces()).toEqual([])
    expect(type.getFields()).toExcludeKey('id')
  })
})
