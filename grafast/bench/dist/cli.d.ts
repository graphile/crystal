import type { ArgsFromOptions, Argv } from "graphile-config/cli";
export declare function options(yargs: Argv): Argv<{
    schema: string | undefined;
} & {
    operations: string | undefined;
} & {
    config: string | undefined;
}>;
export declare function run(args: ArgsFromOptions<typeof options>): Promise<void>;
//# sourceMappingURL=cli.d.ts.map