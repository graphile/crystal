import "./PgTablesPlugin.js";
import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgFirstLastBeforeAfterArgsPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface Inflection {
            conditionType(this: Inflection, typeName: string): string;
        }
        interface ScopeInputObject {
            isPgCondition?: boolean;
        }
        interface ScopeInputObjectFieldsField {
            isPgConnectionConditionInputField?: boolean;
        }
    }
}
export declare const PgFirstLastBeforeAfterArgsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgFirstLastBeforeAfterArgsPlugin.d.ts.map