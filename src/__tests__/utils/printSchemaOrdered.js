import { parse, buildASTSchema } from "graphql";
import { printSchema } from "graphql/utilities";

export default function printSchemaOrdered(originalSchema) {
  // Clone schema so we don't damage anything
  const schema = buildASTSchema(parse(printSchema(originalSchema)));

  const typeMap = schema.getTypeMap();
  Object.keys(typeMap).forEach(name => {
    const Type = typeMap[name];

    // Object?
    if (Type.getFields) {
      const fields = Type.getFields();
      const keys = Object.keys(fields).sort();
      keys.forEach(key => {
        const value = fields[key];

        // Move the key to the end of the object
        delete fields[key];
        fields[key] = value;

        // Sort args
        if (value.args) {
          value.args.sort((a, b) => a.name.localeCompare(b.name));
        }
      });
    }

    // Enum?
    if (Type.getValues) {
      Type.getValues().sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  return printSchema(schema);
};
