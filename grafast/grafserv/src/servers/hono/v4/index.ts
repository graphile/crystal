import { GRAPHQL_TRANSPORT_WS_PROTOCOL, makeServer } from "graphql-ws";
import type { Context as Ctx, Hono, MiddlewareHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import type { UpgradeWebSocket, WSContext } from "hono/ws";

import {
  convertHandlerResultToResult,
  GrafservBase,
  makeGraphQLWSConfig,
  normalizeRequest,
  processHeaders,
} from "../../../index.js";
import type {
  EventStreamHeandlerResult,
  GrafservBodyJSON,
  GrafservConfig,
  RequestDigest,
  Result,
} from "../../../interfaces.js";

declare global {
  namespace Grafast {
    interface RequestContext {
      honov4: {
        ctx: Ctx;
      };
    }
  }
}

function getDigest(ctx: Ctx): RequestDigest {
  const req = ctx.req;
  const res = ctx.res;
  return {
    httpVersionMajor: 1, // Hono uses Fetch API, which doesn't expose HTTP version
    httpVersionMinor: 1,
    isSecure: req.url.startsWith("https:"),
    method: req.method,
    path: req.path,
    headers: processHeaders(req.header()),
    getQueryParams() {
      return req.query();
    },
    async getBody() {
      const json = await req.json();
      if (!json) {
        throw new Error("Failed to retrieve body from hono");
      }
      return {
        type: "json",
        json,
      } as GrafservBodyJSON;
    },
    requestContext: {
      honov4: {
        ctx: ctx,
      },
      node: {
        // @ts-expect-error type imports
        req,
        res,
      },
    },
  };
}

export class HonoGrafserv extends GrafservBase {
  constructor(
    config: GrafservConfig,
    private upgradeWebSocket?: UpgradeWebSocket,
  ) {
    super(config);
  }

  public makeWsHandler(upgradeWebSocket: UpgradeWebSocket): MiddlewareHandler {
    const graphqlWsServer = makeServer(makeGraphQLWSConfig(this));
    return upgradeWebSocket((c) => {
      let onMessage: ((data: string) => void) | undefined;
      let onClose: ((code: number, reason: string) => void) | undefined;
      let isOpened = false;

      const initGraphqlServer = (ws: WSContext) => {
        onClose = graphqlWsServer.opened(
          {
            protocol: ws.protocol ?? GRAPHQL_TRANSPORT_WS_PROTOCOL,
            send(data) {
              ws.send(data);
            },
            close(code, reason) {
              console.log("close", code, reason);
              ws.close(code, reason);
              isOpened = false;
            },
            onMessage(cb) {
              onMessage = cb;
            },
          },
          { socket: ws, request: c.req },
        );
        isOpened = true;
      };

      return {
        onOpen(evt, ws) {
          initGraphqlServer(ws);
        },
        onMessage(evt, ws) {
          // cloudflare workers don't support the open event
          // so we initialize the server on the first message
          if (!isOpened) {
            initGraphqlServer(ws);
          }
          onMessage?.(evt.data);
        },
        onClose(evt) {
          onClose?.(evt.code, evt.reason);
        },
        onError(evt) {
          console.error("An error occured in the websocket:", evt);
        },
      };
    });
  }

  /**
   * @deprecated use handleGraphQLEvent instead
   */
  public async handleEvent(ctx: Ctx) {
    return this.handleGraphQLEvent(ctx);
  }

  public async handleGraphQLEvent(ctx: Ctx) {
    const digest = getDigest(ctx);

    const handlerResult = await this.graphqlHandler(
      normalizeRequest(digest),
      this.graphiqlHandler,
    );
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(ctx, result);
  }

  public async handleGraphiqlEvent(ctx: Ctx) {
    const digest = getDigest(ctx);

    const handlerResult = await this.graphiqlHandler(normalizeRequest(digest));
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(ctx, result);
  }

  public async handleEventStreamEvent(ctx: Ctx) {
    const digest = getDigest(ctx);

    const handlerResult: EventStreamHeandlerResult = {
      type: "event-stream",
      request: normalizeRequest(digest),
      dynamicOptions: this.dynamicOptions,
      payload: this.makeStream(),
      statusCode: 200,
    };
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(ctx, result);
  }

  public async send(ctx: Ctx, result: Result | null) {
    if (result === null) {
      // 404
      ctx.status(404);
      return ctx.text("¯\\_(ツ)_/¯");
    }

    switch (result.type) {
      case "error": {
        const { statusCode, headers } = result;
        this.setResponseHeaders(ctx, headers);
        ctx.status(statusCode as StatusCode);
        const errorWithStatus = Object.assign(result.error, {
          status: statusCode,
        });
        throw errorWithStatus;
      }
      case "buffer": {
        const { statusCode, headers, buffer } = result;
        this.setResponseHeaders(ctx, headers);
        ctx.status(statusCode as StatusCode);
        return ctx.body(buffer);
      }
      case "json": {
        const { statusCode, headers, json } = result;
        this.setResponseHeaders(ctx, headers);
        ctx.status(statusCode as StatusCode);
        return ctx.json(json);
      }
      case "noContent": {
        const { statusCode, headers } = result;
        this.setResponseHeaders(ctx, headers);
        ctx.status(statusCode as StatusCode);
        return ctx.body(null);
      }
      // TODO : handle bufferStream ?
      default: {
        const never = result;
        console.log("Unhandled:");
        console.dir(never);
        this.setResponseHeaders(ctx, { "Content-Type": "text/plain" });
        ctx.status(501);
        return "Server hasn't implemented this yet";
      }
    }
  }

  public async addTo(app: Hono) {
    const dynamicOptions = this.dynamicOptions;

    if (this.resolvedPreset.grafserv?.websockets && !this.upgradeWebSocket) {
      throw new Error(
        "grafserv.websockets is enabled but no upgradeWebSocket was provided",
      );
    }
    if (!this.resolvedPreset.grafserv?.websockets && this.upgradeWebSocket) {
      console.warn(
        "UpgradeWebSocket was provided but grafserv.websockets is disabled - websockets will not be activated",
      );
    }

    app.post(this.dynamicOptions.graphqlPath, (c) =>
      this.handleGraphQLEvent(c),
    );

    const websocketHandler =
      this.resolvedPreset.grafserv?.websockets && this.upgradeWebSocket
        ? this.makeWsHandler(this.upgradeWebSocket)
        : undefined;

    const shouldServeGetHandler =
      this.dynamicOptions.graphqlOverGET ||
      this.dynamicOptions.graphiqlOnGraphQLGET ||
      websocketHandler;

    if (shouldServeGetHandler) {
      app.get(this.dynamicOptions.graphqlPath, (c, next) => {
        if (c.req.header("Upgrade") === "websocket" && websocketHandler) {
          return websocketHandler(c, next);
        }
        return this.handleGraphQLEvent(c);
      });
    }

    if (dynamicOptions.graphiql) {
      app.get(this.dynamicOptions.graphiqlPath, (c) =>
        this.handleGraphiqlEvent(c),
      );
    }

    if (dynamicOptions.watch) {
      app.get(this.dynamicOptions.eventStreamPath, (c) =>
        this.handleEventStreamEvent(c),
      );
    }
  }

  private setResponseHeaders(ctx: Ctx, headers: Record<string, string>) {
    for (const key in headers) {
      ctx.header(key, headers[key]);
    }
  }
}

/**
 * Creates a new instance of HonoGrafserv.
 *
 * @param config - The configuration object for Grafserv.
 * @param upgradeWebSocket - Optional parameter required when using websockets.
 *        Hono uses the upgradeWebsocket helper depending on the environment.
 *        Refer to https://hono.dev/docs/helpers/websocket for more details.
 * @returns An instance of HonoGrafserv.
 */
export const grafserv = (
  config: GrafservConfig,
  upgradeWebSocket?: UpgradeWebSocket,
) => {
  return new HonoGrafserv(config, upgradeWebSocket);
};
