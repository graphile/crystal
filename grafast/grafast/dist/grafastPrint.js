"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._grafastPrint = _grafastPrint;
exports.recursivePrintBucket = recursivePrintBucket;
exports.printStore = printStore;
exports.grafastColor = grafastColor;
exports.grafastPrint = grafastPrint;
exports.ansiPad = ansiPad;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const executeBucket_js_1 = require("./engine/executeBucket.js");
const OutputPlan_js_1 = require("./engine/OutputPlan.js");
const inspect_js_1 = require("./inspect.js");
const step_js_1 = require("./step.js");
const stripAnsi_js_1 = require("./stripAnsi.js");
const utils_js_1 = require("./utils.js");
/*
 * This file contains utilities used with the `debug` module primarily (but
 * also used elsewhere) that are useful for outputting Grafast stuff in a
 * more helpful way - typically with more relevant detail and colours to help
 * you (me) digest things.
 */
const COLORS = [
    //chalk.black,
    chalk_1.default.yellow,
    chalk_1.default.magenta,
    //chalk.cyan,
    chalk_1.default.red,
    //chalk.white,
    //chalk.blackBright,
    chalk_1.default.greenBright,
    chalk_1.default.yellowBright,
    chalk_1.default.blueBright,
    chalk_1.default.magentaBright,
    chalk_1.default.cyanBright,
    chalk_1.default.redBright,
    chalk_1.default.blue,
    chalk_1.default.green,
    //chalk.whiteBright,
];
const BG_COLORS = [
    // chalk.bgRgb(53, 0, 0),
    // chalk.bgRgb(0, 53, 0),
    // chalk.bgRgb(0, 0, 53),
    chalk_1.default.visible,
    chalk_1.default.underline,
];
function _grafastPrint(symbol, seen) {
    if ((0, utils_js_1.isDeferred)(symbol)) {
        return chalk_1.default.gray `<Deferred>`;
    }
    if ((0, utils_js_1.isPromise)(symbol)) {
        return chalk_1.default.gray `<Promise>`;
    }
    if (symbol === utils_js_1.ROOT_VALUE_OBJECT) {
        return chalk_1.default.gray `(blank)`;
    }
    if (symbol instanceof step_js_1.Step) {
        return String(symbol);
    }
    if (Array.isArray(symbol)) {
        if (seen.has(symbol)) {
            return chalk_1.default.gray `(loop)`;
        }
        seen.add(symbol);
        return `[${symbol
            .map((value, i) => BG_COLORS[i % BG_COLORS.length](_grafastPrint(value, new Set(seen))))
            .join(", ")}]`;
    }
    if (symbol instanceof Map) {
        if (seen.has(symbol)) {
            return chalk_1.default.gray `(loop)`;
        }
        seen.add(symbol);
        const pairs = [];
        let i = 0;
        for (const [key, value] of symbol.entries()) {
            pairs.push(BG_COLORS[i % BG_COLORS.length](`${_grafastPrint(key, new Set(seen))}: ${_grafastPrint(value, new Set(seen))}`));
            i++;
        }
        return `Map{${pairs.join(", ")}}`;
    }
    if (isBucket(symbol)) {
        return recursivePrintBucket(symbol);
    }
    if (typeof symbol === "object" && symbol) {
        if (symbol instanceof Error) {
            return chalk_1.default.red(`ERROR<${(0, stripAnsi_js_1.stripAnsi)(String(symbol.message))
                .replace(/\s+/g, " ")
                .substring(0, 30) + "..."}>`);
        }
        if (symbol instanceof OutputPlan_js_1.OutputPlan) {
            return symbol.print();
        }
        if (![null, Object.prototype, utils_js_1.sharedNull].includes(Object.getPrototypeOf(symbol))) {
            return chalk_1.default.red(`OBJECT<${(0, stripAnsi_js_1.stripAnsi)(String(symbol))}>`);
        }
        if (seen.has(symbol)) {
            return chalk_1.default.gray `(loop)`;
        }
        seen.add(symbol);
        return `{${[...Object.keys(symbol), ...Object.getOwnPropertySymbols(symbol)]
            .map((key, i) => BG_COLORS[i % BG_COLORS.length](`${_grafastPrint(key, new Set(seen))}: ${_grafastPrint(symbol[key], new Set(seen))}`))
            .join(", ")}}`;
    }
    if (typeof symbol !== "symbol") {
        return (0, inspect_js_1.inspect)(symbol, { colors: true });
    }
    return grafastPrintSymbol(symbol);
}
function isBucket(thing) {
    return (typeof thing === "object" &&
        thing !== null &&
        thing.toString === executeBucket_js_1.bucketToString);
}
function _grafastSymbolDescription(symbol) {
    if (!symbol.description) {
        return chalk_1.default.green("Symbol()");
    }
    const nStr = symbol.description?.replace(/[^0-9]/g, "") || "";
    const n = parseInt(nStr, 10) || 0;
    if (n > 0) {
        return grafastColor(symbol.description, n);
    }
    else {
        return chalk_1.default.cyan(`$$${symbol.description}`);
    }
}
function indent(level, string) {
    return " ".repeat(level) + string.replace(/\n/g, `\n${" ".repeat(level)}`);
}
function recursivePrintBucket(bucket, indentLevel = 0) {
    return indent(indentLevel, `Bucket for ${bucket.layerPlan} (size = ${bucket.size}):
  Store:
${indent(4, printStore(bucket))}
  Children:
${Object.entries(bucket.children)
        .map(([_id, { bucket }]) => indent(4, recursivePrintBucket(bucket)))
        .join("\n")}`);
}
const PRINT_STORE_INSPECT_OPTIONS = {
    colors: true,
    depth: 0,
    showHidden: false,
    maxArrayLength: 5,
    maxStringLength: 50,
};
function indentIfMultiline(string) {
    if (string.includes("\n")) {
        return indent(4, "\n" + string);
    }
    else {
        return string;
    }
}
function printStore(bucket) {
    const output = [];
    for (const [key, val] of bucket.store) {
        const printKey = String(key).padStart(3, " ");
        if (bucket.layerPlan.copyStepIds.includes(key)) {
            output.push(`${printKey} (copy)`);
        }
        else if (val.isBatch) {
            const step = bucket.layerPlan.operationPlan.stepTracker.getStepById(key, true);
            output.push(`${printKey} (BATCH): ${step ?? "-"}\n${indent(2, val.entries
                .map((e, i) => `${String(i).padStart(3, " ")}: flags=${String(val._flagsAt(i)).padStart(2, " ")} value=${indentIfMultiline((0, inspect_js_1.inspect)(val.at(i), PRINT_STORE_INSPECT_OPTIONS))}`)
                .join("\n"))}`);
        }
        else {
            const step = bucket.layerPlan.operationPlan.stepTracker.getStepById(key, true);
            output.push(`${printKey} (UNARY/${String(val._entryFlags).padStart(2, " ")}) ${step ?? "-"}\n${indent(4, (0, inspect_js_1.inspect)(val.value, PRINT_STORE_INSPECT_OPTIONS))}`);
        }
    }
    return output.join("\n") || "EMPTY";
}
function grafastColor(text, n) {
    const color = COLORS[Math.abs(n) % COLORS.length];
    return color(text);
}
const symbolsByAlias = new Map();
let symbolClear = null;
/**
 * Returns a text description for a symbol that helps differentiate similar
 * symbols by keeping track of the symbols/descriptions it has seen and adding
 * numeric identifiers to the output. Only tracks symbols over a short period
 * so counts will reset very frequently.
 */
