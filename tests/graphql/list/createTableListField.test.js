import expect from 'expect'
import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql'
import { TestTable } from '../helpers.js'
import createTableListField from '#/graphql/list/createTableListField.js'

describe('graphql/createTableListField', () => {
  it('has an object type', async () => {
    const { type } = createTableListField(new TestTable())
    expect(type).toBeA(GraphQLObjectType)
  })

  it('will append “connection” to type name', () => {
    const { type } = createTableListField(new TestTable({ name: 'person' }))
    expect(type.name).toEqual('PersonConnection')
  })

  it('will have Relay connection arguments', () => {
    const field = createTableListField(new TestTable())
    expect(field.args).toIncludeKeys(['first', 'last', 'before', 'after'])
  })

  it('will take cursors for `before` and `after` args', () => {
    const field = createTableListField(new TestTable())
    expect(field.args.before.type.name).toEqual('Cursor')
    expect(field.args.after.type.name).toEqual('Cursor')
  })

  it('will take standard SQL args', () => {
    const field = createTableListField(new TestTable())
    expect(field.args).toIncludeKeys(['orderBy', 'offset', 'descending'])
  })

  it('will have a connection type with Relay connection fields', () => {
    const { type } = createTableListField(new TestTable({ name: 'person' }))
    const fields = type.getFields()
    expect(fields.pageInfo.type).toBeA(GraphQLNonNull)
    expect(fields.pageInfo.type.ofType.name).toEqual('PageInfo')
    expect(fields.totalCount.type.name).toEqual('Int')
    expect(fields.edges.type).toBeA(GraphQLList)
    expect(fields.edges.type.ofType.name).toEqual('PersonEdge')
  })

  it('will have a connection type with a plain list field', () => {
    const { type } = createTableListField(new TestTable({ name: 'person' }))
    const fields = type.getFields()
    expect(fields.list.type).toBeA(GraphQLList)
    expect(fields.list.type.ofType.name).toEqual('Person')
  })

  it('will have edges with a node and a cursor', () => {
    const { type } = createTableListField(new TestTable({ name: 'person' }))
    const edgeType = type.getFields().edges.type
    expect(edgeType).toBeA(GraphQLList)
    expect(edgeType.ofType.name).toEqual('PersonEdge')
    expect(edgeType.ofType.getFields().cursor.type).toBeA(GraphQLNonNull)
    expect(edgeType.ofType.getFields().cursor.type.ofType.name).toEqual('Cursor')
    expect(edgeType.ofType.getFields().node.type.name).toEqual('Person')
  })

  it.skip('implements a connection interface')
})
