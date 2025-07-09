import type { Plugin } from "pretty-format";
export interface FormattedObject {
    __: string | JSON | null | undefined;
}
declare function printFormattedObject(val: FormattedObject): string;
export declare const test: Plugin["test"];
export declare const serialize: typeof printFormattedObject;
export {};
//# sourceMappingURL=index.d.ts.map