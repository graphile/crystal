import type { HandlerResult, NormalizedRequestDigest } from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";
import { getGrafservHooks } from "../hooks.js";
import type { RuruHTMLParts, RuruServerConfig } from "ruru/server";
import { ruruHTML, defaultHTMLParts, baseHTMLParts } from "ruru/server";

// TODO: use a specific version of mermaid
export function makeGraphiQLHandler(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  dynamicOptions: OptionsFromConfig,
) {
  const { htmlParts: htmlPartsFromConfig } = resolvedPreset?.ruru ?? {};
  const hooks = getGrafservHooks(resolvedPreset);
  const initialHTMLParts: RuruHTMLParts = {
    ...baseHTMLParts,
    ...htmlPartsFromConfig,
  };
  return async (request: NormalizedRequestDigest): Promise<HandlerResult> => {
    let htmlParts = initialHTMLParts!;
    if (hooks.callbacks.ruruHTMLParts) {
      const hookData = {
        request,
        parts: {
          ...defaultHTMLParts(),
          ...htmlPartsFromConfig,
        },
      };
      await hooks.process("ruruHTMLParts", hookData);
      htmlParts = hookData.parts;
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
