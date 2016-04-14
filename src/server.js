import Express from 'express'
import logger from 'morgan'
import { formatError } from 'graphql'
import { createGraphQLMiddleware } from 'express-graphql'

/**
 * Creates an HTTP server with the provided configuration.
 *
 * @param {Object} config
 * @param {GraphQLSchema} config.graphqlSchema
 * @param {string} config.route
 * @param {boolean} config.development
 * @returns {Server}
 */
export const createServer = async ({ graphqlSchema, route, development }) => {
  const server = new Express()

  server.use(logger(development ? 'dev' : 'common'))

  server.use(route || '/', createGraphQLMiddleware({
    schema: graphqlSchema,
    pretty: development,
    graphiql: development,
    formatError: development ? developmentFormatError : formatError,
  }))

  // Lol, we actually return an express server, but we might not in the
  // future ;)
  return server
}

const developmentFormatError = error => ({
  message: error.message,
  locations: error.locations,
  stack: error.stack,
})
