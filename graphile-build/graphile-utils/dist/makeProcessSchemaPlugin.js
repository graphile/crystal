"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeProcessSchemaPlugin = makeProcessSchemaPlugin;
let counter = 0;
function makeProcessSchemaPlugin(callback) {
    return {
        name: `ProcessSchemaPlugin_${++counter}`,
        version: "0.0.0",
        schema: {
            hooks: {
                finalize: {
                    callback,
                },
            },
        },
    };
}
//# sourceMappingURL=makeProcessSchemaPlugin.js.map