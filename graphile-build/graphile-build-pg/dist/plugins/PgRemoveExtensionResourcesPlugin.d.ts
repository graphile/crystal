import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgRemoveExtensionResourcesPlugin: true;
        }
        interface GatherHelpers {
            pgRemoveExtensionResources: Record<string, never>;
        }
    }
    namespace DataplanPg {
        interface PgResourceExtensions {
            isFromExtension?: boolean;
        }
    }
}
export declare const PgRemoveExtensionResourcesPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgRemoveExtensionResourcesPlugin.d.ts.map