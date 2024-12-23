import { createServerAdapter } from '@whatwg-node/server'

import { GrafservBase } from "../../core/base.js";
import type {
  GrafservConfig,
  RequestDigest,
  Result,
} from "../../interfaces.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Grafast {
    interface RequestContext {
        whatwg: {
            request: Request
        }
    }
  }
}

/** @experimental */
export class WhatwgGrafserv extends GrafservBase {
  protected whatwgRequestToGrafserv(
    request: Request
  ): RequestDigest {
    const url = new URL(request.url);
    return {
      httpVersionMajor: 1,
      httpVersionMinor: 0,
      isSecure: url.protocol === 'https://',
      method:  request.method,
      path: url.pathname,
      headers: this.processHeaders(request.headers),
      getQueryParams() {
        return Object.fromEntries(url.searchParams.entries()) as Record<string, string>;
      },
      async getBody() {
        const text = await request.text()
        return {
          type: "text",
          text,
        };
      },
      requestContext: {
        whatwg: {request}
      },
      preferJSON: true,
    };
  }

  protected processHeaders(headers: Headers): Record<string, string> {
    const headerDigest: Record<string, string> = Object.create(null);
    headers.forEach((v,k)=> {
      headerDigest[k]= v
    })
    return headerDigest
  }

  protected grafservResponseToWhatwg(response: Result | null): Response {
    if (response === null) {
      return new Response("¯\\_(ツ)_/¯", {status: 404, headers: new Headers({"Content-Type": "text/plain"})})
    }

    switch (response.type) {
      case "error": {
        const { statusCode, headers, error } = response;
        const respHeaders = new Headers(headers)
        respHeaders.append("Content-Type", "text/plain")
        return new Response(error.message, {status: statusCode, headers:respHeaders})
      }

      case "buffer": {
        const { statusCode, headers, buffer } = response;
        const respHeaders = new Headers(headers)
        return new Response(buffer.toString('utf8'), {status: statusCode, headers:respHeaders})
      }

      case "json": {
        const { statusCode, headers, json } = response;
        const respHeaders = new Headers(headers)
        return new Response(JSON.stringify(json), {status: statusCode, headers:respHeaders})
      }

      default: {
        console.log("Unhandled:");
        console.dir(response);
        return new Response("Server hasn't implemented this yet", {status: 501, headers: new Headers({"Content-Type": "text/plain"})})
      }
    }
  }

  createHandler() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return createServerAdapter(async (request: Request): Promise<Response> => {
      return this.grafservResponseToWhatwg(
        await this.processWhatwgRequest(
          request,
          this.whatwgRequestToGrafserv(request),
        ),
      );
    })
  }

  protected processWhatwgRequest(
    _request: Request,
    request: RequestDigest,
  ) {
    return this.processRequest(request);
  }
}

/** @experimental */
export function grafserv(config: GrafservConfig) {
  return new WhatwgGrafserv(config);
}
