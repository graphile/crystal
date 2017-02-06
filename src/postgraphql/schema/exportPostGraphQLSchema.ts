import { writeFileSync } from 'fs'
import { graphql, GraphQLSchema } from 'graphql'
import { introspectionQuery, printSchema } from 'graphql/utilities'
import { graphql } from 'graphql'

/**
 * Exports a PostGraphQL schema by looking at a Postgres client.
 */
export default async function exportPostGraphQLSchema (
  schema: GraphQLSchema,
  options: {
    exportPathJSON?: string,
    exportPathSchema?: string,
  } = {},
): Promise<void> {
  // JSON version
  if (options.exportPathJSON) {
    const result = await graphql(schema, introspectionQuery)
    writeFileSync(options.exportPathJSON, JSON.stringify(result))
  }

  // Schema language version
  if (options.exportPathSchema) {
    writeFileSync(options.exportPathSchema, printSchema(schema))
  }
}
