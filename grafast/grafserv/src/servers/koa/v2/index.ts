import type { Context } from "koa";
import type Koa from "koa";
import type { IncomingMessage, Server as HTTPServer } from "node:http";
import type { Server as HTTPSServer } from "node:https";
import type { Duplex } from "node:stream";
import { PassThrough } from "node:stream";

import { GrafservBase } from "../../../core/base.js";
import type { GrafservConfig, RequestDigest } from "../../../interfaces.js";
import type { OptionsFromConfig } from "../../../options.js";
import {
  getBodyFromFrameworkBody,
  getBodyFromRequest,
  processHeaders,
} from "../../../utils.js";
import { makeNodeUpgradeHandler } from "../../node/index.js";

declare global {
  namespace Grafast {
    interface RequestContext {
      koav2: {
        ctx: Context;
      };
    }
  }
}

function getDigest(
  dynamicOptions: OptionsFromConfig,
  ctx: Context,
): RequestDigest {
  return {
    httpVersionMajor: ctx.req.httpVersionMajor,
    httpVersionMinor: ctx.req.httpVersionMinor,
    // Koa respects X-Forwarded-Proto when configured to trust the proxy
    isSecure: ctx.secure,
    method: ctx.request.method,
    path: ctx.request.url,
    headers: processHeaders(ctx.request.headers),
    getQueryParams() {
      return ctx.request.query as Record<string, string | string[]>;
    },
    getBody() {
      if ("body" in ctx.request) {
        return getBodyFromFrameworkBody(ctx.request.body);
      } else {
        // No koa-bodyparser, let's just read the body ourself
        return getBodyFromRequest(ctx.req, dynamicOptions.maxRequestLength);
      }
    },
    requestContext: {
      node: {
        req: ctx.req,
        res: ctx.res,
      },
      koav2: {
        ctx,
      },
    },
    preferJSON: true,
  };
}

export class KoaGrafserv extends GrafservBase {
  constructor(config: GrafservConfig) {
    super(config);
  }

  protected _createHandler(): (
    ctx: Context,
    next: (err?: Error) => void,
  ) => void {
    const dynamicOptions = this.dynamicOptions;
    return async (ctx, next) => {
      const request = getDigest(dynamicOptions, ctx);
      const result = await this.processRequest(request);

      if (result === null) {
        return next();
      }

      switch (result.type) {
        case "error": {
          const { statusCode, headers } = result;
          ctx.response.set(headers);
          ctx.response.status = statusCode;
          // DEBT: mutating the error is probably bad form...
          const errorWithStatus = Object.assign(result.error, {
            status: statusCode,
          });
          throw errorWithStatus;
        }
        case "buffer": {
          const { statusCode, headers, buffer } = result;
          ctx.response.set(headers);
          ctx.response.status = statusCode;
          ctx.response.body = buffer;
          return;
        }
        case "json": {
          const { statusCode, headers, json } = result;
          ctx.response.set(headers);
          ctx.response.status = statusCode;
          ctx.response.body = json;
          return;
        }
        case "noContent": {
          const { statusCode, headers } = result;
          ctx.response.set(headers);
          ctx.response.status = statusCode;
          ctx.response.body = null;
          return;
        }
        case "bufferStream": {
          const { statusCode, headers, lowLatency, bufferIterator } = result;
          if (lowLatency) {
            ctx.req.socket.setTimeout(0);
            ctx.req.socket.setNoDelay(true);
            ctx.req.socket.setKeepAlive(true);
          }
          ctx.response.set(headers);
          ctx.response.status = statusCode;
          const stream = new PassThrough();
          ctx.response.body = stream;
          for await (const buffer of bufferIterator) {
            stream.write(buffer);
          }

          return;
        }
        default: {
          const never: never = result;
          console.log("Unhandled:");
          console.dir(never);
          ctx.response.type = "text/plain";
          ctx.response.status = 503;
          ctx.response.body = "Server hasn't implemented this yet";
          return;
        }
      }
    };
  }

  async getUpgradeHandler() {
    if (this.resolvedPreset.grafserv?.websockets) {
      return makeNodeUpgradeHandler(this);
    } else {
      return null;
    }
  }
  shouldHandleUpgrade(req: IncomingMessage, _socket: Duplex, _head: Buffer) {
    const fullUrl = req.url;
    if (!fullUrl) {
      return false;
    }
    const q = fullUrl.indexOf("?");
    const url = q >= 0 ? fullUrl.substring(0, q) : fullUrl;
    const graphqlPath = this.dynamicOptions.graphqlPath;
    return url === graphqlPath;
  }

  async addTo(
    app: Koa,
    server: HTTPServer | HTTPSServer | null,
    addExclusiveWebsocketHandler = true,
  ) {
    app.use(this._createHandler());
    // Alias this just to make it easier for users to copy/paste the code below
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const serv = this;
    if (addExclusiveWebsocketHandler) {
      const grafservUpgradeHandler = await serv.getUpgradeHandler();
      if (grafservUpgradeHandler) {
        const upgrade = (
          req: IncomingMessage,
          socket: Duplex,
          head: Buffer,
        ) => {
          if (serv.shouldHandleUpgrade(req, socket, head)) {
            grafservUpgradeHandler(req, socket, head);
          } else {
            socket.destroy();
          }
        };

        const attachWebsocketsToServer = (server: HTTPServer | HTTPSServer) => {
          server.on("upgrade", upgrade);
          serv.onRelease(() => {
            server.off("upgrade", upgrade);
          });
        };

        if (server) {
          // If user explicitly passes server, bind to it:
          attachWebsocketsToServer(server);
        } else {
          // If not, hope they're calling `app.listen()` and intercept that call.
          const oldListen = app.listen;
          app.listen = function (...args: any) {
            const server = oldListen.apply(this, args);
            attachWebsocketsToServer(server);
            return server;
          };
        }
      }
    }
  }
}

export function grafserv(config: GrafservConfig) {
  return new KoaGrafserv(config);
}
