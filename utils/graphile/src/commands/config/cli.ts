import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import * as optionsCmd from "./options/cli.js";

export function options(yargs: Argv) {
  return yargs
    .command(
      "options",
      "Output the options your config may contain",
      optionsCmd.options,
      optionsCmd.run,
    )
    .demandCommand();
}

export function run(_args: ArgsFromOptions<typeof options>) {
  // This should never happen, yargs handles it for us
  throw new Error("Subcommand required");
}
