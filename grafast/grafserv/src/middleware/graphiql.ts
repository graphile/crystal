import type { PromiseOrDirect } from "grafast";
import type { Middlewares } from "graphile-config";
import type { RuruHTMLParts, RuruServerConfig } from "ruru/server";
import { defaultHTMLParts, makeHTMLParts, ruruHTML } from "ruru/server";

import type { HandlerResult, NormalizedRequestDigest } from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";
import { noop } from "../utils.js";

export function makeGraphiQLHandler(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  middlewares: Middlewares<GraphileConfig.GrafservMiddlewares>,
  dynamicOptions: OptionsFromConfig,
): (request: NormalizedRequestDigest) => PromiseOrDirect<HandlerResult> {
  const { htmlParts: htmlPartsFromConfig } = resolvedPreset?.ruru ?? {};
  const unhookedHTMLParts: RuruHTMLParts = {
    ...defaultHTMLParts,
    ...htmlPartsFromConfig,
  };
  return async (request) => {
    let htmlParts = unhookedHTMLParts!;
    if (middlewares.middlewares.ruruHTMLParts) {
      htmlParts = {
        ...makeHTMLParts(),
        ...htmlPartsFromConfig,
      };
      await middlewares.run("ruruHTMLParts", noop, {
        resolvedPreset,
        htmlParts,
        request,
      });
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
