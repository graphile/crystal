import EventEmitter from "eventemitter3";
import type { PromiseOrDirect, TypedEventEmitter } from "grafast";
import {
  defer,
  execute,
  getGrafastMiddleware,
  isPromiseLike,
  stringifyPayload,
  subscribe,
} from "grafast";
import type { GraphQLSchema } from "grafast/graphql";
import * as graphql from "grafast/graphql";
import type { Middleware } from "graphile-config";
import { resolvePresets } from "graphile-config";

import { getGrafservMiddleware } from "../hooks.js";
import type {
  BufferResult,
  DynamicOptions,
  ErrorResult,
  EventStreamEvent,
  ExecutionConfig,
  GrafservConfig,
  HandlerResult,
  NoContentHandlerResult,
  NoContentResult,
  NormalizedRequestDigest,
  ProcessRequestEvent,
  RequestDigest,
  Result,
  SchemaChangeEvent,
} from "../interfaces.js";
import { mapIterator } from "../mapIterator.js";
import { makeGraphiQLHandler } from "../middleware/graphiql.js";
import {
  APPLICATION_JSON,
  makeGraphQLHandler,
  makeParseAndValidateFunction,
} from "../middleware/graphql.js";
import { optionsFromConfig } from "../options.js";
import { handleErrors, normalizeRequest, sleep } from "../utils.js";

const failedToBuildHandlersError = new graphql.GraphQLError(
  "Unknown error occurred.",
);

const { isSchema, validateSchema } = graphql;

export class GrafservBase {
  private releaseHandlers: Array<() => PromiseOrDirect<void>> = [];
  private releasing = false;
  public dynamicOptions: DynamicOptions;
  public getExecutionConfig(
    _ctx: Partial<Grafast.RequestContext>,
  ): PromiseOrDirect<ExecutionConfig> {
    throw new Error("Overwritten in constructor");
  }
  public resolvedPreset: GraphileConfig.ResolvedPreset;
  /** @internal */
  public middleware: Middleware<GraphileConfig.GrafservMiddleware>;
  public grafastMiddleware: Middleware<GraphileConfig.GrafastMiddleware> | null;
  protected schema: GraphQLSchema | PromiseLike<GraphQLSchema> | null;
  protected schemaError: PromiseLike<GraphQLSchema> | null;
  protected eventEmitter: TypedEventEmitter<{
    "schema:ready": GraphQLSchema;
    "schema:error": any;
    "dynamicOptions:ready": Record<string, never>;
    "dynamicOptions:error": any;
  }>;
  private initialized = false;
  public graphqlHandler!: ReturnType<typeof makeGraphQLHandler>;
  public graphiqlHandler!: ReturnType<typeof makeGraphiQLHandler>;

  constructor(config: GrafservConfig) {
    this.eventEmitter = new EventEmitter();
    this.resolvedPreset = config.preset ? resolvePresets([config.preset]) : {};
    this.dynamicOptions = {
      validationRules: [...graphql.specifiedRules],
      getExecutionConfig: defaultMakeGetExecutionConfig(),
      ...optionsFromConfig(this.resolvedPreset),
    };
    this.getExecutionConfig = this.dynamicOptions.getExecutionConfig;
    this.middleware = getGrafservMiddleware(this.resolvedPreset);
    this.grafastMiddleware = getGrafastMiddleware(this.resolvedPreset);
    this.schemaError = null;
    this.schema = config.schema;
    if (isPromiseLike(config.schema)) {
      const promise = config.schema;
      promise.then(
        (schema) => {
          this.setSchema(schema);
        },
        (error) => {
          this.schemaError = promise;
          this.schema = null;
          this.eventEmitter.emit("schema:error", error);
        },
      );
    } else {
      this.eventEmitter.emit("schema:ready", config.schema);
    }
    this.graphqlHandler = this.waitForGraphqlHandler;
    this.graphiqlHandler = this.waitForGraphiqlHandler;
    this.setPreset(this.resolvedPreset);
  }

