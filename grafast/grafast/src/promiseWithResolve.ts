export interface PromiseWithResolve<T> {
  promise: Promise<T>;
  /**
   * NOTE: cannot pass a promise to `value`, otherwise it's possible to reject
   * - in that case you should use `Promise.withResolvers()` rather than
   * `promiseWithResolve`
   */
  resolve(value: Awaited<T>): void;
}

/** When you can only succeed, there's no need to handle failure */
export function promiseWithResolve<T>(): PromiseWithResolve<T> {
  return Promise.withResolvers<T>();
}
