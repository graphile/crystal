import type { PromiseOrDirect } from "grafast";
import type { Middleware } from "graphile-config";
import type { RuruHTMLParts, RuruServerConfig } from "ruru/server";
import { defaultHTMLParts, makeHTMLParts, ruruHTML } from "ruru/server";

import type { HandlerResult, NormalizedRequestDigest } from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";
import { noop } from "../utils.js";

export function makeGraphiQLHandler(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  middleware: Middleware<GraphileConfig.GrafservMiddleware>,
  dynamicOptions: OptionsFromConfig,
): (request: NormalizedRequestDigest) => PromiseOrDirect<HandlerResult> {
  const { htmlParts: htmlPartsFromConfig } = resolvedPreset?.ruru ?? {};
  const unhookedHTMLParts: RuruHTMLParts = {
    ...defaultHTMLParts,
    ...htmlPartsFromConfig,
  };
  return async (request) => {
    let htmlParts = unhookedHTMLParts!;
    if (middleware.middleware.ruruHTMLParts) {
      htmlParts = {
        ...makeHTMLParts(),
        ...htmlPartsFromConfig,
      };
      await middleware.run(
        "ruruHTMLParts",
        {
          resolvedPreset,
          htmlParts,
          request,
        },
        noop,
      );
    }
    const config: RuruServerConfig = {
      endpoint: dynamicOptions.graphqlPath,
      // TODO: websocket endpoint
      debugTools:
        dynamicOptions.explain === true
          ? ["explain", "plan"]
          : dynamicOptions.explain === false
          ? []
          : (dynamicOptions.explain as any[]),
    };
    return {
      statusCode: 200,
      request,
      dynamicOptions,
      type: "html",
      payload: Buffer.from(ruruHTML(config, htmlParts), "utf8"),
    };
  };
}
