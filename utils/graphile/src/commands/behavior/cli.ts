import type { ArgsFromOptions, Argv } from "graphile-config/cli";

import * as debugCmd from "./debug/cli.js";

export function options(yargs: Argv) {
  return yargs
    .command(
      "debug [entityType] [entityIdentifier]",
      "Detail the behavior for a particular entity",
      debugCmd.options,
      debugCmd.run,
    )
    .demandCommand();
}

export function run(_args: ArgsFromOptions<typeof options>) {
  // This should never happen, yargs handles it for us
  throw new Error("Subcommand required");
}
