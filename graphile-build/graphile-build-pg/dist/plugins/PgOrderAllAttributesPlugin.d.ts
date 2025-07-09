import "./PgTablesPlugin.js";
import "graphile-config";
import type { PgCodecWithAttributes } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgOrderAllAttributesPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface Inflection {
            orderByAttributeEnum(this: Inflection, details: {
                codec: PgCodecWithAttributes;
                attributeName: string;
                variant: "asc" | "desc" | "asc_nulls_last" | "desc_nulls_last";
            }): string;
        }
    }
}
export declare const PgOrderAllAttributesPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgOrderAllAttributesPlugin.d.ts.map