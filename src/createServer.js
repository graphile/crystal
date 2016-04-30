import path from 'path'
import http from 'http'
import Express from 'express'
import onFinished from 'on-finished'
import logger from 'morgan'
import favicon from 'serve-favicon'
import pg from 'pg'
import { formatError } from 'graphql'
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
const createServer = async ({ graphqlSchema, pgConfig, route, development }) => {
  const server = new Express()

  server.use(logger(development ? 'dev' : 'common'))
  server.use(favicon(path.join(__dirname, '../assets/favicon.ico')))

  server.use(route || '/', graphqlHTTP(async req => {
    // Acquire a new client for every request.
    const client = await pg.connectAsync(pgConfig)

    // Start a session for our client. Useful when setting roles.
    await client.queryAsync('begin')

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

const developmentFormatError = error => {
  console.error(error.stack) // eslint-disable-line no-console
  return {
    message: error.message,
    locations: error.locations,
    stack: error.stack,
  }
}
