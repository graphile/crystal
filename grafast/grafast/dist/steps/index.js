"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setter = exports.Setter = exports.createObjectAndApplyChildren = exports.ReverseStep = exports.reverseArray = exports.reverse = exports.RemapKeysStep = exports.remapKeys = exports.partitionByIndex = exports.ObjectStep = exports.object = exports.specFromNodeId = exports.NodeStep = exports.nodeIdFromNode = exports.node = exports.makeDecodeNodeIdRuntime = exports.makeDecodeNodeId = exports.listTransform = exports.__ListTransformStep = exports.ListenStep = exports.listen = exports.ListStep = exports.list = exports.LastStep = exports.last = exports.LambdaStep = exports.lambda = exports.groupBy = exports.FirstStep = exports.first = exports.filter = exports.ErrorStep = exports.error = exports.each = exports.ConstantStep = exports.constant = exports.EdgeStep = exports.ConnectionStep = exports.connection = exports.assertPageInfoCapableStep = exports.assertEdgeCapableStep = exports.AccessStep = exports.access = exports.TRAP_INHIBITED = exports.TRAP_ERROR_OR_INHIBITED = exports.TRAP_ERROR = exports.trap = exports.inhibitOnNull = exports.assertNotNull = exports.__FlagStep = void 0;
exports.ProxyStep = exports.proxy = exports.PolymorphicBranchStep = exports.polymorphicBranch = exports.LoadStep = exports.loadOneCallback = exports.loadOne = exports.loadManyCallback = exports.loadMany = exports.LoadedRecordStep = exports.GraphQLResolverStep = exports.graphqlResolver = exports.graphqlItemHandler = exports.GraphQLItemHandler = exports.ConditionStep = exports.condition = exports.BakedInputStep = exports.bakedInputRuntime = exports.bakedInput = exports.ApplyTransformsStep = exports.applyTransforms = exports.Modifier = exports.isModifier = exports.assertModifier = exports.ApplyInputStep = exports.applyInput = exports.__ValueStep = exports.__TrackedValueStep = exports.__ItemStep = exports.__InputStaticLeafStep = exports.__InputObjectStep = exports.__InputListStep = exports.SideEffectStep = exports.sideEffect = void 0;
exports.operationPlan = operationPlan;
exports.context = context;
exports.rootValue = rootValue;
exports.trackedContext = trackedContext;
exports.trackedRootValue = trackedRootValue;
exports.debugPlans = debugPlans;
const withGlobalLayerPlan_js_1 = require("../engine/lib/withGlobalLayerPlan.js");
const global_js_1 = require("../global.js");
function operationPlan() {
    return (0, withGlobalLayerPlan_js_1.currentLayerPlan)().operationPlan;
}
function context() {
    return operationPlan().contextStep;
}
function rootValue() {
    return operationPlan().rootValueStep;
}
function trackedContext() {
    return operationPlan().trackedContextStep;
}
function trackedRootValue() {
    return operationPlan().trackedRootValueStep;
}
/**
 * Turns on debug mode, calls the callback, and then turns debug mode back off
 * again.
 */
