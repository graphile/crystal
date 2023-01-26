import type { IncomingMessage, ServerResponse } from "http";

import { GrafservBase } from "../../core/base.js";
import type { GrafservConfig, RequestDigest } from "../../interfaces.js";

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
    httpVersionMajor: req.httpVersionMajor,
    httpVersionMinor: req.httpVersionMinor,
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

class NodeGrafserv extends GrafservBase {
  constructor(config: GrafservConfig) {
    super(config);
  }

  public createHandler(): (
    req: IncomingMessage,
    res: ServerResponse,
    next?: (err?: Error) => void,
  ) => void {
    const dynamicOptions = this.dynamicOptions;
    // FIXME: 'async' here is risky
    return async (req, res, next) => {
      try {
        const request = getDigest(req, res);
        const result = await this.processRequest(request);

        if (result === null) {
          if (typeof next === "function") {
            return next();
          } else {
            const payload = Buffer.from(
              `Could not process ${req.method} request to ${req.url} ─ please POST requests to ${dynamicOptions.graphqlPath}`,
              "utf8",
            );
            res.writeHead(404, {
              "Content-Type": "text/plain; charset=utf-8",
              "Content-Length": payload.length,
            });
            res.end(payload);
            return;
          }
        }

        switch (result.type) {
          case "error": {
            if (typeof next === "function") {
              return next(result.error);
            } else {
              const payload = Buffer.from("An error occurred", "utf8");
              res.writeHead(500, {
                "Content-Type": "text/plain; charset=utf-8",
                "Content-Length": payload.length,
              });
              res.end(payload);
              return;
            }
          }
          case "buffer": {
            const { statusCode, headers, buffer } = result;
            res.writeHead(statusCode, headers);
            res.end(buffer);
            return;
          }
          case "json": {
            const { statusCode, headers, json } = result;
            const buffer = Buffer.from(JSON.stringify(json), "utf8");
            headers["Content-Length"] = String(buffer.length);
            res.writeHead(statusCode, headers);
            res.end(buffer);
            return;
          }
          case "bufferStream": {
            const { statusCode, headers, lowLatency, bufferIterator } = result;
            if (lowLatency) {
              req.socket.setTimeout(0);
              req.socket.setNoDelay(true);
              req.socket.setKeepAlive(true);
            }
            res.writeHead(statusCode, headers);

            // Clean up when connection closes.
            const cleanup = () => {
              try {
                bufferIterator.return?.();
              } catch {
                /* nom nom nom */
              }
              req.removeListener("close", cleanup);
              req.removeListener("finish", cleanup);
              req.removeListener("error", cleanup);
            };
            req.on("close", cleanup);
            req.on("finish", cleanup);
            req.on("error", cleanup);

            // https://github.com/expressjs/compression#server-sent-events
            const flush = lowLatency
              ? typeof (res as any).flush === "function"
                ? (res as any).flush.bind(res)
                : typeof (res as any).flushHeaders === "function"
                ? (res as any).flushHeaders.bind(res)
                : null
              : null;

            try {
              for await (const buffer of bufferIterator) {
                res.write(buffer);
                // FIXME: Technically we should see if `.write()` returned
                // false, and if so we should pause the stream.

                if (flush) {
                  flush();
                }
              }
            } catch (e) {
              console.error(
                `Error occurred during stream; swallowing error.`,
                e,
              );
            } finally {
              res.end();
            }
            return;
          }
          default: {
            const never: never = result;
            console.log("Unhandled:");
            console.dir(never);
            const payload = Buffer.from(
              "Server hasn't implemented this yet",
              "utf8",
            );
            res.writeHead(503, { "Content-Length": payload.length });
            res.end(payload);
            return;
          }
        }
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
}

export function grafserv(config: GrafservConfig) {
  return new NodeGrafserv(config);
}
