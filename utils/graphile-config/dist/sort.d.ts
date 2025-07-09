export declare function sortWithBeforeAfterProvides<TIdKey extends string, TSortable extends {
    before?: string[];
    after?: string[];
    provides?: string[];
} & {
    [id in TIdKey]: string;
}>(rawList: TSortable[], idKey: TIdKey): TSortable[];
//# sourceMappingURL=sort.d.ts.map