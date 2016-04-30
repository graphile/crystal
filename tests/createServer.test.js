import request from 'supertest-as-promised'
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { PG_CONFIG } from './helpers.js'
import createServer from '#/createServer.js'

describe('createServer', () => {
  let graphqlSchema

  const testCreateServer = (config = {}) => createServer({
    graphqlSchema,
    pgConfig: PG_CONFIG,
    log: false,
    ...config,
  })

  before(() => {
    graphqlSchema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          hello: {
            type: GraphQLString,
            resolve: () => 'world',
          },
        },
      }),
    })
  })

  it('can make a query', async () => {
    const server = testCreateServer()
    await (
      request(server)
      .get('/')
      .query({ query: '{hello}' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({ data: { hello: 'world' } })
    )
    await (
      request(server)
      .get('/graphql')
      .expect(404)
    )
  })

  it('can make a query even with a different route', async () => {
    const server = testCreateServer({ route: '/graphql' })
    await (
      request(server)
      .get('/graphql')
      .query({ query: '{hello}' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({ data: { hello: 'world' } })
    )
    await (
      request(server)
      .get('/')
      .expect(404)
    )
  })

  it('will serve GraphiQL if requested', async () => {
    const server = testCreateServer()
    await (
      request(server)
      .get('/')
      .set('Accept', 'text/html')
      .expect(200)
      .expect('Content-Type', /html/)
    )
    await (
      request(server)
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(404)
    )
  })

  it('will serve GraphiQL if requested even on a different route', async () => {
    const server = testCreateServer({ route: '/graphql' })
    await (
      request(server)
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200)
      .expect('Content-Type', /html/)
    )
    await (
      request(server)
      .get('/')
      .set('Accept', 'text/html')
      .expect(404)
    )
  })

  it('will not serve GraphiQL in production', async () => {
    const server = testCreateServer({ development: false })
    await (
      request(server)
      .get('/')
      .set('Accept', 'text/html')
      .expect(400)
    )
  })

  it('serves a favicon', async () => {
    const server = testCreateServer()
    await (
      request(server)
      .get('/favicon.ico')
      .expect(200)
      .expect('Content-Type', 'image/x-icon')
    )
  })

  it('serves a favicon even with a different route', async () => {
    const server = testCreateServer({ route: '/graphql' })
    await (
      request(server)
      .get('/favicon.ico')
      .expect(200)
      .expect('Content-Type', 'image/x-icon')
    )
  })
})
