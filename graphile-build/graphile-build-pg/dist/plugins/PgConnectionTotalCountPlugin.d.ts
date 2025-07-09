import "./PgTablesPlugin.js";
import "./PgBasicsPlugin.js";
import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgConnectionTotalCountPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            totalCount: true;
        }
        interface ScopeObjectFieldsField {
            /**
             * 'true' if this field is the 'totalCount' field on a connection as
             * added by {@link PgConnectionTotalCountPlugin}.
             */
            isPgConnectionTotalCountField?: true;
        }
    }
}
export declare const PgConnectionTotalCountPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgConnectionTotalCountPlugin.d.ts.map