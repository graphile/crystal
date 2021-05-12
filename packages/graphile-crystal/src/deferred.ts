export interface Deferred<T> extends Promise<T> {
  resolve: (input: T | PromiseLike<T>) => void;
  reject: (error: Error) => void;
}

export function defer<T = void>(): Deferred<T> {
  let resolve: (input: T | PromiseLike<T>) => void;
  let reject: (error: Error) => void;
  const promise = new Promise<T>((_resolve, _reject): void => {
    resolve = _resolve;
    reject = _reject;
  });
  return Object.assign(promise, {
    // @ts-ignore
    resolve,
    // @ts-ignore
    reject,
  });
}
