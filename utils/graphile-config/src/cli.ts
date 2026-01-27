import type { Argv } from "yargs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export type { Argv };

export type OptionsFunction<TArgs> = (yargs: Argv) => Argv<TArgs>;

export type ArgsFromOptions<TOptionsFunction extends OptionsFunction<any>> =
  TOptionsFunction extends OptionsFunction<infer U> ? Args<U> : never;

export type Args<TArgs> = {
  [key in keyof yargs.Arguments<TArgs> as
    | key
    | yargs.CamelCaseKey<key>]: yargs.Arguments<TArgs>[key];
};

export async function runCli<TArgs>(
  options: OptionsFunction<TArgs>,
  run: (args: Args<TArgs>) => Promise<void>,
) {
  const argv = await options(yargs(hideBin(process.argv)))
    .strict()
    .showHelpOnFail(false, "Specify --help for available options")
    .epilogue(
      `\
Graphile's MIT-licensed Open Source Software is made possible thanks to support from our sponsors. To find out more about sponsorship, please visit:

  💖 https://graphile.org/sponsor

Thank you for using our software.`,
    )
    .wrap(yargs.terminalWidth()).argv;
  await run(argv);
}

export function getTerminalWidth() {
  return yargs.terminalWidth();
}
