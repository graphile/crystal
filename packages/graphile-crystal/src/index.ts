import debugFactory from "debug";
import chalk from "chalk";

const COLORS = [
  //"black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  //"white",
  //"blackBright",
  "redBright",
  "greenBright",
  "yellowBright",
  "blueBright",
  "magentaBright",
  "cyanBright",
  //"whiteBright",
] as const;

debugFactory.formatters.c = (symbol: symbol) => {
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
