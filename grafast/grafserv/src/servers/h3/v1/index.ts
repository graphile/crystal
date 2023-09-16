import type { IncomingMessage, Server as HTTPServer } from "node:http";
import type { Server as HTTPSServer } from "node:https";
import type { Duplex } from "node:stream";
import { PassThrough } from "node:stream";

import type { App, H3Event } from "h3";
import {
  createRouter,
  eventHandler,
  getQuery,
  getRequestHeaders,
  getRequestProtocol,
  readRawBody,
  sendStream,
  setResponseHeader,
  setResponseHeaders,
  setResponseStatus,
} from "h3";

import {
  convertHandlerResultToResult,
  GrafservBase,
  normalizeRequest,
  processHeaders,
} from "../../../index.js";
import type {
  EventStreamHeandlerResult,
  GrafservBodyBuffer,
  GrafservConfig,
  RequestDigest,
  Result,
} from "../../../interfaces.js";
import { makeNodeUpgradeHandler } from "../../node/index.js";

declare global {
  namespace Grafast {
    interface RequestContext {
      h3v1: {
        event: H3Event;
      };
    }
  }
}

function getDigest(event: H3Event): RequestDigest {
  const req = event.node.req;
  const res = event.node.res;
  return {
    httpVersionMajor: req.httpVersionMajor,
    httpVersionMinor: req.httpVersionMinor,
    isSecure: getRequestProtocol(event) === "https",
    method: event.method,
    path: event.path,
    headers: processHeaders(getRequestHeaders(event)),
    getQueryParams() {
      return getQuery(event) as Record<string, string | string[]>;
    },
    async getBody() {
      const buffer = await readRawBody(event, false);
      if (!buffer) {
        throw new Error("Failed to retrieve body from h3");
      }
      return {
        type: "buffer",
        buffer,
      } as GrafservBodyBuffer;
    },
    requestContext: {
      h3v1: {
        event,
      },
      node: {
        req,
        res,
      },
    },
  };
}

export class H3Grafserv extends GrafservBase {
  constructor(config: GrafservConfig) {
    super(config);
  }

  /**
   * @deprecated use handleGraphQLEvent instead
   */
  public async handleEvent(event: H3Event) {
    return this.handleGraphQLEvent(event);
  }

  public async handleGraphQLEvent(event: H3Event) {
    const digest = getDigest(event);

    const handlerResult = await this.graphqlHandler(
      normalizeRequest(digest),
      this.graphiqlHandler,
    );
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(event, result);
  }

  public async handleGraphiqlEvent(event: H3Event) {
    const digest = getDigest(event);

    const handlerResult = await this.graphiqlHandler(normalizeRequest(digest));
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(event, result);
  }

  public async handleEventStreamEvent(event: H3Event) {
    const digest = getDigest(event);

    const handlerResult: EventStreamHeandlerResult = {
      type: "event-stream",
      request: normalizeRequest(digest),
      dynamicOptions: this.dynamicOptions,
      payload: this.makeStream(),
      statusCode: 200,
    };
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(event, result);
  }

