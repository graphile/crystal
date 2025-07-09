"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryQueryPlugin = void 0;
require("graphile-config");
const grafast_1 = require("grafast");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
/**
 * Adds the Query.query field to the Query type for Relay 1 compatibility. This
 * is a vestigial field, you probably don't want it.
 */
exports.QueryQueryPlugin = {
    name: "QueryQueryPlugin",
    description: "Adds a 'query' field to the Query type giving access to the Query type again. You probably don't want this unless you need to support Relay Classic.",
    version: version_js_1.version,
    schema: {
        hooks: {
            GraphQLObjectType_fields: {
                callback: (fields, build, context) => {
                    const { extend, graphql: { GraphQLNonNull }, } = build;
                    const { Self, scope: { isRootQuery }, } = context;
                    if (isRootQuery !== true) {
                        return fields;
                    }
                    return extend(fields, {
                        query: {
                            description: build.wrapDescription("Exposes the root query type nested one level down. This is helpful for Relay 1 which can only query top level fields if they are in a particular form.", "field"),
                            type: new GraphQLNonNull(Self),
                            plan: (0, utils_js_1.EXPORTABLE)((rootValue) => function plan() {
                                return rootValue();
                            }, [grafast_1.rootValue]),
                        },
                    }, "Adding the Query.query field for Relay 1 compat");
                },
            },
        },
    },
};
//# sourceMappingURL=QueryQueryPlugin.js.map