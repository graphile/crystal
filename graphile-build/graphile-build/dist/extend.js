"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indent = indent;
exports.default = extend;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const INDENT = "  ";
const $$hints = Symbol("hints");
/**
 * Indents every line in the given text by two spaces (and trims spaces from
 * spaces-only lines).
 */
function indent(text) {
    return (INDENT + text.replace(/\n/g, "\n" + INDENT).replace(/\n +(?=\n|$)/g, "\n"));
}
/**
 * Merges the properties from `extra` into `base` tracking the `hint` as to
 * when they were added. If a conflict is found (where `base` already has a key
 * in `extra`) an error will be thrown describing what happened.
 */
function extend(base, extra, hint) {
    const hints = base[$$hints] || {};
    const keysB = Object.keys(extra);
    const extraHints = extra[$$hints] || {};
    for (const key of keysB) {
        const newValue = extra[key];
        const hintB = extraHints[key] || hint;
        if (key in base && base[key] !== newValue) {
            const hintA = hints[key];
            const firstEntityDetails = !hintA
                ? "We don't have any information about the first entity."
                : `The first entity was:\n\n${indent(chalk_1.default.magenta(hintA))}`;
            const secondEntityDetails = !hintB
                ? "We don't have any information about the second entity."
                : `The second entity was:\n\n${indent(chalk_1.default.yellow(hintB))}`;
            throw new Error(`A naming conflict has occurred - two entities have tried to define the same key '${chalk_1.default.bold(key)}'.\n\n${indent(firstEntityDetails)}\n\n${indent(secondEntityDetails)}.\n  Details: ${chalk_1.default.blue.bold.underline `https://err.red/pnc`}`);
        }
        if (hintB) {
            hints[key] = hintB;
        }
    }
    return Object.assign(base, extra, {
        // $FlowFixMe: symbols
        [$$hints]: hints,
    });
}
//# sourceMappingURL=extend.js.map