  /** @internal */
  _processRequest(
    inRequest: RequestDigest,
  ): PromiseOrDirect<HandlerResult | null> {
    const request = normalizeRequest(inRequest);
    if (!this.dynamicOptions) {
      throw new Error(
        `GrafservInternalError<1377f225-31b7-4a81-a56e-a28e18a19899>: Attempted to process request prematurely`,
      );
    }
    const dynamicOptions = this.dynamicOptions;
    const forceCORS =
      !!this.resolvedPreset.grafserv?.dangerouslyAllowAllCORSRequests &&
      request.method === "OPTIONS";
    try {
      if (request.path === dynamicOptions.graphqlPath) {
        if (forceCORS) return optionsResponse(request, this.dynamicOptions);
        return this.graphqlHandler(request, this.graphiqlHandler);
      }

      if (
        dynamicOptions.graphiql &&
        request.method === "GET" &&
        request.path === dynamicOptions.graphiqlPath
      ) {
        if (forceCORS) return optionsResponse(request, dynamicOptions);
        return this.graphiqlHandler(request);
      }

      if (
        dynamicOptions.watch &&
        request.method === "GET" &&
        request.path === dynamicOptions.eventStreamPath
      ) {
        if (forceCORS) return optionsResponse(request, dynamicOptions);
        const stream = this.makeStream();
        return {
          type: "event-stream",
          request,
          dynamicOptions,
          payload: stream,
          statusCode: 200,
        };
      }

      // Unhandled
      return null;
    } catch (e) {
      console.error("Unexpected error occurred in _processRequest", e);
      return {
        type: "html",
        request,
        dynamicOptions,
        status: 500,
        payload: Buffer.from("ERROR", "utf8"),
      } as HandlerResult;
    }
  }

  protected processRequest(
    requestDigest: RequestDigest,
  ): PromiseOrDirect<Result | null> {
    const { resolvedPreset } = this;
    return this.middleware.run(
      "processRequest",
      { resolvedPreset, requestDigest, instance: this },
      processRequestWithEvent,
    );
  }

  public getPreset(): GraphileConfig.ResolvedPreset {
    return this.resolvedPreset;
  }

  public getSchema(): PromiseOrDirect<GraphQLSchema> {
    return this.schema ?? this.schemaError!;
  }

  public async release() {
    if (this.releasing) {
      throw new Error("Release has already been called");
    }
    this.releasing = true;
    for (let i = this.releaseHandlers.length - 1; i >= 0; i--) {
      const handler = this.releaseHandlers[i];
      try {
        await handler();
      } catch (e) {
        /* nom nom nom */
      }
    }
  }

  public onRelease(cb: () => PromiseOrDirect<void>) {
    if (this.releasing) {
      throw new Error(
        "Release has already been called; cannot add more onRelease callbacks",
      );
    }
    this.releaseHandlers.push(cb);
  }

  private _settingPreset = false;
  public setPreset(newPreset: GraphileConfig.Preset): PromiseOrDirect<void> {
    if (this._settingPreset) {
      throw new Error(
        `Setting a preset is currently in progress; please wait for it to complete.`,
      );
    }
    this._settingPreset = true;
    const resolvedPreset = resolvePresets([newPreset]);
    const middleware = getGrafservMiddleware(this.resolvedPreset);
    const grafastMiddleware = getGrafastMiddleware(this.resolvedPreset);
    // Note: this gets directly mutated
    const dynamicOptions: DynamicOptions = {
      validationRules: [...graphql.specifiedRules],
      getExecutionConfig: defaultMakeGetExecutionConfig(),
      ...optionsFromConfig(resolvedPreset),
    };
    return (
      new Promise((resolve) =>
        resolve(
          middleware.run("setPreset", dynamicOptions, (dynamicOptions) => {
            const { resolvedPreset } = dynamicOptions;
            // Overwrite all the `this.*` properties at once
            this.resolvedPreset = resolvedPreset;
            this.middleware = middleware;
            this.grafastMiddleware = grafastMiddleware;
            this.dynamicOptions = dynamicOptions as DynamicOptions;
            this.initialized = true;
            // ENHANCE: this.graphqlHandler?.release()?
            this.refreshHandlers();
            this.getExecutionConfig = dynamicOptions.getExecutionConfig;
            // MUST come after the handlers have been refreshed, otherwise we'll
            // get infinite loops
            this.eventEmitter.emit("dynamicOptions:ready", {});
          }),
        ),
      )
        .then(null, (e) => {
          this.graphqlHandler = this.failedGraphqlHandler;
          this.graphiqlHandler = this.failedGraphiqlHandler;
          this.eventEmitter.emit("dynamicOptions:error", e);
        })
        // Finally:
        .then(() => {
          this._settingPreset = false;
        })
    );
  }

