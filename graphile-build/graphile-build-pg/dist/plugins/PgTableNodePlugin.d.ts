import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgTableNodePlugin: true;
        }
    }
    namespace GraphileBuild {
        interface SchemaOptions {
            pgV4UseTableNameForNodeIdentifier?: boolean;
        }
    }
}
export declare const PgTableNodePlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgTableNodePlugin.d.ts.map