import chalk from "chalk";
import { inspect } from "util";

import { isDev } from "./dev";
import type { CrystalObject } from "./interfaces";
import { ExecutablePlan } from "./plan";
import { isCrystalObject } from "./resolvers";
import { isDeferred, isPromise, ROOT_VALUE_OBJECT } from "./utils";

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
    | symbol
    | symbol[]
    | Record<symbol, any>
    | Map<any, any>
    | CrystalObject<any>,
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
  if (!symbol.description) {
    return chalk.green("Symbol()");
  }
  const nStr = symbol.description?.replace(/[^0-9]/g, "") || "";
  const n = parseInt(nStr, 10) || 0;
  if (n > 0) {
    const color = COLORS[n % COLORS.length];
    return color(symbol.description);
  } else {
    return chalk.cyan(`$$${symbol.description}`);
  }
}

export function crystalPrint(
  symbol:
    | symbol
    | symbol[]
    | Record<symbol, any>
    | Map<any, any>
    | CrystalObject<any>,
): string {
  return _crystalPrint(symbol, new Set());
}

export function crystalPrintPathIdentity(pathIdentity: string): string {
  let short = pathIdentity.replace(/>[A-Za-z0-9]+\./g, ">").slice(1);
  if (!short) return chalk.bold.yellow("~");
  if (isDev) {
    const segments = short.split(">");
    const shortenedSegments = segments.map((s, i) => {
      if (i >= segments.length - 1) {
        // Don't compress last one
        return s;
      }
      if (s.length < 5) {
        // Don't compress short ones
        return s;
      }
      return `${s[0]}…${s[s.length - 1]}`;
    });

    short = shortenedSegments.join(">");
  }
  return chalk.bold.yellow(short.replace(/\./g, chalk.gray(".")));
}
