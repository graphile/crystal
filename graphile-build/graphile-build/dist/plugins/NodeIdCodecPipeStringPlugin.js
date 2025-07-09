"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeIdCodecPipeStringPlugin = void 0;
require("graphile-config");
function pipeStringEncode(value) {
    return Array.isArray(value) ? value.join("|") : null;
}
pipeStringEncode.isSyncAndSafe = true; // Optimization
function pipeStringDecode(value) {
    return typeof value === "string" ? value.split("|") : null;
}
pipeStringDecode.isSyncAndSafe = true; // Optimization
exports.NodeIdCodecPipeStringPlugin = {
    name: "NodeIdCodecPipeStringPlugin",
    version: "1.0.0",
    description: `Adds the 'pipeString' codec for NodeIDs`,
    schema: {
        hooks: {
            init(_, build) {
                if (!build.registerNodeIdCodec) {
                    return _;
                }
                const { EXPORTABLE } = build;
                build.registerNodeIdCodec(EXPORTABLE((pipeStringDecode, pipeStringEncode) => ({
                    name: "pipeString",
                    encode: pipeStringEncode,
                    decode: pipeStringDecode,
                }), [pipeStringDecode, pipeStringEncode]));
                return _;
            },
        },
    },
};
//# sourceMappingURL=NodeIdCodecPipeStringPlugin.js.map