"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationPayloadQueryPlugin = void 0;
require("graphile-config");
const grafast_1 = require("grafast");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
/**
 * Adds a 'query' field to each mutation payload object type; this often turns
 * out to be quite helpful but if you don't want it in your schema then it's
 * safe to disable this plugin.
 */
exports.MutationPayloadQueryPlugin = {
    name: "MutationPayloadQueryPlugin",
    description: "Adds the 'query' field to mutation payloads; useful for follow-up queries after a mutation",
    version: version_js_1.version,
    schema: {
        hooks: {
            GraphQLObjectType_fields: {
                callback: (fields, build, context) => {
                    const { extend, getTypeByName, inflection } = build;
                    const { scope: { isMutationPayload }, Self, } = context;
                    if (isMutationPayload !== true) {
                        return fields;
                    }
                    const Query = getTypeByName(inflection.builtin("Query"));
                    return extend(fields, {
                        query: {
                            description: "Our root query field type. Allows us to run any query from our mutation payload.",
                            type: Query,
                            plan: (0, utils_js_1.EXPORTABLE)((rootValue) => function plan() {
                                return rootValue();
                            }, [grafast_1.rootValue]),
                        },
                    }, `Adding 'query' field to mutation payload ${Self.name}`);
                },
                provides: ["MutationPayloadQuery"],
            },
        },
    },
};
//# sourceMappingURL=MutationPayloadQueryPlugin.js.map