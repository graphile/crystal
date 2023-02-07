import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import { main } from "./main";
export function options(yargs: Argv) {
  return yargs
    .example(
      "$0 -C graphile.config.ts",
      "Read and parse graphile.config.ts, and determine the options available for presets therein",
    )
    .option("config", {
      alias: "C",
      type: "string",
      description: "The path to the config file",
      normalize: true,
    });
}
export function run(args: ArgsFromOptions<typeof options>) {
  const text = main({ filename: args.config });
  console.log(text);
}
