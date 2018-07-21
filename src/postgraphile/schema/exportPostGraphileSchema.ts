import { writeFile } from 'fs'
import { graphql, GraphQLSchema, introspectionQuery, printSchema } from 'graphql'

async function writeFileAsync(path: string, contents: string): Promise<void> {
  await new Promise((resolve, reject) => {
    writeFile(path, contents, error => {
      if (error) reject(error)
      else resolve()
    })
  })
}

/**
 * Exports a PostGraphile schema by looking at a Postgres client.
 */
export default async function exportPostGraphileSchema(
  schema: GraphQLSchema,
  options: {
    exportJsonSchemaPath?: string
    exportGqlSchemaPath?: string
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
