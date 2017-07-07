jest.mock('pg')
jest.mock('pg-connection-string')
jest.mock('../schema/createPostGraphQLSchema')
jest.mock('../http/createPostGraphQLHttpRequestHandler')
jest.mock('../watch/watchPgSchemas')

import { Pool } from 'pg'
import { parse as parsePgConnectionString } from 'pg-connection-string'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'
import createPostGraphQLHttpRequestHandler from '../http/createPostGraphQLHttpRequestHandler'
import watchPgSchemas from '../watch/watchPgSchemas'
import postgraphql from '../postgraphql'

const chalk = require('chalk')

createPostGraphQLHttpRequestHandler.mockImplementation(({ getGqlSchema }) => Promise.resolve(getGqlSchema()).then(() => null))
watchPgSchemas.mockImplementation(() => Promise.resolve())

test('will use the first parameter as the pool if it is an instance of `Pool`', async () => {
  const pgPool = new Pool()
  await postgraphql(pgPool)
  expect(pgPool.connect.mock.calls).toEqual([[]])
  expect(createPostGraphQLHttpRequestHandler.mock.calls.length).toBe(1)
  expect(createPostGraphQLHttpRequestHandler.mock.calls[0][0].pgPool).toBe(pgPool)
})

test('will use the config to create a new pool', async () => {
  Pool.mockClear()
  createPostGraphQLHttpRequestHandler.mockClear()
  const pgPoolConfig = Symbol('pgPoolConfig')
  await postgraphql(pgPoolConfig)
  expect(Pool.mock.calls).toEqual([[pgPoolConfig]])
  expect(Pool.mock.instances[0].connect.mock.calls).toEqual([[]])
  expect(createPostGraphQLHttpRequestHandler.mock.calls.length).toBe(1)
  expect(createPostGraphQLHttpRequestHandler.mock.calls[0][0].pgPool).toBe(Pool.mock.instances[0])
})

test('will parse a string config before creating a new pool', async () => {
  Pool.mockClear()
  createPostGraphQLHttpRequestHandler.mockClear()
  parsePgConnectionString.mockClear()
  const pgPoolConnectionString = 'abcdefghijklmnopqrstuvwxyz'
  const pgPoolConfig = Symbol('pgPoolConfig')
  parsePgConnectionString.mockReturnValueOnce(pgPoolConfig)
  await postgraphql(pgPoolConnectionString)
  expect(parsePgConnectionString.mock.calls).toEqual([[pgPoolConnectionString]])
  expect(Pool.mock.calls).toEqual([[pgPoolConfig]])
  expect(Pool.mock.instances[0].connect.mock.calls).toEqual([[]])
  expect(createPostGraphQLHttpRequestHandler.mock.calls.length).toBe(1)
  expect(createPostGraphQLHttpRequestHandler.mock.calls[0][0].pgPool).toBe(Pool.mock.instances[0])
})

test('will use a connected client from the pool, the schemas, and options to create a GraphQL schema', async () => {
  createPostGraphQLSchema.mockClear()
  createPostGraphQLHttpRequestHandler.mockClear()
  const pgPool = new Pool()
  const schemas = [Symbol('schemas')]
  const options = Symbol('options')
  const pgClient = { release: jest.fn() }
  pgPool.connect.mockReturnValue(Promise.resolve(pgClient))
  await postgraphql(pgPool, schemas, options)
  expect(pgPool.connect.mock.calls).toEqual([[]])
  expect(createPostGraphQLSchema.mock.calls).toEqual([[pgClient, schemas, options]])
  expect(pgClient.release.mock.calls).toEqual([[]])
})

test('will use a connected client from the pool, the default schema, and options to create a GraphQL schema', async () => {
  createPostGraphQLSchema.mockClear()
  createPostGraphQLHttpRequestHandler.mockClear()
  const pgPool = new Pool()
  const options = Symbol('options')
  const pgClient = { release: jest.fn() }
  pgPool.connect.mockReturnValue(Promise.resolve(pgClient))
  await postgraphql(pgPool, options)
  expect(pgPool.connect.mock.calls).toEqual([[]])
  expect(createPostGraphQLSchema.mock.calls).toEqual([[pgClient, ['public'], options]])
  expect(pgClient.release.mock.calls).toEqual([[]])
})

test('will use a created GraphQL schema to create the HTTP request handler and pass down options', async () => {
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
  const pgPool = new Pool()
  const pgSchemas = [Symbol('a'), Symbol('b'), Symbol('c')]
  await postgraphql(pgPool, pgSchemas, { watchPg: false })
  await postgraphql(pgPool, pgSchemas, { watchPg: true })
  expect(watchPgSchemas.mock.calls.length).toBe(1)
  expect(watchPgSchemas.mock.calls[0].length).toBe(1)
  expect(Object.keys(watchPgSchemas.mock.calls[0][0])).toEqual(['pgPool', 'pgSchemas', 'onChange'])
  expect(watchPgSchemas.mock.calls[0][0].pgPool).toBe(pgPool)
  expect(watchPgSchemas.mock.calls[0][0].pgSchemas).toBe(pgSchemas)
  expect(typeof watchPgSchemas.mock.calls[0][0].onChange).toBe('function')
})

test('will create a new PostGraphQL schema on when `watchPgSchemas` emits a change', async () => {
  watchPgSchemas.mockClear()
  createPostGraphQLHttpRequestHandler.mockClear()
  const gqlSchemas = [Symbol('a'), Symbol('b'), Symbol('c')]
  let gqlSchemaI = 0
  createPostGraphQLSchema.mockClear()
  createPostGraphQLSchema.mockImplementation(() => Promise.resolve(gqlSchemas[gqlSchemaI++]))
  const pgPool = new Pool()
  const pgClient = { release: jest.fn() }
  pgPool.connect.mockReturnValue(Promise.resolve(pgClient))
  const mockLog = jest.fn()
  const origLog = console.log
  console.log = mockLog
  await postgraphql(pgPool, [], { watchPg: true })
  const { onChange } = watchPgSchemas.mock.calls[0][0]
  const { getGqlSchema } = createPostGraphQLHttpRequestHandler.mock.calls[0][0]
  expect(pgPool.connect.mock.calls).toEqual([[]])
  expect(pgClient.release.mock.calls).toEqual([[]])
  expect(await getGqlSchema()).toBe(gqlSchemas[0])
  onChange({ commands: ['a', 'b', 'c'] })
  expect(await getGqlSchema()).toBe(gqlSchemas[1])
  onChange({ commands: ['d', 'e'] })
  expect(await getGqlSchema()).toBe(gqlSchemas[2])
  expect(pgPool.connect.mock.calls).toEqual([[], [], []])
  expect(pgClient.release.mock.calls).toEqual([[], [], []])
  expect(mockLog.mock.calls).toEqual([
    [`Rebuilding PostGraphQL API after Postgres command(s): ️${chalk.bold.cyan('a')}, ${chalk.bold.cyan('b')}, ${chalk.bold.cyan('c')}`],
    [`Rebuilding PostGraphQL API after Postgres command(s): ️${chalk.bold.cyan('d')}, ${chalk.bold.cyan('e')}`],
  ])
  console.log = origLog
})

test('will not error if jwtSecret is provided without jwtPgTypeIdentifier', async () => {
  const pgPool = new Pool()
  expect(() => postgraphql(pgPool, [], { jwtSecret: 'test' })).not.toThrow()
})
