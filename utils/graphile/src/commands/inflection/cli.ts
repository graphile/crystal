import type { ArgsFromOptions, Argv } from "graphile-config/cli";

import * as listCmd from "./list/cli.js";

export function options(yargs: Argv) {
  return yargs
    .command(
      "list",
      "List the available inflectors",
      listCmd.options,
      listCmd.run,
    )
    .demandCommand();
}

export function run(_args: ArgsFromOptions<typeof options>) {
  // This should never happen, yargs handles it for us
  throw new Error("Subcommand required");
}
