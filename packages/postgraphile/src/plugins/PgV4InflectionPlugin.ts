import "graphile-config";
import "graphile-build-pg";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgV4SmartTags: Record<string, never>;
    }
  }
}

export const PgV4InflectionPlugin: GraphileConfig.Plugin = {
  name: "PgV4InflectionPlugin",
  description:
    "For compatibility with PostGraphile v4 schemas, this plugin emulates the default version 4 inflectors",
  version: "0.0.0",

  inflection: {
    replace: {
      _schemaPrefix() {
        return ``;
      },
      enumValue(previous, options, value, codec) {
        const oldValue = previous!.call(this, value, codec);
        return this.coerceToGraphQLName(this.constantCase(oldValue));
      },
      _columnName(previous, options, details) {
        const { column, columnName: _columnName } = details;
        if (column.extensions?.argIndex != null && !column.extensions.argName) {
          return `arg${column.extensions.argIndex + 1}`;
        }
        return previous!.call(this, details);
      },
      functionMutationResultFieldName(previous, options, details) {
        const { source, returnGraphQLTypeName } = details;
        if (source.extensions?.tags?.resultFieldName) {
          return source.extensions.tags.resultFieldName;
        }
        let name;
        if (source.extensions?.singleOutputParameterName) {
          name = this.camelCase(source.extensions.singleOutputParameterName);
        } else if (returnGraphQLTypeName === "Int") {
          name = "integer";
        } else if (returnGraphQLTypeName === "Float") {
          name = "float";
        } else if (returnGraphQLTypeName === "Boolean") {
          name = "boolean";
        } else if (returnGraphQLTypeName === "String") {
          name = "string";
        } else if (source.codec.isAnonymous) {
          // returns a record type
          name = "result";
        } else {
          name = this.camelCase(returnGraphQLTypeName);
        }
        const plural = !source.isUnique || !!source.codec.arrayOfCodec;
        return plural ? this.pluralize(name) : name;
      },
      edgeType(previous, options, typeName) {
        return this.upperCamelCase(`${this.pluralize(typeName)}-edge`);
      },
      edgeField(previous, options, typeName) {
        return this.camelCase(`${typeName}-edge`);
      },
    },
  },
};
