import "./PgTablesPlugin.js";
import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgConnectionArgOrderByDefaultValuePlugin: true;
        }
    }
}
export declare const PgConnectionArgOrderByDefaultValuePlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgConnectionArgOrderByDefaultValuePlugin.d.ts.map