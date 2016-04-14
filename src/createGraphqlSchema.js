import pg from 'pg'
import getCatalog from './postgres/getCatalog.js'
import createSchema from './graphql/createSchema.js'

/**
 * Creates a GraphQL schema from a PostgreSQL config and a PostgreSQL schema
 * name.
 *
 * @param {Object} pgConfig
 * @param {string} schemaName
 * @returns {GraphQLSchema}
 */
const createGraphqlSchema = async (pgConfig, schemaName) => {
  // Connect a client from the pool…
  const client = await pg.connectAsync(pgConfig)

  const pgCatalog = await getCatalog(client)
  const pgSchema = pgCatalog.getSchema(schemaName)
  const graphqlSchema = createSchema(pgSchema)

  // Make sure to release the client!
  client.end()

  return graphqlSchema
}

export default createGraphqlSchema
