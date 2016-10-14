jest.mock('pg')
jest.mock('pg-connection-string')
jest.mock('../schema/createPostGraphQLSchema')
jest.mock('../http/createPostGraphQLHTTPRequestHandler')

import { Pool } from 'pg'
import { parse as parsePGConnectionString } from 'pg-connection-string'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'
import createPostGraphQLHTTPRequestHandler from '../http/createPostGraphQLHTTPRequestHandler'
import postgraphql from '../postgraphql'

createPostGraphQLHTTPRequestHandler
  .mockImplementation(({ graphqlSchema }) => Promise.resolve(graphqlSchema).then(() => null))

test('will use the first parameter as the pool if it is an instance of `Pool`', async () => {
  const pgPool = new Pool()
  await postgraphql(pgPool)
  expect(pgPool.connect.mock.calls).toEqual([[]])
  expect(createPostGraphQLHTTPRequestHandler.mock.calls.length).toBe(1)
  expect(createPostGraphQLHTTPRequestHandler.mock.calls[0][0].pgPool).toBe(pgPool)
})

test('will use the config to create a new pool', async () => {
  Pool.mockClear()
  createPostGraphQLHTTPRequestHandler.mockClear()
  const pgPoolConfig = Symbol('pgPoolConfig')
  await postgraphql(pgPoolConfig)
  expect(Pool.mock.calls).toEqual([[pgPoolConfig]])
  expect(Pool.mock.instances[0].connect.mock.calls).toEqual([[]])
  expect(createPostGraphQLHTTPRequestHandler.mock.calls.length).toBe(1)
  expect(createPostGraphQLHTTPRequestHandler.mock.calls[0][0].pgPool).toBe(Pool.mock.instances[0])
})

test('will parse a string config before creating a new pool', async () => {
  Pool.mockClear()
  createPostGraphQLHTTPRequestHandler.mockClear()
  parsePGConnectionString.mockClear()
  const pgPoolConnectionString = 'abcdefghijklmnopqrstuvwxyz'
  const pgPoolConfig = Symbol('pgPoolConfig')
  parsePGConnectionString.mockReturnValueOnce(pgPoolConfig)
  await postgraphql(pgPoolConnectionString)
  expect(parsePGConnectionString.mock.calls).toEqual([[pgPoolConnectionString]])
  expect(Pool.mock.calls).toEqual([[pgPoolConfig]])
  expect(Pool.mock.instances[0].connect.mock.calls).toEqual([[]])
  expect(createPostGraphQLHTTPRequestHandler.mock.calls.length).toBe(1)
  expect(createPostGraphQLHTTPRequestHandler.mock.calls[0][0].pgPool).toBe(Pool.mock.instances[0])
})

test('will use a connected client from the pool, the schemas, and options to create a GraphQL schema', async () => {
  createPostGraphQLSchema.mockClear()
  createPostGraphQLHTTPRequestHandler.mockClear()
  const pgPool = new Pool()
  const schemas = Symbol('schemas')
  const options = Symbol('options')
  const pgClient = { release: jest.fn() }
  pgPool.connect.mockReturnValue(Promise.resolve(pgClient))
  await postgraphql(pgPool, schemas, options)
  expect(pgPool.connect.mock.calls).toEqual([[]])
  expect(createPostGraphQLSchema.mock.calls).toEqual([[pgClient, schemas, options]])
  expect(pgClient.release.mock.calls).toEqual([[]])
})

test('will use a created GraphQL schema to create the HTTP request handler and pass down options', async () => {
  createPostGraphQLHTTPRequestHandler.mockClear()
  const pgPool = new Pool()
  const graphqlSchema = Promise.resolve(Symbol('graphqlSchema'))
  const options = { a: 1, b: 2, c: 3 }
  createPostGraphQLSchema.mockReturnValueOnce(graphqlSchema)
  await postgraphql(pgPool, null, options)
  expect(createPostGraphQLHTTPRequestHandler.mock.calls)
    .toEqual([[{ pgPool, graphqlSchema, a: 1, b: 2, c: 3 }]])
})
