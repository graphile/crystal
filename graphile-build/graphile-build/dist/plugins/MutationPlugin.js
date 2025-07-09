"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationPlugin = void 0;
require("graphile-config");
const grafast_1 = require("grafast");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
/**
 * This plugin registers the operation type for the 'mutation' operation, and
 * if that type adds at least one field then it will be added to the GraphQL
 * schema.
 *
 * By default we call this type `Mutation`, but you can rename it using the
 * `builtin` inflector.
 *
 * Removing this plugin will mean that your GraphQL schema will not allow
 * mutation operations.
 */
exports.MutationPlugin = {
    name: "MutationPlugin",
    description: "Adds the 'Mutation' type to the GraphQL schema",
    version: version_js_1.version,
    schema: {
        hooks: {
            init: {
                callback: (_, build, _context) => {
                    const { inflection } = build;
                    build.registerObjectType(inflection.builtin("Mutation"), {
                        isRootMutation: true,
                    }, () => ({
                        assertStep: grafast_1.__ValueStep,
                        description: "The root mutation type which contains root level fields which mutate data.",
                    }), `graphile-build built-in (root mutation type)`);
                    return _;
                },
            },
            GraphQLSchema: {
                callback: (schema, build, _context) => {
                    const { getTypeByName, extend, inflection, handleRecoverableError } = build;
                    // IIFE to get the mutation type, handling errors occurring during
                    // validation.
                    const Mutation = (() => {
                        try {
                            const Type = getTypeByName(inflection.builtin("Mutation"));
                            if ((0, utils_js_1.isValidObjectType)(Type)) {
                                return Type;
                            }
                        }
                        catch (e) {
                            handleRecoverableError(e);
                        }
                        return null;
                    })();
                    if (Mutation == null) {
                        return schema;
                    }
                    // Errors thrown here (e.g. due to naming conflicts) should be raised,
                    // hence this is outside of the IIFE.
                    return extend(schema, { mutation: Mutation }, "Adding mutation type to schema");
                },
                provides: ["Mutation"],
                before: [],
                after: ["Query"],
            },
        },
    },
};
//# sourceMappingURL=MutationPlugin.js.map