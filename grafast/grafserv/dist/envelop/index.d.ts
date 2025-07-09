import { type GetEnvelopedFn } from "@envelop/core";
import type { GraphileConfig } from "graphile-config";
declare global {
    namespace GraphileConfig {
        interface GrafservOptions {
            getEnveloped?: GetEnvelopedFn<any>;
        }
    }
}
declare global {
    namespace GraphileConfig {
        interface Plugins {
            GrafservEnvelopPlugin: true;
        }
    }
}
export declare const GrafservEnvelopPlugin: GraphileConfig.Plugin;
export declare const GrafservEnvelopPreset: GraphileConfig.Preset;
//# sourceMappingURL=index.d.ts.map