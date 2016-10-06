// TODO
test('todo', () => {})

// jest.mock('../../../interface/Inventory')
// jest.mock('../../schema/createGQLSchema')

// import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
// import Inventory from '../../../interface/Inventory'
// import createGQLSchema from '../../schema/createGQLSchema'
// import createGraphqlHTTPRequestHandler from '../createGraphqlHTTPRequestHandler'

// const http = require('http')
// const request = require('supertest-as-promised')
// const connect = require('connect')
// const express = require('express')
// const Koa = require('koa')

// createGQLSchema.mockReturnValue(new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'Query',
//     fields: {
//       hello: {
//         type: GraphQLString,
//         resolve: () => 'world',
//       },
//       greetings: {
//         type: GraphQLString,
//         args: {
//           name: { type: GraphQLString },
//         },
//         resolve: (source, { name }) => `Hello, ${name}!`,
//       }
//     },
//   }),
//   mutation: new GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//       hello: {
//         type: GraphQLString,
//         resolve: () => 'world',
//       },
//     },
//   }),
// }))

// const inventory = new Inventory()

// inventory.createContext = jest.fn(() => null)

// const serverCreators = new Map([
//   ['http', options => {
//     return http.createServer(createGraphqlHTTPRequestHandler(inventory, options))
//   }],
//   ['connect', options => {
//     const app = connect()
//     app.use(createGraphqlHTTPRequestHandler(inventory, options))
//     return http.createServer(app)
//   }],
//   ['express', options => {
//     const app = express()
//     app.use(createGraphqlHTTPRequestHandler(inventory, options))
//     return http.createServer(app)
//   }],
//   ['koa', options => {
//     const app = new Koa()
//     app.use(createGraphqlHTTPRequestHandler(inventory, options))
//     return http.createServer(app.callback())
//   }],
// ])

// for (const [name, createServer] of serverCreators) {
//   describe(name, () => {
//     test('will call createGraphqlSchema with inventory and options', () => {
//       const options = Symbol('options')
//       createGraphqlSchema.mockClear()
//       createServer()
//       createServer(options)
//       expect(createGraphqlSchema.mock.calls).toEqual([
//         [inventory, {}],
//         [inventory, options],
//       ])
//     })

//     test('will 404 for route other than that specified', async () => {
//       const server1 = createServer()
//       const server2 = createServer({ graphqlRoute: '/x' })
//       await (
//         request(server1)
//         .post('/x')
//         .expect(404)
//       )
//       await (
//         request(server2)
//         .post('/graphql')
//         .expect(404)
//       )
//     })

//     test('will respond to queries on a different route', async () => {
//       const server = createServer({ graphqlRoute: '/x' })
//       await (
//         request(server)
//         .post('/x')
//         .send({ query: '{hello}' })
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .expect({ data: { hello: 'world' } })
//       )
//     })

//     test('will always respond with CORS to an OPTIONS request when enabled', async () => {
//       const server = createServer({ enableCORS: true })
//       await (
//         request(server)
//         .options('/graphql')
//         .expect(200)
//         .expect('Access-Control-Allow-Origin', '*')
//         .expect('Access-Control-Request-Method', 'POST')
//         .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
//         .expect('')
//       )
//     })

//     test('will always respond to any request with CORS headers when enabled', async () => {
//       const server = createServer({ enableCORS: true })
//       await (
//         request(server)
//         .post('/graphql')
//         .expect('Access-Control-Allow-Origin', '*')
//         .expect('Access-Control-Request-Method', 'POST')
//         .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
//       )
//     })

//     test('will not allow requests other than POST', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .get('/graphql')
//         .expect(405)
//         .expect('Allow', 'POST, OPTIONS')
//       )
//       await (
//         request(server)
//         .delete('/graphql')
//         .expect(405)
//         .expect('Allow', 'POST, OPTIONS')
//       )
//       await (
//         request(server)
//         .put('/graphql')
//         .expect(405)
//         .expect('Allow', 'POST, OPTIONS')
//       )
//     })

//     test('will run a query on a POST request with JSON data', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .set('Content-Type', 'application/json')
//         .send(JSON.stringify({ query: '{hello}' }))
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .expect({ data: { hello: 'world' } })
//       )
//     })

//     test('will run a query on a POST request with form data', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .set('Content-Type', 'application/x-www-form-urlencoded')
//         .send(`query=${encodeURIComponent('{hello}')}`)
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .expect({ data: { hello: 'world' } })
//       )
//     })

//     test('will run a query on a POST request with GraphQL data', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .set('Content-Type', 'application/graphql')
//         .send('{hello}')
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .expect({ data: { hello: 'world' } })
//       )
//     })