  public setSchema(newSchema: GraphQLSchema) {
    if (!newSchema) {
      throw new Error(`setSchema must be called with a GraphQL schema`);
    }
    if (!isSchema(newSchema)) {
      throw new Error(
        `setParams called with invalid schema (is there more than one 'graphql' module loaded?)`,
      );
    }
    const errors = validateSchema(newSchema);
    if (errors.length > 0) {
      throw new Error(
        `setParams called with invalid schema; first error: ${errors[0]}`,
      );
    }
    if (this.schema !== newSchema) {
      this.schemaError = null;
      this.schema = newSchema;
      this.eventEmitter.emit("schema:ready", newSchema);
      this.refreshHandlers();
    }
  }

  private refreshHandlers() {
    if (!this.initialized) {
      // This will be handled once `setPreset` completes
      return;
    }
    this.graphqlHandler = makeGraphQLHandler(this);
    this.graphiqlHandler = makeGraphiQLHandler(
      this.resolvedPreset,
      this.middleware,
      this.dynamicOptions,
    );
  }

  private waitForGraphqlHandler: ReturnType<typeof makeGraphQLHandler> =
    function (this: GrafservBase, ...args) {
      const [request] = args;
      const deferred = defer<HandlerResult | null>();
      const { dynamicOptions } = this;
      const onReady = () => {
        this.eventEmitter.off("dynamicOptions:ready", onReady);
        this.eventEmitter.off("dynamicOptions:error", onError);
        Promise.resolve()
          .then(() => this.graphqlHandler(...args))
          .then(deferred.resolve, deferred.reject);
      };
      const onError = (e: any) => {
        this.eventEmitter.off("dynamicOptions:ready", onReady);
        this.eventEmitter.off("dynamicOptions:error", onError);
        const graphqlError = new graphql.GraphQLError(
          "Unknown error occurred",
          null,
          null,
          null,
          null,
          e,
        );
        deferred.resolve({
          type: "graphql",
          request,
          dynamicOptions,
          payload: { errors: [graphqlError] },
          statusCode:
            (graphqlError.extensions?.statusCode as number | undefined) ?? 503,
          // Fall back to application/json; this is when an unexpected error happens
          // so it shouldn't be hit.
          contentType: APPLICATION_JSON,
        });
      };
      this.eventEmitter.on("dynamicOptions:ready", onReady);
      this.eventEmitter.on("dynamicOptions:error", onError);
      setTimeout(onError, 5000, new Error("Server initialization timed out"));
      return Promise.resolve(deferred);
    };

  private waitForGraphiqlHandler: ReturnType<typeof makeGraphiQLHandler> =
    function (this: GrafservBase, ...args) {
      const [request] = args;
      const { dynamicOptions } = this;
      const deferred = defer<HandlerResult>();
      const onReady = () => {
        this.eventEmitter.off("dynamicOptions:ready", onReady);
        this.eventEmitter.off("dynamicOptions:error", onError);
        Promise.resolve()
          .then(() => this.graphiqlHandler(...args))
          .then(deferred.resolve, deferred.reject);
      };
      const onError = (e: any) => {
        this.eventEmitter.off("dynamicOptions:ready", onReady);
        this.eventEmitter.off("dynamicOptions:error", onError);
        const graphqlError = new graphql.GraphQLError(
          "Unknown error occurred",
          null,
          null,
          null,
          null,
          e,
        );
        // TODO: this should be an HTML response
        deferred.resolve({
          type: "graphql",
          request,
          dynamicOptions,
          payload: { errors: [graphqlError] },
          statusCode:
            (graphqlError.extensions?.statusCode as number | undefined) ?? 503,
          // Fall back to application/json; this is when an unexpected error happens
          // so it shouldn't be hit.
          contentType: APPLICATION_JSON,
        });
      };
      this.eventEmitter.on("dynamicOptions:ready", onReady);
      this.eventEmitter.on("dynamicOptions:error", onError);
      setTimeout(onError, 5000, new Error("Server initialization timed out"));
      return Promise.resolve(deferred);
    };

