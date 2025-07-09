import "graphile-config";
import { Pool } from "pg";
export declare function getPool(): Pool;
declare global {
    namespace GraphileConfig {
        interface Plugins {
            EnumManglingPlugin: true;
        }
    }
}
export declare function makeSharedPresetAndClient(pool: Pool): Promise<{
    preset: GraphileConfig.Preset;
    withPgClient: import("@dataplan/pg").WithPgClient<import("@dataplan/pg/adaptors/pg").NodePostgresPgClient>;
}>;
//# sourceMappingURL=config.d.ts.map