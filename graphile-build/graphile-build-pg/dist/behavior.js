"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBehavior = getBehavior;
const grafast_1 = require("grafast");
const graphile_build_1 = require("graphile-build");
const util_1 = require("util");
/**
 * Takes a smart tags object and extracts the 'behavior' (or 'behaviour')
 * property and coerces it to be a string.
 */
function getBehavior(extensions) {
    const allExtensions = Array.isArray(extensions) ? extensions : [extensions];
    const behaviors = [];
    for (const extensions of allExtensions) {
        // LOGGING: all of these are just for user convenience, users should be guided not to use them.
        add(extensions?.tags?.behaviours);
        add(extensions?.tags?.behaviors);
        add(extensions?.tags?.behaviour);
        // This is the real one
        add(extensions?.tags?.behavior);
    }
    return behaviors.join(" ");
    function add(rawBehavior) {
        const behavior = typeof rawBehavior === "string" ? rawBehavior.trim() : rawBehavior;
        if (!behavior) {
            return;
        }
        if (Array.isArray(behavior)) {
            if (grafast_1.isDev && !behavior.every(graphile_build_1.isValidBehaviorString)) {
                throw new Error(`Invalid value for behavior; expected a string or string array using simple alphanumeric strings, but found ${(0, util_1.inspect)(behavior)}`);
            }
            for (const b of behavior) {
                behaviors.push(b);
            }
            return;
        }
        if ((0, graphile_build_1.isValidBehaviorString)(behavior)) {
            behaviors.push(behavior);
            return;
        }
        throw new Error(`Invalid value for behavior; expected a string or string array using simple alphanumeric strings, but found ${(0, util_1.inspect)(behavior)}`);
    }
}
//# sourceMappingURL=behavior.js.map