"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withGlobalLayerPlan = withGlobalLayerPlan;
exports.currentLayerPlan = currentLayerPlan;
exports.currentPolymorphicPaths = currentPolymorphicPaths;
exports.isUnaryStep = isUnaryStep;
let globalData_layerPlan = undefined;
let globalData_polymorphicPaths = undefined;
function withGlobalLayerPlan(layerPlan, polymorphicPaths, callback, callbackThis, ...callbackArgs) {
    const oldLayerPlan = globalData_layerPlan;
    globalData_layerPlan = layerPlan;
    const oldPolymorphicPaths = globalData_polymorphicPaths;
    globalData_polymorphicPaths = polymorphicPaths;
    try {
        return callback.apply(callbackThis, callbackArgs);
    }
    finally {
        globalData_layerPlan = oldLayerPlan;
        globalData_polymorphicPaths = oldPolymorphicPaths;
    }
}
function currentLayerPlan() {
    if (globalData_layerPlan === undefined) {
        throw new Error(
        // Must only be called from inside `withGlobalLayerPlan`!
        "Now is not a valid time to call `currentLayerPlan`. This error typically occurs when you attempt to call a Grafast step function from outside of the planning lifecycle - it's important to note that Grafast plans must be resolved synchronously, so check for 'async' or 'setTimeout' or any location where a step function is called outside of a plan resolver. For more information, read about plan resolvers: https://grafast.org/grafast/plan-resolvers");
    }
    return globalData_layerPlan;
}
function currentPolymorphicPaths() {
    if (globalData_polymorphicPaths === undefined) {
        throw new Error("GrafastInternalError<b0b05743-8b21-42c6-9b53-925013d88bd1>: currentPolymorphicPaths called out of turn; must only called within a withGlobalLayerPlan callback");
    }
    return globalData_polymorphicPaths;
}
function isUnaryStep($step) {
    return $step._isUnary;
}
//# sourceMappingURL=withGlobalLayerPlan.js.map