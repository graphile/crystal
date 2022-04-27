import type { Argv } from "yargs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export { Argv };

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
  const argv = await options(yargs(hideBin(process.argv))).argv;
  await run(argv);
}