  public async send(event: H3Event, result: Result | null) {
    if (result === null) {
      // 404
      setResponseStatus(event, 404);
      return "¯\\_(ツ)_/¯";
    }

    switch (result.type) {
      case "error": {
        const { statusCode, headers } = result;
        setResponseHeaders(event, headers);
        setResponseStatus(event, statusCode);
        // DEBT: mutating the error is probably bad form...
        const errorWithStatus = Object.assign(result.error, {
          status: statusCode,
        });
        throw errorWithStatus;
      }
      case "buffer": {
        const { statusCode, headers, buffer } = result;
        setResponseHeaders(event, headers);
        setResponseStatus(event, statusCode);
        return buffer;
      }
      case "json": {
        const { statusCode, headers, json } = result;
        setResponseHeaders(event, headers);
        setResponseStatus(event, statusCode);
        return json;
      }
      case "noContent": {
        const { statusCode, headers } = result;
        setResponseHeaders(event, headers);
        setResponseStatus(event, statusCode);
        return null;
      }
      case "bufferStream": {
        const { statusCode, headers, lowLatency, bufferIterator } = result;
        let bufferIteratorHandled = false;
        try {
          if (lowLatency) {
            event.node.req.socket.setTimeout(0);
            event.node.req.socket.setNoDelay(true);
            event.node.req.socket.setKeepAlive(true);
          }
          setResponseHeaders(event, headers);
          setResponseStatus(event, statusCode);
          const stream = new PassThrough();
          sendStream(event, stream).catch((e) => {
            console.error("An error occured when streaming to h3:");
            console.error(e);
          });

          // Fork off and convert bufferIterator to
          try {
            bufferIteratorHandled = true;
            for await (const buffer of bufferIterator) {
              stream.write(buffer);
            }
          } finally {
            stream.end();
          }
        } catch (e) {
          if (!bufferIteratorHandled) {
            try {
              if (bufferIterator.return) {
                bufferIterator.return();
              } else if (bufferIterator.throw) {
                bufferIterator.throw(e);
              }
            } catch (e2) {
              /* nom nom nom */
            }
          }
          throw e;
        }

        return;
      }
      default: {
        const never: never = result;
        console.log("Unhandled:");
        console.dir(never);
        setResponseHeader(event, "Content-Type", "text/plain");
        setResponseStatus(event, 503);
        return "Server hasn't implemented this yet";
      }
    }
  }

  public async addTo(app: App) {
    const dynamicOptions = this.dynamicOptions;

    const router = createRouter();
    app.use(router);

    router.use(
      this.dynamicOptions.graphqlPath,
      eventHandler((event) => this.handleGraphqlEvent(event)),
      this.dynamicOptions.graphqlOverGET ||
        this.dynamicOptions.graphiqlOnGraphQLGET
        ? ["get", "post"]
        : ["post"],
    );

    if (dynamicOptions.graphiql) {
      router.get(
        this.dynamicOptions.graphiqlPath,
        eventHandler((event) => this.handleGraphiqlEvent(event)),
      );
    }

    if (dynamicOptions.watch) {
      router.get(
        this.dynamicOptions.eventStreamPath,
        eventHandler((event) => this.handleEventStreamEvent(event)),
      );
    }
  }

  async getUpgradeHandler_experimental() {
    if (this.resolvedPreset.grafserv?.websockets) {
      return makeNodeUpgradeHandler(this);
    } else {
      return null;
    }
  }

  shouldHandleUpgrade_experimental(
    req: IncomingMessage,
    _socket: Duplex,
    _head: Buffer,
  ) {
    const fullUrl = req.url;
    if (!fullUrl) {
      return false;
    }
    const q = fullUrl.indexOf("?");
    const url = q >= 0 ? fullUrl.substring(0, q) : fullUrl;
    const graphqlPath = this.dynamicOptions.graphqlPath;
    return url === graphqlPath;
  }

  public async addTo_experimental(
    app: App,
    server: HTTPServer | HTTPSServer | undefined,
    addExclusiveWebsocketHandler = true,
  ) {
    this.addTo(app);

    if (addExclusiveWebsocketHandler && server) {
      await this.attachWebsocketsToServer_experimental(server);
    }
  }

  public async attachWebsocketsToServer_experimental(
    server: HTTPServer | HTTPSServer,
  ) {
    const grafservUpgradeHandler = await this.getUpgradeHandler_experimental();
    if (grafservUpgradeHandler) {
      const upgrade = (req: IncomingMessage, socket: Duplex, head: Buffer) => {
        if (this.shouldHandleUpgrade_experimental(req, socket, head)) {
          grafservUpgradeHandler(req, socket, head);
        } else {
          socket.destroy();
        }
      };
      server.on("upgrade", upgrade);
      this.onRelease(() => {
        server.off("upgrade", upgrade);
      });
    }
  }
}

export function grafserv(config: GrafservConfig) {
  return new H3Grafserv(config);
}
