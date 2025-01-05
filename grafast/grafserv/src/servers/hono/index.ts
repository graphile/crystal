import type { Context as HonoContext, Hono, MiddlewareHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import {
  convertHandlerResultToResult,
  GrafservBase,
  makeGraphQLWSConfig,
  normalizeRequest,
  processHeaders,
} from "../../index.js";
import type {
  EventStreamHeandlerResult,
  GrafservBodyJSON,
  GrafservConfig,
  RequestDigest,
  Result,
} from "../../interfaces.js";
import { GRAPHQL_TRANSPORT_WS_PROTOCOL, makeServer } from "graphql-ws";
import { UpgradeWebSocket } from "hono/ws";
import { web } from "webpack";

declare global {
  namespace Grafast {
    interface RequestContext {
      Hono: {
        honoContext: HonoContext;
      };
    }
  }
}

function getDigest(honoContext: HonoContext): RequestDigest {
  const req = honoContext.req;
  const res = honoContext.res;
  return {
    httpVersionMajor: 1, // Hono uses Fetch API, which doesn't expose HTTP version
    httpVersionMinor: 1,
    isSecure: req.url.startsWith("https"),
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
      hono: {
        context: honoContext,
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
      return {
        onOpen(evt, ws) {
          onClose = graphqlWsServer.opened(
            {
              protocol: ws.protocol ?? GRAPHQL_TRANSPORT_WS_PROTOCOL,
              send(data) {
                ws.send(data);
              },
              close(code, reason) {
                console.log("close", code, reason);
                ws.close(code, reason);
              },
              onMessage(cb) {
                onMessage = cb;
              },
            },
            { socket: ws, request: c.req },
          );
        },
        onMessage(evt, ws) {
          onMessage?.(evt.data);
        },
        onClose(evt, ws) {
          onClose?.(evt.code, evt.reason);
        },
        onError(evt, ws) {
          console.error("An error occured in the websocket:", evt);
        },
      };
    });
  }

  /**
   * @deprecated use handleGraphQLEvent instead
   */
  public async handleEvent(honoContext: HonoContext) {
    return this.handleGraphQLEvent(honoContext);
  }

  public async handleGraphQLEvent(honoContext: HonoContext) {
    const digest = getDigest(honoContext);

    const handlerResult = await this.graphqlHandler(
      normalizeRequest(digest),
      this.graphiqlHandler,
    );
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(honoContext, result);
  }

  public async handleGraphiqlEvent(honoContext: HonoContext) {
    const digest = getDigest(honoContext);

    const handlerResult = await this.graphiqlHandler(normalizeRequest(digest));
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(honoContext, result);
  }

  public async handleEventStreamEvent(honoContext: HonoContext) {
    const digest = getDigest(honoContext);

    const handlerResult: EventStreamHeandlerResult = {
      type: "event-stream",
      request: normalizeRequest(digest),
      dynamicOptions: this.dynamicOptions,
      payload: this.makeStream(),
      statusCode: 200,
    };
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(honoContext, result);
  }

  public async send(honoContext: HonoContext, result: Result | null) {
    if (result === null) {
      // 404
      honoContext.status(404);
      return honoContext.text("¯\\_(ツ)_/¯");
    }

    switch (result.type) {
      case "error": {
        const { statusCode, headers } = result;
        this.setResponseHeaders(honoContext, headers);
        honoContext.status(statusCode as StatusCode);
        const errorWithStatus = Object.assign(result.error, {
          status: statusCode,
        });
        throw errorWithStatus;
      }
      case "buffer": {
        const { statusCode, headers, buffer } = result;
        this.setResponseHeaders(honoContext, headers);
        honoContext.status(statusCode as StatusCode);
        return honoContext.body(buffer);
      }
      case "json": {
        const { statusCode, headers, json } = result;
        this.setResponseHeaders(honoContext, headers);
        honoContext.status(statusCode as StatusCode);
        return honoContext.json(json);
      }
      case "noContent": {
        const { statusCode, headers } = result;
        this.setResponseHeaders(honoContext, headers);
        honoContext.status(statusCode as StatusCode);
        return honoContext.body(null);
      }
      // TODO : handle bufferStream ?
      default: {
        const never = result;
        console.log("Unhandled:");
        console.dir(never);
        this.setResponseHeaders(honoContext, { "Content-Type": "text/plain" });
        honoContext.status(501);
        return "Server hasn't implemented this yet";
      }
    }
  }

  public async addTo(app: Hono) {
    const dynamicOptions = this.dynamicOptions;

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

  private setResponseHeaders(
    honoContext: HonoContext,
    headers: Record<string, string>,
  ) {
    for (const key in headers) {
      honoContext.header(key, headers[key]);
    }
  }
}

export function grafserv(
  config: GrafservConfig,
  upgradeWebSocket?: UpgradeWebSocket,
) {
  return new HonoGrafserv(config, upgradeWebSocket);
}
