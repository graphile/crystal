import "graphile-config";
import type { PgCodecWithAttributes } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgMutationPayloadEdgePlugin: true;
        }
    }
    namespace GraphileBuild {
        interface Inflection {
            tableEdgeField(this: Inflection, codec: PgCodecWithAttributes): string;
        }
        interface ScopeObjectFieldsField {
            isPgMutationPayloadEdgeField?: boolean;
        }
    }
}
export declare const PgMutationPayloadEdgePlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgMutationPayloadEdgePlugin.d.ts.map