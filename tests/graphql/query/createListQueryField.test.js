import expect from 'expect'
import { GraphQLObjectType } from 'graphql'
import { TestTable } from '../../helpers.js'
import createListQueryField from '#/graphql/query/createListQueryField.js'

describe('createListQueryField', () => {
  it('has an object type', async () => {
    const { type } = createListQueryField(new TestTable())
    expect(type).toBeA(GraphQLObjectType)
  })

  it('will have Relay connection arguments', () => {
    const field = createListQueryField(new TestTable())
    expect(field.args).toIncludeKeys(['first', 'last', 'before', 'after'])
  })

  it('will take cursors for `before` and `after` args', () => {
    const field = createListQueryField(new TestTable())
    expect(field.args.before.type.name).toEqual('Cursor')
    expect(field.args.after.type.name).toEqual('Cursor')
  })

  it('will take standard SQL args', () => {
    const field = createListQueryField(new TestTable())
    expect(field.args).toIncludeKeys(['orderBy', 'offset', 'descending'])
  })
})
