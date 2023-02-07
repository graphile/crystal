import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import * as configCmd from "./commands/config/cli.js";
export function options(yargs: Argv) {
  return yargs
    .parserConfiguration({
      // Last option wins - do NOT make duplicates into arrays!
      "duplicate-arguments-array": false,
    })
    .example(
      "$0 config options -C graphile.config.ts",
      "Output the options available to be used in the given config file, based on the imports it contains.",
    )
    .command(
      "config",
      "Tools for helping with config",
      (yargs) => configCmd.options(yargs),
      configCmd.run,
    )
    .demandCommand();
}
export async function run(_args: ArgsFromOptions<typeof options>) {
  // Do nothing
}