function debugPlans(callback) {
    const oldDebug = (0, global_js_1.getDebug)();
    (0, global_js_1.setDebug)(true);
    const result = callback();
    (0, global_js_1.setDebug)(oldDebug);
    return result;
}
var __flag_js_1 = require("./__flag.js");
Object.defineProperty(exports, "__FlagStep", { enumerable: true, get: function () { return __flag_js_1.__FlagStep; } });
Object.defineProperty(exports, "assertNotNull", { enumerable: true, get: function () { return __flag_js_1.assertNotNull; } });
Object.defineProperty(exports, "inhibitOnNull", { enumerable: true, get: function () { return __flag_js_1.inhibitOnNull; } });
Object.defineProperty(exports, "trap", { enumerable: true, get: function () { return __flag_js_1.trap; } });
Object.defineProperty(exports, "TRAP_ERROR", { enumerable: true, get: function () { return __flag_js_1.TRAP_ERROR; } });
Object.defineProperty(exports, "TRAP_ERROR_OR_INHIBITED", { enumerable: true, get: function () { return __flag_js_1.TRAP_ERROR_OR_INHIBITED; } });
Object.defineProperty(exports, "TRAP_INHIBITED", { enumerable: true, get: function () { return __flag_js_1.TRAP_INHIBITED; } });
var access_js_1 = require("./access.js");
Object.defineProperty(exports, "access", { enumerable: true, get: function () { return access_js_1.access; } });
Object.defineProperty(exports, "AccessStep", { enumerable: true, get: function () { return access_js_1.AccessStep; } });
var connection_js_1 = require("./connection.js");
Object.defineProperty(exports, "assertEdgeCapableStep", { enumerable: true, get: function () { return connection_js_1.assertEdgeCapableStep; } });
Object.defineProperty(exports, "assertPageInfoCapableStep", { enumerable: true, get: function () { return connection_js_1.assertPageInfoCapableStep; } });
Object.defineProperty(exports, "connection", { enumerable: true, get: function () { return connection_js_1.connection; } });
Object.defineProperty(exports, "ConnectionStep", { enumerable: true, get: function () { return connection_js_1.ConnectionStep; } });
Object.defineProperty(exports, "EdgeStep", { enumerable: true, get: function () { return connection_js_1.EdgeStep; } });
var constant_js_1 = require("./constant.js");
Object.defineProperty(exports, "constant", { enumerable: true, get: function () { return constant_js_1.constant; } });
Object.defineProperty(exports, "ConstantStep", { enumerable: true, get: function () { return constant_js_1.ConstantStep; } });
var each_js_1 = require("./each.js");
Object.defineProperty(exports, "each", { enumerable: true, get: function () { return each_js_1.each; } });
var error_js_1 = require("./error.js");
Object.defineProperty(exports, "error", { enumerable: true, get: function () { return error_js_1.error; } });
Object.defineProperty(exports, "ErrorStep", { enumerable: true, get: function () { return error_js_1.ErrorStep; } });
var filter_js_1 = require("./filter.js");
Object.defineProperty(exports, "filter", { enumerable: true, get: function () { return filter_js_1.filter; } });
var first_js_1 = require("./first.js");
Object.defineProperty(exports, "first", { enumerable: true, get: function () { return first_js_1.first; } });
Object.defineProperty(exports, "FirstStep", { enumerable: true, get: function () { return first_js_1.FirstStep; } });
var groupBy_js_1 = require("./groupBy.js");
Object.defineProperty(exports, "groupBy", { enumerable: true, get: function () { return groupBy_js_1.groupBy; } });
var lambda_js_1 = require("./lambda.js");
Object.defineProperty(exports, "lambda", { enumerable: true, get: function () { return lambda_js_1.lambda; } });
Object.defineProperty(exports, "LambdaStep", { enumerable: true, get: function () { return lambda_js_1.LambdaStep; } });
var last_js_1 = require("./last.js");
Object.defineProperty(exports, "last", { enumerable: true, get: function () { return last_js_1.last; } });
Object.defineProperty(exports, "LastStep", { enumerable: true, get: function () { return last_js_1.LastStep; } });
var list_js_1 = require("./list.js");
Object.defineProperty(exports, "list", { enumerable: true, get: function () { return list_js_1.list; } });
Object.defineProperty(exports, "ListStep", { enumerable: true, get: function () { return list_js_1.ListStep; } });
var listen_js_1 = require("./listen.js");
Object.defineProperty(exports, "listen", { enumerable: true, get: function () { return listen_js_1.listen; } });
Object.defineProperty(exports, "ListenStep", { enumerable: true, get: function () { return listen_js_1.ListenStep; } });
var listTransform_js_1 = require("./listTransform.js");
Object.defineProperty(exports, "__ListTransformStep", { enumerable: true, get: function () { return listTransform_js_1.__ListTransformStep; } });
Object.defineProperty(exports, "listTransform", { enumerable: true, get: function () { return listTransform_js_1.listTransform; } });
var node_js_1 = require("./node.js");
Object.defineProperty(exports, "makeDecodeNodeId", { enumerable: true, get: function () { return node_js_1.makeDecodeNodeId; } });
Object.defineProperty(exports, "makeDecodeNodeIdRuntime", { enumerable: true, get: function () { return node_js_1.makeDecodeNodeIdRuntime; } });
Object.defineProperty(exports, "node", { enumerable: true, get: function () { return node_js_1.node; } });
Object.defineProperty(exports, "nodeIdFromNode", { enumerable: true, get: function () { return node_js_1.nodeIdFromNode; } });
Object.defineProperty(exports, "NodeStep", { enumerable: true, get: function () { return node_js_1.NodeStep; } });
Object.defineProperty(exports, "specFromNodeId", { enumerable: true, get: function () { return node_js_1.specFromNodeId; } });
var object_js_1 = require("./object.js");
Object.defineProperty(exports, "object", { enumerable: true, get: function () { return object_js_1.object; } });
Object.defineProperty(exports, "ObjectStep", { enumerable: true, get: function () { return object_js_1.ObjectStep; } });
var partitionByIndex_js_1 = require("./partitionByIndex.js");
Object.defineProperty(exports, "partitionByIndex", { enumerable: true, get: function () { return partitionByIndex_js_1.partitionByIndex; } });
var remapKeys_js_1 = require("./remapKeys.js");
Object.defineProperty(exports, "remapKeys", { enumerable: true, get: function () { return remapKeys_js_1.remapKeys; } });
Object.defineProperty(exports, "RemapKeysStep", { enumerable: true, get: function () { return remapKeys_js_1.RemapKeysStep; } });
var reverse_js_1 = require("./reverse.js");
Object.defineProperty(exports, "reverse", { enumerable: true, get: function () { return reverse_js_1.reverse; } });
Object.defineProperty(exports, "reverseArray", { enumerable: true, get: function () { return reverse_js_1.reverseArray; } });
Object.defineProperty(exports, "ReverseStep", { enumerable: true, get: function () { return reverse_js_1.ReverseStep; } });
var setter_js_1 = require("./setter.js");
Object.defineProperty(exports, "createObjectAndApplyChildren", { enumerable: true, get: function () { return setter_js_1.createObjectAndApplyChildren; } });
Object.defineProperty(exports, "Setter", { enumerable: true, get: function () { return setter_js_1.Setter; } });
Object.defineProperty(exports, "setter", { enumerable: true, get: function () { return setter_js_1.setter; } });
var sideEffect_js_1 = require("./sideEffect.js");
Object.defineProperty(exports, "sideEffect", { enumerable: true, get: function () { return sideEffect_js_1.sideEffect; } });
Object.defineProperty(exports, "SideEffectStep", { enumerable: true, get: function () { return sideEffect_js_1.SideEffectStep; } });
// Internal plans
var __inputList_js_1 = require("./__inputList.js");
Object.defineProperty(exports, "__InputListStep", { enumerable: true, get: function () { return __inputList_js_1.__InputListStep; } });
var __inputObject_js_1 = require("./__inputObject.js");
Object.defineProperty(exports, "__InputObjectStep", { enumerable: true, get: function () { return __inputObject_js_1.__InputObjectStep; } });
var __inputStaticLeaf_js_1 = require("./__inputStaticLeaf.js");
Object.defineProperty(exports, "__InputStaticLeafStep", { enumerable: true, get: function () { return __inputStaticLeaf_js_1.__InputStaticLeafStep; } });
var __item_js_1 = require("./__item.js");
Object.defineProperty(exports, "__ItemStep", { enumerable: true, get: function () { return __item_js_1.__ItemStep; } });
var __trackedValue_js_1 = require("./__trackedValue.js");
Object.defineProperty(exports, "__TrackedValueStep", { enumerable: true, get: function () { return __trackedValue_js_1.__TrackedValueStep; } });
var __value_js_1 = require("./__value.js");
Object.defineProperty(exports, "__ValueStep", { enumerable: true, get: function () { return __value_js_1.__ValueStep; } });
var applyInput_js_1 = require("./applyInput.js");
Object.defineProperty(exports, "applyInput", { enumerable: true, get: function () { return applyInput_js_1.applyInput; } });
Object.defineProperty(exports, "ApplyInputStep", { enumerable: true, get: function () { return applyInput_js_1.ApplyInputStep; } });
Object.defineProperty(exports, "assertModifier", { enumerable: true, get: function () { return applyInput_js_1.assertModifier; } });
Object.defineProperty(exports, "isModifier", { enumerable: true, get: function () { return applyInput_js_1.isModifier; } });
Object.defineProperty(exports, "Modifier", { enumerable: true, get: function () { return applyInput_js_1.Modifier; } });
var applyTransforms_js_1 = require("./applyTransforms.js");
Object.defineProperty(exports, "applyTransforms", { enumerable: true, get: function () { return applyTransforms_js_1.applyTransforms; } });
Object.defineProperty(exports, "ApplyTransformsStep", { enumerable: true, get: function () { return applyTransforms_js_1.ApplyTransformsStep; } });
var bakedInput_js_1 = require("./bakedInput.js");
Object.defineProperty(exports, "bakedInput", { enumerable: true, get: function () { return bakedInput_js_1.bakedInput; } });
Object.defineProperty(exports, "bakedInputRuntime", { enumerable: true, get: function () { return bakedInput_js_1.bakedInputRuntime; } });
Object.defineProperty(exports, "BakedInputStep", { enumerable: true, get: function () { return bakedInput_js_1.BakedInputStep; } });
var condition_js_1 = require("./condition.js");
Object.defineProperty(exports, "condition", { enumerable: true, get: function () { return condition_js_1.condition; } });
Object.defineProperty(exports, "ConditionStep", { enumerable: true, get: function () { return condition_js_1.ConditionStep; } });
var graphqlResolver_js_1 = require("./graphqlResolver.js");
Object.defineProperty(exports, "GraphQLItemHandler", { enumerable: true, get: function () { return graphqlResolver_js_1.GraphQLItemHandler; } });
Object.defineProperty(exports, "graphqlItemHandler", { enumerable: true, get: function () { return graphqlResolver_js_1.graphqlItemHandler; } });
Object.defineProperty(exports, "graphqlResolver", { enumerable: true, get: function () { return graphqlResolver_js_1.graphqlResolver; } });
Object.defineProperty(exports, "GraphQLResolverStep", { enumerable: true, get: function () { return graphqlResolver_js_1.GraphQLResolverStep; } });
var load_js_1 = require("./load.js");
Object.defineProperty(exports, "LoadedRecordStep", { enumerable: true, get: function () { return load_js_1.LoadedRecordStep; } });
Object.defineProperty(exports, "loadMany", { enumerable: true, get: function () { return load_js_1.loadMany; } });
Object.defineProperty(exports, "loadManyCallback", { enumerable: true, get: function () { return load_js_1.loadManyCallback; } });
Object.defineProperty(exports, "loadOne", { enumerable: true, get: function () { return load_js_1.loadOne; } });
Object.defineProperty(exports, "loadOneCallback", { enumerable: true, get: function () { return load_js_1.loadOneCallback; } });
Object.defineProperty(exports, "LoadStep", { enumerable: true, get: function () { return load_js_1.LoadStep; } });
var polymorphicBranch_js_1 = require("./polymorphicBranch.js");
Object.defineProperty(exports, "polymorphicBranch", { enumerable: true, get: function () { return polymorphicBranch_js_1.polymorphicBranch; } });
Object.defineProperty(exports, "PolymorphicBranchStep", { enumerable: true, get: function () { return polymorphicBranch_js_1.PolymorphicBranchStep; } });
var proxy_js_1 = require("./proxy.js");
Object.defineProperty(exports, "proxy", { enumerable: true, get: function () { return proxy_js_1.proxy; } });
Object.defineProperty(exports, "ProxyStep", { enumerable: true, get: function () { return proxy_js_1.ProxyStep; } });
//# sourceMappingURL=index.js.map