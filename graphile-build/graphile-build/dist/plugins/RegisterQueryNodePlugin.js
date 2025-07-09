"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterQueryNodePlugin = void 0;
require("graphile-config");
const grafast_1 = require("grafast");
const utils_js_1 = require("../utils.js");
exports.RegisterQueryNodePlugin = {
    name: "RegisterQueryNodePlugin",
    version: "1.0.0",
    description: `Registers the 'Query' type as a 'Node' type. You probably don't want this.`,
    schema: {
        hooks: {
            init(_, build) {
                if (!build.registerNodeIdHandler) {
                    return _;
                }
                build.registerNodeIdHandler({
                    typeName: build.inflection.builtin("Query"),
                    codec: build.getNodeIdCodec("raw"),
                    match: (0, utils_js_1.EXPORTABLE)(() => (specifier) => {
                        return specifier === "query";
                    }, []),
                    getIdentifiers(_value) {
                        return [];
                    },
                    getSpec: () => "irrelevant",
                    get: (0, utils_js_1.EXPORTABLE)((rootValue) => () => {
                        return rootValue();
                    }, [grafast_1.rootValue]),
                    plan: (0, utils_js_1.EXPORTABLE)((constant) => () => {
                        return constant `query`;
                    }, [grafast_1.constant]),
                });
                return _;
            },
        },
    },
};
//# sourceMappingURL=RegisterQueryNodePlugin.js.map