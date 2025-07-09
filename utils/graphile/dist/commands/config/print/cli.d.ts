import type { ArgsFromOptions, Argv } from "graphile-config/cli";
export declare function options(yargs: Argv): Argv<{
    config: string | undefined;
} & {
    full: boolean | undefined;
} & {
    "debug-order": boolean | undefined;
}>;
type Opts = ArgsFromOptions<typeof options>;
export declare function run(args: Opts): Promise<void>;
export {};
//# sourceMappingURL=cli.d.ts.map