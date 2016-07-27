import request from 'supertest-as-promised'
import { ary } from 'lodash'
import jwt from 'jsonwebtoken'
import pg from 'pg'
import { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql'
import { PG_CONFIG } from './helpers.js'
import createServer from '#/createServer.js'

const ignorePromiseError = promise => new Promise(resolve =>
  promise
  .then(ary(resolve, 0))
  .catch(ary(resolve, 0))
)

describe('createServer', () => {
  const TEST_ROLE = 'postgraphql_test_role'

  let graphqlSchema

  const testCreateServer = (config = {}) => createServer({
    graphqlSchema,
    pgConfig: PG_CONFIG,
    log: false,
    development: false,
    secret: 'secret',
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
          claim: {
            type: GraphQLString,
            args: {
              name: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (source, { name }, { client }) =>
              client.queryAsync('select current_setting(\'jwt.claims.\' || $1) as param', [name])
              .then(result => result.rows[0].param),
          },
          role: {
            type: GraphQLString,
            resolve: (source, args, { client }) =>
              client.queryAsync('show role').then(result => result.rows[0].role),
          },
        },
      }),
    })
  })

  before(async () => {
    const client = await pg.connectAsync(PG_CONFIG)
    await ignorePromiseError(client.queryAsync(`drop role ${TEST_ROLE}`))
    await ignorePromiseError(client.queryAsync(`create role ${TEST_ROLE}`))
    client.end()
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
    const server = testCreateServer({ development: true })
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
    const server = testCreateServer({ route: '/graphql', development: true })
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

  it('will fail for poorly formed Authorization headers', async () => {
    const server = testCreateServer()
    await (
      request(server)
      .get('/')
      .set('Authorization', 'qwerty')
      .query({ query: '{hello}' })
      .expect(400)
      .expect({ errors: [{ message: 'Authorization header is not in the correct bearer token format.' }] })
    )
    await (
      request(server)
      .get('/')
      .set('Authorization', 'Basic asd')
      .query({ query: '{hello}' })
      .expect(400)
      .expect({ errors: [{ message: 'Authorization header is not in the correct bearer token format.' }] })
    )
    await (
      request(server)
      .get('/')
      .set('Authorization', 'Bearer ')
      .query({ query: '{hello}' })
      .expect(400)
      .expect({ errors: [{ message: 'Authorization header is not in the correct bearer token format.' }] })
    )
  })

  it('requires tokens to have an audience of \'postgraphql\'', async () => {
    const tokenA = await jwt.signAsync({ yolo: 'swag' }, 'secret', {})
    const tokenB = await jwt.signAsync({ aud: 'anything else', yolo: 'hat' }, 'secret', {})
    const tokenC = await jwt.signAsync({ aud: 'postgraphql', swag: 'yolo' }, 'secret', {})
    const server = testCreateServer()
    await (
      request(server)
      .get('/')
      .set('Authorization', `Bearer ${tokenA}`)
      .query({ query: '{hello}' })
      .expect(403)
      .expect({ errors: [{ message: 'jwt audience invalid. expected: postgraphql' }] })
    )
    await (
      request(server)
      .get('/')
      .set('Authorization', `Bearer ${tokenB}`)
      .query({ query: '{hello}' })
      .expect(403)
      .expect({ errors: [{ message: 'jwt audience invalid. expected: postgraphql' }] })
    )
    await (
      request(server)
      .get('/')
      .set('Authorization', `Bearer ${tokenC}`)
      .query({ query: '{hello}' })
      .expect(200)
      .expect({ data: { hello: 'world' } })
    )
  })

  it('will set claims as local parameters', async () => {
    const query = `{
      aud: claim(name: "aud")
      yolo: claim(name: "yolo")
    }`

    const tokenA = await jwt.signAsync({ aud: 'postgraphql', yolo: 'swag' }, 'secret', {})
    const tokenB = await jwt.signAsync({ aud: 'postgraphql', yolo: 'hat' }, 'secret', {})

    const server = testCreateServer()

    await (
      request(server)
      .get('/')
      .query({ query })
      .expect(200)
      .expect(req => (req.body = req.body.data))
      .expect({ aud: null, yolo: null })
    )
    await (
      request(server)
      .get('/')
      .set('Authorization', `Bearer ${tokenA}`)
      .query({ query })
      .expect(200)
      .expect(req => (req.body = req.body.data))
      .expect({ aud: 'postgraphql', yolo: 'swag' })
    )
    await (
      request(server)
      .get('/')
      .query({ query })
      .expect(200)
      .expect(req => (req.body = req.body.data))
      .expect({ aud: null, yolo: null })
    )
    await (
      request(server)
      .get('/')
      .set('Authorization', `Bearer ${tokenB}`)
      .query({ query })
      .expect(200)
      .expect(req => (req.body = req.body.data))
      .expect({ aud: 'postgraphql', yolo: 'hat' })
    )
  })

  it('cannot set a role that does not exist', async () => {
    const token = await jwt.signAsync({ aud: 'postgraphql', role: 'does_not_exist' }, 'secret', {})
    const server = testCreateServer()
    await (
      request(server)
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .query({ query: '{role,claim(name:"role")}' })
      .expect(500)
      .expect({ errors: [{ message: 'role "does_not_exist" does not exist' }] })
    )
  })

  it('can set a role that does exist', async () => {
    const token = await jwt.signAsync({ aud: 'postgraphql', role: TEST_ROLE }, 'secret', {})
    const server = testCreateServer()
    await (
      request(server)
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .query({ query: '{role,claim(name:"role")}' })
      .expect(200)
      .expect(req => (req.body = req.body.data))
      .expect({ role: TEST_ROLE, claim: TEST_ROLE })
    )
    await (
      request(server)
      .get('/')
      .query({ query: '{role,claim(name:"role")}' })
      .expect(200)
      .expect(req => (req.body = req.body.data))
      .expect({ role: 'none', claim: null })
    )
  })

  it('ignores authorization if a secret is not set', async () => {
    const token = await jwt.signAsync({ aud: 'postgraphql', yolo: 'swag' }, 'secret', {})
    const server = testCreateServer({ secret: null })
    await (
      request(server)
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .query({ query: '{claim(name:"yolo")}' })
      .expect(200)
      .expect(req => (req.body = req.body.data))
      .expect({ claim: null })
    )
  })

  it('will respond with CORS headers to an OPTIONS request', async () => {
    const server = testCreateServer()
    await (
      request(server)
      .options('/')
      .expect(200)
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Request-Method', 'GET, POST')
      .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
    )
  })

  it('will respond to any request with CORS headers', async () => {
    const server = testCreateServer()
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
})
