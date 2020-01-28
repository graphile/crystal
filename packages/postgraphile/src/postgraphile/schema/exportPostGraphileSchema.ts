import { readFile as origReadFile, writeFile as origWriteFile } from 'fs';
import {
  graphql,
  GraphQLSchema,
  introspectionQuery,
  printSchema,
  lexicographicSortSchema,
} from 'graphql';
import { PostGraphileOptions } from '../../interfaces';
import { promisify } from 'util';

const readFile = promisify(origReadFile);
const writeFile = promisify(origWriteFile);

async function writeFileIfDiffers(path: string, contents: string): Promise<void> {
  let oldContents: string | null = null;
  try {
    oldContents = await readFile(path, 'utf8');
  } catch (e) {
    /* noop */
  }
  if (oldContents !== contents) {
    await writeFile(path, contents);
  }
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
    await writeFileIfDiffers(jsonPath, JSON.stringify(result, null, 2));
  }

  // Schema language version
  if (graphqlPath) {
    await writeFileIfDiffers(graphqlPath, printSchema(finalSchema));
  }
}
