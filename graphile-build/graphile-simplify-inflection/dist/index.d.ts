import type { PgCodec } from "@dataplan/pg";
import type { GraphileConfig } from "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgSimplifyInflectionPlugin: true;
        }
    }
}
/**
 * Returns true if array1 and array2 have the same length, and every pair of
 * values within them pass the `comparator` check (which defaults to `===`).
 */
export declare function arraysMatch<T>(array1: ReadonlyArray<T>, array2: ReadonlyArray<T>, comparator?: (val1: T, val2: T) => boolean): boolean;
declare global {
    namespace GraphileBuild {
        interface Inflection {
            distinctPluralize(this: GraphileBuild.Inflection, str: string): string;
            _getBaseName(this: GraphileBuild.Inflection, attributeName: string): string | null;
            _baseNameMatches(this: GraphileBuild.Inflection, baseName: string, otherName: string): boolean;
            _getOppositeBaseName(this: GraphileBuild.Inflection, baseName: string): string | null;
            _getBaseNameFromKeys(this: GraphileBuild.Inflection, detailedKeys: Array<{
                codec: PgCodec<any, any, any, any, any, any, any>;
                attributeName: string;
            }>): string | null;
        }
        interface SchemaOptions {
            pgOmitListSuffix?: boolean;
            pgSimplifyPatch?: boolean;
            pgSimplifyAllRows?: boolean;
            pgShortPk?: boolean;
            pgSimplifyMultikeyRelations?: boolean;
        }
    }
}
declare const PgSimplifyInflectionPlugin: GraphileConfig.Plugin;
export declare const PgSimplifyInflectionPreset: GraphileConfig.Preset;
export { PgSimplifyInflectionPlugin };
//# sourceMappingURL=index.d.ts.map