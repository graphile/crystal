import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            StreamDeferPlugin: true;
        }
    }
}
/**
 * Enables stream/defer on the schema.
 *
 * Removing this plugin will result in a GraphQL schema that does not enable
 * stream/defer.
 */
export declare const StreamDeferPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=StreamDeferPlugin.d.ts.map