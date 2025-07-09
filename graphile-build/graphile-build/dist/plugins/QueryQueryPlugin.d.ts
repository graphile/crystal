import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            QueryQueryPlugin: true;
        }
    }
}
/**
 * Adds the Query.query field to the Query type for Relay 1 compatibility. This
 * is a vestigial field, you probably don't want it.
 */
export declare const QueryQueryPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=QueryQueryPlugin.d.ts.map