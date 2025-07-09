"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPlanResolver = void 0;
const access_js_1 = require("../../steps/access.js");
const defaultPlanResolver = ($step, _, { fieldName }) => {
    return typeof $step.get === "function"
        ? $step.get(fieldName)
        : (0, access_js_1.access)($step, [fieldName]);
};
exports.defaultPlanResolver = defaultPlanResolver;
//# sourceMappingURL=defaultPlanResolver.js.map