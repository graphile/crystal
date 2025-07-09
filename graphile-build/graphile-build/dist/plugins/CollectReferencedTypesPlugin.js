"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectReferencedTypesPlugin = void 0;
require("graphile-config");
const collectReferencedTypes_js_1 = require("../vendor/collectReferencedTypes.js");
const version_js_1 = require("../version.js");
exports.CollectReferencedTypesPlugin = {
    name: "CollectReferencedTypesPlugin",
    version: version_js_1.version,
    description: `Emulates graphql.js' behavior of collecting the types in a particular order`,
    schema: {
        hooks: {
            GraphQLSchema_types(types, build, context) {
                const set = new Set(types);
                for (const type of types) {
                    set.delete(type);
                    (0, collectReferencedTypes_js_1.collectReferencedTypes)(type, set);
                }
                const { config } = context;
                if (config.query) {
                    (0, collectReferencedTypes_js_1.collectReferencedTypes)(config.query, set);
                }
                if (config.mutation) {
                    (0, collectReferencedTypes_js_1.collectReferencedTypes)(config.mutation, set);
                }
                if (config.subscription) {
                    (0, collectReferencedTypes_js_1.collectReferencedTypes)(config.subscription, set);
                }
                return [...set];
            },
        },
    },
};
//# sourceMappingURL=CollectReferencedTypesPlugin.js.map