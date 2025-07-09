import { Middleware } from "graphile-config";
declare const $$middleware: unique symbol;
export declare function getGrafastMiddleware(resolvedPreset: GraphileConfig.ResolvedPreset & {
    [$$middleware]?: Middleware<GraphileConfig.GrafastMiddleware> | null;
}): Middleware<GraphileConfig.GrafastMiddleware> | null;
export {};
//# sourceMappingURL=middleware.d.ts.map