"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeOutputPlan = executeOutputPlan;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const assert = tslib_1.__importStar(require("../assert.js"));
const dev_js_1 = require("../dev.js");
const debug = (0, debug_1.default)("grafast:OutputPlan");
const debugVerbose = debug.extend("verbose");
/**
 * @internal
 */
function executeOutputPlan(ctx, outputPlan, bucket, bucketIndex, outputDataAsString) {
    if (debugVerbose.enabled) {
        debugVerbose("Executing %c with data:\n%c", outputPlan, bucket);
    }
    if (dev_js_1.isDev) {
        assert.strictEqual(bucket.isComplete, true, "Can only process an output plan for a completed bucket");
    }
    // PERF: feels like this path could be done more efficiently
    const mutablePath = ["SOMEONE_FORGOT_TO_SLICE_THE_PATH!", ...ctx.path];
    return outputDataAsString
        ? outputPlan.executeString(ctx.root, mutablePath, bucket, bucketIndex)
        : outputPlan.execute(ctx.root, mutablePath, bucket, bucketIndex);
}
//# sourceMappingURL=executeOutputPlan.js.map