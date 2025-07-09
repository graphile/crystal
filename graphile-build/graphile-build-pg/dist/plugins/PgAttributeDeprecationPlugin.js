"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgAttributeDeprecationPlugin = void 0;
require("graphile-config");
const version_js_1 = require("../version.js");
exports.PgAttributeDeprecationPlugin = {
    name: "PgAttributeDeprecationPlugin",
    description: "Marks a attribute as deprecated if it has the deprecated tag",
    version: version_js_1.version,
    schema: {
        hooks: {
            GraphQLObjectType_fields_field(field, build, context) {
                const { scope: { fieldName, pgFieldAttribute: pgAttribute }, Self, } = context;
                if (!pgAttribute) {
                    return field;
                }
                const deprecated = pgAttribute?.extensions?.tags?.deprecated;
                if (!deprecated || field.deprecationReason != null) {
                    return field;
                }
                return build.extend(field, {
                    deprecationReason: Array.isArray(deprecated)
                        ? deprecated.join("\n")
                        : String(deprecated),
                }, `Deprecating ${Self.name}.${fieldName}`);
            },
        },
    },
};
//# sourceMappingURL=PgAttributeDeprecationPlugin.js.map