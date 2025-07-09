import type { GraphQLSchema } from "grafast/graphql";
import type { BenchOperation, GrafastBenchSetupResult } from "./interfaces.js";
export { GrafastBenchConfig } from "./interfaces.js";
export declare function bench(schema: GraphQLSchema, operations: BenchOperation[], options: {
    setup?: () => Promise<GrafastBenchSetupResult> | GrafastBenchSetupResult;
    teardown?: (setupResult: GrafastBenchSetupResult) => void | Promise<void>;
    contextFactory?: (operation: BenchOperation, setupResult: GrafastBenchSetupResult) => object;
}): Promise<void>;
//# sourceMappingURL=index.d.ts.map