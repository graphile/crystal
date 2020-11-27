// This file is a copy from the GraphQL codebase, modified to work in TypeScript:
//   https://github.com/graphql/graphql-js/blob/f56905bd6b030d5912092a1239ed21f73fbdd408/src/subscription/mapAsyncIterator.js
/* tslint:disable no-any */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import { $$asyncIterator, getAsyncIterator } from 'iterall';
type PromiseOrValue<T> = T | Promise<T>;

/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */
export default function mapAsyncIterator<T, U>(
  iterable: AsyncIterable<T>,
  callback: (val: T) => PromiseOrValue<U>,
  rejectCallback?: (val: any) => PromiseOrValue<U>,
): AsyncIterableIterator<U> {
  const iterator = getAsyncIterator(iterable);
  let $return: any;
  let abruptClose: any;
  // $FlowFixMe(>=0.68.0)
  if (typeof iterator.return === 'function') {
    $return = iterator.return;
    abruptClose = (error: any) => {
      const rethrow = () => Promise.reject(error);
      return $return.call(iterator).then(rethrow, rethrow);
    };
  }

  function mapResult(result: any) {
    return result.done
      ? result
      : asyncMapValue(result.value, callback).then(iteratorResult, abruptClose);
  }

  let mapReject: any;
  if (rejectCallback) {
    // Capture rejectCallback to ensure it cannot be null.
    const reject = rejectCallback;
    mapReject = (error: any) => asyncMapValue(error, reject).then(iteratorResult, abruptClose);
  }

  const mappedIterator: AsyncIterableIterator<U> = {
    next() {
      return iterator.next().then(mapResult, mapReject);
    },
    return() {
      return $return
        ? $return.call(iterator).then(mapResult, mapReject)
        : Promise.resolve({ value: undefined, done: true });
    },
    throw(error) {
      if (typeof iterator.throw === 'function') {
        return iterator.throw(error).then(mapResult, mapReject);
      }
      return Promise.reject(error).catch(abruptClose);
    },
    // @ts-ignore TypeScript doesn't seem to understand that this is really `Symbol.asyncIterator`
    [$$asyncIterator]() {
      return this;
    },
  };
  return mappedIterator;
}

function asyncMapValue<T, U>(value: T, callback: (val: T) => PromiseOrValue<U>): Promise<U> {
  return new Promise(resolve => resolve(callback(value)));
}

function iteratorResult<T>(value: T) {
  return { value, done: false };
}
