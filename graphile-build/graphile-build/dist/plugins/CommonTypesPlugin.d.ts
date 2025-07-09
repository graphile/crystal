import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            CommonTypesPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface ScopeScalar {
        }
        interface SchemaOptions {
            /**
             * Set 'true' if you want JSON values to be stringified.
             */
            jsonScalarAsString?: boolean;
        }
    }
}
export declare const CommonTypesPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=CommonTypesPlugin.d.ts.map