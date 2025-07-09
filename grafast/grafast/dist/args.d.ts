import type { ExecutionArgs } from "graphql";
import type { GrafastExecutionArgs, PromiseOrDirect } from "./interfaces.js";
/** @deprecated Pass `resolvedPreset` and `requestContext` via args directly */
export declare function hookArgs(rawArgs: ExecutionArgs, resolvedPreset: GraphileConfig.ResolvedPreset, ctx: Partial<Grafast.RequestContext>): PromiseOrDirect<Grafast.ExecutionArgs>;
export declare function hookArgs(rawArgs: GrafastExecutionArgs): PromiseOrDirect<Grafast.ExecutionArgs>;
//# sourceMappingURL=args.d.ts.map