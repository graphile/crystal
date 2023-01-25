import { stringifyPayload } from "grafast";
import { IncomingMessage, ServerResponse } from "http";
import { GrafservBase } from "../../core/base";
import {
  GrafservConfig,
  SendResult,
  SendError,
  RequestDigest,
  EventStreamEvent,
} from "../../interfaces";
import { handleErrors } from "../../utils";

declare global {
  namespace Grafserv {
    interface RequestDigestFrameworkMeta {
      node: {
        req: IncomingMessage;
        res: ServerResponse;
      };
    }
  }
}

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
        // FIXME: validate this approach
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

function processHeaders(
  headers: IncomingMessage["headers"],
): Record<string, string> {
  const headerDigest: Record<string, string> = Object.create(null);
  for (const key in headers) {
    const val = headers[key];
    if (val == null) {
      continue;
    }
    if (typeof val === "string") {
      headerDigest[key] = val;
    } else {
      headerDigest[key] = val.join("\n");
    }
  }
  return headerDigest;
}

function getDigest(req: IncomingMessage, res: ServerResponse): RequestDigest {
  return {
    method: req.method!,
    path: req.url!,
    headers: processHeaders(req.headers),
    getBody(dynamicOptions) {
      return getBodyFromRequest(req, dynamicOptions.maxRequestLength);
    },
    frameworkMeta: {
      req,
      res,
    },
  };
}

const END = Buffer.from("\r\n-----\r\n", "utf8");

class NodeGrafserv extends GrafservBase {
  constructor(config: GrafservConfig) {
    super(config);
  }

  public createHandler(): (
    req: IncomingMessage,
    res: ServerResponse,
    next?: (err?: Error) => void,
  ) => void {
    return (req, res, next) => {
      try {
        const request = getDigest(req, res);
        const sendResult = this.makeSendResult(req, res, next);
        const sendError = this.makeSendError(req, res, next);
        this.processRequest({
          request,
          sendResult,
          sendError,
        });
      } catch (e) {
        console.error("Unexpected error occurred:");
        console.error(e);
        if (typeof next === "function") {
          next(e);
        } else {
          const text = "Unknown error occurred";
          res.writeHead(500, {
            "Content-Type": "text/plain",
            "Content-Length": text.length,
          });
          res.end(text);
        }
      }
    };
  }

  private makeSendResult(
    req: IncomingMessage,
    res: ServerResponse,
    next?: (err?: Error) => void,
  ): SendResult {
    const dynamicOptions = this.dynamicOptions;
    return function sendResult(handlerResult) {
      if (handlerResult == null) {
        // Not handled
        if (typeof next === "function") {
          return next();
        } else {
          console.log(`Unhandled ${req.method} to ${req.url}`);
          sendResult({
            type: "text",
            payload: Buffer.from(
              `Could not process ${req.method} request to ${req.url} ─ please POST requests to ${dynamicOptions.graphqlPath}`,
              "utf8",
            ),
            statusCode: 404,
          });
          return;
        }
      }
      switch (handlerResult.type) {
        case "graphql": {
          const { payload, statusCode = 200, asString } = handlerResult;

          handleErrors(payload);
          const payloadBuffer = Buffer.from(
            stringifyPayload(payload as any, asString),
            "utf8",
          );
          res.writeHead(statusCode, {
            "Content-Type": "application/json",
            ...(dynamicOptions.watch
              ? {
                  "X-GraphQL-Event-Stream": dynamicOptions.eventStreamRoute,
                }
              : null),
            "Content-Length": payloadBuffer.length,
          });
          res.end(payloadBuffer);
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
                const payloadBuffer = Buffer.from(
                  stringifyPayload(payload as any, asString),
                  "utf8",
                );
                res.write(
                  Buffer.from(
                    `\r\n---\r\nContent-Type: application/json\r\nContent-Length: ${payloadBuffer.length}\r\n\r\n`,
                    "utf8",
                  ),
                );
                res.write(payloadBuffer);
              }
            } finally {
              res.write(END);
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
            "Content-Length": payload.length,
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
          const payload = Buffer.from("Unexpected input to sendResult", "utf8");
          res.writeHead(500, {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Length": payload.length,
          });
          res.end(payload);
        }
      }
    };
  }

  private makeSendError(
    _req: IncomingMessage,
    res: ServerResponse,
    next?: (err?: Error) => void,
  ): SendError {
    if (typeof next === "function") {
      return next;
    }

    return (e: Error) => {
      console.error(e);
      const payload = Buffer.from("Internal server error", "utf8");
      res.writeHead(500, {
        "Content-Type": "text/plain",
        "Content-Length": payload.length,
      });
      res.end(payload);
    };
  }
}

export default function grafserv(config: GrafservConfig) {
  return new NodeGrafserv(config);
}
