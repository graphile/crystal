import "graphile-config";
import type { PgResource, PgResourceUnique } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgRowByUniquePlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            "query:resource:single": true;
        }
        interface Inflection {
            rowByUnique(this: Inflection, details: {
                unique: PgResourceUnique;
                resource: PgResource<any, any, any, any, any>;
            }): string;
        }
        interface ScopeObjectFieldsField {
            isPgRowByUniqueConstraintField?: boolean;
        }
    }
}
export declare const PgRowByUniquePlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgRowByUniquePlugin.d.ts.map