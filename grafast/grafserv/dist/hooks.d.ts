import { Middleware } from "graphile-config";
declare const $$middleware: unique symbol;
export declare function getGrafservMiddleware(resolvedPreset: GraphileConfig.ResolvedPreset & {
    [$$middleware]?: Middleware<GraphileConfig.GrafservMiddleware> | null;
}): Middleware<GraphileConfig.GrafservMiddleware> | null;
export {};
//# sourceMappingURL=hooks.d.ts.map