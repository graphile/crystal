import expect from 'expect'
import { GraphQLObjectType } from 'graphql'
import { TestTable } from '../../helpers.js'
import createNodesQueryField from '#/graphql/query/createNodesQueryField.js'

describe('createNodesQueryField', () => {
  it('has an object type', async () => {
    const { type } = createNodesQueryField(new TestTable())
    expect(type).toBeA(GraphQLObjectType)
  })

  it('will have Relay connection arguments', () => {
    const field = createNodesQueryField(new TestTable())
    expect(field.args).toIncludeKeys(['first', 'last', 'before', 'after'])
  })

  it('will take cursors for `before` and `after` args', () => {
    const field = createNodesQueryField(new TestTable())
    expect(field.args.before.type.name).toEqual('Cursor')
    expect(field.args.after.type.name).toEqual('Cursor')
  })

  it('will take standard SQL args', () => {
    const field = createNodesQueryField(new TestTable())
    expect(field.args).toIncludeKeys(['orderBy', 'offset', 'descending'])
  })
})
