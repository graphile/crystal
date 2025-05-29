import { createServerAdapter } from '@whatwg-node/server'

import { GrafservBase } from "../../core/base.js";
import type {
  GrafservBody,
  GrafservConfig,
  RequestDigest,
  Result,
} from "../../interfaces.js";

import { OptionsFromConfig } from '../../options.js';
import { httpError } from '../../utils.js';

export function getBodyFromRequest(
  req: Request /* IncomingMessage */,
  maxLength: number,
): Promise<GrafservBody> {
  return new Promise(async (resolve, reject) => {
    const chunks: Buffer[] = [];
    let len = 0;
    const handleDataCb = (chunk: Uint8Array<ArrayBufferLike>) => {
      chunks.push(Buffer.from(chunk));
      len += chunk.length;
      if (len > maxLength) {
        reject(httpError(413, "Too much data"));
      }
    };
    const doneCb = () => {
      resolve({ type: "buffer", buffer: Buffer.concat(chunks) });
    };
    const reader = req.body?.getReader()
    if (!reader) {
      return doneCb()
    }
    while (true) {
      const {done, value} = await reader?.read()
      if (value) {
        handleDataCb(value)
      }
      if (done) {
        return doneCb()
      }
    }
  });
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Grafast {
    interface RequestContext {
        whatwg: {
            version:string
            request: Request
        }
    }
  }
}

/** @experimental */
export class WhatwgGrafserv extends GrafservBase {
  protected whatwgRequestToGrafserv(
    dynamicOptions: OptionsFromConfig,
    request: Request
  ): RequestDigest {
    const url = new URL(request.url);
    return {
      httpVersionMajor: 1,
      httpVersionMinor: 1,
      isSecure: url.protocol === 'https:',
      method:  request.method,
      path: url.pathname,
      headers: this.processHeaders(request.headers),
      getQueryParams() {
        return Object.fromEntries(url.searchParams.entries()) as Record<string, string>;
      },
      async getBody() {
        return getBodyFromRequest(request, dynamicOptions.maxRequestLength)
      },
      requestContext: {
        whatwg: {
          version:'whatwgv1',
          request
        }
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
        return new Response(buffer, {status: statusCode, headers:respHeaders})
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
      const dynamicOptions = this.dynamicOptions;
      return this.grafservResponseToWhatwg(
        await this.processWhatwgRequest(
          request,
          this.whatwgRequestToGrafserv(dynamicOptions, request),
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
