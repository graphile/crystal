"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeIdCodecBase64JSONPlugin = void 0;
require("graphile-config");
exports.NodeIdCodecBase64JSONPlugin = {
    name: "NodeIdCodecBase64JSONPlugin",
    version: "1.0.0",
    description: `Adds the 'base64JSON' codec for NodeIDs`,
    schema: {
        hooks: {
            init(_, build) {
                if (!build.registerNodeIdCodec) {
                    return _;
                }
                const { EXPORTABLE } = build;
                const base64JSONEncode = EXPORTABLE(() => {
                    function base64JSONEncode(value) {
                        return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
                    }
                    base64JSONEncode.isSyncAndSafe = true; // Optimization
                    return base64JSONEncode;
                }, []);
                const base64JSONDecode = EXPORTABLE(() => {
                    function base64JSONDecode(value) {
                        return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
                    }
                    base64JSONDecode.isSyncAndSafe = true; // Optimization
                    return base64JSONDecode;
                }, []);
                build.registerNodeIdCodec(EXPORTABLE((base64JSONDecode, base64JSONEncode) => ({
                    name: "base64JSON",
                    encode: base64JSONEncode,
                    decode: base64JSONDecode,
                }), [base64JSONDecode, base64JSONEncode]));
                return _;
            },
        },
    },
};
//# sourceMappingURL=NodeIdCodecBase64JSONPlugin.js.map