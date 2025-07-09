import "graphile-config";
import type { PgResource } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgMutationCreatePlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            "insert:resource:select": true;
            record: true;
        }
        interface ScopeObject {
            isPgCreatePayloadType?: boolean;
        }
        interface Inflection {
            createField(this: Inflection, resource: PgResource<any, any, any, any, any>): string;
            createInputType(this: Inflection, resource: PgResource<any, any, any, any, any>): string;
            createPayloadType(this: Inflection, resource: PgResource<any, any, any, any, any>): string;
            tableFieldName(this: Inflection, resource: PgResource<any, any, any, any, any>): string;
        }
    }
}
export declare const PgMutationCreatePlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgMutationCreatePlugin.d.ts.map