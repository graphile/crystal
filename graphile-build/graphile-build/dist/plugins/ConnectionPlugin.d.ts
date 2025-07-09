import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            ConnectionPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface RegisterCursorConnectionOptions {
            typeName: string;
            connectionTypeName?: string;
            edgeTypeName?: string;
            scope?: GraphileBuild.ScopeObject;
            nonNullNode?: boolean;
        }
        interface ScopeObject {
            isConnectionType?: true;
            isConnectionEdgeType?: true;
            isPageInfo?: boolean;
        }
        interface ScopeObjectFieldsField {
            isPageInfoHasNextPageField?: boolean;
            isPageInfoHasPreviousPageField?: boolean;
        }
        interface Build {
            registerCursorConnection(options: RegisterCursorConnectionOptions): void;
        }
    }
}
export declare const ConnectionPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=ConnectionPlugin.d.ts.map