function grafastPrintSymbol(symbol) {
    const description = _grafastSymbolDescription(symbol);
    if (!symbolClear) {
        // Only cache symbols for a few milliseconds, we don't want a memory leak!
        symbolClear = setTimeout(() => {
            symbolClear = null;
            symbolsByAlias.clear();
        }, 200);
    }
    const symbols = symbolsByAlias.get(description);
    if (!symbols) {
        symbolsByAlias.set(description, [symbol]);
        return description;
    }
    let idx = symbols.indexOf(symbol);
    if (idx === 0) {
        return description;
    }
    if (idx < 0) {
        idx = symbols.push(symbol) - 1;
    }
    return `${description}${chalk_1.default.gray(`:${idx + 1}`)}`;
}
/**
 * Prints something grafast-style (i.e. concise, coloured, with helpful detail)
 */
function grafastPrint(symbol) {
    return _grafastPrint(symbol, new Set());
}
/**
 * An ANSI-aware pad function; strips ANSI sequences from the string, figures
 * out how much it needs to pad it by, and then pads the original string by
 * that amount.
 */
function ansiPad(ansiString, targetLength, fill, position) {
    const string = (0, stripAnsi_js_1.stripAnsi)(ansiString);
    const fillLength = targetLength - string.length;
    if (fillLength >= 0) {
        const fillString = fill.repeat(fillLength);
        if (position === "start") {
            return fillString + ansiString;
        }
        else {
            return ansiString + fillString;
        }
    }
    else {
        return ansiString;
    }
}
//# sourceMappingURL=grafastPrint.js.map