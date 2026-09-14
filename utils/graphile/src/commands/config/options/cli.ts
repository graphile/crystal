import type { ArgsFromOptions, Argv } from "graphile-config/cli";

export const command = "options [scope]";

export const description = "Output the options your config may contain";

export function options(yargs: Argv) {
  return yargs
    .example(
      "$0",
      "Read graphile.config.ts and determine the configuration options available",
    )
    .example(
      "$0 grafserv",
      "As above, but only output configuration for the grafserv scope",
    )
    .example("$0 -C myconf.ts", "Use a custom configuration path")
    .option("config", {
      alias: "C",
      type: "string",
      description: "The path to the config file",
      normalize: true,
    })
    .positional("scope", {
      description: "Only include the specified scope",
      demandOption: false,
      type: "string",
    });
}
export async function run(args: ArgsFromOptions<typeof options>) {
  const { main } = await import("./main.ts");
  const text = main({ filename: args.config, scope: args.scope });
  console.log(text);
}
