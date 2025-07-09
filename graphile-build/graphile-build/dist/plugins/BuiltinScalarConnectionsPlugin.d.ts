import "./ConnectionPlugin.js";
import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            BuiltinScalarConnectionsPlugin: true;
        }
    }
}
export declare const BuiltinScalarConnectionsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=BuiltinScalarConnectionsPlugin.d.ts.map