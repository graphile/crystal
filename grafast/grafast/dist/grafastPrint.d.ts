import type { Bucket } from "./bucket.js";
export declare function _grafastPrint(symbol: string | symbol | symbol[] | Record<symbol, any> | Map<any, any>, seen: Set<any>): string;
export declare function recursivePrintBucket(bucket: Bucket, indentLevel?: number): string;
export declare function printStore(bucket: Bucket): string;
export declare function grafastColor(text: string, n: number): string;
/**
 * Prints something grafast-style (i.e. concise, coloured, with helpful detail)
 */
export declare function grafastPrint(symbol: symbol | symbol[] | Record<symbol, any> | Map<any, any> | any): string;
/**
 * An ANSI-aware pad function; strips ANSI sequences from the string, figures
 * out how much it needs to pad it by, and then pads the original string by
 * that amount.
 */
export declare function ansiPad(ansiString: string, targetLength: number, fill: string, position: "start" | "end"): string;
//# sourceMappingURL=grafastPrint.d.ts.map