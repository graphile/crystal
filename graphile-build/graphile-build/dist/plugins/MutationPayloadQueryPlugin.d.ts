import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            MutationPayloadQueryPlugin: true;
        }
        interface Provides {
            MutationPayloadQuery: true;
        }
    }
}
/**
 * Adds a 'query' field to each mutation payload object type; this often turns
 * out to be quite helpful but if you don't want it in your schema then it's
 * safe to disable this plugin.
 */
export declare const MutationPayloadQueryPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=MutationPayloadQueryPlugin.d.ts.map