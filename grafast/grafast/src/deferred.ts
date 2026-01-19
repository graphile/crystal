/**
 * A promise that can be `.resolve()`-ed or `.reject()`-ed at a later time.
 *
 * @deprecated Use Promise.withResolvers
 */
export interface Deferred<T> extends PromiseLike<T> {
  resolve: (input: T | PromiseLike<T>) => void;
  reject: (error: Error) => void;
}

function NOOP() {}

/**
 * Returns a promise that can be `.resolve()`-ed or `.reject()`-ed at a later
 * time.
 *
 * @deprecated Use Promise.withResolvers
 */
export function defer<T = void>(): Deferred<T> {
  const { resolve, reject, promise: rawPromise } = Promise.withResolvers<T>();
  const promise = rawPromise as unknown as Deferred<T>;
  promise.resolve = resolve;
  promise.reject = reject;

  // PERF: this is to avoid unhandledPromiseRejection errors; generally
  // deferred errors are handled at a later time (or can be safely ignored if
  // another error wins). Maybe there's a better way?
  promise.then(null, NOOP);

  return promise;
}
