import type { AsyncExecutionResult, ExecutionResult } from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";
import type { GrafastArgs } from "./interfaces.js";
/**
 * A replacement for GraphQL.js' `graphql` method that calls Grafast's
 * execute instead
 */
export declare function grafast(args: GrafastArgs): PromiseOrValue<ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>>;
/**
 * @deprecated Second and third parameters should be passed as part of args,
 * specifically `resolvedPreset` and `requestContext`.
 */
export declare function grafast(args: GrafastArgs, legacyResolvedPreset?: GraphileConfig.ResolvedPreset | undefined, legacyCtx?: Partial<Grafast.RequestContext> | undefined): PromiseOrValue<ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>>;
export declare function grafastSync(args: GrafastArgs, legacyResolvedPreset?: GraphileConfig.ResolvedPreset, legacyRequestContext?: Partial<Grafast.RequestContext>): ExecutionResult;
//# sourceMappingURL=grafastGraphql.d.ts.map