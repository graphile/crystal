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
import type { EventStreamEvent, HandlerResult } from "./interfaces.js";

function getBodyFromRequest(
  req: IncomingMessage,
  maxLength: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    req.setEncoding("utf8");
    let data = "";
    const handleData = (chunk: Buffer) => {
      data += chunk;
      if (data.length > maxLength) {
        req.off("end", done);
        req.off("error", reject);
        req.off("data", handleData);
        // TODO: validate this approach
        reject(new Error("Too much data"));
      }
    };
    const done = () => {
      resolve(data);
    };
    req.on("end", done);
    req.on("error", reject);
    req.on("data", handleData);
  });
}

function handleErrors(payload: ExecutionResult | AsyncExecutionResult): void {
  if ("errors" in payload && payload.errors) {
    (payload.errors as any[]) = payload.errors.map((e) => {
      const obj =
        e instanceof GraphQLError
          ? e.toJSON()
          : { message: (e as any).message, ...(e as object) };
      return Object.assign(obj, {
        message: stripAnsi(obj.message),
        extensions: { stack: stripAnsi(e.stack ?? "").split("\n") },
      });
    });
  }
}

function optionsFromConfig(config: GraphileConfig.ResolvedPreset) {
  const {
    graphqlPath = "/graphql",
    graphiql = true,
    graphiqlOnGraphQLGET = true,
    graphiqlPath = "/",
    watch = false,
    eventStreamRoute = "/graphql/stream",
    maxRequestLength = 100_000,
  } = config.server ?? {};
  return {
    graphqlPath,
    graphiql,
    graphiqlOnGraphQLGET,
    graphiqlPath,
    watch,
    eventStreamRoute,
    maxRequestLength,
  };
}

export interface Grafserv {
  // TODO: should build handler on demand depending on flavour needed
  handler: RequestListener;
  release(): Promise<void>;
  onRelease(cb: () => PromiseOrDirect<void>): void;
  setParams(result: ServerParams): void;
}

