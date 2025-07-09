"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddInterfaceSubtypesToTypesPlugin = void 0;
require("graphile-config");
const version_js_1 = require("../version.js");
exports.AddInterfaceSubtypesToTypesPlugin = {
    name: "AddInterfaceSubtypesToTypesPlugin",
    version: version_js_1.version,
    description: `Ensures that subtypes of an interface are added to the schema even if they're not directly referenced`,
    schema: {
        hooks: {
            GraphQLSchema_types: {
                after: ["CollectReferencedTypesPlugin"],
                callback(types, build) {
                    const { graphql: { GraphQLObjectType }, } = build;
                    const allTypes = Object.values(build.getAllTypes());
                    for (const t of allTypes) {
                        if (t != null &&
                            t instanceof GraphQLObjectType &&
                            t.getInterfaces().length !== 0 &&
                            !types.includes(t)) {
                            types.push(t);
                        }
                    }
                    return types;
                },
            },
        },
    },
};
//# sourceMappingURL=AddInterfaceSubtypesToTypesPlugin.js.map