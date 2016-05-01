import assert from 'assert'
import path from 'path'
import http from 'http'
import { forEach } from 'lodash'
import Express from 'express'
import onFinished from 'on-finished'
import logger from 'morgan'
import favicon from 'serve-favicon'
import jwt from 'jsonwebtoken'
import pg from 'pg'
import { GraphQLSchema, formatError } from 'graphql'
import graphqlHTTP from 'express-graphql'

/**
 * Creates an HTTP server with the provided configuration.
 *
 * @param {Object} config
 * @param {GraphQLSchema} config.graphqlSchema
 * @param {Object} config.pgConfig
 * @param {string} config.route
 * @param {boolean} config.development
 * @returns {Server}
 */
const createServer = ({
  graphqlSchema,
  pgConfig,
  route = '/',
  secret,
  development = true,
  log = true,
}) => {
  assert(graphqlSchema instanceof GraphQLSchema, 'Must be an instance of GraphQL schema must be defined')
  assert(pgConfig, 'A PostgreSQL config must be defined')

  const server = new Express()

  if (log) server.use(logger(development ? 'dev' : 'common'))
  server.use(favicon(path.join(__dirname, '../assets/favicon.ico')))

  server.all(route, graphqlHTTP(async req => {
    // Acquire a new client for every request.
    const client = await pg.connectAsync(pgConfig)

    // Start a transaction for our client and set it up.
    await client.queryAsync('begin')

    // If we have a secret, let’s setup the request transaction.
    if (secret) await setupRequestTransaction(req, client, secret)

    // Make sure we release our client back to the pool once the response has
    // finished.
    onFinished(req.res, () => {
      // Try to end our session with a commit. If it succeeds, release the
      // client back into the pool. If it fails, release the client back into
      // the pool, but also report that it failed. We cannot report an error in
      // the request at this point because it has finished.
      client.queryAsync('commit')
      .then(() => client.end())
      .catch(error => {
        console.error(error.stack) // eslint-disable-line no-console
        client.end()
      })
    })

    return {
      schema: graphqlSchema,
      context: { client },
      pretty: development,
      graphiql: development,
      formatError: development ? developmentFormatError : formatError,
    }
  }))

  return http.createServer(server)
}

export default createServer

const setupRequestTransaction = async (req, client, secret) => {
  // First, get the possible `Bearer` token from the request. If it does not
  // exist, exit.
  const token = getToken(req)
  if (!token) return

  const decoded = await jwt.verifyAsync(token, secret, { audience: 'postgraphql' })
  const { role } = decoded
  const values = []
  const querySelection = []

  // Make sure to set the local role if it exists.
  if (role) {
    values.push(role)
    querySelection.push('set_config(\'role\', $1, true)')
  }

  // Iterate through all of the JWT decoded values and set a local parameter
  // with that key and value.
  forEach(decoded, (value, key) => {
    values.push(key)
    values.push(value)
    querySelection.push(`set_config('jwt.claims.' || $${values.length - 1}, $${values.length}, true)`)
  })

  await client.queryAsync(`select ${querySelection.join(', ')}`, values)
}

/**
 * Parses the `Bearer` auth scheme token out of the `Authorization` header as
 * defined by [RFC7235][1].
 *
 * ```
 * Authorization = credentials
 * credentials   = auth-scheme [ 1*SP ( token68 / #auth-param ) ]
 * token68       = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" )*"="
 * ```
 *
 * [1]: https://tools.ietf.org/html/rfc7235
 *
 * @private
 */
const bearerRex = /^\s*bearer\s+([a-z0-9\-._~+/]+=*)\s*$/i

const getToken = req => {
  const { authorization } = req.headers
  const match = bearerRex.exec(authorization)
  if (!match) return null
  return match[1]
}

const developmentFormatError = error => {
  console.error(error.stack) // eslint-disable-line no-console
  return {
    message: error.message,
    locations: error.locations,
    stack: error.stack,
  }
}
