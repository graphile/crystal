export interface LRUOptions<KeyType, ValueType> {
    maxLength: number;
    dispose?: (key: KeyType, value: ValueType) => void;
}
/**
 * An tiny LRU cache with maximum count, identical weighting and no expiration.
 */
export declare class LRU<KeyType = any, ValueType = any> {
    length: number;
    /** max length */
    private m;
    /** head */
    private h;
    /** tail */
    private t;
    /** cache */
    private c;
    /** dispose */
    private d;
    /** saturated (length === max length) */
    private s;
    constructor({ maxLength, dispose }: LRUOptions<KeyType, ValueType>);
    reset(): void;
    get(key: KeyType): ValueType | undefined;
    set(key: KeyType, value: ValueType): void;
    /** add */
    private a;
}
export default LRU;
//# sourceMappingURL=index.d.ts.map