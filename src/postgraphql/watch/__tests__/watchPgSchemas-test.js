jest.useFakeTimers()

import watchPgSchemas, { _watchFixturesQuery } from '../watchPgSchemas'

const chalk = require('chalk')

test('will connect a client from the provided pool, run some SQL, and listen for notifications', async () => {
  const pgClient = { query: jest.fn(() => Promise.resolve()), on: jest.fn() }
  const pgPool = { connect: jest.fn(() => Promise.resolve(pgClient)) }
  await watchPgSchemas({ pgPool })
  expect(pgPool.connect.mock.calls).toEqual([[]])
  expect(pgClient.query.mock.calls).toEqual([[await _watchFixturesQuery], ['listen postgraphql_watch']])
  expect(pgClient.on.mock.calls.length).toBe(1)
  expect(pgClient.on.mock.calls[0].length).toBe(2)
  expect(pgClient.on.mock.calls[0][0]).toBe('notification')
  expect(typeof pgClient.on.mock.calls[0][1]).toBe('function')
})

test('will log some stuff and continue if the watch fixtures query fails', async () => {
  const pgClient = {
    query: jest.fn(async query => {
      if (query === await _watchFixturesQuery)
        throw new Error('oops!')
    }),
    on: jest.fn(),
  }
  const pgPool = {
    connect: jest.fn(() => Promise.resolve(pgClient)),
  }
  const mockWarn = jest.fn()
  const origWarn = console.warn
  console.warn = mockWarn
  await watchPgSchemas({ pgPool })
  console.warn = origWarn
  expect(pgPool.connect.mock.calls).toEqual([[]])
  expect(pgClient.query.mock.calls).toEqual([[await _watchFixturesQuery], ['listen postgraphql_watch']])
  expect(pgClient.on.mock.calls.length).toBe(1)
  expect(pgClient.on.mock.calls[0].length).toBe(2)
  expect(pgClient.on.mock.calls[0][0]).toBe('notification')
  expect(typeof pgClient.on.mock.calls[0][1]).toBe('function')
  expect(mockWarn.mock.calls).toEqual([
    [chalk.bold.yellow('Failed to setup watch fixtures in Postgres database') + ' ️️⚠️'],
    [chalk.yellow('This is likely because your Postgres user is not a superuser. If the')],
    [chalk.yellow('fixtures already exist, the watch functionality may still work.')],
  ])
})

test('will call `onChange` with the appropriate commands from the notification listener', async () => {
  const onChange = jest.fn()
  let notificationListener
  const pgClient = { query: jest.fn(), on: jest.fn((event, listener) => notificationListener = listener) }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await watchPgSchemas({ pgPool, pgSchemas: ['a', 'b'], onChange })
  const notifications = [
    {},
    { payload: '' },
    { channel: 'postgraphql_watch' },
    { channel: 'unknown_channel', payload: 'error!' },
    { channel: 'postgraphql_watch', payload: '' },
    { channel: 'postgraphql_watch', payload: JSON.stringify([{ schema: 'a', command: '1' }]) },
    { channel: 'postgraphql_watch', payload: JSON.stringify([{ schema: 'b', command: '2' }]) },
    { channel: 'postgraphql_watch', payload: JSON.stringify([{ schema: 'a', command: '3' }, { schema: 'b', command: '4' }]) },
    { channel: 'postgraphql_watch', payload: JSON.stringify([{ schema: 'c', command: '5' }]) },
    { channel: 'postgraphql_watch', payload: JSON.stringify([{ schema: 'a', command: '6' }, { schema: 'c', command: '7' }, { schema: 'b', command: '8' }]) },
  ]
  notifications.forEach(notification => notificationListener(notification))
  jest.runAllTimers()
  expect(onChange.mock.calls).toEqual([[{ commands: ['1', '2', '3', '4', '6', '8'] }]])
})
