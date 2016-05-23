import createGraphqlSchema from './createGraphqlSchema.js'
import createServer from './createServer.js'

/**
 * A nice interface for creating a PostGraphQL server.
 *
 * @param {string | Object} pgConfig
 * @param {string?} schemaName
 * @param {Object} options
 * @returns {Server}
 */
const postgraphql = (pgConfig, schemaName, options) => {
  if (typeof schemaName === 'object') {
    options = schemaName
    schemaName = null
  }

  // Default schema name is public.
  schemaName = schemaName || 'public'
  options = options || {}

  // `createServer` allows us to give it a promise for a `graphqlSchema`
  const graphqlSchema = createGraphqlSchema(pgConfig, schemaName)

  return createServer({
    ...options,
    graphqlSchema,
    pgConfig,
  })
}

export default postgraphql
