import "./PgTablesPlugin.js";
import "graphile-config";
import type { PgResource, PgResourceParameter } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgOrderCustomFieldsPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            "proc:orderBy": true;
        }
        interface Inflection {
            computedAttributeOrder(this: Inflection, details: {
                resource: PgResource<any, any, any, readonly PgResourceParameter[], any>;
                variant: "asc" | "desc" | "asc_nulls_last" | "desc_nulls_last";
            }): string;
        }
    }
}
export declare const PgOrderCustomFieldsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgOrderCustomFieldsPlugin.d.ts.map