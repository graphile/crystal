import { promisify } from "node:util";
import { brotliCompress as brotliCompressCb, constants } from "node:zlib";

import type { PromiseOrDirect } from "grafast";
import type { Middleware } from "graphile-config";
import type { RuruServerConfig } from "ruru/server";
import { makeHTMLParts, ruruHTML } from "ruru/server";
import { getStaticFile } from "ruru/static";

import type {
  HandlerResult,
  NormalizedRequestDigest,
  RuruHTMLEvent,
} from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";

const brotliCompress = promisify(brotliCompressCb)

export function makeGraphiQLHandler(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  middleware: Middleware<GraphileConfig.GrafservMiddleware> | null,
  dynamicOptions: OptionsFromConfig,
): (request: NormalizedRequestDigest) => PromiseOrDirect<HandlerResult> {
  return async (request) => {
    const config = {
      ...resolvedPreset.ruru,
      // Override the ruru staticPath; this isn't for Ruru CLI
      staticPath: dynamicOptions.graphiqlStaticPath,
      endpoint: dynamicOptions.graphqlPath,
      // TODO: websocket endpoint
      clientConfig: {
        ...resolvedPreset.ruru?.clientConfig,
        debugTools:
          dynamicOptions.explain === true
            ? ["explain", "plan"]
            : dynamicOptions.explain === false
              ? []
              : (dynamicOptions.explain as any[]),
      },
    } satisfies RuruServerConfig;
    const htmlParts = makeHTMLParts(config);
    let html: string;
    if (middleware != null && middleware.middleware.ruruHTML != null) {
      html = await middleware.run(
        "ruruHTML",
        {
          resolvedPreset,
          config,
          htmlParts: { ...htmlParts },
          request,
        },
        ruruHTMLFromEvent,
      );
    } else {
      html = ruruHTML(config, htmlParts);
    }

    const statusCode = 200;
    const headers: Record<string, string> = Object.create(null)
    let payload = Buffer.from(html, 'utf8')

    const accept = request.getHeader('accept-encoding')
    if (typeof accept === 'string' && /\bbr\b/.test(accept)) {
      headers['content-encoding'] = 'br'
      payload = await brotliCompress(payload, {
        params: {
          // No compression is ~3.2KB and 100,000 compresses takes 195ms
          // Level 1 compression is ~1.2KB and 100,000 compresses takes 1.46s
          // Level 5 compression is ~0.96KB and 100,000 compresses takes 3.12s
          // Level 11 compression is ~0.85KB and 100,000 compresses takes 211s
          [constants.BROTLI_PARAM_QUALITY]: 5
        }
      })
    }

    return { type: "html", request, dynamicOptions, statusCode, headers, payload };
  };
}

export function makeGraphiQLStaticHandler(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  _middleware: Middleware<GraphileConfig.GrafservMiddleware> | null,
  dynamicOptions: OptionsFromConfig,
): (request: NormalizedRequestDigest) => PromiseOrDirect<HandlerResult> {
  return async (request) => {
    const file = await getStaticFile({
      ...resolvedPreset.ruru,
      // Override the ruru staticPath; this isn't for Ruru CLI
      staticPath: dynamicOptions.graphiqlStaticPath,
      urlPath: request.path,
      acceptEncoding: request.getHeader("accept-encoding"),
    });
    if (!file) {
      return {
        request,
        dynamicOptions,
        type: "notFound",
      };
    }

    const etag = request.getHeader("if-none-match");
    if (etag === file.headers.etag) {
      return {
        statusCode: 304,
        request,
        dynamicOptions,
        type: "noContent",
        headers: { etag },
      };
    }

    return {
      statusCode: 200,
      request,
      dynamicOptions,
      type: "raw",
      headers: file.headers,
      payload: file.content,
    };
  };
}

function ruruHTMLFromEvent(event: RuruHTMLEvent) {
  return ruruHTML(event.config, event.htmlParts);
}
