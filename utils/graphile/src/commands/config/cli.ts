import type { ArgsFromOptions, Argv } from "graphile-config/cli";

import * as optionsCmd from "./options/cli.js";
import * as printCmd from "./print/cli.js";

export function options(yargs: Argv) {
  return yargs
    .command(
      optionsCmd.command,
      optionsCmd.description,
      optionsCmd.options,
      optionsCmd.run,
    )
    .command(
      "print",
      "Prints your resolved configuration",
      printCmd.options,
      printCmd.run,
    )
    .demandCommand();
}

export function run(_args: ArgsFromOptions<typeof options>) {
  // This should never happen, yargs handles it for us
  throw new Error("Subcommand required");
}
