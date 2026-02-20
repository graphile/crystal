import { GRAPHQL_TRANSPORT_WS_PROTOCOL, makeServer } from "graphql-ws";
import type { Context as Ctx, Elysia, ElysiaWS } from "elysia";

import {
  convertHandlerResultToResult,
  GrafservBase,
  makeGraphQLWSConfig,
  normalizeRequest,
  processHeaders,
} from "../../../index.js";
import type {
  EventStreamHandlerResult,
  GrafservBodyJSON,
  GrafservConfig,
  RequestDigest,
  Result,
} from "../../../interfaces.js";

declare global {
  namespace Grafast {
    interface RequestContext {
      elysiav1: {
        ctx: Ctx;
      };
    }
  }
}

function getDigest(ctx: Ctx): RequestDigest {
  const req = ctx.request;
  return {
    httpVersionMajor: 1, // Elysia uses Fetch API, which doesn't expose HTTP version
    httpVersionMinor: 1,
    isSecure: req.url.startsWith("https:"),
    method: req.method,
    path: new globalThis.URL(req.url).pathname,
    headers: processHeaders(Object.fromEntries(req.headers.entries())),
    getQueryParams() {
      const url = new globalThis.URL(req.url);
      const params: Record<string, string | string[]> = {};
      url.searchParams.forEach((value: string, key: string) => {
        const existing = params[key];
        if (existing) {
          if (Array.isArray(existing)) {
            existing.push(value);
          } else {
            params[key] = [existing, value];
          }
        } else {
          params[key] = value;
        }
      });
      return params;
    },
    async getBody() {
      const json = await req.json();
      if (!json) {
        throw new Error("Failed to retrieve body from elysia");
      }
      return {
        type: "json",
        json,
      } as GrafservBodyJSON;
    },
    requestContext: {
      elysiav1: {
        ctx: ctx,
      },
    },
  };
}

const utf8TextDecoder = new globalThis.TextDecoder("utf-8");

export class ElysiaGrafserv extends GrafservBase {
  constructor(config: GrafservConfig) {
    super(config);
  }

  public makeWsHandler() {
    const graphqlWsServer = makeServer(makeGraphQLWSConfig(this));

    return {
      message: (
        ws: ElysiaWS<any, any, any>,
        message: string | ArrayBuffer,
      ) => {
        let data: string;
        if (typeof message === "string") {
          data = message;
        } else {
          try {
            data = utf8TextDecoder.decode(message);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(`Didn't understand the data`, e);
            try {
              ws.close(1003, "Unsupported data");
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(
                `Failed to close websocket, maybe it's already closed`,
                e,
              );
            }
            return;
          }
        }

        ws.data.onMessage?.(data);
      },
      open: (ws: ElysiaWS<any, any, any>) => {
        ws.data.onClose = graphqlWsServer.opened(
          {
            protocol: GRAPHQL_TRANSPORT_WS_PROTOCOL,
            send(data: string) {
              ws.send(data);
            },
            close(code: number, reason: string) {
              ws.close(code, reason);
            },
            onMessage(cb: (data: string) => void) {
              ws.data.onMessage = cb;
            },
          },
          { socket: ws, request: ws.data.request },
        );
      },
      close: (ws: ElysiaWS<any, any, any>, code: number, reason: string) => {
        ws.data.onClose?.(code, reason);
      },
    };
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

  public async handleGraphiqlStaticEvent(ctx: Ctx) {
    const digest = getDigest(ctx);

    const handlerResult = await this.graphiqlStaticHandler(
      normalizeRequest(digest),
    );
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(ctx, result);
  }

  public async handleEventStreamEvent(ctx: Ctx) {
    const digest = getDigest(ctx);

    const handlerResult: EventStreamHandlerResult = {
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
      ctx.set.status = 404;
      return "¯\\_(ツ)_/¯";
    }

    switch (result.type) {
      case "error": {
        const { statusCode, headers } = result;
        this.setResponseHeaders(ctx, headers);
        ctx.set.status = statusCode;
        throw result.error;
      }
      case "buffer": {
        const { statusCode, headers, buffer } = result;
        this.setResponseHeaders(ctx, headers);
        ctx.set.status = statusCode;
        return buffer;
      }
      case "json": {
        const { statusCode, headers, json } = result;
        this.setResponseHeaders(ctx, headers);
        ctx.set.status = statusCode;
        return json;
      }
      case "noContent": {
        const { statusCode, headers } = result;
        this.setResponseHeaders(ctx, headers);
        ctx.set.status = statusCode;
        return new globalThis.Response(null, { status: statusCode });
      }
      case "bufferStream": {
        const { statusCode, headers, bufferIterator } = result;

        this.setResponseHeaders(ctx, headers);
        ctx.set.status = statusCode;

        // Create a ReadableStream from the buffer iterator
        const stream = new globalThis.ReadableStream({
          async start(controller: ReadableStreamDefaultController<any>) {
            try {
              for await (const buffer of bufferIterator) {
                controller.enqueue(buffer);
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        });

        return new globalThis.Response(stream, {
          status: statusCode,
          headers: headers as any,
        });
      }
      default: {
        const never: never = result;
        // eslint-disable-next-line no-console
        console.log("Unhandled:");
        // eslint-disable-next-line no-console
        console.dir(never);
        this.setResponseHeaders(ctx, { "Content-Type": "text/plain" });
        ctx.set.status = 501;
        return "Server hasn't implemented this yet";
      }
    }
  }

  public async addTo(app: Elysia) {
    const dynamicOptions = this.dynamicOptions;

    app.post(this.dynamicOptions.graphqlPath, (c: Ctx) =>
      this.handleGraphQLEvent(c),
    );

    const shouldServeGetHandler =
      this.dynamicOptions.graphqlOverGET ||
      this.dynamicOptions.graphiqlOnGraphQLGET ||
      this.resolvedPreset.grafserv?.websockets;

    if (shouldServeGetHandler) {
      if (this.resolvedPreset.grafserv?.websockets) {
        // Add WebSocket support
        app.ws(this.dynamicOptions.graphqlPath, {
          ...this.makeWsHandler(),
          upgrade: (req: Request) => {
            // Only upgrade if it's a websocket request
            return {
              headers: req.headers,
              request: req,
            };
          },
        });
      }

      // Regular GET handler for GraphQL or GraphiQL
      app.get(this.dynamicOptions.graphqlPath, (c: Ctx) =>
        this.handleGraphQLEvent(c),
      );
    }

    if (dynamicOptions.graphiql) {
      app.get(this.dynamicOptions.graphiqlPath, (c: Ctx) =>
        this.handleGraphiqlEvent(c),
      );
    }

    if (dynamicOptions.watch) {
      app.get(this.dynamicOptions.eventStreamPath, (c: Ctx) =>
        this.handleEventStreamEvent(c),
      );
    }

    if (dynamicOptions.graphiql) {
      // Must come last, because wildcard
      app.get(this.dynamicOptions.graphiqlStaticPath + "*", (c: Ctx) =>
        this.handleGraphiqlStaticEvent(c),
      );
    }
  }

  private setResponseHeaders(ctx: Ctx, headers: Record<string, string>) {
    for (const key in headers) {
      if (key.toLowerCase() === "content-length") {
        // Elysia takes care of setting Content-Length for us
        continue;
      }
      ctx.set.headers[key] = headers[key];
    }
  }
}

/**
 * Creates a new instance of ElysiaGrafserv.
 *
 * @param config - The configuration object for Grafserv.
 * @returns An instance of ElysiaGrafserv.
 */
export const grafserv = (config: GrafservConfig) => {
  return new ElysiaGrafserv(config);
};
