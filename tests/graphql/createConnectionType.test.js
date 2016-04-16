import expect from 'expect'
import { GraphQLNonNull, GraphQLList } from 'graphql'
import { TestTable } from '../helpers.js'
import createConnectionType from '#/graphql/createConnectionType.js'

describe('createConnectionType', () => {
  it('will append “connection” to type name', () => {
    const type = createConnectionType(new TestTable({ name: 'person' }))
    expect(type.name).toEqual('PersonConnection')
  })

  it('will have a connection type with Relay connection fields', () => {
    const type = createConnectionType(new TestTable({ name: 'person' }))
    const fields = type.getFields()
    expect(fields.pageInfo.type).toBeA(GraphQLNonNull)
    expect(fields.pageInfo.type.ofType.name).toEqual('PageInfo')
    expect(fields.totalCount.type.name).toEqual('Int')
    expect(fields.edges.type).toBeA(GraphQLList)
    expect(fields.edges.type.ofType.name).toEqual('PersonEdge')
  })

  it('will have a connection type with a plain list field', () => {
    const type = createConnectionType(new TestTable({ name: 'person' }))
    const fields = type.getFields()
    expect(fields.list.type).toBeA(GraphQLList)
    expect(fields.list.type.ofType.name).toEqual('Person')
  })

  it('will have edges with a node and a cursor', () => {
    const type = createConnectionType(new TestTable({ name: 'person' }))
    const edgeType = type.getFields().edges.type
    expect(edgeType).toBeA(GraphQLList)
    expect(edgeType.ofType.name).toEqual('PersonEdge')
    expect(edgeType.ofType.getFields().cursor.type).toBeA(GraphQLNonNull)
    expect(edgeType.ofType.getFields().cursor.type.ofType.name).toEqual('Cursor')
    expect(edgeType.ofType.getFields().node.type.name).toEqual('Person')
  })

  it.skip('implements a connection interface')
})
