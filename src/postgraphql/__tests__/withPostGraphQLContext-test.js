// tslint:disable no-empty

import { $$pgClient } from '../../postgres/inventory/pgClientFromContext'
import withPostGraphQLContext from '../withPostGraphQLContext'

const jwt = require('jsonwebtoken')

/**
 * Expects an Http error. Passes if there is an error of the correct form,
 * fails if there is not.
 */
function expectHttpError (promise, statusCode, message) {
  return promise.then(
    () => { throw new Error('Expected a Http error.') },
    error => {
      expect(error.statusCode).toBe(statusCode)
      expect(error.message).toBe(message)
    },
  )
}

test('will be a noop for no token, secret, or default role', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({ pgPool }, () => {})
  expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']])
})

test('will pass in a context object with the client', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({ pgPool }, client => {
    expect(client[$$pgClient]).toBe(pgClient)
  })
})

test('will record queries run inside the transaction', async () => {
  const query1 = Symbol()
  const query2 = Symbol()
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({ pgPool }, client => {
    client[$$pgClient].query(query1)
    client[$$pgClient].query(query2)
  })
  expect(pgClient.query.mock.calls).toEqual([['begin'], [query1], [query2], ['commit']])
})

test('will return the value from the callback', async () => {
  const value = Symbol()
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  expect(await withPostGraphQLContext({ pgPool }, () => value)).toBe(value)
})

test('will return the asynchronous value from the callback', async () => {
  const value = Symbol()
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  expect(await withPostGraphQLContext({ pgPool }, () => Promise.resolve(value))).toBe(value)
})

test('will throw an error if there was a `jwtToken`, but no `jwtSecret`', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await expectHttpError(withPostGraphQLContext({ pgPool, jwtToken: 'asd' }, () => {}), 403, 'Not allowed to provide a JWT token.')
  expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']])
})

test('will throw an error for a malformed `jwtToken`', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await expectHttpError(withPostGraphQLContext({ pgPool, jwtToken: 'asd', jwtSecret: 'secret' }, () => {}), 403, 'jwt malformed')
  expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']])
})

test('will throw an error if the JWT token was signed with the wrong signature', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await expectHttpError(withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ a: 1, b: 2, c: 3 }, 'wrong secret', { noTimestamp: true }),
    jwtSecret: 'secret',
  }, () => {}), 403, 'invalid signature')
  expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']])
})

test('will throw an error if the JWT token does not have an audience', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await expectHttpError(withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ a: 1, b: 2, c: 3 }, 'secret', { noTimestamp: true }),
    jwtSecret: 'secret',
  }, () => {}), 403, 'jwt audience invalid. expected: postgraphql')
  expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']])
})

test('will throw an error if the JWT token does not have an appropriate audience', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await expectHttpError(withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ a: 1, b: 2, c: 3, aud: 'postgrest' }, 'secret', { noTimestamp: true }),
    jwtSecret: 'secret',
  }, () => {}), 403, 'jwt audience invalid. expected: postgraphql')
  expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']])
})

test('will succeed with all the correct things', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ aud: 'postgraphql' }, 'secret', { noTimestamp: true }),
    jwtSecret: 'secret',
  }, () => {})
  expect(pgClient.query.mock.calls).toEqual([['begin'], [{
    text: 'select set_config($1, $2, true)',
    values: ['jwt.claims.aud', 'postgraphql'],
  }], ['commit']])
})

test('will add extra claims as available', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3 }, 'secret', { noTimestamp: true }),
    jwtSecret: 'secret',
  }, () => {})
  expect(pgClient.query.mock.calls).toEqual([['begin'], [{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true)',
    values: [
      'jwt.claims.aud', 'postgraphql',
      'jwt.claims.a', 1,
      'jwt.claims.b', 2,
      'jwt.claims.c', 3,
    ],
  }], ['commit']])
})

