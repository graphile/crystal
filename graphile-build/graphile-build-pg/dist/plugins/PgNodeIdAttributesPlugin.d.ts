import "./PgTablesPlugin.js";
import "graphile-config";
import type { PgCodecWithAttributes, PgRegistry } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgNodeIdAttributesPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            "nodeId:insert": true;
            "nodeId:update": true;
            "nodeId:base": true;
            "nodeId:filterBy": true;
        }
        interface Inflection {
            /**
             * The name of the attribute used as an `ID` input representing a related
             * record ultimately representing the underlying keys.
             */
            nodeIdAttribute(this: Inflection, details: {
                registry: PgRegistry;
                codec: PgCodecWithAttributes;
                relationName: string;
            }): string;
        }
    }
}
export declare const PgNodeIdAttributesPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgNodeIdAttributesPlugin.d.ts.map