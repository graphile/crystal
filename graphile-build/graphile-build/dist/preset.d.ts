import "./interfaces.js";
import "graphile-config";
import * as grafast from "grafast";
import * as graphql from "grafast/graphql";
import { EXPORTABLE, EXPORTABLE_OBJECT_CLONE, exportNameHint } from "./utils.js";
declare global {
    namespace GraphileConfig {
        interface Lib {
            graphql: typeof graphql;
            grafast: typeof grafast;
            graphileBuild: {
                EXPORTABLE: typeof EXPORTABLE;
                EXPORTABLE_OBJECT_CLONE: typeof EXPORTABLE_OBJECT_CLONE;
                exportNameHint: typeof exportNameHint;
            };
        }
    }
}
export declare const GraphileBuildLibPreset: GraphileConfig.Preset;
export declare const defaultPreset: GraphileConfig.Preset;
//# sourceMappingURL=preset.d.ts.map