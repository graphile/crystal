/**
 * A promise that can be `.resolve()`-ed or `.reject()`-ed at a later time.
 */
export interface Deferred<T> extends PromiseLike<T> {
    resolve: (input: T | PromiseLike<T>) => void;
    reject: (error: Error) => void;
}
/**
 * Returns a promise that can be `.resolve()`-ed or `.reject()`-ed at a later
 * time.
 */
export declare function defer<T = void>(): Deferred<T>;
//# sourceMappingURL=deferred.d.ts.map