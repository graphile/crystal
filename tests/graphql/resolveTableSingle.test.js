import expect, { createSpy } from 'expect'
import { TestTable } from '../helpers.js'
import resolveTableSingle from '#/graphql/resolveTableSingle.js'

describe('resolveTableSingle', () => {
  it('will only call the client once for many resolves', async () => {
    const table = new TestTable()
    const resolve = resolveTableSingle(table, [table.getColumns()[0]], () => [1])
    const client = { queryAsync: createSpy().andReturn(Promise.resolve({ rows: [] })) }
    expect(client.queryAsync.calls.length).toEqual(0)
    await Promise.all([
      resolve({}, {}, { client }),
      resolve({}, {}, { client }),
      resolve({}, {}, { client }),
      resolve({}, {}, { client }),
    ])
    expect(client.queryAsync.calls.length).toEqual(1)
  })
})
