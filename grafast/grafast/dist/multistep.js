"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multistep = multistep;
exports.isMultistep = isMultistep;
const step_js_1 = require("./step.js");
const constant_js_1 = require("./steps/constant.js");
const list_js_1 = require("./steps/list.js");
const object_js_1 = require("./steps/object.js");
const utils_js_1 = require("./utils.js");
function multistep(spec, stable) {
    if (spec == null) {
        return (0, constant_js_1.constant)(spec);
    }
    else if (spec instanceof step_js_1.Step) {
        return spec;
    }
    else if ((0, utils_js_1.isTuple)(spec)) {
        const config = stable === true
            ? { identifier: `multistep` }
            : typeof stable === "string"
                ? { identifier: stable }
                : stable;
        const $step = (0, list_js_1.list)(spec, config);
        return $step;
    }
    else {
        const config = stable === true
            ? { identifier: `multistep` }
            : typeof stable === "string"
                ? { identifier: stable }
                : stable;
        const $step = (0, object_js_1.object)(spec, config);
        return $step;
    }
}
function isMultistep(spec) {
    if (spec == null) {
        return true;
    }
    else if (spec instanceof step_js_1.Step) {
        return true;
    }
    else if ((0, utils_js_1.isTuple)(spec) && spec.every((s) => s instanceof step_js_1.Step)) {
        return true;
    }
    else if (typeof spec === "object" &&
        Object.values(spec).every((s) => s instanceof step_js_1.Step)) {
        return true;
    }
    else {
        return false;
    }
}
//# sourceMappingURL=multistep.js.map