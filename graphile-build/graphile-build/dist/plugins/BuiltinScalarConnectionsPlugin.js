"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuiltinScalarConnectionsPlugin = void 0;
require("./ConnectionPlugin.js");
require("graphile-config");
const version_js_1 = require("../version.js");
exports.BuiltinScalarConnectionsPlugin = {
    name: "BuiltinScalarConnectionsPlugin",
    description: "Adds connection types for builtin scalars",
    version: version_js_1.version,
    schema: {
        hooks: {
            init(_, build) {
                if (!build.registerCursorConnection) {
                    return _;
                }
                build.registerCursorConnection({
                    typeName: "Boolean",
                    nonNullNode: false,
                });
                build.registerCursorConnection({
                    typeName: "Int",
                    nonNullNode: false,
                });
                build.registerCursorConnection({
                    typeName: "Float",
                    nonNullNode: false,
                });
                build.registerCursorConnection({
                    typeName: "String",
                    nonNullNode: false,
                });
                build.registerCursorConnection({
                    typeName: "ID",
                    nonNullNode: false,
                });
                return _;
            },
        },
    },
};
//# sourceMappingURL=BuiltinScalarConnectionsPlugin.js.map