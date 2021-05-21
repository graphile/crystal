import type { GraphQLSchema } from "graphql";
import { buildASTSchema, parse } from "graphql";
import { printSchema } from "graphql/utilities";

export default function printSchemaOrdered(originalSchema: GraphQLSchema) {
  // TODO: use lexicographicSortSchema from 'graphql' instead.
  // Clone schema so we don't damage anything
  const schema = buildASTSchema(parse(printSchema(originalSchema)));

  const typeMap = schema.getTypeMap();
  Object.keys(typeMap).forEach((name) => {
    const gqlType = typeMap[name];

    // Object?
    if ("getFields" in gqlType && gqlType.getFields) {
      const fields = gqlType.getFields();
      const keys = Object.keys(fields).sort();
      keys.forEach((key) => {
        const value = fields[key];

        // Move the key to the end of the object
        delete fields[key];
        fields[key] = value;

        // Sort args
        if ("args" in value && value.args) {
          value.args.sort((a, b) => a.name.localeCompare(b.name));
        }
      });
    }

    // Enum?
    if ("getValues" in gqlType && gqlType.getValues) {
      gqlType.getValues().sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  return printSchema(schema);
}