  private failedGraphqlHandler: ReturnType<typeof makeGraphQLHandler> =
    function (this: GrafservBase, ...args) {
      const [request] = args;
      const { dynamicOptions } = this;
      return {
        type: "graphql",
        request,
        dynamicOptions,
        payload: { errors: [failedToBuildHandlersError] },
        statusCode: 503,
        // Fall back to application/json; this is when an unexpected error happens
        // so it shouldn't be hit.
        contentType: APPLICATION_JSON,
      };
    };

  private failedGraphiqlHandler: ReturnType<typeof makeGraphiQLHandler> =
    function (this: GrafservBase, ...args) {
      const [request] = args;
      const { dynamicOptions } = this;
      return {
        type: "graphql",
        request,
        dynamicOptions,
        payload: { errors: [failedToBuildHandlersError] },
        statusCode: 503,
        // Fall back to application/json; this is when an unexpected error happens
        // so it shouldn't be hit.
        contentType: APPLICATION_JSON,
      };
    };

  // TODO: Rename this, or make it a middleware, or something
  public makeStream(): AsyncIterableIterator<SchemaChangeEvent> {
    const queue: Array<{
      resolve: (value: IteratorResult<SchemaChangeEvent>) => void;
      reject: (e: Error) => void;
    }> = [];
    let finished = false;
    const bump = () => {
      const next = queue.shift();
      if (next !== undefined) {
        next.resolve({
          done: false,
          value: { event: "change", data: "schema" },
        });
      }
    };
    const flushQueue = (e?: Error) => {
      const entries = queue.splice(0, queue.length);
      for (const entry of entries) {
        if (e != null) {
          entry.reject(e);
        } else {
          entry.resolve({ done: true } as IteratorResult<SchemaChangeEvent>);
        }
      }
    };
    this.eventEmitter.on("schema:ready", bump);
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
        if (queue.length !== 0) {
          flushQueue();
        }
        return Promise.resolve({
          done: true,
        } as IteratorResult<SchemaChangeEvent>);
      },
      throw(e) {
        if (queue.length !== 0) {
          flushQueue(e);
        }
        return Promise.reject(e);
      },
    };
  }
}

