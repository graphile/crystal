import type { ArgsFromOptions, Argv } from "graphile-config/cli";

import { main } from "./main.ts";

export function options(yargs: Argv) {
  return yargs
    .example(
      "$0 -C graphile.config.ts",
      "Read and parse graphile.config.ts, and determine the inflectors available for plugins therein",
    )
    .option("config", {
      alias: "C",
      type: "string",
      description: "The path to the config file",
      normalize: true,
    })
    .option("quiet", {
      type: "boolean",
      description: "Turn off the preamble",
      normalize: true,
    });
}
export async function run(args: ArgsFromOptions<typeof options>) {
  const text = await main({ filename: args.config, quiet: args.quiet });
  console.log(text);
}
