import type { ArgsFromOptions, Argv } from "graphile-config/cli";
export declare function options(yargs: Argv): Argv<{
    config: string | undefined;
}>;
export declare function run(args: ArgsFromOptions<typeof options>): void;
//# sourceMappingURL=cli.d.ts.map