//     test('will error if query parse fails', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .send({ query: '{' })
//         .expect(400)
//         .expect('Content-Type', /json/)
//         .expect({ errors: [{ message: 'Syntax Error GraphQL HTTP Request (1:2) Expected Name, found <EOF>\n\n1: {\n    ^\n', locations: [{ line: 1, column: 2 }] }] })
//       )
//     })

//     test('will error if validation fails', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .send({ query: '{notFound}' })
//         .expect(400)
//         .expect('Content-Type', /json/)
//         .expect({ errors: [{ message: 'Cannot query field "notFound" on type "Query".', locations: [{ line: 1, column: 2 }] }] })
//       )
//     })

//     test('will allow mutations with POST', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .send({ query: 'mutation {hello}' })
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .expect({ data: { hello: 'world' } })
//       )
//     })

//     // test('will create and cleanup a context on every request', async () => {
//     //   const server = createServer()
//     //   const context = new Context()
//     //   inventory.createContext.mockClear()
//     //   inventory.createContext.mockReturnValueOnce(Promise.resolve(context))
//     //   await (
//     //     request(server)
//     //     .post('/graphql')
//     //     .send({ query: '{hello}' })
//     //     .expect(200)
//     //     .expect('Content-Type', /json/)
//     //     .expect({ data: { hello: 'world' } })
//     //   )
//     //   expect(inventory.createContext.mock.calls).toEqual([[]])
//     //   expect(context.cleanup.mock.calls).toEqual([[]])
//     // })

//     test('will respect an operation name', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .send({ query: 'query A { a: hello } query B { b: hello }', operationName: 'A' })
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .expect({ data: { a: 'world' } })
//       )
//       await (
//         request(server)
//         .post('/graphql')
//         .send({ query: 'query A { a: hello } query B { b: hello }', operationName: 'B' })
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .expect({ data: { b: 'world' } })
//       )
//     })

//     test('will use variables', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .send({ query: 'query A($name: String!) { greetings(name: $name) }', variables: JSON.stringify({ name: 'Joe' }), operationName: 'A' })
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .expect({ data: { greetings: 'Hello, Joe!' } })
//       )
//       await (
//         request(server)
//         .post('/graphql')
//         .set('Content-Type', 'application/x-www-form-urlencoded')
//         .send(`operationName=A&query=${encodeURIComponent('query A($name: String!) { greetings(name: $name) }')}&variables=${encodeURIComponent(JSON.stringify({ name: 'Joe' }))}`)
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .expect({ data: { greetings: 'Hello, Joe!' } })
//       )
//     })

//     test('will ignore empty string variables', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .send({ query: '{hello}', variables: '' })
//         .expect(200)
//         .expect({ data: { hello: 'world' } })
//       )
//     })

//     test('will error with variables of the incorrect type', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .send({ query: '{hello}', variables: 2 })
//         .expect(400)
//         .expect({ errors: [{ message: 'Variables must be an object, not \'number\'.' }] })
//       )
//     })

//     test('will error with an operation name of the incorrect type', async () => {
//       const server = createServer()
//       await (
//         request(server)
//         .post('/graphql')
//         .send({ query: '{hello}', operationName: 2 })
//         .expect(400)
//         .expect({ errors: [{ message: 'Operation name must be a string, not \'number\'.' }] })
//       )
//     })

//     test('will serve a favicon', async () => {
//       const server1 = createServer()
//       const server2 = createServer({ route: '/graphql' })
//       await (
//         request(server1)
//         .get('/favicon.ico')
//         .expect(200)
//         .expect('Cache-Control', 'public, max-age=86400')
//         .expect('Content-Type', 'image/x-icon')
//       )
//       await (
//         request(server2)
//         .get('/favicon.ico')
//         .expect(200)
//         .expect('Cache-Control', 'public, max-age=86400')
//         .expect('Content-Type', 'image/x-icon')
//       )
//     })

//     test('will render GraphiQL if enabled', async () => {
//       const server1 = createServer()
//       const server2 = createServer({ graphiql: true })
//       await (
//         request(server1)
//         .get('/graphiql')
//         .expect(404)
//       )
//       await (
//         request(server2)
//         .get('/graphiql')
//         .expect(200)
//         .expect('Content-Type', 'text/html; charset=utf-8')
//       )
//     })

//     test('will render GraphiQL on another route if desired', async () => {
//       const server1 = createServer({ graphiqlRoute: '/x' })
//       const server2 = createServer({ graphiql: true, graphiqlRoute: '/x' })
//       await (
//         request(server1)
//         .get('/x')
//         .expect(404)
//       )
//       await (
//         request(server2)
//         .get('/x')
//         .expect(200)
//         .expect('Content-Type', 'text/html; charset=utf-8')
//       )
//     })
//   })
// }
