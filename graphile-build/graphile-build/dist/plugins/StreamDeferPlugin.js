"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDeferPlugin = void 0;
require("graphile-config");
/**
 * Enables stream/defer on the schema.
 *
 * Removing this plugin will result in a GraphQL schema that does not enable
 * stream/defer.
 */
exports.StreamDeferPlugin = {
    name: "StreamDeferPlugin",
    version: "1.0.0",
    description: `Enables stream and defer on the schema`,
    schema: {
        hooks: {
            GraphQLSchema: {
                callback: (schema) => {
                    schema.enableDeferStream = true;
                    return schema;
                },
            },
        },
    },
};
//# sourceMappingURL=StreamDeferPlugin.js.map