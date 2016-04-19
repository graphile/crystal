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
  const pgCatalog = await getCatalog(pgConfig)
  const pgSchema = pgCatalog.getSchema(schemaName)
  if (!pgSchema) throw new Error(`No schema named '${schemaName}' found.`)
  const graphqlSchema = createSchema(pgSchema)
  return graphqlSchema
}

export default createGraphqlSchema
