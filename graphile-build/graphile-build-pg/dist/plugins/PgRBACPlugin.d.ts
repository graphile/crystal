import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgRBACPlugin: true;
        }
        interface GatherHelpers {
            pgRBAC: Record<string, never>;
        }
    }
    namespace DataplanPg {
        interface PgCodecAttributeExtensions {
            /** Checks permissions to see if SELECTing this attribute is allowed */
            canSelect?: boolean;
            /** Checks permissions to see if INSERTing into this attribute is allowed */
            canInsert?: boolean;
            /** Checks permissions to see if UPDATEing this attribute is allowed */
            canUpdate?: boolean;
        }
        interface PgResourceExtensions {
            /** Checks permissions to see if SELECTing this resource is allowed */
            canSelect?: boolean;
            /** Checks permissions to see if INSERTing this resource is allowed */
            canInsert?: boolean;
            /** Checks permissions to see if UPDATEing this resource is allowed */
            canUpdate?: boolean;
            /** Checks permissions to see if DELETEing this resource is allowed */
            canDelete?: boolean;
            /** Checks permissions to see if EXECUTEing the function is allowed */
            canExecute?: boolean;
        }
    }
}
export declare const PgRBACPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgRBACPlugin.d.ts.map