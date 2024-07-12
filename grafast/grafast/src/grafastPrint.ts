import chalk from "chalk";

import type { Bucket } from "./bucket.js";
import { bucketToString } from "./engine/executeBucket.js";
import { OutputPlan } from "./engine/OutputPlan.js";
import { inspect } from "./inspect.js";
import { ExecutableStep } from "./step.js";
import { stripAnsi } from "./stripAnsi.js";
import {
  isDeferred,
  isPromise,
  ROOT_VALUE_OBJECT,
  sharedNull,
} from "./utils.js";

/*
 * This file contains utilities used with the `debug` module primarily (but
 * also used elsewhere) that are useful for outputting Grafast stuff in a
 * more helpful way - typically with more relevant detail and colours to help
 * you (me) digest things.
 */

const COLORS = [
  //chalk.black,
  chalk.yellow,
  chalk.magenta,
  //chalk.cyan,
  chalk.red,
  //chalk.white,
  //chalk.blackBright,
  chalk.greenBright,
  chalk.yellowBright,
  chalk.blueBright,
  chalk.magentaBright,
  chalk.cyanBright,
  chalk.redBright,
  chalk.blue,
  chalk.green,
  //chalk.whiteBright,
] as const;

const BG_COLORS = [
  // chalk.bgRgb(53, 0, 0),
  // chalk.bgRgb(0, 53, 0),
  // chalk.bgRgb(0, 0, 53),
  chalk.visible,
  chalk.underline,
] as const;

export function _grafastPrint(
  symbol: string | symbol | symbol[] | Record<symbol, any> | Map<any, any>,
  seen: Set<any>,
): string {
  if (isDeferred(symbol)) {
    return chalk.gray`<Deferred>`;
  }
  if (isPromise(symbol)) {
    return chalk.gray`<Promise>`;
  }
  if (symbol === ROOT_VALUE_OBJECT) {
    return chalk.gray`(blank)`;
  }
  if (symbol instanceof ExecutableStep) {
    return String(symbol);
  }
  if (Array.isArray(symbol)) {
    if (seen.has(symbol)) {
      return chalk.gray`(loop)`;
    }
    seen.add(symbol);
    return `[${symbol
      .map((value, i) =>
        BG_COLORS[i % BG_COLORS.length](_grafastPrint(value, new Set(seen))),
      )
      .join(", ")}]`;
  }
  if (symbol instanceof Map) {
    if (seen.has(symbol)) {
      return chalk.gray`(loop)`;
    }
    seen.add(symbol);
    const pairs: string[] = [];
    let i = 0;
    for (const [key, value] of symbol.entries()) {
      pairs.push(
        BG_COLORS[i % BG_COLORS.length](
          `${_grafastPrint(key, new Set(seen))}: ${_grafastPrint(
            value,
            new Set(seen),
          )}`,
        ),
      );
      i++;
    }
    return `Map{${pairs.join(", ")}}`;
  }
  if (isBucket(symbol)) {
    return recursivePrintBucket(symbol);
  }
  if (typeof symbol === "object" && symbol) {
    if (symbol instanceof Error) {
      return chalk.red(
        `ERROR<${
          stripAnsi(String(symbol.message))
            .replace(/\s+/g, " ")
            .substring(0, 30) + "..."
        }>`,
      );
    }
    if (symbol instanceof OutputPlan) {
      return symbol.print();
    }
    if (
      ![null, Object.prototype, sharedNull].includes(
        Object.getPrototypeOf(symbol),
      )
    ) {
      return chalk.red(`OBJECT<${stripAnsi(String(symbol))}>`);
    }
    if (seen.has(symbol)) {
      return chalk.gray`(loop)`;
    }
    seen.add(symbol);
    return `{${[...Object.keys(symbol), ...Object.getOwnPropertySymbols(symbol)]
      .map((key, i) =>
        BG_COLORS[i % BG_COLORS.length](
          `${_grafastPrint(key, new Set(seen))}: ${_grafastPrint(
            (symbol as any)[key],
            new Set(seen),
          )}`,
        ),
      )
      .join(", ")}}`;
  }
  if (typeof symbol !== "symbol") {
    return inspect(symbol, { colors: true });
  }
  return grafastPrintSymbol(symbol);
}

