import type { Context as HonoContext, Hono } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import {
  convertHandlerResultToResult,
  GrafservBase,
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
  constructor(config: GrafservConfig) {
    super(config);
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

    app.on(
      this.dynamicOptions.graphqlOverGET ||
        this.dynamicOptions.graphiqlOnGraphQLGET
        ? ["GET", "POST"]
        : ["POST"],
      this.dynamicOptions.graphqlPath,
      (c) => this.handleGraphQLEvent(c),
    );

    if (this.resolvedPreset.grafserv?.websockets) {
      console.warn(
        "You have enabled websockets, but the hono adapter doesn't support websockets yet.",
      );
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

export function grafserv(config: GrafservConfig) {
  return new HonoGrafserv(config);
}
