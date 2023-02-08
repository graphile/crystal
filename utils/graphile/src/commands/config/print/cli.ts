import chalk from "chalk";
import { resolvePresets } from "graphile-config";
import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import { getTerminalWidth } from "graphile-config/cli";

import { loadConfig } from "graphile-config/load";
import { inspect, InspectOptions } from "util";
import { stripAnsi } from "../../../stripAnsi";

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
    });
  // TODO: add options for debugging things like: where did this option come
  // from, why are the plugins in this order, etc.
}

export async function run(args: ArgsFromOptions<typeof options>) {
  const userPreset = await loadConfig(args.config);
  if (!userPreset) {
    console.error("Failed to load config, please check the file exists");
    process.exit(1);
  }
  const resolvedPreset = resolvePresets([userPreset]);
  console.log(printPlugins(resolvedPreset.plugins));
  for (const key of Object.keys(resolvedPreset)) {
    if (key === "plugins" || key === "extends" || key === "disablePlugins") {
      continue;
    }
    console.log();
    console.log(chalk.whiteBright.bold(key) + ":");
    const value = resolvedPreset[key];
    if (Array.isArray(value)) {
      console.log(inspect(value, inspectOpts));
    } else if (typeof value === "object" && value !== null) {
      const keys = Object.keys(value);
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

function printPlugins(plugins: GraphileConfig.Plugin[] | undefined): string {
  if (!plugins || plugins.length === 0) {
    return "";
  }
  return `${chalk.whiteBright.bold("plugins")}:
${plugins.map((p) => printPlugin(p)).join("\n")}`;
}

function printPlugin(plugin: GraphileConfig.Plugin): string {
  const left = `  ${chalk.greenBright.bold(plugin.name)}${chalk.whiteBright(
    "@",
  )}${chalk.gray(plugin.version)}${plugin.description ? ": " : ""}`;
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