function isBucket(thing: any): thing is Bucket {
  return (
    typeof thing === "object" &&
    thing !== null &&
    thing.toString === bucketToString
  );
}

function _grafastSymbolDescription(symbol: symbol): string {
  if (!symbol.description) {
    return chalk.green("Symbol()");
  }
  const nStr = symbol.description?.replace(/[^0-9]/g, "") || "";
  const n = parseInt(nStr, 10) || 0;
  if (n > 0) {
    return grafastColor(symbol.description, n);
  } else {
    return chalk.cyan(`$$${symbol.description}`);
  }
}

function indent(level: number, string: string) {
  return " ".repeat(level) + string.replace(/\n/g, `\n${" ".repeat(level)}`);
}

export function recursivePrintBucket(bucket: Bucket, indentLevel = 0): string {
  return indent(
    indentLevel,
    `Bucket for ${bucket.layerPlan} (size = ${bucket.size}):
  Store:
${indent(4, printStore(bucket))}
  Children:
${Object.entries(bucket.children)
  .map(([_id, { bucket }]) => indent(4, recursivePrintBucket(bucket)))
  .join("\n")}`,
  );
}

const PRINT_STORE_INSPECT_OPTIONS = {
  colors: true,
  depth: 0,
  showHidden: false,
  maxArrayLength: 5,
  maxStringLength: 50,
};

function indentIfMultiline(string: string): string {
  if (string.includes("\n")) {
    return indent(4, "\n" + string);
  } else {
    return string;
  }
}

export function printStore(bucket: Bucket): string {
  const output: string[] = [];
  for (const [key, val] of bucket.store) {
    const printKey = String(key).padStart(3, " ");
    if (bucket.layerPlan.copyStepIds.includes(key)) {
      output.push(`${printKey} (copy)`);
    } else if (val.isBatch) {
      const step = bucket.layerPlan.operationPlan.stepTracker.getStepById(
        key,
        true,
      );
      output.push(
        `${printKey} (BATCH): ${step ?? "-"}\n${indent(
          2,
          val.entries
            .map(
              (e, i) =>
                `${String(i).padStart(3, " ")}: flags=${String(
                  val._flagsAt(i),
                ).padStart(2, " ")} value=${indentIfMultiline(
                  inspect(val.at(i), PRINT_STORE_INSPECT_OPTIONS),
                )}`,
            )
            .join("\n"),
        )}`,
      );
    } else {
      const step = bucket.layerPlan.operationPlan.stepTracker.getStepById(
        key,
        true,
      );
      output.push(
        `${printKey} (UNARY/${String(val._entryFlags).padStart(2, " ")}) ${
          step ?? "-"
        }\n${indent(4, inspect(val.value, PRINT_STORE_INSPECT_OPTIONS))}`,
      );
    }
  }
  return output.join("\n") || "EMPTY";
}

export function grafastColor(text: string, n: number): string {
  const color = COLORS[Math.abs(n) % COLORS.length];
  return color(text);
}

const symbolsByAlias = new Map<string, symbol[]>();
let symbolClear: NodeJS.Timer | null = null;

/**
 * Returns a text description for a symbol that helps differentiate similar
 * symbols by keeping track of the symbols/descriptions it has seen and adding
 * numeric identifiers to the output. Only tracks symbols over a short period
 * so counts will reset very frequently.
 */
function grafastPrintSymbol(symbol: symbol): string {
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
  return `${description}${chalk.gray(`:${idx + 1}`)}`;
}

/**
 * Prints something grafast-style (i.e. concise, coloured, with helpful detail)
 */
export function grafastPrint(
  symbol: symbol | symbol[] | Record<symbol, any> | Map<any, any> | any,
): string {
  return _grafastPrint(symbol, new Set());
}

/**
 * An ANSI-aware pad function; strips ANSI sequences from the string, figures
 * out how much it needs to pad it by, and then pads the original string by
 * that amount.
 */
export function ansiPad(
  ansiString: string,
  targetLength: number,
  fill: string,
  position: "start" | "end",
): string {
  const string = stripAnsi(ansiString);
  const fillLength = targetLength - string.length;
  if (fillLength >= 0) {
    const fillString = fill.repeat(fillLength);
    if (position === "start") {
      return fillString + ansiString;
    } else {
      return ansiString + fillString;
    }
  } else {
    return ansiString;
  }
}
