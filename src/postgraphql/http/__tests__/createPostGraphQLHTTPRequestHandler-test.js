import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { $$pgClient } from '../../../postgres/inventory/pgClientFromContext'
import createPostGraphQLHTTPRequestHandler, { $$pgClientOrigQuery } from '../createPostGraphQLHTTPRequestHandler'

const http = require('http')
const request = require('supertest-as-promised')
const connect = require('connect')
const express = require('express')
const Koa = require('koa')

const graphqlSchema = new GraphQLSchema({
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
          context[$$pgClient].query()
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
  [$$pgClientOrigQuery]: jest.fn(() => Promise.resolve()),
  release: jest.fn(),
}

const pgPool = {
  connect: jest.fn(() => pgClient),
}

const defaultOptions = {
  graphqlSchema,
  pgPool,
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
  ['koa', handler => {
    const app = new Koa()
    app.use(handler)
    return http.createServer(app.callback())
  }],
])

for (const [name, createServerFromHandler] of serverCreators) {
  const createServer = options =>
    createServerFromHandler(createPostGraphQLHTTPRequestHandler(Object.assign({}, defaultOptions, options)))

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
      const server = createServer({ enableCORS: true })
      await (
        request(server)
        .options('/graphql')
        .expect(200)
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Request-Method', 'POST')
        .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
        .expect('')
      )
    })

    test('will always respond to any request with CORS headers when enabled', async () => {
      const server = createServer({ enableCORS: true })
      await (
        request(server)
        .post('/graphql')
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Request-Method', 'POST')
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
        .expect({ errors: [{ message: 'Syntax Error GraphQL HTTP Request (1:2) Expected Name, found <EOF>\n\n1: {\n    ^\n', locations: [{ line: 1, column: 2 }] }] })
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
      pgClient[$$pgClientOrigQuery].mockClear()
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
      expect(pgClient[$$pgClientOrigQuery].mock.calls).toEqual([])
      expect(pgClient.release.mock.calls).toEqual([[]])
    })

    test('will call `begin` and `commit` for requests that use the Postgres client', async () => {
      pgPool.connect.mockClear()
      pgClient[$$pgClientOrigQuery].mockClear()
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
      expect(pgClient[$$pgClientOrigQuery].mock.calls).toEqual([['begin'], [], ['commit']])
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

    test('will serve a favicon', async () => {
      const server1 = createServer()
      const server2 = createServer({ route: '/graphql' })
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
    })
  })
}
