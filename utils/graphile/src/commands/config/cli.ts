import type { ArgsFromOptions, Argv } from "graphile-config/cli";

import * as optionsCmd from "./options/cli.ts";
import * as printCmd from "./print/cli.ts";

export function options(yargs: Argv) {
  return yargs
    .command(
      optionsCmd.command,
      optionsCmd.description,
      optionsCmd.options,
      optionsCmd.run,
    )
    .command(
      printCmd.command,
      printCmd.description,
      printCmd.options,
      printCmd.run,
    )
    .demandCommand();
}

export function run(_args: ArgsFromOptions<typeof options>) {
  // This should never happen, yargs handles it for us
  throw new Error("Subcommand required");
}
