import "graphile-config";
import type { NodeIdCodec, NodeIdHandler } from "grafast";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            NodePlugin: true;
        }
    }
    namespace GraphileBuild {
        interface Inflection {
            nodeIdFieldName(this: Inflection): string;
        }
        interface Build {
            [NODE_ID_CODECS]?: {
                [codecName: string]: NodeIdCodec;
            };
            [NODE_ID_HANDLER_BY_TYPE_NAME]?: {
                [typeName: string]: NodeIdHandler;
            };
            registerNodeIdCodec?(codec: NodeIdCodec): void;
            getNodeIdCodec?(codecName: string): NodeIdCodec;
            registerNodeIdHandler?(matcher: NodeIdHandler): void;
            getNodeIdHandler?(typeName: string): NodeIdHandler | undefined;
            getNodeTypeNames?(): string[];
            getNodeIdHandlerByTypeName?(): Readonly<Record<string, NodeIdHandler>>;
        }
        interface ScopeObjectFieldsField {
            isRootNodeField?: boolean;
        }
    }
}
export declare const NodePlugin: GraphileConfig.Plugin;
//# sourceMappingURL=NodePlugin.d.ts.map