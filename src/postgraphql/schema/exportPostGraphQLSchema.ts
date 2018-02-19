import { writeFile } from 'fs'
import { graphql, GraphQLSchema } from 'graphql'
import { introspectionQuery, printSchema } from 'graphql/utilities'

async function writeFileAsync(
  path: string,
  contents: string,
): Promise<void> {
  await new Promise((resolve, reject) => {
    writeFile(path, contents, error => {
      if (error) reject(error)
      else resolve()
    })
  })
}

/**
 * Exports a PostGraphQL schema by looking at a Postgres client.
 */
export default async function exportPostGraphQLSchema(
  schema: GraphQLSchema,
  options: {
    exportJsonSchemaPath?: string,
    exportGqlSchemaPath?: string,
  } = {},
): Promise<void> {
  // JSON version
  if (typeof options.exportJsonSchemaPath === 'string') {
    const result = await graphql(schema, introspectionQuery)
    await writeFileAsync(options.exportJsonSchemaPath, JSON.stringify(result, null, 2))
  }

  // Schema language version
  if (typeof options.exportGqlSchemaPath === 'string') {
    await writeFileAsync(options.exportGqlSchemaPath, printSchema(schema))
  }
}