export function grafserv(
  preset: GraphileConfig.Preset,
  initialParams?: PromiseOrDirect<ServerParams>,
): Grafserv {
  /**
   * Mutable options, change them by calling `setParams`. Don't dereference
   * properties as they should be dynamic.
   */
  const resolvedPreset = resolvePresets([preset]);
  let dynamicOptions = optionsFromConfig(resolvedPreset);

  const sendResult = (
    res: ServerResponse,
    handlerResult: HandlerResult,
  ): void => {
    switch (handlerResult.type) {
      case "graphql": {
        const { payload, statusCode = 200, asString } = handlerResult;

        handleErrors(payload);
        res.writeHead(statusCode, {
          "Content-Type": "application/json",
          ...(dynamicOptions.watch
            ? {
                "X-GraphQL-Event-Stream": dynamicOptions.eventStreamRoute,
              }
            : null),
        });
        const payloadString = stringifyPayload(payload as any, asString);
        res.end(payloadString);
        break;
      }
      case "graphqlIncremental": {
        const { iterator, statusCode = 200, asString } = handlerResult;
        res.writeHead(statusCode, {
          "Content-Type": 'multipart/mixed; boundary="-"',
          "Transfer-Encoding": "chunked",
          ...(dynamicOptions.watch
            ? {
                "X-GraphQL-Event-Stream": dynamicOptions.eventStreamRoute,
              }
            : null),
        });

        (async () => {
          // TODO: use manual looping so the iterable can be aborted without awaiting the promise
          try {
            for await (const payload of iterator) {
              handleErrors(payload);
              const payloadString = stringifyPayload(payload as any, asString);
              res.write(
                "\r\n---\r\nContent-Type: application/json\r\n\r\n" +
                  payloadString,
              );
            }
          } finally {
            res.write("\r\n-----\r\n");
            res.end();
          }
        })().catch((e) => {
          console.error(`Error occurred when streaming result: ${e}`);
          try {
            res.end();
          } catch (e2) {
            console.error(
              `A further error occurred when terminating the request: ${e2}`,
            );
          }
        });

        break;
      }
      case "text":
      case "html": {
        const { payload, statusCode = 200 } = handlerResult;
        res.writeHead(statusCode, {
          "Content-Type":
            handlerResult.type === "html"
              ? "text/html; charset=utf-8"
              : "text/plain; charset=utf-8",
        });
        res.end(payload);
        break;
      }
      case "event-stream": {
        const { payload: stream, statusCode = 200 } = handlerResult;

        // Making sure these options are set.
        res.req.socket.setTimeout(0);
        res.req.socket.setNoDelay(true);
        res.req.socket.setKeepAlive(true);

        // Set headers for Server-Sent Events.
        // Don't buffer EventStream in nginx
        res.setHeader("X-Accel-Buffering", "no");
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        if (res.req.httpVersionMajor >= 2) {
          // NOOP
        } else {
          res.setHeader("Connection", "keep-alive");
        }
        res.writeHead(statusCode);

        // Creates a stream for the response

        let stopped = false;
        const send = (event: EventStreamEvent) => {
          if (stopped) {
            return;
          }
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
          res.write(payload);
          // Technically we should see if `.write()` returned false, and if so we
          // should pause the stream. However, since our stream is coming from
          // watch mode, we find it unlikely that a significant amount of data
          // will be buffered (and we don't recommend watch mode in production),
          // so it doesn't feel like we need this currently. If it turns out you
          // need this, a PR would be welcome.

          if (typeof (res as any).flush === "function") {
            // https://github.com/expressjs/compression#server-sent-events
            (res as any).flush();
          } else if (typeof (res as any).flushHeaders === "function") {
            (res as any).flushHeaders();
          }
        };

        // Notify client that connection is open.
        send({ event: "open" });

        // Process stream
        const iterator = stream[Symbol.asyncIterator]();
        const waitNext = () => {
          const n = iterator.next();
          n.then(
            (r) => {
              if (!r.done || r.value) {
                send(r.value);
              }
              if (r.done) {
                res.end();
                cleanup();
                return;
              } else {
                if (!stopped) {
                  waitNext();
                }
              }
            },
            (error) => {
              console.error("Error occurred processing event stream:", error);
              send({
                event: "error",
                data: JSON.stringify({
                  errors: [
                    { message: "Error occurred processing event stream" },
                  ],
                }),
              });
              res.end();
              cleanup();
            },
          );
        };
        waitNext();

        // Clean up when connection closes.
        const cleanup = () => {
          stopped = true;
          try {
            iterator.return?.();
          } catch {
            /* nom nom nom */
          }
          res.req.removeListener("close", cleanup);
          res.req.removeListener("finish", cleanup);
          res.req.removeListener("error", cleanup);
        };
        res.req.on("close", cleanup);
        res.req.on("finish", cleanup);
        res.req.on("error", cleanup);
        break;
      }
      default: {
        const never: never = handlerResult;
        console.error(`Did not understand '${never}' passed to sendResult`);
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Unexpected input to sendResult");
      }
    }
  };

  const makeErrorHandler = (
    req: IncomingMessage,
    res: ServerResponse,
    next: any,
  ) => {
    if (typeof next === "function") {
      return next;
    }

    return (e: Error) => {
      console.error(e);
      sendResult(res, {
        statusCode: 500,
        type: "text",
        payload: "Internal server error",
      });
    };
  };

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

  const middleware: RequestListener = (req, res, next?: any): void => {
    const handleError = makeErrorHandler(req, res, next);

    // TODO: consider allowing GraphQL queries over 'GET'
    if (req.url === dynamicOptions.graphqlPath && req.method === "POST") {
      (async () => {
        const bodyRaw = await getBodyFromRequest(
          req,
          dynamicOptions.maxRequestLength,
        );
        // TODO: this parsing is unsafe (it doesn't even check the
        // content-type!) - replace it with V4's behaviour
        const body = JSON.parse(bodyRaw);
        const sP = isPromiseLike(serverParams)
          ? await serverParams
          : serverParams;
        const result = await sP.graphqlHandler(
          resolvedPreset,
          {
            httpRequest: req,
          },
          body,
        );
        sendResult(res, result);
      })().catch((e) => {
        // Special error handling for GraphQL route
        try {
          console.error(
            "An error occurred whilst attempting to handle the GraphQL request:",
          );
          console.dir(e);
          sendResult(res, {
            type: "graphql",
            payload: { errors: [e] },
            statusCode: 500,
          });
        } catch (e2) {
          console.error(
            "An error occurred whilst telling the user than an error occurred:",
            e2,
          );
        }
      });
      return;
    }

    // TODO: handle 'HEAD' requests
    if (
      dynamicOptions.graphiql &&
      (req.url === dynamicOptions.graphiqlPath ||
        (dynamicOptions.graphiqlOnGraphQLGET &&
          req.url === dynamicOptions.graphqlPath)) &&
      req.method === "GET"
    ) {
      (async () => {
        const sP = isPromiseLike(serverParams)
          ? await serverParams
          : serverParams;
        const result = await sP.graphiqlHandler();
        sendResult(res, result);
      })().catch(handleError);
      return;
    }

    if (
      dynamicOptions.watch &&
      req.url === dynamicOptions.eventStreamRoute &&
      req.method === "GET"
    ) {
      (async () => {
        const stream = makeStream();
        sendResult(res, {
          type: "event-stream",
          payload: stream,
          statusCode: 200,
        });
      })().catch(handleError);
      return;
    }

    // Not handled
    if (next) {
      return next();
    } else {
      console.log(`Unhandled ${req.method} to ${req.url}`);
      sendResult(res, {
        type: "text",
        payload: `Could not process ${req.method} request to ${req.url} ─ please POST requests to ${dynamicOptions.graphqlPath}`,
        statusCode: 404,
      });
      return;
    }
  };

  const releaseHandlers: Array<() => PromiseOrDirect<void>> = [];

  return {
    handler: middleware,
    async release() {
      for (const handler of releaseHandlers) {
        try {
          await handler();
        } catch (e) {
          /* nom nom nom */
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
