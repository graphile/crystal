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
