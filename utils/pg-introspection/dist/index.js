"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePermissions = exports.expandRoles = exports.entityPermissions = exports.aclContainsRole = exports.parseSmartComment = exports.reservedWords = exports.makeIntrospectionQuery = void 0;
exports.parseIntrospectionResults = parseIntrospectionResults;
const tslib_1 = require("tslib");
var introspection_js_1 = require("./introspection.js");
Object.defineProperty(exports, "makeIntrospectionQuery", { enumerable: true, get: function () { return introspection_js_1.makeIntrospectionQuery; } });
const acl_js_1 = require("./acl.js");
Object.defineProperty(exports, "aclContainsRole", { enumerable: true, get: function () { return acl_js_1.aclContainsRole; } });
Object.defineProperty(exports, "entityPermissions", { enumerable: true, get: function () { return acl_js_1.entityPermissions; } });
Object.defineProperty(exports, "expandRoles", { enumerable: true, get: function () { return acl_js_1.expandRoles; } });
Object.defineProperty(exports, "resolvePermissions", { enumerable: true, get: function () { return acl_js_1.resolvePermissions; } });
const augmentIntrospection_js_1 = require("./augmentIntrospection.js");
var reservedWords_js_1 = require("./reservedWords.js");
Object.defineProperty(exports, "reservedWords", { enumerable: true, get: function () { return tslib_1.__importDefault(reservedWords_js_1).default; } });
var smartComments_js_1 = require("./smartComments.js");
Object.defineProperty(exports, "parseSmartComment", { enumerable: true, get: function () { return smartComments_js_1.parseSmartComment; } });
function parseIntrospectionResults(introspectionResults, includeExtensionResources = false) {
    return (0, augmentIntrospection_js_1.augmentIntrospection)(introspectionResults, includeExtensionResources);
}
//# sourceMappingURL=index.js.map