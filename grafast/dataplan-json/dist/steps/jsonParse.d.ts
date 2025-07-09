import type { AccessStep, ExecutionDetails, GrafastResultsList } from "grafast";
import { Step } from "grafast";
export type JSONValue = string | number | boolean | null | {
    [key: string]: JSONValue;
} | Array<JSONValue>;
/**
 * This plan accepts as JSON string as its only input and will result in the
 * parsed JSON object (or array, boolean, string, etc).
 */
export declare class JSONParseStep<TJSON extends JSONValue> extends Step<TJSON> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    constructor($stringPlan: Step<string | null>);
    toStringMeta(): string;
    get<TKey extends keyof TJSON>(key: TKey): AccessStep<TJSON extends {
        [key: string]: unknown;
    } ? TJSON[TKey] : never>;
    at<TIndex extends keyof TJSON & number>(index: TIndex): AccessStep<TJSON[TIndex]>;
    deduplicate(_peers: readonly Step[]): readonly Step[];
    execute({ indexMap, values: [stringDep], }: ExecutionDetails<[string]>): GrafastResultsList<TJSON>;
}
/**
 * This plan accepts as JSON string as its only input and will result in the
 * parsed JSON object (or array, boolean, string, etc).
 */
export declare function jsonParse<TJSON extends JSONValue>($string: Step<string | null>): JSONParseStep<TJSON>;
//# sourceMappingURL=jsonParse.d.ts.map