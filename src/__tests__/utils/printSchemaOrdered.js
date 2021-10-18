import { lexicographicSortSchema, printSchema } from 'graphql/utilities';

export default function printSchemaOrdered(originalSchema) {
  return printSchema(lexicographicSortSchema(originalSchema));
}
