import type { HandlerResult, NormalizedRequestDigest } from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";

const ruruServer = import("ruru/server");
type RuruHTMLFunction = Awaited<typeof ruruServer>["ruruHTML"];
let ruruHTML: RuruHTMLFunction | undefined = undefined;

// TODO: use a specific version of mermaid
export function makeGraphiQLHandler(
  _resolvedPreset: GraphileConfig.ResolvedPreset,
  dynamicOptions: OptionsFromConfig,
) {
  return async (request: NormalizedRequestDigest): Promise<HandlerResult> => {
    if (!ruruHTML) {
      ruruHTML = (await ruruServer).ruruHTML;
    }
    const config: Parameters<RuruHTMLFunction>[0] = {
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
      payload: Buffer.from(ruruHTML(config), "utf8"),
    };
  };
}
