jest.mock('send')

import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { $$pgClient } from '../../../postgres/inventory/pgClientFromContext'
import createPostGraphQLHttpRequestHandler, { graphiqlDirectory } from '../createPostGraphQLHttpRequestHandler'

const path = require('path')
const http = require('http')
const request = require('supertest')
const connect = require('connect')
const express = require('express')
const sendFile = require('send')
const event = require('events')

sendFile.mockImplementation(() => {
  const stream = new event.EventEmitter()
  stream.pipe = jest.fn(res => process.nextTick(() => res.end()))
  process.nextTick(() => stream.emit('end'))
  return stream
})

const gqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
      greetings: {
        type: GraphQLString,
        args: {
          name: { type: GraphQLString },
        },
        resolve: (source, { name }) => `Hello, ${name}!`,
      },
      query: {
        type: GraphQLString,
        resolve: (source, args, context) =>
          context[$$pgClient].query('EXECUTE'),
      },
      testError: {
        type: GraphQLString,
        resolve: (source, args, context) => {
          const err = new Error('test message')
          err.detail = 'test detail'
          err.hint = 'test hint'
          err.code = '12345'
          throw err
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
    },
  }),
})

const pgClient = {
  query: jest.fn(() => Promise.resolve()),
  release: jest.fn(),
}

const pgPool = {
  connect: jest.fn(() => pgClient),
}

const defaultOptions = {
  getGqlSchema: () => gqlSchema,
  pgPool,
  disableQueryLog: true,
}

const serverCreators = new Map([
  ['http', handler => {
    return http.createServer(handler)
  }],
  ['connect', handler => {
    const app = connect()
    app.use(handler)
    return http.createServer(app)
  }],
  ['express', handler => {
    const app = express()
    app.use(handler)
    return http.createServer(app)
  }],
])

// Parse out the Node.js version number. The version will be in a semantic
// versioning format with maybe a `v` in front. We remove that `v`, split by
// `.`, get the first item in the split array, and parse that as an integer to
// get the Node.js major version number.
const nodeMajorVersion = parseInt(process.version.replace(/^v/, '').split('.')[0], 10)

/* XXX: re-enable koa tests

// Only test Koa in version of Node.js greater than 4 because the Koa source
// code has some ES2015 syntax in it which breaks in Node.js 4 and lower. Koa is
// not meant to be used in Node.js 4 anyway so this is fine.
if (nodeMajorVersion > 4) {
  const Koa = require('koa') // tslint:disable-line variable-name
  serverCreators.set('koa', handler => {
    const app = new Koa()
    app.use(handler)
    return http.createServer(app.callback())
  })
}
*/

