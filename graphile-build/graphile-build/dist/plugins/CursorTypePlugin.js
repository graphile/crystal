"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorTypePlugin = void 0;
require("graphile-config");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
exports.CursorTypePlugin = {
    name: "CursorTypePlugin",
    description: "Registers the 'Cursor' scalar type for cursor pagination",
    version: version_js_1.version,
    schema: {
        hooks: {
            init: {
                callback: (_, build) => {
                    const { registerScalarType, inflection } = build;
                    const cursorTypeName = inflection.builtin("Cursor");
                    registerScalarType(cursorTypeName, { isCursorType: true }, () => (0, utils_js_1.stringTypeSpec)("A location in a connection that can be used for resuming pagination.", undefined, cursorTypeName), "graphile-build built-in (Cursor type)");
                    return _;
                },
                provides: ["Cursor"],
            },
        },
    },
};
//# sourceMappingURL=CursorTypePlugin.js.map