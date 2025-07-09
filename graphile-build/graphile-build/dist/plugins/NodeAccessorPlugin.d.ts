import "graphile-config";
import type { ExecutableStep, Maybe, NodeIdHandler } from "grafast";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            NodeAccessorPlugin: true;
        }
    }
    namespace GraphileBuild {
        type NodeFetcher = {
            ($nodeId: ExecutableStep<Maybe<string>>): ExecutableStep<any>;
            deprecationReason?: string;
        };
        interface Build {
            specForHandler?(handler: NodeIdHandler): (nodeId: Maybe<string>) => any;
            nodeFetcherByTypeName?(typeName: string): NodeFetcher | null;
        }
        interface Inflection {
            nodeById(this: Inflection, typeName: string): string;
        }
        interface ScopeObjectFieldsField {
            isPgNodeQuery?: boolean;
        }
    }
}
export declare const NodeAccessorPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=NodeAccessorPlugin.d.ts.map