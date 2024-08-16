import "graphile-config";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgAttributeDeprecationPlugin: true;
    }
  }
}

export const PgAttributeDeprecationPlugin: GraphileConfig.Plugin = {
  name: "PgAttributeDeprecationPlugin",
  description: "Marks a attribute as deprecated if it has the deprecated tag",
  version: version,
  schema: {
    hooks: {
      GraphQLObjectType_fields_field(field, build, context) {
        const {
          scope: { fieldName, pgFieldAttribute: pgAttribute },
          Self,
        } = context;
        if (!pgAttribute) {
          return field;
        }
        const deprecated = pgAttribute?.extensions?.tags?.deprecated;
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
