import type { PgCodecRefPath, PgResource } from "@dataplan/pg";
export declare function tagToString(str: undefined | null | boolean | string | (string | boolean)[]): string | undefined;
export declare function parseSmartTagsOptsString<TParamName extends string = string>(optsString: string | true | (string | true)[] | undefined, leading?: number): {
    args: string[];
    params: { [paramName in TParamName]?: string; };
};
export declare function parseDatabaseIdentifier<TExpectedLength extends number>(identifier: string, expectedLength: TExpectedLength, fallbackNamespace?: string): TExpectedLength extends 1 ? [string] : TExpectedLength extends 2 ? [string, string] : TExpectedLength extends 3 ? [string, string, string] : string[];
/**
 * Parses an identifier string like `a."fooBar",baz,"MySchema".MyCol` into a
 * list of tuples of length `expectedLength`, backfilling with fallbackNamespace
 * if necessary (e.g. to produce `[["a", "fooBar"], ["public", "baz"], ["MySchema", "mycol"]]`)
 *
 * To find this, you might also search for: `parseIdentifier()`,
 * `parseIdentifiers()`.
 */
export declare function parseDatabaseIdentifiers<TExpectedLength extends number>(identifier: string, expectedLength: TExpectedLength, fallbackNamespace?: string): Array<TExpectedLength extends 1 ? [string] : TExpectedLength extends 2 ? [string, string] : TExpectedLength extends 3 ? [string, string, string] : string[]>;
type Layer = {
    relationName: string;
    localAttributes: string[];
    resource: PgResource<any, any, any, any, any>;
    remoteAttributes: string[];
    isUnique: boolean;
};
export declare const resolveResourceRefPath: (resource: PgResource<any, any, any, any, any>, path: PgCodecRefPath) => {
    resource: PgResource<any, any, any, any, any>;
    hasReferencee: boolean;
    isUnique: boolean;
    layers: Layer[];
};
export declare function exportNameHint(obj: any, nameHint: string): void;
export {};
//# sourceMappingURL=utils.d.ts.map