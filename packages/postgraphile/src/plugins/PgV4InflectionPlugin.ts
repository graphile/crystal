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
        return this.camelCase(details.source.codec.name);
      },
    },
  },
};
