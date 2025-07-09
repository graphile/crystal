"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePresets = exports.resolvePreset = exports.isResolvedPreset = exports.Middleware = exports.AsyncHooks = exports.applyHooks = exports.orderedApply = void 0;
exports.sortedPlugins = sortedPlugins;
require("./interfaces.js");
const sort_js_1 = require("./sort.js");
var functionality_js_1 = require("./functionality.js");
Object.defineProperty(exports, "orderedApply", { enumerable: true, get: function () { return functionality_js_1.orderedApply; } });
var hooks_js_1 = require("./hooks.js");
Object.defineProperty(exports, "applyHooks", { enumerable: true, get: function () { return hooks_js_1.applyHooks; } });
Object.defineProperty(exports, "AsyncHooks", { enumerable: true, get: function () { return hooks_js_1.AsyncHooks; } });
var middleware_js_1 = require("./middleware.js");
Object.defineProperty(exports, "Middleware", { enumerable: true, get: function () { return middleware_js_1.Middleware; } });
var resolvePresets_js_1 = require("./resolvePresets.js");
Object.defineProperty(exports, "isResolvedPreset", { enumerable: true, get: function () { return resolvePresets_js_1.isResolvedPreset; } });
Object.defineProperty(exports, "resolvePreset", { enumerable: true, get: function () { return resolvePresets_js_1.resolvePreset; } });
Object.defineProperty(exports, "resolvePresets", { enumerable: true, get: function () { return resolvePresets_js_1.resolvePresets; } });
function sortedPlugins(plugins) {
    if (plugins) {
        return (0, sort_js_1.sortWithBeforeAfterProvides)(plugins, "name");
    }
    else {
        return [];
    }
}
//# sourceMappingURL=index.js.map