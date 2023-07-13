import type { ArgsFromOptions, Argv } from "graphile-config/cli";

import { main } from "./main.js";

export function options(yargs: Argv) {
  return yargs
    .positional("entityType", { type: "string" })
    .positional("entityIdentifier", { type: "string" })
    .example(
      "$0 pgClass public.users",
      "Output the behavior of the public.users entity",
    )
    .option("config", {
      alias: "C",
      type: "string",
      description: "The path to the config file",
      normalize: true,
    });
}
export async function run(args: ArgsFromOptions<typeof options>) {
  const text = await main({
    config: args.config,
    entityType: args.entityType,
    entityIdentifier: args.entityIdentifier,
  });
  console.log(text);
}
