const { parse, buildASTSchema } = require("graphql");
const { printSchema } = require("graphql/utilities");

module.exports = function printSchemaOrdered(originalSchema) {
  // Clone schema so we don't damage anything
  const schema = buildASTSchema(parse(printSchema(originalSchema)));

  const typeMap = schema.getTypeMap();
  Object.keys(typeMap).forEach(name => {
    const gqlType = typeMap[name];

    // Object?
    if (gqlType.getFields) {
      const fields = gqlType.getFields();
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
    if (gqlType.getValues) {
      gqlType.getValues().sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  return printSchema(schema);
};
