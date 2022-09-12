import "graphile-config";

import { version } from "../index.js";

export const PgColumnDeprecationPlugin: GraphileConfig.Plugin = {
  name: "PgColumnDeprecationPlugin",
  description: "Marks a column as deprecated if it has the deprecated tag",
  version: version,
  schema: {
    hooks: {
      GraphQLObjectType_fields_field(field, build, context) {
        const {
          scope: { fieldName, pgColumn },
          Self,
        } = context;
        if (!pgColumn) {
          return field;
        }
        const deprecated = pgColumn?.extensions?.tags?.deprecated;
        if (!deprecated || field.deprecationReason != null) {
          return field;
        }
        return build.extend(
          field,
          {
            deprecationReason: Array.isArray(deprecated)
              ? deprecated.join("\n")
              : String(deprecated),
          },
          `Deprecating ${Self.name}.${fieldName}`,
        );
      },
    },
  },
};
