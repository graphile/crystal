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
    // Make sure we release our client back to the pool once the response has
    // finished.
    onFinished(req.res, () => client.end())
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
  /* eslint-disable no-console */
  console.error(error.stack)
  /* eslint-enable no-console */
  return {
    message: error.message,
    locations: error.locations,
    stack: error.stack,
  }
}
