jest.mock('pg')
jest.mock('pg-connection-string')
jest.mock('postgraphql-build')
jest.mock('../http/createPostGraphQLHttpRequestHandler')

import { Pool } from 'pg'
import { parse as parsePgConnectionString } from 'pg-connection-string'
import { createPostGraphQLSchema, watchPostGraphQLSchema } from '..'
import createPostGraphQLHttpRequestHandler from '../http/createPostGraphQLHttpRequestHandler'
import postgraphql from '../postgraphql'

const chalk = require('chalk')

createPostGraphQLHttpRequestHandler.mockImplementation(({ getGqlSchema }) => Promise.resolve(getGqlSchema()).then(() => null))

test('will use a connected client from the pool, the schemas, and options to create a GraphQL schema', async () => {
  createPostGraphQLSchema.mockClear()
  createPostGraphQLHttpRequestHandler.mockClear()
  const pgPool = new Pool()
  const schemas = [Symbol('schemas')]
  const options = Symbol('options')
  await postgraphql(pgPool, schemas, options)
  expect(createPostGraphQLSchema.mock.calls).toEqual([[pgPool, schemas, options]])
})

test('will use a connected client from the pool, the default schema, and options to create a GraphQL schema', async () => {
  createPostGraphQLSchema.mockClear()
  createPostGraphQLHttpRequestHandler.mockClear()
  const pgPool = new Pool()
  const options = Symbol('options')
  const pgClient = { release: jest.fn() }
  await postgraphql(pgPool, options)
  expect(createPostGraphQLSchema.mock.calls).toEqual([[pgPool, ['public'], options]])
})

test('will use a created GraphQL schema to create the HTTP request handler and pass down options', async () => {
  createPostGraphQLSchema.mockClear()
  createPostGraphQLHttpRequestHandler.mockClear()
  const pgPool = new Pool()
  const gqlSchema = Symbol('gqlSchema')
  const options = { a: 1, b: 2, c: 3 }
  createPostGraphQLSchema.mockReturnValueOnce(Promise.resolve(gqlSchema))
  await postgraphql(pgPool, [], options)
  expect(createPostGraphQLHttpRequestHandler.mock.calls.length).toBe(1)
  expect(createPostGraphQLHttpRequestHandler.mock.calls[0].length).toBe(1)
  expect(Object.keys(createPostGraphQLHttpRequestHandler.mock.calls[0][0])).toEqual(['a', 'b', 'c', 'getGqlSchema', 'pgPool', '_emitter'])
  expect(createPostGraphQLHttpRequestHandler.mock.calls[0][0].pgPool).toBe(pgPool)
  expect(createPostGraphQLHttpRequestHandler.mock.calls[0][0].a).toBe(options.a)
  expect(createPostGraphQLHttpRequestHandler.mock.calls[0][0].b).toBe(options.b)
  expect(createPostGraphQLHttpRequestHandler.mock.calls[0][0].c).toBe(options.c)
  expect(await createPostGraphQLHttpRequestHandler.mock.calls[0][0].getGqlSchema()).toBe(gqlSchema)
})

test('will watch Postgres schemas when `watchPg` is true', async () => {
  createPostGraphQLSchema.mockClear()
  watchPostGraphQLSchema.mockClear()
  const pgPool = new Pool()
  const pgSchemas = [Symbol('a'), Symbol('b'), Symbol('c')]
  await postgraphql(pgPool, pgSchemas, { watchPg: false })
  await postgraphql(pgPool, pgSchemas, { watchPg: true })
  expect(createPostGraphQLSchema.mock.calls).toEqual([[pgPool, pgSchemas, { watchPg: false }]])

  expect(watchPostGraphQLSchema.mock.calls.length).toBe(1);
  expect(watchPostGraphQLSchema.mock.calls[0].length).toBe(4);
  expect(watchPostGraphQLSchema.mock.calls[0][0]).toEqual(pgPool)
  expect(watchPostGraphQLSchema.mock.calls[0][1]).toEqual(pgSchemas)
  expect(watchPostGraphQLSchema.mock.calls[0][2]).toEqual({ watchPg: true })
  expect(typeof watchPostGraphQLSchema.mock.calls[0][3]).toBe('function')
})

test('will not error if jwtSecret is provided without jwtPgTypeIdentifier', async () => {
  const pgPool = new Pool()
  expect(() => postgraphql(pgPool, [], { jwtSecret: 'test' })).not.toThrow()
})
