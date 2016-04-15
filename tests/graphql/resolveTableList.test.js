import expect, { createSpy } from 'expect'
import { noop } from 'lodash'
import { TestTable } from '../helpers.js'
import resolveTableList from '#/graphql/resolveTableList.js'

// More in depth testing is done in integration tests.
describe('graphql/resolveTableListField', () => {
  it('does not allow `first` and `last` together', async () => {
    const resolve = resolveTableList(new TestTable())

    try {
      await resolve({}, { first: 2, last: 5 }, {})
      throw new Error('Error not thrown!')
    }
    catch (error) {
      if (!/cannot define both a/i.test(error.message))
        throw error
    }
  })

  it('will lazily get properties and memoize common data', async () => {
    const resolve = resolveTableList(new TestTable())
    const client = { queryAsync: createSpy().andReturn(Promise.resolve({ rows: [] })) }
    const result1 = await resolve({}, { orderBy: 'id' }, { client })
    const result2 = await resolve({}, { orderBy: 'id', descending: true }, { client })
    expect(client.queryAsync.calls.length).toEqual(0)
    noop(await Promise.all([result1.hasNextPage, result1.hasPreviousPage, result2.hasNextPage, result2.hasPreviousPage]))
    expect(client.queryAsync.calls.length).toEqual(2)
    noop(await result2.list)
    expect(client.queryAsync.calls.length).toEqual(2)
    noop(await Promise.all([result2.list, result1.list, result1.edges, result2.edges]))
    expect(client.queryAsync.calls.length).toEqual(2)
  })
})
