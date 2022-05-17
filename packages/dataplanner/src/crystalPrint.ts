import chalk from "chalk";
import { inspect } from "util";

import { isDev } from "./dev.js";
import type { CrystalObject } from "./interfaces.js";
import { ExecutablePlan } from "./plan.js";
import { PlanResults } from "./planResults.js";
import { isCrystalObject } from "./resolvers.js";
import { stripAnsi } from "./stripAnsi.js";
import { isDeferred, isPromise, ROOT_VALUE_OBJECT, sharedNull } from "./utils.js";

/*
 * This file contains utilities used with the `debug` module primarily (but
 * also used elsewhere) that are useful for outputting DataPlanner stuff in a
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

export function _crystalPrint(
  symbol:
    | string
    | symbol
    | symbol[]
    | Record<symbol, any>
    | Map<any, any>
    | CrystalObject
    | PlanResults,
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
  if (isCrystalObject(symbol)) {
    return String(symbol);
  }
  if (symbol instanceof ExecutablePlan) {
    return String(symbol);
  }
  if (symbol instanceof PlanResults) {
    return String(symbol);
  }
  if (Array.isArray(symbol)) {
    if (seen.has(symbol)) {
      return chalk.gray`(loop)`;
    }
    seen.add(symbol);
    return `[${symbol
      .map((value, i) =>
        BG_COLORS[i % BG_COLORS.length](_crystalPrint(value, new Set(seen))),
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
          `${_crystalPrint(key, new Set(seen))}: ${_crystalPrint(
            value,
            new Set(seen),
          )}`,
        ),
      );
      i++;
    }
    return `Map{${pairs.join(", ")}}`;
  }
  if (typeof symbol === "object" && symbol) {
    if (symbol instanceof Error) {
      return chalk.red(
        `ERROR<${
          stripAnsi(String(symbol.message)).replace(/\s+/g, " ").substr(0, 30) +
          "..."
        }>`,
      );
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
          `${_crystalPrint(key, new Set(seen))}: ${_crystalPrint(
            symbol[key],
            new Set(seen),
          )}`,
        ),
      )
      .join(", ")}}`;
  }
  if (typeof symbol !== "symbol") {
    return inspect(symbol, { colors: true });
  }
  return crystalPrintSymbol(symbol);
}

function _crystalSymbolDescription(symbol: symbol): string {
  if (!symbol.description) {
    return chalk.green("Symbol()");
  }
  const nStr = symbol.description?.replace(/[^0-9]/g, "") || "";
  const n = parseInt(nStr, 10) || 0;
  if (n > 0) {
    return crystalColor(symbol.description, n);
  } else {
    return chalk.cyan(`$$${symbol.description}`);
  }
}

export function crystalColor(text: string, n: number): string {
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
function crystalPrintSymbol(symbol: symbol): string {
  const description = _crystalSymbolDescription(symbol);
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
 * Prints something crystal-style (i.e. concise, coloured, with helpful detail)
 */
export function crystalPrint(
  symbol:
    | symbol
    | symbol[]
    | Record<symbol, any>
    | Map<any, any>
    | CrystalObject
    | PlanResults
    | any,
): string {
  return _crystalPrint(symbol, new Set());
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

/**
 * Prints a _lossy_ representation of a path identity. Path identities can get
 * really long really fast, which makes working with them a challenge; this
 * utility can help shrink them down so that they're useful for humans, though
 * they can be potentially misleading due to their deliberate data loss.
 */
export function crystalPrintPathIdentity(
  pathIdentity: string,
  l = 1,
  r = 1,
): string {
  let short = pathIdentity.replace(/>[A-Za-z0-9]+\./g, ">").slice(1);
  if (!short) return pathIdentity || "¤";
  if (isDev) {
    const segments = short.split(">");
    const shortenedSegments = segments.map((s, i) => {
      if (i >= segments.length - 1) {
        // Don't compress last one
        return s;
      }
      if (s.length < 3 + l + r) {
        // Don't compress short ones
        return s;
      }
      return `${s.slice(0, l)}…${s.slice(s.length - r)}`;
    });

    short = shortenedSegments.join(">");
  }
  return short.replace(/\./g, chalk.gray("."));
}
