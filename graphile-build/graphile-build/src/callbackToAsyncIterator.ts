// Turn a callback-based listener into an async iterator
// From https://raw.githubusercontent.com/withspectrum/callback-to-async-iterator/master/src/index.js
// License MIT (Copyright (c) 2017 Maximilian Stoiber)
// Based on https://github.com/apollographql/graphql-subscriptions/blob/master/src/event-emitter-to-async-iterator.ts

/**
 * The default behaviour when an error occurs (i.e. throw the error!)
 */
const defaultOnError = (err: Error) => {
  throw err;
};

type StrongAsyncIterableIterator<T> = Required<AsyncIterableIterator<T>>;

/**
 * Builds an AsyncIterator from a callback; much safer than an async generator
 * because it will not get frozen waiting for a promise to resolve.
 */
export default function callbackToAsyncIterator<CallbackInput, ReturnVal>(
  listener: (
    callback: (value: CallbackInput) => void,
  ) => (ReturnVal | null | undefined) | Promise<ReturnVal | null | undefined>,
  options: {
    onError?: (err: Error) => void;
    onClose?: (arg: ReturnVal | null | undefined) => void;
    buffering?: boolean;
  } = {},
): AsyncIterableIterator<CallbackInput> {
  const { onError = defaultOnError, buffering = true, onClose } = options;
  let pullQueue: ((result: IteratorResult<CallbackInput, unknown>) => void)[] =
    [];
  let pushQueue: CallbackInput[] = [];
  let listening = true;
  let listenerReturnValue: ReturnVal | null | undefined;

  function pushValue(value: CallbackInput) {
    const nextPull = pullQueue.shift();
    if (nextPull) {
      nextPull({ value, done: false });
    } else if (buffering === true) {
      pushQueue.push(value);
    }
  }

  function pullValue() {
    return new Promise<IteratorResult<CallbackInput, unknown>>((resolve) => {
      const nextPush = pushQueue.shift();
      if (nextPush) {
        resolve({ value: nextPush, done: false });
      } else {
        pullQueue.push(resolve);
      }
    });
  }

  function emptyQueue() {
    if (listening) {
      listening = false;
      pullQueue.forEach((resolve) => resolve({ value: undefined, done: true }));
      pullQueue = [];
      pushQueue = [];
      onClose?.(listenerReturnValue);
    }
  }

  try {
    // Start listener
    Promise.resolve(listener((value) => pushValue(value))).then((a) => {
      listenerReturnValue = a;
    }, onError);

    const i: StrongAsyncIterableIterator<CallbackInput> = {
      next() {
        return listening ? pullValue() : this.return();
      },
      return() {
        emptyQueue();
        return Promise.resolve({ value: undefined, done: true });
      },
      throw(error: Error) {
        emptyQueue();
        onError(error);
        return Promise.reject(error);
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
    return i;
  } catch (err: any) {
    onError(err);
    return {
      next() {
        return Promise.reject(err);
      },
      return() {
        return Promise.reject(err);
      },
      throw(error: Error) {
        return Promise.reject(error);
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }
}
