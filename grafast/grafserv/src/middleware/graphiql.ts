import type { HandlerResult, NormalizedRequestDigest } from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";
import { getGrafservHooks } from "../hooks.js";

const ruruServerPromise = import("ruru/server");
type RuruServer = Awaited<typeof ruruServerPromise>;
let ruruServer: RuruServer | undefined;

// TODO: use a specific version of mermaid
export function makeGraphiQLHandler(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  dynamicOptions: OptionsFromConfig,
) {
  const hooks = getGrafservHooks(resolvedPreset);
  return async (request: NormalizedRequestDigest): Promise<HandlerResult> => {
    if (!ruruServer) {
      ruruServer = await ruruServerPromise;
    }
    const { baseHTMLParts, defaultHTMLParts, ruruHTML } = ruruServer;
    let htmlParts = baseHTMLParts;
    if (hooks.callbacks.ruruHTMLParts) {
      const hookData = {
        request,
        parts: defaultHTMLParts(),
      };
      await hooks.process("ruruHTMLParts", hookData);
      htmlParts = hookData.parts;
    }
    const config: Parameters<RuruServer["ruruHTML"]>[0] = {
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
