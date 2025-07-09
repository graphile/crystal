import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            CursorTypePlugin: true;
        }
        interface Provides {
            Cursor: true;
        }
    }
    namespace GraphileBuild {
        interface ScopeScalar extends Scope {
            isCursorType?: boolean;
        }
    }
}
export declare const CursorTypePlugin: GraphileConfig.Plugin;
//# sourceMappingURL=CursorTypePlugin.d.ts.map