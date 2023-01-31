import type { Context } from "koa";
import type Koa from "koa";
import { PassThrough } from "node:stream";

import { GrafservBase } from "../../../core/base.js";
import type { GrafservConfig, RequestDigest } from "../../../interfaces.js";
import type { OptionsFromConfig } from "../../../options.js";
import {
  getBodyFromFrameworkBody,
  getBodyFromRequest,
  processHeaders,
} from "../../../utils.js";

declare global {
  namespace GraphileConfig {
    interface GraphQLRequestContext {
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
    // TODO: check Koa respects X-Forwarded-Proto when configured to trust the proxy
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

  public createHandler(): (ctx: Context, next: (err?: Error) => void) => void {
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
          // TODO: mutating the error is probably bad form...
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

  addTo(app: Koa) {
    app.use(this.createHandler());
  }
}

export function grafserv(config: GrafservConfig) {
  return new KoaGrafserv(config);
}
