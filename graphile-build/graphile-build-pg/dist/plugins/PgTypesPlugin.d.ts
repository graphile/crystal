import "./PgBasicsPlugin.js";
import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgTypesPlugin: true;
        }
        interface Provides {
            "pg-standard-types": true;
        }
    }
    namespace GraphileBuild {
        interface ScopeObject {
            isPgIntervalType?: boolean;
            isPgPointType?: boolean;
        }
        interface ScopeInputObject {
            isPgIntervalInputType?: boolean;
            isPgPointInputType?: boolean;
        }
        interface ScopeScalar {
        }
        interface SchemaOptions {
            pgUseCustomNetworkScalars?: boolean;
        }
    }
}
export declare const PgTypesPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgTypesPlugin.d.ts.map