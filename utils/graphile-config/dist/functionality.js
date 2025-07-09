"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderedApply = orderedApply;
const sort_js_1 = require("./sort.js");
// TypeScript nonsense
const isCallbackDescriptor = (v) => typeof v !== "function";
const isCallback = (v) => typeof v === "function";
function isArray(arg) {
    return Array.isArray(arg);
}
function orderedApply(plugins, functionalityRetriever, applyCallback) {
    // Normalize all the plugin "functionalities" and gather them into collections
    const allFunctionalities = Object.create(null);
    let uid = 0;
    if (plugins) {
        for (const plugin of plugins) {
            const hooks = functionalityRetriever(plugin);
            if (!hooks) {
                continue;
            }
            const keys = Object.keys(hooks);
            for (const key of keys) {
                const value = hooks[key];
                if (!value) {
                    continue;
                }
                const hookList = isArray(value) ? value : [value];
                for (const hookSpecRaw of hookList) {
                    const callback = (isCallback(hookSpecRaw) ? hookSpecRaw : hookSpecRaw.callback);
                    const { provides, before, after } = isCallbackDescriptor(hookSpecRaw)
                        ? hookSpecRaw
                        : {};
                    if (!allFunctionalities[key]) {
                        allFunctionalities[key] = [];
                    }
                    // We need to give each functionality a unique ID
                    const id = String(uid++);
                    allFunctionalities[key].push({
                        id,
                        plugin,
                        callback,
                        provides: [...(provides || []), id, plugin.name],
                        before: before || [],
                        after: after || [],
                    });
                }
            }
        }
    }
    // Sort the collections according to provides, before and after.
    for (const functionalityName in allFunctionalities) {
        const functionalities = allFunctionalities[functionalityName];
        if (!functionalities) {
            continue;
        }
        const final = (0, sort_js_1.sortWithBeforeAfterProvides)(functionalities, "id");
        // Finally we can register the functionalities
        for (const functionality of final) {
            applyCallback(functionalityName, functionality.callback, functionality.plugin);
        }
    }
}
//# sourceMappingURL=functionality.js.map