function defaultMakeGetExecutionConfig(): (
  ctx: Partial<Grafast.RequestContext>,
) => PromiseOrDirect<ExecutionConfig> {
  let latestSchema: GraphQLSchema;
  let latestSchemaOrPromise: PromiseOrDirect<GraphQLSchema>;
  let latestParseAndValidate: ReturnType<typeof makeParseAndValidateFunction>;
  let schemaPrepare: Promise<boolean> | null = null;

  return function getExecutionConfig(this: GrafservBase) {
    // Get up to date schema, in case we're in watch mode
    const schemaOrPromise = this.getSchema();
    const { resolvedPreset, dynamicOptions } = this;
    if (schemaOrPromise !== latestSchemaOrPromise) {
      latestSchemaOrPromise = schemaOrPromise;
      if ("then" in schemaOrPromise) {
        schemaPrepare = (async () => {
          latestSchema = await schemaOrPromise;
          latestSchemaOrPromise = schemaOrPromise;
          latestParseAndValidate = makeParseAndValidateFunction(
            latestSchema,
            resolvedPreset,
            dynamicOptions,
          );
          schemaPrepare = null;
          return true;
        })();
      } else {
        if (latestSchema === schemaOrPromise) {
          // No action necessary
        } else {
          latestSchema = schemaOrPromise;
          latestParseAndValidate = makeParseAndValidateFunction(
            latestSchema,
            resolvedPreset,
            dynamicOptions,
          );
        }
      }
    }
    if (schemaPrepare !== null) {
      const sleeper = sleep(dynamicOptions.schemaWaitTime);
      const schemaReadyPromise = Promise.race([schemaPrepare, sleeper.promise]);
      return schemaReadyPromise.then((schemaReady) => {
        sleeper.release();
        if (schemaReady !== true) {
          // Handle missing schema
          throw new Error(`Schema isn't ready`);
        }
        return {
          schema: latestSchema,
          parseAndValidate: latestParseAndValidate,
          resolvedPreset,
          execute,
          subscribe,
          contextValue: Object.create(null),
        };
      });
    }
    /*
  if (schemaOrPromise == null) {
    const err = Promise.reject(
      new GraphQLError(
        "The schema is currently unavailable",
        null,
        null,
        null,
        null,
        null,
        {
          statusCode: 503,
        },
      ),
    );
    return () => err;
  }
    */
    return {
      schema: latestSchema,
      parseAndValidate: latestParseAndValidate,
      resolvedPreset,
      execute,
      subscribe,
      contextValue: Object.create(null),
    };
  };
}

const END = Buffer.from("\r\n-----\r\n", "utf8");
const DIVIDE = Buffer.from(
  `\r\n---\r\nContent-Type: application/json\r\n\r\n`,
  "utf8",
);

export function convertHandlerResultToResult(
  handlerResult: HandlerResult | null,
): PromiseOrDirect<Result | null> {
  if (handlerResult === null) {
    return null;
  }
  switch (handlerResult.type) {
    case "graphql": {
      const {
        payload,
        statusCode = 200,
        contentType,
        outputDataAsString,
        dynamicOptions,
        request: { preferJSON },
      } = handlerResult;

      handleErrors(payload);
      const headers = Object.create(null);
      headers["Content-Type"] = contentType;
      if (dynamicOptions.watch) {
        headers["X-GraphQL-Event-Stream"] = dynamicOptions.eventStreamPath;
      }
      if (preferJSON && !outputDataAsString) {
        return {
          type: "json",
          statusCode,
          headers,
          json: payload as any,
        };
      } else {
        const buffer = Buffer.from(
          stringifyPayload(payload as any, outputDataAsString),
          "utf8",
        );
        headers["Content-Length"] = buffer.length;
        return {
          type: "buffer",
          statusCode,
          headers,
          buffer,
        };
      }
    }
    case "graphqlIncremental": {
      const {
        iterator,
        statusCode = 200,
        outputDataAsString,
        dynamicOptions,
      } = handlerResult;
      const headers = Object.create(null);
      (headers["Content-Type"] = 'multipart/mixed; boundary="-"'),
        (headers["Transfer-Encoding"] = "chunked");
      if (dynamicOptions.watch) {
        headers["X-GraphQL-Event-Stream"] = dynamicOptions.eventStreamPath;
      }

      const bufferIterator = mapIterator(
        iterator,
        (payload) => {
          handleErrors(payload);
          const payloadBuffer = Buffer.from(
            stringifyPayload(payload as any, outputDataAsString),
            "utf8",
          );
          return Buffer.concat([DIVIDE, payloadBuffer]);
        },
        () => {
          return END;
        },
      );

      return {
        type: "bufferStream",
        headers,
        statusCode,
        lowLatency: true,
        bufferIterator,
      };
    }
    case "text":
    case "html": {
      const { payload, statusCode = 200 } = handlerResult;
      const headers = Object.create(null);
      if (handlerResult.type === "html") {
        headers["Content-Type"] = "text/html; charset=utf-8";
      } else {
        headers["Content-Type"] = "text/plain; charset=utf-8";
      }
      headers["Content-Length"] = payload.length;
      return {
        type: "buffer",
        statusCode,
        headers,
        buffer: payload,
      } as BufferResult;
    }
    case "noContent": {
      const { statusCode = 204 } = handlerResult;
      const headers = Object.create(null);
      return {
        type: "noContent",
        statusCode,
        headers,
      } as NoContentResult;
    }
    case "event-stream": {
      const {
        payload: stream,
        statusCode = 200,
        request: { httpVersionMajor },
      } = handlerResult;

      // Making sure these options are set.

      // Set headers for Server-Sent Events.
      const headers = Object.create(null);
      // Don't buffer EventStream in nginx
      headers["X-Accel-Buffering"] = "no";
      headers["Content-Type"] = "text/event-stream";
      headers["Cache-Control"] = "no-cache, no-transform";
      if (httpVersionMajor >= 2) {
        // NOOP
      } else {
        headers["Connection"] = "keep-alive";
      }

      // Creates a stream for the response
      const event2buffer = (event: EventStreamEvent): Buffer => {
        let payload = "";
        if (event.event !== undefined) {
          payload += `event: ${event.event}\n`;
        }
        if (event.id !== undefined) {
          payload += `id: ${event.id}\n`;
        }
        if (event.retry !== undefined) {
          payload += `retry: ${event.retry}\n`;
        }
        if (event.data != null) {
          payload += `data: ${event.data.replace(/\n/g, "\ndata: ")}\n`;
        }
        payload += "\n";
        return Buffer.from(payload, "utf8");
      };

      const bufferIterator = mapIterator<EventStreamEvent, Buffer>(
        stream,
        event2buffer,
        undefined,
        () => event2buffer({ event: "open" }),
      );

      return {
        type: "bufferStream",
        statusCode,
        headers,
        lowLatency: true,
        bufferIterator,
      };
    }
    default: {
      const never: never = handlerResult;
      console.error(
        `Did not understand '${never}' passed to convertHandlerResultToResult`,
      );
      const payload = Buffer.from(
        "Unexpected input to convertHandlerResultToResult",
        "utf8",
      );
      const headers = Object.create(null);
      headers["Content-Type"] = "text/plain; charset=utf-8";
      headers["Content-Length"] = payload.length;
      return {
        type: "buffer",
        statusCode: 500,
        headers,
        buffer: payload,
      } as BufferResult;
    }
  }
}

