import chalk from "chalk";
import { resolvePresets } from "graphile-config";
import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import { getTerminalWidth } from "graphile-config/cli";
import { loadConfig } from "graphile-config/load";
import type { InspectOptions } from "util";
import { inspect } from "util";

import { stripAnsi } from "../../../stripAnsi.js";

const inspectOpts: InspectOptions = {
  colors: true,
};

export function options(yargs: Argv) {
  return yargs
    .example("$0 -C graphile.config.ts", "Print your graphile.config.ts")
    .option("config", {
      alias: "C",
      type: "string",
      description: "The path to the config file",
      normalize: true,
    })
    .option("full", {
      alias: "f",
      type: "boolean",
      description: "Print full details, do not summarize",
      normalize: true,
    })
    .option("debug-order", {
      alias: "o",
      type: "boolean",
      description: "Include details to help debug the ordering of plugins",
      normalize: true,
    });
}

type Opts = ArgsFromOptions<typeof options>;

export async function run(args: Opts) {
  const opts: Opts = {
    ...args,
    // debug-order implies full currently
    full: args.full || args.debugOrder,
  };
  const userPreset = await loadConfig(opts.config);
  if (!userPreset) {
    console.error("Failed to load config, please check the file exists");
    process.exit(1);
  }
  const resolvedPreset = resolvePresets([userPreset]);
  console.log(printPlugins(opts, resolvedPreset.plugins));
  for (const key of Object.keys(
    resolvedPreset,
  ) as (keyof typeof resolvedPreset)[]) {
    if (key === "plugins" || key === "extends" || key === "disablePlugins") {
      continue;
    }
    console.log();
    console.log(chalk.whiteBright.bold(key) + ":");
    const value = resolvedPreset[key];
    if (Array.isArray(value)) {
      console.log(inspect(value, inspectOpts));
    } else if (typeof value === "object" && value !== null) {
      const keys = Object.keys(value).filter((key) => value[key] !== undefined);
      if (keys.length) {
        for (const key of keys) {
          const val = value[key];
          console.log(`  ${chalk.blueBright(key)}: ${printValue(val, 4)}`);
        }
      } else {
        console.log(`  ${chalk.gray("-empty-")}`);
      }
    } else {
      console.log(inspect(value, inspectOpts));
    }
  }
}

function printAPB(
  opts: Opts,
  strs: string[] | undefined,
  type: "after" | "provides" | "before",
  plugins: GraphileConfig.Plugin[],
  index: number,
): string {
  if (!strs || strs.length === 0) {
    return chalk.gray("-");
  } else {
    if (opts.debugOrder && (type === "after" || type === "before")) {
      const matches = strs.map((str) => {
        const hits: {
          plugin: GraphileConfig.Plugin;
          index: number;
          good: boolean;
        }[] = [];
        for (let i = 0, l = plugins.length; i < l; i++) {
          const plugin = plugins[i];
          if (plugin.provides?.includes(str) || plugin.name === str) {
            const good = type === "after" ? i < index : i > index;
            hits.push({
              plugin,
              index: i,
              good,
            });
          }
        }
        const allGood = hits.every((h) => h.good);
        return `${
          hits.length === 0
            ? chalk.strikethrough(str)
            : allGood
            ? chalk.green(str)
            : chalk.red(str)
        }${
          hits.length > 0 ? chalk.gray(`[${hits.map((h) => h.index + 1)}]`) : ""
        }`;
      });
      return chalk.cyan(matches.join("    "));
    } else {
      return chalk.cyan(strs.join("    "));
    }
  }
}

function printPlugins(
  opts: Opts,
  plugins: GraphileConfig.Plugin[] | undefined,
): string {
  if (!plugins || plugins.length === 0) {
    return "";
  }
  return `${chalk.whiteBright.bold("plugins")}:
${plugins.map((p, i) => printPlugin(opts, p, plugins, i)).join("\n")}`;
}

function printPlugin(
  opts: Opts,
  plugin: GraphileConfig.Plugin,
  plugins: GraphileConfig.Plugin[],
  index: number,
): string {
  const { full, debugOrder } = opts;
  const left = `  ${
    debugOrder ? chalk.whiteBright(`${index + 1}. `.padStart(5, " ")) : ""
  }${chalk.greenBright.bold(plugin.name)}${chalk.whiteBright("@")}${chalk.gray(
    plugin.version,
  )}${plugin.description || debugOrder ? (full ? ":" : ": ") : ""}`;
  const indent = debugOrder ? `       ` : `    `;
  if (full) {
    return `${left}${
      debugOrder
        ? `
${indent}${chalk.whiteBright("After:")}    ${printAPB(
            opts,
            plugin.after,
            "after",
            plugins,
            index,
          )}
${indent}${chalk.whiteBright("Provides:")} ${printAPB(
            opts,
            plugin.provides,
            "provides",
            plugins,
            index,
          )}
${indent}${chalk.whiteBright("Before:")}   ${printAPB(
            opts,
            plugin.before,
            "before",
            plugins,
            index,
          )}`
        : ""
    }${
      plugin.description
        ? `
${indent}${chalk.dim(plugin.description.replace(/\n/g, `\n${indent}`))}`
        : ``
    }
`;
  } else {
    const l = stripAnsi(left).length;
    const MAX = 50;
    const SCREEN_WIDTH = getTerminalWidth();
    const padL = Math.max(MAX, l) - l;
    const pad = " ".repeat(Math.max(0, padL));
    return `${left}${
      plugin.description
        ? `${pad}${chalk.dim(
            oneLine(
              plugin.description,
              SCREEN_WIDTH - pad.length - stripAnsi(left).length,
            ),
          )}`
        : ""
    }`;
  }
}

function oneLine(str: string, max = 60, suffix = "..."): string {
  const single = str.replace(/[\r\n\t]+/g, " ");
  if (single.length > max - suffix.length) {
    return single.slice(0, max - suffix.length) + suffix;
  } else {
    return single;
  }
}

function printValue(
  value: any[] | Record<string, any>,
  indentation: number,
): string {
  const indent = " ".repeat(indentation);
  return inspect(value, inspectOpts).replace(/\n/g, `\n${indent}`);
}
