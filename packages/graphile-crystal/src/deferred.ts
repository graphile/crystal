export interface Deferred<T> extends Promise<T> {
  resolve: (input?: T | PromiseLike<T> | undefined) => void;
  reject: (error: Error) => void;
}

export function deferred<T = void>(): Deferred<T> {
  let resolve: (input?: T | PromiseLike<T> | undefined) => void;
  let reject: (error: Error) => void;
  const promise = new Promise<T>((_resolve, _reject): void => {
    resolve = _resolve;
    reject = _reject;
  });
  // tslint:disable-next-line prefer-object-spread
  return Object.assign(promise, {
    // @ts-ignore This isn't used before being defined.
    resolve,
    // @ts-ignore This isn't used before being defined.
    reject,
  });
}
