import * as ts from "typescript";
export declare function configVfs(options: {
    filename?: string;
    initialCode?: string;
}): {
    env: import("@typescript/vfs").VirtualTypeScriptEnvironment;
    FAKE_FILENAME: string;
    BASE_CONTENT: string;
    getCompletions: (additionalContent?: string, offsetFromEnd?: number) => ts.WithMetadata<ts.CompletionInfo> | undefined;
    getQuickInfo: (additionalContent?: string, offsetFromEnd?: number) => ts.QuickInfo | undefined;
};
/**
 * @deprecated use prettyQuickInfoDisplayParts instead
 */
export declare function prettyDisplayParts(displayParts: ReadonlyArray<ts.SymbolDisplayPart> | undefined, trimUntil?: string): string;
export declare function prettyQuickInfoDisplayParts(quickInfo: ts.QuickInfo | undefined, omitThis?: boolean): string;
export declare function prettyDocumentation(parts: ReadonlyArray<ts.SymbolDisplayPart> | undefined): string;
export declare function truncate(text: string, length?: number): string;
export declare function tightDocumentation(info: ts.QuickInfo | undefined, length?: number): string;
export declare function tightDisplayParts(info: ts.QuickInfo | undefined, length?: number): string;
export declare const accessKey: (key: string) => string;
//# sourceMappingURL=typescriptVfs.d.ts.map