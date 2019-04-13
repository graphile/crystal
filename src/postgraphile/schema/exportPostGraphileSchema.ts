import { writeFile } from 'fs';
import {
  graphql,
  GraphQLSchema,
  introspectionQuery,
  printSchema,
  lexicographicSortSchema,
} from 'graphql';
import { PostGraphileOptions } from '../../interfaces';

async function writeFileAsync(path: string, contents: string): Promise<void> {
  await new Promise((resolve, reject) => {
    writeFile(path, contents, error => {
      if (error) reject(error);
      else resolve();
    });
  });
}

/**
 * Exports a PostGraphile schema by looking at a Postgres client.
 */
export default async function exportPostGraphileSchema(
  schema: GraphQLSchema,
  options: PostGraphileOptions = {},
): Promise<void> {
  const jsonPath =
    typeof options.exportJsonSchemaPath === 'string' ? options.exportJsonSchemaPath : null;
  const graphqlPath =
    typeof options.exportGqlSchemaPath === 'string' ? options.exportGqlSchemaPath : null;

  // Sort schema, if requested
  const finalSchema =
    options.sortExport && lexicographicSortSchema && (jsonPath || graphqlPath)
      ? lexicographicSortSchema(schema)
      : schema;

  // JSON version
  if (jsonPath) {
    const result = await graphql(finalSchema, introspectionQuery);
    await writeFileAsync(jsonPath, JSON.stringify(result, null, 2));
  }

  // Schema language version
  if (graphqlPath) {
    await writeFileAsync(graphqlPath, printSchema(finalSchema));
  }
}
