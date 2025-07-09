import "graphile-config";
import type { PgResource } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgConditionCustomFieldsPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            "proc:filterBy": true;
        }
        interface ScopeInputObjectFieldsField {
            isPgConnectionConditionInputField?: boolean;
            pgFieldSource?: PgResource<any, any, any, any, any>;
        }
    }
}
/**
 * Returns true for function sources that have at least one argument, all
 * arguments except the first are nullable, the first argument is a composite
 * type, and the result is a simple scalar type.
 */
export declare function isSimpleScalarComputedColumnLike(resource: PgResource): boolean;
export declare const PgConditionCustomFieldsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgConditionCustomFieldsPlugin.d.ts.map