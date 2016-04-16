import expect, { createSpy } from 'expect'
import { noop } from 'lodash'
import { TestTable } from '../helpers.js'
import resolveConnection from '#/graphql/resolveConnection.js'

// More in depth testing is done in integration tests.
describe('resolveTableListField', () => {
  it('will error without an `orderBy`', async () => {
    const resolve = resolveConnection(new TestTable())

    try {
      await resolve({}, {}, {})
      throw new Error('Error not thrown!')
    }
    catch (error) {
      if (!/orderBy/.test(error.message))
        throw error
    }
  })

  it('does not allow `first` and `last` together', async () => {
    const resolve = resolveConnection(new TestTable())

    try {
      await resolve({}, { orderBy: 'test', first: 2, last: 5 }, {})
      throw new Error('Error not thrown!')
    }
    catch (error) {
      if (!/cannot define both a/i.test(error.message))
        throw error
    }
  })

  it('will lazily get properties and memoize common data', async () => {
    const resolve = resolveConnection(new TestTable())
    const client = { queryAsync: createSpy().andReturn(Promise.resolve({ rows: [] })) }
    const result1 = await resolve({}, { orderBy: 'test' }, { client })
    const result2 = await resolve({}, { orderBy: 'test', descending: true }, { client })
    expect(client.queryAsync.calls.length).toEqual(0)
    noop(await Promise.all([result1.hasNextPage, result1.hasPreviousPage, result2.hasNextPage, result2.hasPreviousPage]))
    expect(client.queryAsync.calls.length).toEqual(2)
    noop(await result2.list)
    expect(client.queryAsync.calls.length).toEqual(2)
    noop(await Promise.all([result2.list, result1.list, result1.edges, result2.edges]))
    expect(client.queryAsync.calls.length).toEqual(2)
  })
})
