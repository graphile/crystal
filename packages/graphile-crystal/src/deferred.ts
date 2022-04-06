export interface Deferred<T> extends PromiseLike<T> {
  resolve: (input: T | PromiseLike<T>) => void;
  reject: (error: Error) => void;
}

function NOOP() {}

export function defer<T = void>(): Deferred<T> {
  let resolve!: (input: T | PromiseLike<T>) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((_resolve, _reject): void => {
    resolve = _resolve;
    reject = _reject;
  }) as unknown as Deferred<T>;
  promise.resolve = resolve;
  promise.reject = reject;

  // TODO: this is to avoid unhandledPromiseRejection errors; generally
  // deferred errors are handled at a later time (or can be safely ignored if
  // another error wins). Maybe there's a better way?
  promise.then(null, NOOP);

  return promise;
}