for (const [name, createServerFromHandler] of Array.from(serverCreators)) {
  const createServer = options =>
    createServerFromHandler(createPostGraphQLHttpRequestHandler(Object.assign({}, defaultOptions, options)))

  describe(name, () => {

    test('will 404 for route other than that specified', async () => {
      const server1 = createServer()
      const server2 = createServer({ graphqlRoute: '/x' })
      await (
        request(server1)
        .post('/x')
        .expect(404)
      )
      await (
        request(server2)
        .post('/graphql')
        .expect(404)
      )
    })

    test('will respond to queries on a different route', async () => {
      const server = createServer({ graphqlRoute: '/x' })
      await (
        request(server)
        .post('/x')
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
    })

    test('will always respond with CORS to an OPTIONS request when enabled', async () => {
      const server = createServer({ enableCors: true })
      await (
        request(server)
        .options('/graphql')
        .expect(200)
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Request-Method', 'HEAD, GET, POST')
        .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
        .expect('')
      )
    })

    test('will always respond to any request with CORS headers when enabled', async () => {
      const server = createServer({ enableCors: true })
      await (
        request(server)
        .post('/graphql')
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Request-Method', 'HEAD, GET, POST')
        .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
      )
    })

    test('will not allow requests other than POST', async () => {
      const server = createServer()
      await (
        request(server)
        .get('/graphql')
        .expect(405)
        .expect('Allow', 'POST, OPTIONS')
      )
      await (
        request(server)
        .delete('/graphql')
        .expect(405)
        .expect('Allow', 'POST, OPTIONS')
      )
      await (
        request(server)
        .put('/graphql')
        .expect(405)
        .expect('Allow', 'POST, OPTIONS')
      )
    })

    test('will run a query on a POST request with JSON data', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ query: '{hello}' }))
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
    })

    test('will run a query on a POST request with form data', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(`query=${encodeURIComponent('{hello}')}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
    })

    test('will run a query on a POST request with GraphQL data', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .set('Content-Type', 'application/graphql')
        .send('{hello}')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
    })

    test('will error if query parse fails', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{' })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ errors: [{ message: 'Syntax Error GraphQL Http Request (1:2) Expected Name, found <EOF>\n\n1: {\n    ^\n', locations: [{ line: 1, column: 2 }] }] })
      )
    })

    test('will error if validation fails', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{notFound}' })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ errors: [{ message: 'Cannot query field "notFound" on type "Query".', locations: [{ line: 1, column: 2 }] }] })
      )
    })

    test('will allow mutations with POST', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: 'mutation {hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
    })

    test('will connect and release a Postgres client from the pool on every request', async () => {
      pgPool.connect.mockClear()
      pgClient.query.mockClear()
      pgClient.release.mockClear()
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
      expect(pgPool.connect.mock.calls).toEqual([[]])
      expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']])
      expect(pgClient.release.mock.calls).toEqual([[]])
    })

    test('will setup a transaction for requests that use the Postgres client', async () => {
      pgPool.connect.mockClear()
      pgClient.query.mockClear()
      pgClient.release.mockClear()
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{query}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { query: null } })
      )
      expect(pgPool.connect.mock.calls).toEqual([[]])
      expect(pgClient.query.mock.calls).toEqual([['begin'], ['EXECUTE'], ['commit']])
      expect(pgClient.release.mock.calls).toEqual([[]])
    })

    test('will setup a transaction and pass down options for requests that use the Postgres client', async () => {
      pgPool.connect.mockClear()
      pgClient.query.mockClear()
      pgClient.release.mockClear()
      const jwtSecret = 'secret'
      const pgDefaultRole = 'pg_default_role'
      const server = createServer({ jwtSecret, pgDefaultRole })
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{query}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { query: null } })
      )
      expect(pgPool.connect.mock.calls).toEqual([[]])
      expect(pgClient.query.mock.calls).toEqual([
        ['begin'],
        [{ text: 'select set_config($1, $2, true)', values: ['role', 'pg_default_role'] }],
        ['EXECUTE'],
        ['commit'],
      ])
      expect(pgClient.release.mock.calls).toEqual([[]])
    })

    test('will respect an operation name', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: 'query A { a: hello } query B { b: hello }', operationName: 'A' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { a: 'world' } })
      )
      await (
        request(server)
        .post('/graphql')
        .send({ query: 'query A { a: hello } query B { b: hello }', operationName: 'B' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { b: 'world' } })
      )
    })

    test('will use variables', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: 'query A($name: String!) { greetings(name: $name) }', variables: JSON.stringify({ name: 'Joe' }), operationName: 'A' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: 'Hello, Joe!' } })
      )
      await (
        request(server)
        .post('/graphql')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(`operationName=A&query=${encodeURIComponent('query A($name: String!) { greetings(name: $name) }')}&variables=${encodeURIComponent(JSON.stringify({ name: 'Joe' }))}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: 'Hello, Joe!' } })
      )
    })

    test('will ignore empty string variables', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{hello}', variables: '' })
        .expect(200)
        .expect({ data: { hello: 'world' } })
      )
    })

    test('will error with variables of the incorrect type', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{hello}', variables: 2 })
        .expect(400)
        .expect({ errors: [{ message: 'Variables must be an object, not \'number\'.' }] })
      )
    })

    test('will error with an operation name of the incorrect type', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{hello}', operationName: 2 })
        .expect(400)
        .expect({ errors: [{ message: 'Operation name must be a string, not \'number\'.' }] })
      )
    })

    test('will report a simple error in the default case', async () => {
      pgPool.connect.mockClear()
      pgClient.query.mockClear()
      pgClient.release.mockClear()
      const server = createServer()
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{testError}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { testError: null }, errors: [ {
          message: 'test message',
          locations: [{ line: 1, column: 2 }],
          path: ['testError'],
        } ] })
      )
    })

    test('will report an extended error when extendedErrors is enabled', async () => {
      pgPool.connect.mockClear()
      pgClient.query.mockClear()
      pgClient.release.mockClear()
      const server = createServer({ extendedErrors: ['hint', 'detail', 'errcode'] })
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{testError}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { testError: null }, errors: [ {
          message: 'test message',
          locations: [{ line: 1, column: 2 }],
          path: ['testError'],
          hint: 'test hint',
          detail: 'test detail',
          errcode: '12345',
        } ] })
      )
    })

    test('will serve a favicon when graphiql is enabled', async () => {
      const server1 = createServer({ graphiql: true })
      const server2 = createServer({ graphiql: true, route: '/graphql' })
      await (
        request(server1)
        .get('/favicon.ico')
        .expect(200)
        .expect('Cache-Control', 'public, max-age=86400')
        .expect('Content-Type', 'image/x-icon')
      )
      await (
        request(server2)
        .get('/favicon.ico')
        .expect(200)
        .expect('Cache-Control', 'public, max-age=86400')
        .expect('Content-Type', 'image/x-icon')
      )
    })

    test('will not serve a favicon when graphiql is disabled', async () => {
      const server1 = createServer({ graphiql: false })
      const server2 = createServer({ graphiql: false, route: '/graphql' })
      await (
        request(server1)
        .get('/favicon.ico')
        .expect(404)
      )
      await (
        request(server2)
        .get('/favicon.ico')
        .expect(404)
      )
    })

    test('will serve any assets for graphiql', async () => {
      sendFile.mockClear()
      const server = createServer({ graphiql: true })
      await (
        request(server)
        .get('/_postgraphql/graphiql/anything.css')
        .expect(200)
      )
      await (
        request(server)
        .get('/_postgraphql/graphiql/something.js')
        .expect(200)
      )
      await (
        request(server)
        .get('/_postgraphql/graphiql/very/deeply/nested')
        .expect(200)
      )
      expect(sendFile.mock.calls.map(([res, filepath, options]) => [path.relative(graphiqlDirectory, filepath), options]))
        .toEqual([
          ['anything.css', { index: false }],
          ['something.js', { index: false }],
          ['very/deeply/nested', { index: false }],
        ])
    })

    test('will not serve some graphiql assets', async () => {
      const server = createServer({ graphiql: true })
      await (
        request(server)
        .get('/_postgraphql/graphiql/index.html')
        .expect(404)
      )
      await (
        request(server)
        .get('/_postgraphql/graphiql/asset-manifest.json')
        .expect(404)
      )
    })

    test('will not serve any assets for graphiql when disabled', async () => {
      sendFile.mockClear()
      const server = createServer({ graphiql: false })
      await (
        request(server)
        .get('/_postgraphql/graphiql/anything.css')
        .expect(404)
      )
      await (
        request(server)
        .get('/_postgraphql/graphiql/something.js')
        .expect(404)
      )
      expect(sendFile.mock.calls.length).toEqual(0)
    })

    test('will not allow if no text/event-stream headers are set', async () => {
      const server = createServer({ graphiql: true })
      await (
        request(server)
        .get('/_postgraphql/stream')
        .expect(405)
      )
    })

    test('will render GraphiQL if enabled', async () => {
      const server1 = createServer()
      const server2 = createServer({ graphiql: true })
      await (
        request(server1)
        .get('/graphiql')
        .expect(404)
      )
      await (
        request(server2)
        .get('/graphiql')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
      )
    })

    test('will render GraphiQL on another route if desired', async () => {
      const server1 = createServer({ graphiqlRoute: '/x' })
      const server2 = createServer({ graphiql: true, graphiqlRoute: '/x' })
      const server3 = createServer({ graphiql: false, graphiqlRoute: '/x' })
      await (
        request(server1)
        .get('/x')
        .expect(404)
      )
      await (
        request(server2)
        .get('/x')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
      )
      await (
        request(server3)
        .get('/x')
        .expect(404)
      )
      await (
        request(server3)
        .get('/graphiql')
        .expect(404)
      )
    })

    test('cannot use a rejected GraphQL schema', async () => {
      const rejectedGraphQLSchema = Promise.reject(new Error('Uh oh!'))
      // We don’t want Jest to complain about uncaught promise rejections.
      rejectedGraphQLSchema.catch(() => { /* noop */ })
      const server = createServer({ getGqlSchema: () => rejectedGraphQLSchema })
      // We want to hide `console.error` warnings because we are intentionally
      // generating some here.
      const origConsoleError = console.error
      console.error = () => { /* noop */ }
      try {
        await (
          request(server)
          .post('/graphql')
          .send({ query: '{hello}' })
          .expect(500)
        )
      }
      finally {
        console.error = origConsoleError
      }
    })

    test('will correctly hand over pgSettings to the withPostGraphQLContext call', async () => {
      pgPool.connect.mockClear()
      pgClient.query.mockClear()
      pgClient.release.mockClear()
      const server = createServer({
        pgSettings: {
          'foo.string': 'test1',
          'foo.number': 42,
        },
      })
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
      expect(pgPool.connect.mock.calls).toEqual([[]])
      expect(pgClient.query.mock.calls).toEqual([
        ['begin'],
        [
          {
            text: 'select set_config($1, $2, true), set_config($3, $4, true)',
            values: [
              'foo.string', 'test1',
              'foo.number', '42',
            ],
          },
        ],
        ['commit'],
      ])
      expect(pgClient.release.mock.calls).toEqual([[]])
    })

    test('will correctly hand over pgSettings function to the withPostGraphQLContext call', async () => {
      pgPool.connect.mockClear()
      pgClient.query.mockClear()
      pgClient.release.mockClear()
      const server = createServer({
        pgSettings: (req) => ({
          'foo.string': 'test1',
          'foo.number': 42,
        }),
      })
      await (
        request(server)
        .post('/graphql')
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
      expect(pgPool.connect.mock.calls).toEqual([[]])
      expect(pgClient.query.mock.calls).toEqual([
        ['begin'],
        [
          {
            text: 'select set_config($1, $2, true), set_config($3, $4, true)',
            values: [
              'foo.string', 'test1',
              'foo.number', '42',
            ],
          },
        ],
        ['commit'],
      ])
      expect(pgClient.release.mock.calls).toEqual([[]])
    })

    test('will call additionalGraphQLContextFromRequest if provided and add the response to the context', async () => {
      const helloResolver = jest.fn((source, args, context) => context.additional)
      const contextCheckGqlSchema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'Query',
          fields: {
            hello: {
              type: GraphQLString,
              resolve: helloResolver,
            },
          },
        }),
      })
      const additionalGraphQLContextFromRequest = jest.fn(() => ({ additional: 'foo' }))
      const server = createServer({
        additionalGraphQLContextFromRequest,
        getGqlSchema: () => Promise.resolve(contextCheckGqlSchema),
      })

      await (
        request(server)
        .post('/graphql')
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'foo' } })
      )
      expect(additionalGraphQLContextFromRequest).toHaveBeenCalledTimes(1)
      expect(additionalGraphQLContextFromRequest.mock.calls[0][0]).toBeInstanceOf(http.IncomingMessage)
    })
  })
}
