// Turn a callback-based listener into an async iterator
// From https://raw.githubusercontent.com/withspectrum/callback-to-async-iterator/master/src/index.js
// License MIT (Copyright (c) 2017 Maximilian Stoiber)
// Based on https://github.com/apollographql/graphql-subscriptions/blob/master/src/event-emitter-to-async-iterator.ts
import { $$asyncIterator } from "iterall";

const defaultOnError = (err: Error) => {
  throw err;
};

export default function callbackToAsyncIterator<
  CallbackInput extends any,
  ReturnVal extends any
>(
  listener: (
    callback: (arg?: CallbackInput) => any
  ) => (ReturnVal | null | undefined) | Promise<ReturnVal | null | undefined>,
  options: {
    onError?: (err: Error) => void;
    onClose?: (arg: ReturnVal | null | undefined) => void;
    buffering?: boolean;
  } = {}
): AsyncIterator<CallbackInput> {
  const { onError = defaultOnError, buffering = true, onClose } = options;
  let pullQueue: ((result?: {
    value: CallbackInput | undefined;
    done: boolean;
  }) => void)[] = [];
  let pushQueue: (CallbackInput | undefined)[] = [];
  let listening = true;
  let listenerReturnValue;

  function pushValue(value?: CallbackInput) {
    if (pullQueue.length !== 0) {
      pullQueue.shift()!({ value, done: false });
    } else if (buffering === true) {
      pushQueue.push(value);
    }
  }

  function pullValue() {
    return new Promise(resolve => {
      if (pushQueue.length !== 0) {
        resolve({ value: pushQueue.shift(), done: false });
      } else {
        pullQueue.push(resolve);
      }
    });
  }

  function emptyQueue() {
    if (listening) {
      listening = false;
      pullQueue.forEach(resolve => resolve({ value: undefined, done: true }));
      pullQueue = [];
      pushQueue = [];
      onClose && onClose(listenerReturnValue);
    }
  }

  try {
    // Start listener
    Promise.resolve(listener(value => pushValue(value)))
      .then(a => {
        listenerReturnValue = a;
      })
      .catch(err => {
        onError(err);
      });

    return {
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
      [$$asyncIterator]() {
        return this;
      },
    };
  } catch (err) {
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
      [$$asyncIterator]() {
        return this;
      },
    };
  }
}
