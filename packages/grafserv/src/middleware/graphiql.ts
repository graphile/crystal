import type { ServerParams } from "../interfaces.js";
import type { HandlerResult } from "./interfaces.js";

const graphileInspectServer = import("graphile-inspect/server");
let graphileInspectHTML:
  | Awaited<typeof graphileInspectServer>["graphileInspectHTML"]
  | undefined = undefined;

// TODO: use a specific version of mermaid
export function makeGraphiQLHandler(_params: ServerParams) {
  return async (): Promise<HandlerResult> => {
    if (!graphileInspectHTML) {
      graphileInspectHTML = (await graphileInspectServer).graphileInspectHTML;
    }
    const config = {};
    return {
      statusCode: 200,
      type: "html",
      payload: graphileInspectHTML(config),
    };
  };
}
