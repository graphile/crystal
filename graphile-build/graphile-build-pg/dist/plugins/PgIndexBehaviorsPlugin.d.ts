declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgIndexBehaviorsPlugin: true;
        }
    }
    namespace DataplanPg {
        interface PgCodecAttributeExtensions {
            isIndexed?: boolean;
        }
        interface PgCodecRelationExtensions {
            isIndexed?: boolean;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            manyToMany: true;
        }
    }
}
export declare const PgIndexBehaviorsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgIndexBehaviorsPlugin.d.ts.map