import "./PgTablesPlugin.js";
import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgOrderByPrimaryKeyPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface SchemaOptions {
            pgOrderByNullsLast?: boolean;
        }
    }
}
export declare const PgOrderByPrimaryKeyPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgOrderByPrimaryKeyPlugin.d.ts.map