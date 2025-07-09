import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            CollectReferencedTypesPlugin: true;
        }
    }
}
export declare const CollectReferencedTypesPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=CollectReferencedTypesPlugin.d.ts.map