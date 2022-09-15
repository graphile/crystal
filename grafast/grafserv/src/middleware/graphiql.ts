import type { ServerParams } from "../interfaces.js";
import type { HandlerResult } from "./interfaces.js";

const ruruServer = import("ruru/server");
let ruruHTML:
  | Awaited<typeof ruruServer>["ruruHTML"]
  | undefined = undefined;

// TODO: use a specific version of mermaid
export function makeGraphiQLHandler(_params: ServerParams) {
  return async (): Promise<HandlerResult> => {
    if (!ruruHTML) {
      ruruHTML = (await ruruServer).ruruHTML;
    }
    const config = {};
    return {
      statusCode: 200,
      type: "html",
      payload: ruruHTML(config),
    };
  };
}
