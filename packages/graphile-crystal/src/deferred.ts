export interface Deferred<T> extends PromiseLike<T> {
  resolve: (input: T | PromiseLike<T>) => void;
  reject: (error: Error) => void;
}

function NOOP() {}

/**
 * Node.js promises have a little overhead (not least `async_hooks`); this
 * light promise implementation helps us avoid that for `defer()` which is used
 * _a lot_.
 *
 * NOTE: this implementation is (deliberately) not fully compliant with
 * Promises/A+ because it does not invoke the onfulfilled/onrejected in a clean
 * stack. It is not suitable for usage as a generic promise type, only
 * specifically for implementing defer.
 */
class LightPromise<T> {
  /**
   * 0 - pending
   * 1 - fulfilled
   * 2 - rejected
   */
  private state: 0 | 1 | 2 = 0;

  /**
   * If state = 1, the successful value. If state = 2, the error. Otherwise undefined.
   */
  private _value: any = undefined;

  private _thens: Array<{
    onfulfilled: any;
    onrejected: any;
    promise: LightPromise<any>;
  }> = [];

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    if (executor !== NOOP) {
      executor(this.resolve, this.reject);
    }
  }

  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
    promise: LightPromise<any> = new LightPromise(NOOP),
  ): LightPromise<TResult1 | TResult2> {
    if (this.state === 0) {
      this._thens.push({ onfulfilled, onrejected, promise });
    } else if (this.state === 1) {
      if (typeof onfulfilled === "function") {
        try {
          promise.resolve(onfulfilled(this._value));
        } catch (e) {
          promise.reject(e);
        }
      } else {
        promise.resolve(this._value);
      }
    } else {
      if (typeof onrejected === "function") {
        try {
          promise.resolve(onrejected(this._value));
        } catch (e) {
          promise.reject(e);
        }
      } else {
        promise.reject(this._value);
      }
    }
    return promise;
  }

  public resolve = (input: T | PromiseLike<T>): void => {
    if (
      typeof input === "object" &&
      input !== null &&
      typeof (input as any).then === "function"
    ) {
      (input as any).then(this.resolve, this.reject);
    } else if (this.state === 0) {
      this.state = 1;
      this._value = input;
      this.executeThens();
    } else {
      console.warn(
        `Attempted to resolve a LightPromise that already ${
          this.state === 1 ? "resolved" : "rejected"
        }.`,
      );
    }
  };

  public reject = (error: Error): void => {
    if (this.state === 0) {
      this.state = 2;
      this._value = error;
      this.executeThens();
    } else {
      console.warn(
        `Attempted to reject a LightPromise that already ${
          this.state === 1 ? "resolved" : "rejected"
        }.`,
      );
    }
  };

  private executeThens(): void {
    const thens = this._thens;
    (this._thens as any) = null;
    for (const then of thens) {
      this.then(then.onfulfilled, then.onrejected, then.promise);
    }
  }
}

export function deferWithLightPromise<T = void>(): Deferred<T> {
  return new LightPromise<T>(NOOP) as any as Deferred<T>;
}

export function deferWithNativePromise<T = void>(): Deferred<T> {
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
  // another error wins)
  promise.then(null, NOOP);

  return promise;
}

export const defer = deferWithLightPromise;
