import type {
  ServerParams,
  HandlerResult,
  RequestDigest,
} from "../interfaces.js";
import { OptionsFromConfig } from "../options.js";

const ruruServer = import("ruru/server");
let ruruHTML: Awaited<typeof ruruServer>["ruruHTML"] | undefined = undefined;

// TODO: use a specific version of mermaid
export function makeGraphiQLHandler(
  _resolvedPreset: GraphileConfig.ResolvedPreset,
  dynamicOptions: OptionsFromConfig,
) {
  return async (request: RequestDigest): Promise<HandlerResult> => {
    if (!ruruHTML) {
      ruruHTML = (await ruruServer).ruruHTML;
    }
    const config = {};
    return {
      statusCode: 200,
      request,
      dynamicOptions,
      type: "html",
      payload: Buffer.from(ruruHTML(config), "utf8"),
    };
  };
}
