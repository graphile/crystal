import { createServer } from 'http'
import setupRequestPgClientTransaction from '../setupRequestPgClientTransaction'

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
  const request = { headers: {} }
  const pgClient = { query: jest.fn() }
  await setupRequestPgClientTransaction(request, pgClient)
  expect(pgClient.query.mock.calls).toEqual([])
})

test('will throw an error for poorly formed authorization headers', async () => {
  const request = { headers: { authorization: 'asd' } }
  const pgClient = { query: jest.fn() }
  await expectHttpError(setupRequestPgClientTransaction(request, pgClient), 400, 'Authorization header is not of the correct bearer scheme format.')
  expect(pgClient.query.mock.calls).toEqual([])
})

test('will throw an error if a correct authorization header was provided, but there was no secret', async () => {
  const request = { headers: { authorization: 'Bearer asd' } }
  const pgClient = { query: jest.fn() }
  await expectHttpError(setupRequestPgClientTransaction(request, pgClient), 403, 'Not allowed to provide a JWT token.')
  expect(pgClient.query.mock.calls).toEqual([])
})

test('will throw an error if authorization header does not provide a JWT token', async () => {
  const request = { headers: { authorization: 'Bearer asd' } }
  const pgClient = { query: jest.fn() }
  await expectHttpError(setupRequestPgClientTransaction(request, pgClient, { jwtSecret: 'secret' }), 403, 'jwt malformed')
  expect(pgClient.query.mock.calls).toEqual([])
})

test('will throw an error if JWT token was signed with the wrong signature', async () => {
  const request = { headers: { authorization: `Bearer ${jwt.sign({ a: 1, b: 2, c: 3 }, 'wrong secret', { noTimestamp: true })}` } }
  const pgClient = { query: jest.fn() }
  await expectHttpError(setupRequestPgClientTransaction(request, pgClient, { jwtSecret: 'secret' }), 403, 'invalid signature')
  expect(pgClient.query.mock.calls).toEqual([])
})

test('will throw an error if the JWT token does not an audience', async () => {
  const request = { headers: { authorization: `Bearer ${jwt.sign({}, 'secret', { noTimestamp: true })}` } }
  const pgClient = { query: jest.fn() }
  await expectHttpError(setupRequestPgClientTransaction(request, pgClient, { jwtSecret: 'secret' }), 403, 'jwt audience invalid. expected: postgraphql')
  expect(pgClient.query.mock.calls).toEqual([])
})

test('will throw an error if the JWT token does not have the correct audience', async () => {
  const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgrest' }, 'secret', { noTimestamp: true })}` } }
  const pgClient = { query: jest.fn() }
  await expectHttpError(setupRequestPgClientTransaction(request, pgClient, { jwtSecret: 'secret' }), 403, 'jwt audience invalid. expected: postgraphql')
  expect(pgClient.query.mock.calls).toEqual([])
})

test('will succeed with all the correct things', async () => {
  const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgraphql' }, 'secret', { noTimestamp: true })}` } }
  const pgClient = { query: jest.fn() }
  await setupRequestPgClientTransaction(request, pgClient, { jwtSecret: 'secret' })
  expect(pgClient.query.mock.calls).toEqual([[{
    text: 'select set_config($1, $2, true)',
    values: ['jwt.claims.aud', 'postgraphql'],
  }]])
})

test('will add extra claims as available', async () => {
  const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3 }, 'secret', { noTimestamp: true })}` } }
  const pgClient = { query: jest.fn() }
  await setupRequestPgClientTransaction(request, pgClient, { jwtSecret: 'secret' })
  expect(pgClient.query.mock.calls).toEqual([[{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true)',
    values: [
      'jwt.claims.aud', 'postgraphql',
      'jwt.claims.a', 1,
      'jwt.claims.b', 2,
      'jwt.claims.c', 3,
    ],
  }]])
})

test('will set the default role if available', async () => {
  const request = { headers: {} }
  const pgClient = { query: jest.fn() }
  await setupRequestPgClientTransaction(request, pgClient, { pgDefaultRole: 'test_default_role' })
  expect(pgClient.query.mock.calls).toEqual([[{
    text: 'select set_config($1, $2, true)',
    values: ['role', 'test_default_role'],
  }]])
})

test('will set the default role if not role was provided in the JWT', async () => {
  const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3 }, 'secret', { noTimestamp: true })}` } }
  const pgClient = { query: jest.fn() }
  await setupRequestPgClientTransaction(request, pgClient, { jwtSecret: 'secret', pgDefaultRole: 'test_default_role' })
  expect(pgClient.query.mock.calls).toEqual([[{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true)',
    values: [
      'role', 'test_default_role',
      'jwt.claims.aud', 'postgraphql',
      'jwt.claims.a', 1,
      'jwt.claims.b', 2,
      'jwt.claims.c', 3,
    ],
  }]])
})

test('will set a role provided in the JWT', async () => {
  const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgraphql', role: 'test_jwt_role' }, 'secret', { noTimestamp: true })}` } }
  const pgClient = { query: jest.fn() }
  await setupRequestPgClientTransaction(request, pgClient, { jwtSecret: 'secret' })
  expect(pgClient.query.mock.calls).toEqual([[{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true)',
    values: [
      'role', 'test_jwt_role',
      'jwt.claims.aud', 'postgraphql',
      'jwt.claims.role', 'test_jwt_role',
    ],
  }]])
})

test('will set a role provided in the JWT superceding the default role', async () => {
  const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgraphql', role: 'test_jwt_role' }, 'secret', { noTimestamp: true })}` } }
  const pgClient = { query: jest.fn() }
  await setupRequestPgClientTransaction(request, pgClient, { jwtSecret: 'secret', pgDefaultRole: 'test_default_role' })
  expect(pgClient.query.mock.calls).toEqual([[{
    text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true)',
    values: [
      'role', 'test_jwt_role',
      'jwt.claims.aud', 'postgraphql',
      'jwt.claims.role', 'test_jwt_role',
    ],
  }]])
})
