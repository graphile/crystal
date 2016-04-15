import path from 'path'
import Express from 'express'
import logger from 'morgan'
import favicon from 'serve-favicon'
import pg from 'pg'
import { formatError } from 'graphql'
import graphql from 'express-graphql'

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
  server.use(favicon(path.join(__dirname, '../public/favicon.ico')))

  server.use(route || '/', graphql(async () => ({
    schema: graphqlSchema,
    context: { client: await pg.connectAsync(pgConfig) },
    pretty: development,
    graphiql: development,
    formatError: development ? developmentFormatError : formatError,
  })))

  // Lol, we actually return an express server, but we might not in the
  // future ;)
  return server
}

export default createServer

const developmentFormatError = error => ({
  message: error.message,
  locations: error.locations,
  stack: error.stack,
})
