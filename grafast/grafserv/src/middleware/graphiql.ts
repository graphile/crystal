import type { AsyncHooks } from "graphile-config";
import type { RuruHTMLParts, RuruServerConfig } from "ruru/server";
import { defaultHTMLParts, makeHTMLParts, ruruHTML } from "ruru/server";

import type { HandlerResult, NormalizedRequestDigest } from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";

export function makeGraphiQLHandler(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  hooks: AsyncHooks<GraphileConfig.GrafservHooks>,
  dynamicOptions: OptionsFromConfig,
) {
  const { htmlParts: htmlPartsFromConfig } = resolvedPreset?.ruru ?? {};
  const unhookedHTMLParts: RuruHTMLParts = {
    ...defaultHTMLParts,
    ...htmlPartsFromConfig,
  };
  return async (request: NormalizedRequestDigest): Promise<HandlerResult> => {
    let htmlParts = unhookedHTMLParts!;
    if (hooks.callbacks.ruruHTMLParts) {
      htmlParts = {
        ...makeHTMLParts(),
        ...htmlPartsFromConfig,
      };
      await hooks.process("ruruHTMLParts", htmlParts, { request });
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
