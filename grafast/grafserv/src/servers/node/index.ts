import type { IncomingMessage, Server, ServerResponse } from "node:http";
import { parse as parseQueryString } from "node:querystring";
import { makeServer, CloseCode } from "graphql-ws";
import { execute, hookArgs, subscribe } from "grafast";

import { GrafservBase } from "../../core/base.js";
import type { GrafservConfig, RequestDigest } from "../../interfaces.js";
import type { OptionsFromConfig } from "../../options.js";
import { getBodyFromRequest, processHeaders } from "../../utils.js";

declare global {
  namespace Grafast {
    interface RequestContext {
      node: {
        req: IncomingMessage;
        res: ServerResponse;
      };
    }
  }
}

export class NodeGrafservBase extends GrafservBase {
  constructor(config: GrafservConfig) {
    super(config);
  }

  protected getDigest(
    dynamicOptions: OptionsFromConfig,
    req: IncomingMessage,
    res: ServerResponse,
    isHTTPS: boolean,
  ): RequestDigest {
    const reqUrl = req.url!;
    const qi = reqUrl.indexOf("?");
    const path = qi >= 0 ? reqUrl.substring(0, qi) : reqUrl;
    const search = qi >= 0 ? reqUrl.substring(qi + 1) : null;
    return {
      httpVersionMajor: req.httpVersionMajor,
      httpVersionMinor: req.httpVersionMinor,
      isSecure: isHTTPS,
      method: req.method!,
      path,
      headers: processHeaders(req.headers),
      getQueryParams() {
        const queryParams = search
          ? parseQueryString(search)
          : Object.create(null);
        return queryParams;
      },
      getBody() {
        return getBodyFromRequest(req, dynamicOptions.maxRequestLength);
      },
      requestContext: {
        node: {
          req,
          res,
        },
      },
    };
  }

  /**
   * @deprecated Please user serv.addTo instead, so that websockets can be automatically supported
   */
  public createHandler(
    isHTTPS = false,
  ): (
    req: IncomingMessage,
    res: ServerResponse,
    next?: (err?: Error) => void,
  ) => void {
    return this._createHandler(isHTTPS);
  }

  protected _createHandler(
    isHTTPS = false,
  ): (
    req: IncomingMessage,
    res: ServerResponse,
    next?: (err?: Error) => void,
  ) => void {
    const dynamicOptions = this.dynamicOptions;
    // FIXME: 'async' here is risky
    return async (req, res, next) => {
      try {
        const request = this.getDigest(dynamicOptions, req, res, isHTTPS);
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
            if (result.error.safeMessage && result.error.statusCode) {
              const payload = Buffer.from(result.error.message, "utf8");
              res.writeHead(result.statusCode, {
                "Content-Type": "text/plain; charset=utf-8",
                "Content-Length": payload.length,
              });
              res.end(payload);
              return;
            } else if (typeof next === "function") {
              return next(result.error);
            } else {
              // TODO: catch all the code paths that lead here!
              const payload = Buffer.from("An error occurred", "utf8");
              res.writeHead(result.statusCode, {
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
          case "noContent": {
            const { statusCode, headers } = result;
            res.writeHead(statusCode, headers);
            res.end();
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

  async attachWebsocketsToServer(server: Server) {
    const graphqlPath = this.resolvedPreset.server?.graphqlPath ?? "/graphql";
    const ws = await import("ws");
    const { WebSocketServer } = ws;
    const graphqlWsServer = makeServer({
      schema: async () => this.getSchema(),
      execute: (args) => {
        hookArgs(
          args,
          {
            // TODO: we need to pass through some request context here
          },
          this.resolvedPreset,
        );
        return execute(args, this.resolvedPreset);
      },
      subscribe: (args) => {
        hookArgs(
          args,
          {
            // TODO: we need to pass through some request context here
          },
          this.resolvedPreset,
        );
        return subscribe(args, this.resolvedPreset);
      },
    });
    const wsServer = new WebSocketServer({ noServer: true });
    server.on("upgrade", (req, socket, head) =>
      wsServer.handleUpgrade(req, socket, head, function done(ws) {
        wsServer.emit("connection", ws, req);
      }),
    );
    wsServer.on("connection", (socket, request) => {
      const fullUrl = request.url;
      if (!fullUrl) {
        return;
      }
      const q = fullUrl.indexOf("?");
      const url = q >= 0 ? fullUrl.substring(0, q) : fullUrl;
      if (url === graphqlPath) {
        // a new socket opened, let graphql-ws take over
        const closed = graphqlWsServer.opened(
          {
            protocol: socket.protocol, // will be validated
            send: (data) =>
              new Promise((resolve, reject) => {
                socket.send(data, (err) => (err ? reject(err) : resolve()));
              }), // control your data flow by timing the promise resolve
            close: (code, reason) => socket.close(code, reason), // there are protocol standard closures
            onMessage: (cb) =>
              socket.on("message", async (event) => {
                try {
                  // wait for the the operation to complete
                  // - if init message, waits for connect
                  // - if query/mutation, waits for result
                  // - if subscription, waits for complete
                  await cb(event.toString());
                } catch (err) {
                  try {
                    // all errors that could be thrown during the
                    // execution of operations will be caught here
                    socket.close(CloseCode.InternalServerError, err.message);
                  } catch {
                    /*noop*/
                  }
                }
              }),
          },
          // pass values to the `extra` field in the context
          { socket, request },
        );

        // notify server that the socket closed
        socket.once("close", closed);
      }
    });
  }
}

export class NodeGrafserv extends NodeGrafservBase {
  async addTo(server: Server) {
    server.on("request", this._createHandler());
    if (this.resolvedPreset.server?.websockets) {
      this.attachWebsocketsToServer(server);
    }
  }
}

export function grafserv(config: GrafservConfig) {
  return new NodeGrafserv(config);
}
