import type { PromiseOrDirect, TypedEventEmitter } from "grafast";
import type { GraphQLSchema } from "grafast/graphql";
import type { Middleware } from "graphile-config";
import type { DynamicOptions, ErrorResult, ExecutionConfig, GrafservConfig, HandlerResult, RequestDigest, Result, SchemaChangeEvent } from "../interfaces.js";
import { makeGraphiQLHandler } from "../middleware/graphiql.js";
import { makeGraphQLHandler } from "../middleware/graphql.js";
export declare class GrafservBase {
    private releaseHandlers;
    private releasing;
    dynamicOptions: DynamicOptions;
    getExecutionConfig(_ctx: Partial<Grafast.RequestContext>): PromiseOrDirect<ExecutionConfig>;
    resolvedPreset: GraphileConfig.ResolvedPreset;
    grafastMiddleware: Middleware<GraphileConfig.GrafastMiddleware> | null;
    protected schema: GraphQLSchema | PromiseLike<GraphQLSchema> | null;
    protected schemaError: PromiseLike<GraphQLSchema> | null;
    protected eventEmitter: TypedEventEmitter<{
        "schema:ready": GraphQLSchema;
        "schema:error": any;
        "dynamicOptions:ready": Record<string, never>;
        "dynamicOptions:error": any;
    }>;
    private initialized;
    graphqlHandler: ReturnType<typeof makeGraphQLHandler>;
    graphiqlHandler: ReturnType<typeof makeGraphiQLHandler>;
    constructor(config: GrafservConfig);
    protected processRequest(requestDigest: RequestDigest): PromiseOrDirect<Result | null>;
    getPreset(): GraphileConfig.ResolvedPreset;
    getSchema(): PromiseOrDirect<GraphQLSchema>;
    release(): Promise<void>;
    onRelease(cb: () => PromiseOrDirect<void>): void;
    private _settingPreset;
    setPreset(newPreset: GraphileConfig.Preset): PromiseOrDirect<void>;
    setSchema(newSchema: GraphQLSchema): void;
    private refreshHandlers;
    private waitForGraphqlHandler;
    private waitForGraphiqlHandler;
    private failedGraphqlHandler;
    private failedGraphiqlHandler;
    makeStream(): AsyncIterableIterator<SchemaChangeEvent>;
}
export declare function convertHandlerResultToResult(handlerResult: HandlerResult | null): PromiseOrDirect<Result | null>;
export declare const convertErrorToErrorResult: (error: Error & {
    statusCode?: number;
}) => ErrorResult;
//# sourceMappingURL=base.d.ts.map