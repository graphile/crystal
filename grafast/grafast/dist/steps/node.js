"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeStep = void 0;
exports.node = node;
exports.specFromNodeId = specFromNodeId;
exports.nodeIdFromNode = nodeIdFromNode;
exports.makeDecodeNodeIdRuntime = makeDecodeNodeIdRuntime;
exports.makeDecodeNodeId = makeDecodeNodeId;
const dev_js_1 = require("../dev.js");
const inspect_js_1 = require("../inspect.js");
const polymorphic_js_1 = require("../polymorphic.js");
const step_js_1 = require("../step.js");
const access_js_1 = require("./access.js");
const constant_js_1 = require("./constant.js");
const lambda_js_1 = require("./lambda.js");
/**
 * A plan to get a Node by its global object identifier (string). Accepts an
 * object specifying the supported codecs, an object map detailing the
 * typeNames supported and their details (codec to use, how to find the record,
 * etc), and finally the Node id string plan.
 */
class NodeStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "NodeStep",
    }; }
    constructor(possibleTypes, $id) {
        super();
        this.possibleTypes = possibleTypes;
        this.isSyncAndSafe = true;
        this.allowMultipleOptimizations = true;
        this.unbatchedExecute = (_extra, specifier) => {
            const typeName = specifier
                ? this.getTypeNameFromSpecifier(specifier)
                : null;
            return typeName ? (0, polymorphic_js_1.polymorphicWrap)(typeName) : null;
        };
        const decodeNodeId = makeDecodeNodeId(Object.values(possibleTypes));
        this.specPlanDep = this.addDependency(decodeNodeId($id));
    }
    planForType(type) {
        const spec = this.possibleTypes[type.name];
        if (spec !== undefined) {
            return spec.get(spec.getSpec((0, access_js_1.access)(this.getDep(this.specPlanDep), [spec.codec.name])));
        }
        else {
            return (0, constant_js_1.constant)(null);
        }
    }
    getTypeNameFromSpecifier(specifier) {
        for (const [typeName, typeSpec] of Object.entries(this.possibleTypes)) {
            const value = specifier[typeSpec.codec.name];
            if (value != null && typeSpec.match(value)) {
                return typeName;
            }
        }
        if (dev_js_1.isDev) {
            console.error(`Could not find a type that matched the specifier '${(0, inspect_js_1.inspect)(specifier)}'`);
        }
        return null;
    }
}
exports.NodeStep = NodeStep;
/**
 * A plan to get a Node by its global object identifier (string). Accepts an
 * object specifying the supported codecs, an object map detailing the
 * typeNames supported and their details (codec to use, how to find the record,
 * etc), and finally the Node id string plan.
 */
function node(possibleTypes, $id) {
    return new NodeStep(possibleTypes, $id);
}
function specFromNodeId(handler, $id) {
    function decodeWithCodecAndHandler(raw) {
        if (raw == null)
            return raw;
        try {
            const decoded = handler.codec.decode(raw);
            if (handler.match(decoded)) {
                return decoded;
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
    decodeWithCodecAndHandler.displayName = `decode_${handler.typeName}_${handler.codec.name}`;
    decodeWithCodecAndHandler.isSyncAndSafe = true; // Optimization
    const $decoded = (0, lambda_js_1.lambda)($id, decodeWithCodecAndHandler);
    return handler.getSpec($decoded);
}
function nodeIdFromNode(handler, $node) {
    const specifier = handler.plan($node);
    return (0, lambda_js_1.lambda)(specifier, handler.codec.encode);
}
function makeDecodeNodeIdRuntime(handlers) {
    const codecs = [...new Set(handlers.map((h) => h.codec))];
    function decodeNodeIdWithCodecs(raw) {
        if (raw == null)
            return null;
        return codecs.reduce((memo, codec) => {
            try {
                memo[codec.name] = codec.decode(raw);
            }
            catch (e) {
                memo[codec.name] = null;
            }
            return memo;
        }, { raw });
    }
    decodeNodeIdWithCodecs.isSyncAndSafe = true; // Optimization
    return decodeNodeIdWithCodecs;
}
function makeDecodeNodeId(handlers) {
    const decodeNodeIdWithCodecs = makeDecodeNodeIdRuntime(handlers);
    return ($id) => (0, lambda_js_1.lambda)($id, decodeNodeIdWithCodecs);
}
//# sourceMappingURL=node.js.map