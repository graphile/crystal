import type { Argv } from "yargs";
import yargs from "yargs";
export { Argv };
export type OptionsFunction<TArgs> = (yargs: Argv) => Argv<TArgs>;
export type ArgsFromOptions<TOptionsFunction extends OptionsFunction<any>> = TOptionsFunction extends OptionsFunction<infer U> ? Args<U> : never;
export type Args<TArgs> = {
    [key in keyof yargs.Arguments<TArgs> as key | yargs.CamelCaseKey<key>]: yargs.Arguments<TArgs>[key];
};
export declare function runCli<TArgs>(options: OptionsFunction<TArgs>, run: (args: Args<TArgs>) => Promise<void>): Promise<void>;
export declare function getTerminalWidth(): number;
//# sourceMappingURL=cli.d.ts.map