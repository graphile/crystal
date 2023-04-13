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
    ignoreReplaceIfNotExists: ["deletedNodeId"],
    replace: {
      _schemaPrefix() {
        return ``;
      },
      enumValue(previous, options, value, codec) {
        const oldValue = previous!.call(this, value, codec);
        return this.coerceToGraphQLName(this.constantCase(oldValue));
      },
      _attributeName(previous, options, details) {
        const { codec, attributeName } = details;
        const attribute = codec.attributes[attributeName];
        if (!attribute) {
          throw new Error(
            `Attempted to access attribute '${attributeName}' of codec '${
              codec.name
            }', but it doesn't have that attribute (known attributes: ${Object.keys(
              codec.attributes,
            ).join(", ")})`,
          );
        }
        if (
          attribute.extensions?.argIndex != null &&
          !attribute.extensions.argName
        ) {
          return `arg${attribute.extensions.argIndex + 1}`;
        }
        return previous!.call(this, details);
      },
      functionMutationResultFieldName(previous, options, details) {
        const { resource, returnGraphQLTypeName } = details;
        if (resource.extensions?.tags?.resultFieldName) {
          return resource.extensions.tags.resultFieldName;
        }
        let name;
        if (resource.extensions?.singleOutputParameterName) {
          name = this.camelCase(resource.extensions.singleOutputParameterName);
        } else if (returnGraphQLTypeName === "Int") {
          name = "integer";
        } else if (returnGraphQLTypeName === "Float") {
          name = "float";
        } else if (returnGraphQLTypeName === "Boolean") {
          name = "boolean";
        } else if (returnGraphQLTypeName === "String") {
          name = "string";
        } else if (resource.codec.isAnonymous) {
          // returns a record type
          name = "result";
        } else {
          name = this.camelCase(returnGraphQLTypeName);
        }
        const plural = !resource.isUnique || !!resource.codec.arrayOfCodec;
        return plural ? this.pluralize(name) : name;
      },
      deletedNodeId(previous, options, { resource }) {
        // Silly V4 behavior
        return this.camelCase(
          `deleted-${this.singularize(
            resource.extensions?.pg?.name ?? this._resourceName(resource),
          )}-id`,
        );
      },
      orderByType(previous, options, typeName) {
        return this.upperCamelCase(`${this.pluralize(typeName)}-order-by`);
      },
      tableConnectionType(previous, options, codec) {
        if (codec.isAnonymous) {
          return this.connectionType(this.tableType(codec));
        } else {
          return this.connectionType(this.pluralize(this.tableType(codec)));
        }
      },
      tableEdgeField(previous, options, codec) {
        return this.camelCase(`${this.tableType(codec)}-edge`);
      },
      tableEdgeType(previous, options, codec) {
        if (codec.isAnonymous) {
          return this.edgeType(this.tableType(codec));
        } else {
          return this.edgeType(this.pluralize(this.tableType(codec)));
        }
      },
    },
  },
};
