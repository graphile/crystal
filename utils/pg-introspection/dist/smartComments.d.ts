export interface PgSmartTagsDict {
    [tagName: string]: null | true | string | (string | true)[];
}
export interface PgSmartTagsAndDescription {
    tags: PgSmartTagsDict;
    description: string | undefined;
}
export declare const parseSmartComment: (str: string | undefined) => PgSmartTagsAndDescription;
//# sourceMappingURL=smartComments.d.ts.map