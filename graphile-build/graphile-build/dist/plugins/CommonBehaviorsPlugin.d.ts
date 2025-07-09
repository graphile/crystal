import "graphile-config";
declare global {
    namespace GraphileBuild {
        interface BehaviorStrings {
            connection: true;
            list: true;
            array: true;
            single: true;
            "interface:node": true;
            "type:node": true;
            node: true;
        }
    }
}
export declare const CommonBehaviorsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=CommonBehaviorsPlugin.d.ts.map