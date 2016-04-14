import { connectAsync } from 'pg'
import { getCatalog } from './postgres'
import { createGraphqlSchema as internalCreateGraphqlSchema } from './graphql'

/**
 * Creates a GraphQL schema from a PostgreSQL config and a PostgreSQL schema
 * name.
 *
 * @param {Object} pgConfig
 * @param {string} schemaName
 * @returns {GraphQLSchema}
 */
export const createGraphqlSchema = async (pgConfig, schemaName) => {
  // Connect a client from the pool…
  const client = await connectAsync(pgConfig)

  const pgCatalog = await getCatalog(client)
  const pgSchema = pgCatalog.getSchema(schemaName)
  const graphqlSchema = internalCreateGraphqlSchema(pgSchema)

  // Make sure to release the client!
  client.end()

  return graphqlSchema
}
