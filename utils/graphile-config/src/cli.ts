import type { ArgumentsCamelCase, Argv } from "yargs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export type { Argv };

export type OptionsFunction<TArgs> = (yargs: Argv) => Argv<TArgs>;

export type ArgsFromOptions<TOptionsFunction extends OptionsFunction<any>> =
  TOptionsFunction extends OptionsFunction<infer U> ? Args<U> : never;

export type Args<TArgs> = ArgumentsCamelCase<TArgs>;

export async function runCli<TArgs>(
  options: OptionsFunction<TArgs>,
  run: (args: Args<TArgs>) => Promise<void>,
) {
  const base = yargs(hideBin(process.argv));
  const argv = await options(base)
    .strict()
    .showHelpOnFail(false, "Specify --help for available options")
    .epilogue(
      `\
Graphile's MIT-licensed Open Source Software is made possible thanks to support from our sponsors. To find out more about sponsorship, please visit:

  💖 https://graphile.org/sponsor

Thank you for using our software.`,
    )
    .wrap(base.terminalWidth()).argv;
  await run(argv);
}

export function getTerminalWidth() {
  return yargs().terminalWidth();
}
