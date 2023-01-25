/*
import EventEmitter from "eventemitter3";
import type { Deferred, PromiseOrDirect, TypedEventEmitter } from "grafast";
import { defer, isPromiseLike, stringifyPayload, stripAnsi } from "grafast";
import { resolvePresets } from "graphile-config";
import type {
  AsyncExecutionResult,
  ExecutionResult,
  GraphQLSchema,
} from "graphql";
import { GraphQLError } from "graphql";
import type { IncomingMessage, RequestListener, ServerResponse } from "http";

import type { ServerParams } from "../interfaces.js";
import { makeGraphiQLHandler } from "./graphiql.js";
import { makeGraphQLHandler } from "./graphql.js";
import type { EventStreamEvent, HandlerResult } from "../interfaces.js";



  type ServerResultAndHandlers = ServerParams & {
    graphqlHandler: Awaited<ReturnType<typeof makeGraphQLHandler>>;
    graphiqlHandler: Awaited<ReturnType<typeof makeGraphiQLHandler>>;
  };
  const eventEmitter: TypedEventEmitter<{
    newSchema: GraphQLSchema;
  }> = new EventEmitter();
  type SchemaChangeEvent = {
    event: "change";
    data: "schema";
  };
  function makeStream(): AsyncIterableIterator<SchemaChangeEvent> {
    const queue: Array<{
      resolve: (value: IteratorResult<SchemaChangeEvent>) => void;
      reject: (e: Error) => void;
    }> = [];
    let finished = false;
    const bump = () => {
      const next = queue.shift();
      if (next) {
        next.resolve({
          done: false,
          value: { event: "change", data: "schema" },
        });
      }
    };
    const flushQueue = (e?: Error) => {
      const entries = queue.splice(0, queue.length);
      for (const entry of entries) {
        if (e) {
          entry.reject(e);
        } else {
          entry.resolve({ done: true } as IteratorResult<SchemaChangeEvent>);
        }
      }
    };
    eventEmitter.on("newSchema", bump);
    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      next() {
        if (finished) {
          return Promise.resolve({
            done: true,
          } as IteratorResult<SchemaChangeEvent>);
        }
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        });
      },
      return() {
        finished = true;
        if (queue.length) {
          flushQueue();
        }
        return Promise.resolve({
          done: true,
        } as IteratorResult<SchemaChangeEvent>);
      },
      throw(e) {
        if (queue.length) {
          flushQueue(e);
        }
        return Promise.reject(e);
      },
    };
  }
  function addHandlers(r: ServerParams): ServerResultAndHandlers {
    eventEmitter.emit("newSchema", r.schema);
    return {
      ...r,
      graphqlHandler: makeGraphQLHandler(r),
      graphiqlHandler: makeGraphiQLHandler(r),
    };
  }

  let serverParams:
    | PromiseLike<ServerResultAndHandlers>
    | Deferred<ServerResultAndHandlers>
    | ServerResultAndHandlers =
    initialParams == null
      ? defer<ServerResultAndHandlers>()
      : isPromiseLike(initialParams)
      ? initialParams.then(addHandlers)
      : addHandlers(initialParams);

  const releaseHandlers: Array<() => PromiseOrDirect<void>> = [];

  return {
    handler: middleware,
    async release() {
      for (const handler of releaseHandlers) {
        try {
          await handler();
        } catch (e) {
          /* nom nom nom * /
        }
      }
    },
    onRelease(cb) {
      releaseHandlers.push(cb);
    },
    setParams(newParams) {
      const newParamsWithHandlers = addHandlers(newParams!);
      if (
        // If serverParams was deferred, resolve it
        serverParams !== null &&
        "resolve" in serverParams &&
        typeof serverParams.resolve === "function"
      ) {
        serverParams.resolve(newParamsWithHandlers);
      }
      dynamicOptions = optionsFromConfig(newParams.resolvedPreset);
      serverParams = newParamsWithHandlers;
    },
  };
}
*/
