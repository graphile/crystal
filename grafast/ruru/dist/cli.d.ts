import type { ArgsFromOptions, Argv } from "graphile-config/cli";
export declare function options(yargs: Argv): Argv<{
    endpoint: string | undefined;
} & {
    port: number | undefined;
} & {
    proxy: boolean | undefined;
} & {
    subscriptions: boolean | undefined;
} & {
    "subscription-endpoint": string | undefined;
} & {
    config: string | undefined;
}>;
export declare function run(args: ArgsFromOptions<typeof options>): Promise<void>;
//# sourceMappingURL=cli.d.ts.map