import type { Deferred, TypedEventEmitter } from "dataplanner";
import { defer, isPromiseLike, stripAnsi } from "dataplanner";
import { resolvePresets } from "graphile-config";
import type { GraphQLSchema } from "graphql";
import { GraphQLError } from "graphql";
import type { IncomingMessage, RequestListener, ServerResponse } from "http";
import EventEmitter from "node:events";

import type { SchemaResult } from "../interfaces.js";
import { makeSchema, watchSchema } from "../schema.js";
import { makeGraphiQLHandler } from "./graphiql.js";
import { makeGraphQLHandler } from "./graphql.js";
import type { EventStreamEvent, HandlerResult } from "./interfaces.js";

function getBodyFromRequest(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    req.setEncoding("utf8");
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
    req.on("error", reject);
  });
}

export function postgraphile(preset: GraphileConfig.Preset): RequestListener & {
  release(): Promise<void>;
} {
  const config = resolvePresets([preset]);
  const {
    graphqlPath = "/graphql",
    graphiql = true,
    graphiqlOnGraphQLGET = true,
    graphiqlPath = "/",
    watch = false,
    eventStreamRoute = "/graphql/stream",
  } = config.server ?? {};

  const sendResult = (res: ServerResponse, handlerResult: HandlerResult) => {
    switch (handlerResult.type) {
      case "graphql": {
        const { payload, statusCode = 200 } = handlerResult;

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
        res.writeHead(statusCode, {
          "Content-Type": "application/json",
          ...(watch
            ? {
                "X-GraphQL-Event-Stream": eventStreamRoute,
              }
            : null),
        });
        res.end(JSON.stringify(payload));
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

  type SchemaResultAndHandlers = SchemaResult & {
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
  function addHandlers(r: SchemaResult): SchemaResultAndHandlers {
    eventEmitter.emit("newSchema", r.schema);
    return {
      ...r,
      graphqlHandler: makeGraphQLHandler(r),
      graphiqlHandler: makeGraphiQLHandler(r),
    };
  }

  let schemaResult:
    | Promise<SchemaResultAndHandlers>
    | Deferred<SchemaResultAndHandlers>
    | SchemaResultAndHandlers;
  let stopWatchingPromise: Promise<() => void> | null = null;
  if (config.server?.watch) {
    schemaResult = defer<SchemaResultAndHandlers>();
    stopWatchingPromise = watchSchema(preset, (error, result) => {
      if (error) {
        console.error("Watch error: ", error);
        return;
      }
      const resultWithHandlers = addHandlers(result!);
      if (
        schemaResult !== null &&
        "resolve" in schemaResult &&
        typeof schemaResult.resolve === "function"
      ) {
        schemaResult.resolve(resultWithHandlers);
      }
      schemaResult = resultWithHandlers;
    });
  } else {
    schemaResult = makeSchema(preset).then(addHandlers);
  }

  const middleware: RequestListener = (req, res, next?: any): void => {
    const handleError = makeErrorHandler(req, res, next);

    // TODO: consider allowing GraphQL queries over 'GET'
    if (req.url === graphqlPath && req.method === "POST") {
      (async () => {
        const bodyRaw = await getBodyFromRequest(req);
        const body = JSON.parse(bodyRaw);
        const sR = isPromiseLike(schemaResult)
          ? await schemaResult
          : schemaResult;
        const contextValue = sR.contextCallback(req);
        const result = await sR.graphqlHandler(contextValue, body);
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
      graphiql &&
      (req.url === graphiqlPath ||
        (graphiqlOnGraphQLGET && req.url === graphqlPath)) &&
      req.method === "GET"
    ) {
      (async () => {
        const sR = isPromiseLike(schemaResult)
          ? await schemaResult
          : schemaResult;
        const result = await sR.graphiqlHandler();
        sendResult(res, result);
      })().catch(handleError);
      return;
    }

    if (watch && req.url === eventStreamRoute && req.method === "GET") {
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
        payload: `Could not process ${req.method} request to ${req.url} ─ please POST requests to /graphql`,
        statusCode: 404,
      });
      return;
    }
  };

  return Object.assign(middleware, {
    async release() {
      if (stopWatchingPromise) {
        const cb = await stopWatchingPromise;
        cb();
      }
      // TODO: there's almost certainly more things that need releasing?
    },
  });
}
