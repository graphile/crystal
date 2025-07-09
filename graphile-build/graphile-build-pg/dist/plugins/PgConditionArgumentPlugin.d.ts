import "./PgTablesPlugin.js";
import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgConditionArgumentPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            filter: true;
            "query:resource:list:filter": true;
            "query:resource:connection:filter": true;
            "manyRelation:resource:list:filter": true;
            "manyRelation:resource:connection:filter": true;
            "singularRelation:resource:list:filter": true;
            "singularRelation:resource:connection:filter": true;
            "typeField:resource:list:filter": true;
            "typeField:resource:connection:filter": true;
            "queryField:resource:list:filter": true;
            "queryField:resource:connection:filter": true;
        }
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
export declare const PgConditionArgumentPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgConditionArgumentPlugin.d.ts.map