test('will add extra settings as available', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ aud: 'postgraphql' }, 'secret', { noTimestamp: true }),
    jwtSecret: 'secret',
    pgSettings: {
      'foo.bar': 'test1',
      'some.other.var': 'hello world',
    },
  }, () => {})
  expect(pgClient.query.mock.calls).toEqual([['begin'], [{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true)',
    values: [
      'foo.bar', 'test1',
      'some.other.var', 'hello world',
      'jwt.claims.aud', 'postgraphql',
    ],
  }], ['commit']])
})

test('will set the default role if available', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({
    pgPool,
    jwtSecret: 'secret',
    pgDefaultRole: 'test_default_role',
  }, () => {})
  expect(pgClient.query.mock.calls).toEqual([['begin'], [{
    text: 'select set_config($1, $2, true)',
    values: ['role', 'test_default_role'],
  }], ['commit']])
})

test('will set the default role if no other role was provided in the JWT', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3 }, 'secret', { noTimestamp: true }),
    jwtSecret: 'secret',
    pgDefaultRole: 'test_default_role',
  }, () => {})
  expect(pgClient.query.mock.calls).toEqual([['begin'], [{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true)',
    values: [
      'role', 'test_default_role',
      'jwt.claims.aud', 'postgraphql',
      'jwt.claims.a', 1,
      'jwt.claims.b', 2,
      'jwt.claims.c', 3,
    ],
  }], ['commit']])
})

test('will set a role provided in the JWT', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3, role: 'test_jwt_role' }, 'secret', { noTimestamp: true }),
    jwtSecret: 'secret',
  }, () => {})
  expect(pgClient.query.mock.calls).toEqual([['begin'], [{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true)',
    values: [
      'role', 'test_jwt_role',
      'jwt.claims.aud', 'postgraphql',
      'jwt.claims.a', 1,
      'jwt.claims.b', 2,
      'jwt.claims.c', 3,
      'jwt.claims.role', 'test_jwt_role',
    ],
  }], ['commit']])
})

test('will set a role provided in the JWT superceding the default role', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3, role: 'test_jwt_role' }, 'secret', { noTimestamp: true }),
    jwtSecret: 'secret',
    pgDefaultRole: 'test_default_role',
  }, () => {})
  expect(pgClient.query.mock.calls).toEqual([['begin'], [{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true)',
    values: [
      'role', 'test_jwt_role',
      'jwt.claims.aud', 'postgraphql',
      'jwt.claims.a', 1,
      'jwt.claims.b', 2,
      'jwt.claims.c', 3,
      'jwt.claims.role', 'test_jwt_role',
    ],
  }], ['commit']])
})

test('will set a role provided in the JWT', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3, some: {other: {path: 'test_deep_role' }}}, 'secret', { noTimestamp: true }),
    jwtSecret: 'secret',
    jwtRole: ['some', 'other', 'path'],
  }, () => {})
  expect(pgClient.query.mock.calls).toEqual([['begin'], [{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true)',
    values: [
      'role', 'test_deep_role',
      'jwt.claims.aud', 'postgraphql',
      'jwt.claims.a', 1,
      'jwt.claims.b', 2,
      'jwt.claims.c', 3,
      'jwt.claims.some', {'other': {'path': 'test_deep_role'}},
    ],
  }], ['commit']])
})

test('will set a role provided in the JWT superceding the default role', async () => {
  const pgClient = { query: jest.fn(), release: jest.fn() }
  const pgPool = { connect: jest.fn(() => pgClient) }
  await withPostGraphQLContext({
    pgPool,
    jwtToken: jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3, some: {other: {path: 'test_deep_role' }}}, 'secret', { noTimestamp: true }),
    jwtSecret: 'secret',
    jwtRole: ['some', 'other', 'path'],
    pgDefaultRole: 'test_default_role',
  }, () => {})
  expect(pgClient.query.mock.calls).toEqual([['begin'], [{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true)',
    values: [
      'role', 'test_deep_role',
      'jwt.claims.aud', 'postgraphql',
      'jwt.claims.a', 1,
      'jwt.claims.b', 2,
      'jwt.claims.c', 3,
      'jwt.claims.some', {'other': {'path': 'test_deep_role'}},
    ],
  }], ['commit']])
})
