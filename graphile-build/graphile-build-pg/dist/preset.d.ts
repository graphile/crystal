import "graphile-config";
import * as dataplanPg from "@dataplan/pg";
import sql from "pg-sql2";
declare global {
    namespace GraphileConfig {
        interface Lib {
            /** The `@dataplan/pg` module */
            dataplanPg: typeof dataplanPg;
            /** The `pg-sql2` module's `sql` export */
            sql: typeof sql;
        }
    }
}
export declare const GraphileBuildPgLibPreset: GraphileConfig.Preset;
export declare const defaultPreset: GraphileConfig.Preset;
//# sourceMappingURL=preset.d.ts.map