import { inspect } from "util";
import debugFactory from "debug";
import chalk from "chalk";

const COLORS = [
  //"black",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "red",
  //"white",
  //"blackBright",
  "greenBright",
  "yellowBright",
  "blueBright",
  "magentaBright",
  "cyanBright",
  "redBright",
  //"whiteBright",
] as const;

debugFactory.formatters.c = (symbol: symbol | symbol[]): string => {
  if (Array.isArray(symbol)) {
    return chalk.green(`[${symbol.map(debugFactory.formatters.c).join(", ")}]`);
  }
  if (typeof symbol === "object" && symbol) {
    return `${chalk.green("{")}${[
      ...Object.keys(symbol),
      ...Object.getOwnPropertySymbols(symbol),
    ]
      .map(
        (key) =>
          `${debugFactory.formatters.c(key)}: ${inspect(symbol[key], {
            colors: true,
          })}`,
      )
      .join(", ")}${chalk.green("}")}`;
  }
  if (!symbol) {
    return inspect(symbol, { colors: true });
  }
  if (!symbol.description) {
    return chalk.green("Symbol()");
  }
  const nStr = symbol.description?.replace(/[^0-9]/g, "") || "";
  const n = parseInt(nStr, 10) || 0;
  const color = COLORS[n % COLORS.length];
  return chalk[color](symbol.description);
};

export { crystalEnforce } from "./enforceCrystal";
export { crystalWrapResolve, $$crystalWrapped } from "./resolvers";
