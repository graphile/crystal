import "./PgTablesPlugin.js";
import "graphile-config";
import type { PgCodec } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgConnectionArgOrderByPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            "resource:connection:order": true;
            "resource:list:order": true;
        }
        interface Inflection {
            orderByType(this: Inflection, typeName: string): string;
        }
        interface ScopeEnum {
            pgCodec?: PgCodec;
            isPgRowSortEnum?: boolean;
        }
    }
}
export declare const PgConnectionArgOrderByPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgConnectionArgOrderByPlugin.d.ts.map