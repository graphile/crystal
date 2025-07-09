import type { PromiseOrDirect } from "grafast";
import type { Middleware } from "graphile-config";
import type { RuruServerConfig } from "ruru/server";
import { makeHTMLParts, ruruHTML } from "ruru/server";

import type {
  HandlerResult,
  NormalizedRequestDigest,
  RuruHTMLEvent,
} from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";

export function makeGraphiQLHandler(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  middleware: Middleware<GraphileConfig.GrafservMiddleware> | null,
  dynamicOptions: OptionsFromConfig,
): (request: NormalizedRequestDigest) => PromiseOrDirect<HandlerResult> {
  return async (request) => {
    const config: RuruServerConfig = {
      ...resolvedPreset.ruru,
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
    };
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
    return {
      statusCode: 200,
      request,
      dynamicOptions,
      type: "html",
      payload: Buffer.from(html, "utf8"),
    };
  };
}

function ruruHTMLFromEvent(event: RuruHTMLEvent) {
  return ruruHTML(event.config, event.htmlParts);
}
