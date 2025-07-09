"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = exports.test = void 0;
const tslib_1 = require("tslib");
const json5_1 = tslib_1.__importDefault(require("json5"));
function isFormattedObject(val) {
    return ((typeof val === "object" &&
        val &&
        Object.keys(val).length === 1 &&
        "__" in val) ||
        false);
}
function printFormattedObject(val) {
    return typeof val.__ === "string"
        ? String(val.__)
        : typeof val.__ === "undefined"
            ? "undefined"
            : json5_1.default.stringify(val.__, {
                space: 2,
                quote: '"',
            }).trim();
    // prettier
    //     .format(JSON5.stringify(val.__), {
    //       printWidth: 120,
    //       parser: "json5",
    //     })
    //     .trim();
}
exports.test = isFormattedObject;
exports.serialize = printFormattedObject;
//# sourceMappingURL=index.js.map