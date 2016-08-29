import path from 'path'
import { forEach } from 'lodash'
import Express from 'express'
import onFinished from 'on-finished'
import { Forbidden, BadRequest } from 'http-errors'
import morgan from 'morgan'
import favicon from 'serve-favicon'
import finalHandler from 'finalhandler'
import jwt from 'jsonwebtoken'
import pg from 'pg'
import { formatError } from 'graphql'
import graphqlHTTP from 'express-graphql'

/**
 * Creates an HTTP server with the provided configuration.
 *
 * @param {Object} options
 * @param {GraphQLSchema} options.graphqlSchema
 * @param {Object} options.pgConfig
 * @param {string} options.route
 * @param {boolean} options.development
 * @param {boolean} options.log - Whether to enable logging.
 * @param {Object} options.logger - Custom logging middleware.
 * @returns {Server}
 */
const createServer = ({
  graphqlSchema,
  pgConfig,
  anonymousRole,
  route = '/',
  secret,
  development = true,
  log = true,
  logger = morgan(development ? 'dev' : 'common'),
}) => {
  const server = new Express()

  server.disable('x-powered-by')

  if (log) server.use(logger)
  server.use(favicon(path.join(__dirname, '../assets/favicon.ico')))

  // Enabels CORS. See [this][1] flowchart for an explanation of how CORS
  // works. Note that these headers are set for all requests, CORS algorithms
  // normally run a preflight request using the `OPTIONS` method to get these
  // headers.
  //
  // [1]: http://www.html5rocks.com/static/images/cors_server_flowchart.png
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Request-Method', 'GET, POST')
    res.header('Access-Control-Allow-Headers', [
      'Origin',
      'X-Requested-With',
      // Used by `express-graphql` to determine whether to expose the GraphiQL
      // interface (`text/html`) or not.
      'Accept',
      // Used by PostGraphQL for auth purposes.
      'Authorization',
      // The `Content-*` headers are used when making requests with a body,
      // like in a POST request.
      'Content-Type',
      'Content-Length',
    ].join(', '))
    next()
  })

  // Don’t execute our GraphQL stuffs for options requests.
  server.options('/*', (req, res) => {
    res.sendStatus(200)
  })

  server.all(route, graphqlHTTP(async req => {
    // Acquire a new client for every request.
    const client = await pg.connectAsync(pgConfig)

    // Start a transaction for our client and set it up.
    await client.queryAsync('begin')

    // If we have a secret, let’s setup the request transaction.
    await setupRequestTransaction(req, client, secret, anonymousRole)

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
      // Await the `graphqlSchema` because it may be a promise.
      schema: await graphqlSchema,
      context: { client },
      pretty: development,
      graphiql: development,
      formatError: development ? developmentFormatError : formatError,
    }
  }))

  // If next is not defined, use the `finalHandler`.
  return (req, res, next) => server(req, res, next || finalHandler(req, res))
}

export default createServer

const setupRequestTransaction = async (req, client, secret, anonymousRole) => {
  // First, get the possible `Bearer` token from the request. If it does not
  // exist, exit.
  const token = getToken(req)

  // If there is no secret or there is no token, set the `anonymousRole` if it
  // exists, but always return.
  if (!secret || !token) {
    // Set the anonymous role if it exists.
    if (anonymousRole) {
      await client.queryAsync(
        'select set_config(\'role\', $1, true)',
        [anonymousRole],
      )
    }

    return
  }

  let decoded

  // If `jwt.verifyAsync` throws an error, catch it and re-throw it as a 403 error.
  try {
    decoded = await jwt.verifyAsync(token, secret, { audience: 'postgraphql' })
  }
  catch (error) {
    throw new Forbidden(error.message)
  }

  const role = decoded.role || anonymousRole
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
  if (authorization == null) return null
  const match = bearerRex.exec(authorization)
  if (!match)
    throw new BadRequest('Authorization header is not in the correct bearer token format.')
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
