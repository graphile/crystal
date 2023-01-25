import EventEmitter from "eventemitter3";
import { GraphQLSchema, isSchema, validateSchema } from "graphql";
import { resolvePresets } from "graphile-config";
import {
  isPromiseLike,
  PromiseOrDirect,
  stringifyPayload,
  TypedEventEmitter,
} from "grafast";
import {
  GrafservConfig,
  RequestDigest,
  HandlerResult,
  SchemaChangeEvent,
  Result,
  BufferResult,
  EventStreamEvent,
  ErrorResult,
} from "../interfaces";
import { OptionsFromConfig, optionsFromConfig } from "../options";
import { makeGraphQLHandler } from "../middleware/graphql";
import { makeGraphiQLHandler } from "../middleware/graphiql";
import { handleErrors } from "../utils";
import { mapIterator } from "../mapIterator";

export class GrafservBase {
  private releaseHandlers: Array<() => PromiseOrDirect<void>> = [];
  private releasing = false;
  protected dynamicOptions!: OptionsFromConfig;
  protected resolvedPreset!: GraphileConfig.ResolvedPreset;
  protected schema: GraphQLSchema | PromiseLike<GraphQLSchema> | null;
  protected schemaError: PromiseLike<GraphQLSchema> | null;
  protected eventEmitter: TypedEventEmitter<{
    "schema:ready": GraphQLSchema;
    "schema:error": any;
  }>;
  private initialized = false;
  private graphqlHandler!: ReturnType<typeof makeGraphQLHandler>;
  private graphiqlHandler!: ReturnType<typeof makeGraphiQLHandler>;

  constructor(config: GrafservConfig) {
    this.eventEmitter = new EventEmitter();
    this.setPreset(config.preset ?? Object.create(null));
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
    this.initialized = true;
    this.refreshHandlers();
  }

  private _processRequest(
    request: RequestDigest,
  ): PromiseOrDirect<HandlerResult | null> {
    const dynamicOptions = this.dynamicOptions;
    try {
      if (
        request.path === dynamicOptions.graphqlPath &&
        request.method === "POST"
      ) {
        return this.graphqlHandler(request).catch((e) => {
          // Special error handling for GraphQL route
          console.error(
            "An error occurred whilst attempting to handle the GraphQL request:",
          );
          console.dir(e);
          return {
            type: "graphql",
            request,
            dynamicOptions,
            payload: { errors: [e] },
            statusCode: 500,
          } as HandlerResult;
        });
      }

      // FIXME: handle 'HEAD' requests

      if (
        dynamicOptions.graphiql &&
        request.method === "GET" &&
        (request.path === dynamicOptions.graphiqlPath ||
          (dynamicOptions.graphiqlOnGraphQLGET &&
            request.path === dynamicOptions.graphqlPath))
      ) {
        return this.graphiqlHandler(request);
      }

      if (
        dynamicOptions.watch &&
        request.method === "GET" &&
        request.path === dynamicOptions.eventStreamRoute
      ) {
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
    request: RequestDigest,
  ): PromiseOrDirect<Result | null> {
    try {
      const result = this._processRequest(request);
      if (isPromiseLike(result)) {
        return result.then(sendResult, sendError);
      } else {
        return sendResult(result);
      }
    } catch (e) {
      return sendError(e);
    }
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

  public setPreset(newPreset: GraphileConfig.Preset) {
    this.resolvedPreset = resolvePresets([newPreset]);
    const newOptions = optionsFromConfig(this.resolvedPreset);
    if (this.dynamicOptions !== newOptions) {
      this.dynamicOptions = newOptions;
      this.refreshHandlers();
    }
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
      return;
    }
    // TODO: this.graphqlHandler?.release()?
    this.graphqlHandler = makeGraphQLHandler(
      this.resolvedPreset,
      this.dynamicOptions,
      this.schema,
    );
    this.graphiqlHandler = makeGraphiQLHandler(
      this.resolvedPreset,
      this.dynamicOptions,
    );
  }

  private makeStream(): AsyncIterableIterator<SchemaChangeEvent> {
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
}

const END = Buffer.from("\r\n-----\r\n", "utf8");
const DIVIDE = Buffer.from(
  `\r\n---\r\nContent-Type: application/json\r\n\r\n`,
  "utf8",
);

function sendResult(
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
        asString,
        dynamicOptions,
        request: { preferJSON },
      } = handlerResult;

      handleErrors(payload);
      const buffer = Buffer.from(
        stringifyPayload(payload as any, asString),
        "utf8",
      );
      const headers = Object.create(null);
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = buffer.length;
      if (dynamicOptions.watch) {
        headers["X-GraphQL-Event-Stream"] = dynamicOptions.eventStreamRoute;
      }
      return {
        type: "buffer",
        statusCode,
        headers,
        buffer,
      };
    }
    case "graphqlIncremental": {
      const {
        iterator,
        statusCode = 200,
        asString,
        dynamicOptions,
        request: { preferJSON },
      } = handlerResult;
      const headers = Object.create(null);
      (headers["Content-Type"] = 'multipart/mixed; boundary="-"'),
        (headers["Transfer-Encoding"] = "chunked");
      if (dynamicOptions.watch) {
        headers["X-GraphQL-Event-Stream"] = dynamicOptions.eventStreamRoute;
      }

      const bufferIterator = mapIterator(
        iterator,
        (payload) => {
          handleErrors(payload);
          const payloadBuffer = Buffer.from(
            stringifyPayload(payload as any, asString),
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
      const {
        payload,
        statusCode = 200,
        request: { preferJSON },
      } = handlerResult;
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
        if (event.event) {
          payload += `event: ${event.event}\n`;
        }
        if (event.id) {
          payload += `id: ${event.id}\n`;
        }
        if (event.retry) {
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
      console.error(`Did not understand '${never}' passed to sendResult`);
      const payload = Buffer.from("Unexpected input to sendResult", "utf8");
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

const sendError = (error: Error): ErrorResult => {
  return {
    type: "error",
    error,
  };
};
