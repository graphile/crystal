import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PageInfoStartEndCursorPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface ScopeObjectFieldsField {
            isPageInfoStartCursorField?: boolean;
            isPageInfoEndCursorField?: boolean;
        }
    }
}
export declare const PageInfoStartEndCursorPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PageInfoStartEndCursorPlugin.d.ts.map