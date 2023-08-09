import { PassThrough } from "stream";
import type {} from "../../node/index.js";
import {
  H3Event,
  getMethod,
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
  GrafservBodyBuffer,
  GrafservConfig,
  RequestDigest,
  Result,
} from "../../../interfaces.js";
import {
  GrafservBase,
  convertHandlerResultToResult,
  normalizeRequest,
  processHeaders,
} from "../../../index.js";

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
    method: getMethod(event),
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
  public async handleEvent(event: H3Event) {
    const digest = getDigest(event);

    const handlerResult = await this.graphqlHandler(
      normalizeRequest(digest),
      this.graphiqlHandler,
    );
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
          // if (lowLatency) {
          //   request.raw.socket.setTimeout(0);
          //   request.raw.socket.setNoDelay(true);
          //   request.raw.socket.setKeepAlive(true);
          // }
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
        setResponseHeader(event, "content-type", "text/plain");
        setResponseStatus(event, 503);
        return "Server hasn't implemented this yet";
      }
    }
  }
}

export function grafserv(config: GrafservConfig) {
  return new H3Grafserv(config);
}
