"use strict";
// Turn a callback-based listener into an async iterator
// From https://raw.githubusercontent.com/withspectrum/callback-to-async-iterator/master/src/index.js
// License MIT (Copyright (c) 2017 Maximilian Stoiber)
// Based on https://github.com/apollographql/graphql-subscriptions/blob/master/src/event-emitter-to-async-iterator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = callbackToAsyncIterator;
/**
 * The default behaviour when an error occurs (i.e. throw the error!)
 */
const defaultOnError = (err) => {
    throw err;
};
/**
 * Builds an AsyncIterator from a callback; much safer than an async generator
 * because it will not get frozen waiting for a promise to resolve.
 */
function callbackToAsyncIterator(listener, options = {}) {
    const { onError = defaultOnError, buffering = true, onClose } = options;
    let pullQueue = [];
    let pushQueue = [];
    let listening = true;
    let listenerReturnValue;
    function pushValue(value) {
        const nextPull = pullQueue.shift();
        if (nextPull) {
            nextPull({ value, done: false });
        }
        else if (buffering === true) {
            pushQueue.push(value);
        }
    }
    function pullValue() {
        return new Promise((resolve) => {
            const nextPush = pushQueue.shift();
            if (nextPush) {
                resolve({ value: nextPush, done: false });
            }
            else {
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
            onClose && onClose(listenerReturnValue);
        }
    }
    try {
        // Start listener
        Promise.resolve(listener((value) => pushValue(value))).then((a) => {
            listenerReturnValue = a;
        }, onError);
        const i = {
            next() {
                return listening ? pullValue() : this.return();
            },
            return() {
                emptyQueue();
                return Promise.resolve({ value: undefined, done: true });
            },
            throw(error) {
                emptyQueue();
                onError(error);
                return Promise.reject(error);
            },
            [Symbol.asyncIterator]() {
                return this;
            },
        };
        return i;
    }
    catch (err) {
        onError(err);
        return {
            next() {
                return Promise.reject(err);
            },
            return() {
                return Promise.reject(err);
            },
            throw(error) {
                return Promise.reject(error);
            },
            [Symbol.asyncIterator]() {
                return this;
            },
        };
    }
}
//# sourceMappingURL=callbackToAsyncIterator.js.map