export const convertErrorToErrorResult = (
  error: Error & { statusCode?: number },
): ErrorResult => {
  // TODO: need to assert `error` is not a GraphQLError, that should be handled elsewhere.
  const statusCode = error.statusCode ?? 500;
  return {
    type: "error",
    statusCode,
    headers: Object.create(null),
    error,
  };
};

function dangerousCorsWrap(result: Result | null) {
  if (result === null) {
    return result;
  }
  result.headers["Access-Control-Allow-Origin"] = "*";
  result.headers["Access-Control-Allow-Headers"] = "*";
  return result;
}

function optionsResponse(
  request: NormalizedRequestDigest,
  dynamicOptions: any,
): NoContentHandlerResult {
  return {
    type: "noContent",
    request,
    dynamicOptions: dynamicOptions,
    statusCode: 204,
  };
}

function processRequestWithEvent(event: ProcessRequestEvent) {
  const { requestDigest: request, instance } = event;
  let returnValue: PromiseOrDirect<Result | null>;
  try {
    const result = instance._processRequest(request);

    if (isPromiseLike(result)) {
      returnValue = result.then(
        convertHandlerResultToResult,
        convertErrorToErrorResult,
      );
    } else {
      returnValue = convertHandlerResultToResult(result);
    }
  } catch (e) {
    returnValue = convertErrorToErrorResult(e);
  }
  if (instance.resolvedPreset.grafserv?.dangerouslyAllowAllCORSRequests) {
    if (isPromiseLike(returnValue)) {
      return returnValue.then(dangerousCorsWrap);
    } else {
      return dangerousCorsWrap(returnValue);
    }
  } else {
    return returnValue;
  }
}
