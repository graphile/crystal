jest.mock('../../../interface/Inventory')
jest.mock('../../../interface/Context')
jest.mock('../../schema/createGraphqlSchema')

const http = require('http')
const request = require('supertest-as-promised')
const connect = require('connect')
const express = require('express')
const Koa = require('koa')
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import Inventory from '../../../interface/Inventory'
import Context from '../../../interface/Context'
import createGraphqlSchema from '../../schema/createGraphqlSchema'
import createGraphqlHTTPRequestHandler from '../createGraphqlHTTPRequestHandler'

createGraphqlSchema.mockReturnValue(new GraphQLSchema({
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
      }
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
}))

const inventory = new Inventory()
const context = new Context()

inventory.createContext.mockReturnValue(context)

const serverCreators = new Map([
  ['http', options => {
    return http.createServer(createGraphqlHTTPRequestHandler(inventory, options))
  }],
  ['connect', options => {
    const app = connect()
    app.use(createGraphqlHTTPRequestHandler(inventory, options))
    return http.createServer(app)
  }],
  ['express', options => {
    const app = express()
    app.use(createGraphqlHTTPRequestHandler(inventory, options))
    return http.createServer(app)
  }],
  ['koa', options => {
    const app = new Koa()
    app.use(createGraphqlHTTPRequestHandler(inventory, options))
    return http.createServer(app.callback())
  }],
])

for (const [name, createServer] of serverCreators) {
  describe(name, () => {
    test('will call createGraphqlSchema with inventory and options', () => {
      const options = Symbol('options')
      createGraphqlSchema.mockClear()
      createServer()
      createServer(options)
      expect(createGraphqlSchema.mock.calls).toEqual([
        [inventory, {}],
        [inventory, options],
      ])
    })

    test('will 404 for route other than that specified', async () => {
      const server1 = createServer()
      const server2 = createServer({ route: '/graphql' })
      await (
        request(server1)
        .get('/graphql')
        .expect(404)
      )
      await (
        request(server2)
        .get('/')
        .expect(404)
      )
    })

    test('will run a query on a GET request', async () => {
      const server = createServer()
      await (
        request(server)
        .get('/')
        .query({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
    })

    test('will respond to queries on a different route', async () => {
      const server = createServer({ route: '/graphql' })
      await (
        request(server)
        .get('/graphql')
        .query({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
    })

    test('will always respond with CORS to an OPTIONS request', async () => {
      const server = createServer()
      await (
        request(server)
        .options('/')
        .expect(200)
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Request-Method', 'GET, POST')
        .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
        .expect('')
      )
    })

    test('will always respond to any request with CORS headers', async () => {
      const server = createServer()
      await (
        request(server)
        .get('/')
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Request-Method', 'GET, POST')
        .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
      )
      await (
        request(server)
        .post('/')
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Request-Method', 'GET, POST')
        .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
      )
    })

    test('will not allow requests other than GET and POST', async () => {
      const server = createServer()
      await (
        request(server)
        .delete('/')
        .expect(405)
        .expect('Allow', 'GET, POST')
      )
      await (
        request(server)
        .put('/')
        .expect(405)
        .expect('Allow', 'GET, POST')
      )
    })

    test('will run a query on a POST request with JSON data', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/')
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
        .post('/')
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
        .post('/')
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
        .get('/')
        .query({ query: '{' })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ errors: [{ message: 'Syntax Error GraphQL HTTP Request (1:2) Expected Name, found EOF\n\n1: {\n    ^\n', locations: [{ line: 1, column: 2 }] }] })
      )
    })

    test('will error if validation fails', async () => {
      const server = createServer()
      await (
        request(server)
        .get('/')
        .query({ query: '{notFound}' })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ errors: [{ message: 'Cannot query field "notFound" on type "Query".', locations: [{ line: 1, column: 2 }] }] })
      )
    })

    test('will not run mutations in GET', async () => {
      const server = createServer()
      await (
        request(server)
        .get('/')
        .query({ query: 'mutation {hello}' })
        .expect(405)
        .expect('Content-Type', /json/)
        .expect('Allow', 'Post')
        .expect({ errors: [{ message: 'Can only perform a \'mutation\' operation from a POST request.' }] })
      )
      await (
        request(server)
        .get('/')
        .query({ query: 'query A { hello } mutation B { hello }', operationName: 'B' })
        .expect(405)
        .expect('Content-Type', /json/)
        .expect('Allow', 'Post')
        .expect({ errors: [{ message: 'Can only perform a \'mutation\' operation from a POST request.' }] })
      )
      await (
        request(server)
        .get('/')
        .query({ query: 'query A { hello } mutation B { hello }', operationName: 'A' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
    })

    test('will allow mutations with POST', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/')
        .send({ query: 'mutation {hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
    })

    test('will create and cleanup a context on every request', async () => {
      const server = createServer()
      const context = new Context()
      inventory.createContext.mockClear()
      inventory.createContext.mockReturnValueOnce(Promise.resolve(context))
      await (
        request(server)
        .post('/')
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } })
      )
      expect(inventory.createContext.mock.calls).toEqual([[]])
      expect(context.cleanup.mock.calls).toEqual([[]])
    })

    test('will respect an operation name', async () => {
      const server = createServer()
      await (
        request(server)
        .post('/')
        .send({ query: 'query A { a: hello } query B { b: hello }', operationName: 'A' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { a: 'world' } })
      )
      await (
        request(server)
        .post('/')
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
        .get('/')
        .query({ query: 'query A($name: String!) { greetings(name: $name) }', variables: JSON.stringify({ name: 'Joe' }), operationName: 'A' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: 'Hello, Joe!' } })
      )
      await (
        request(server)
        .post('/')
        .send({ query: 'query A($name: String!) { greetings(name: $name) }', variables: { name: 'Joe' }, operationName: 'A' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: 'Hello, Joe!' } })
      )
      await (
        request(server)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(`operationName=A&query=${encodeURIComponent('query A($name: String!) { greetings(name: $name) }')}&variables=${encodeURIComponent(JSON.stringify({ name: 'Joe' }))}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: 'Hello, Joe!' } })
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
        .get('/')
        .set('Accept', 'text/html')
        .query({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
      )
      await (
        request(server2)
        .get('/')
        .set('Accept', 'text/html')
        .query({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
      )
    })
  })
}
