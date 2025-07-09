import type { PromiseOrDirect } from "grafast";
import type { Middleware } from "graphile-config";
import type { HandlerResult, NormalizedRequestDigest } from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";
export declare function makeGraphiQLHandler(resolvedPreset: GraphileConfig.ResolvedPreset, middleware: Middleware<GraphileConfig.GrafservMiddleware> | null, dynamicOptions: OptionsFromConfig): (request: NormalizedRequestDigest) => PromiseOrDirect<HandlerResult>;
//# sourceMappingURL=graphiql.d.ts.map