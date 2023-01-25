import type {
  ServerParams,
  HandlerResult,
  RequestDigest,
} from "../interfaces.js";

const ruruServer = import("ruru/server");
let ruruHTML: Awaited<typeof ruruServer>["ruruHTML"] | undefined = undefined;

// TODO: use a specific version of mermaid
export function makeGraphiQLHandler() {
  return async (_request: RequestDigest): Promise<HandlerResult> => {
    if (!ruruHTML) {
      ruruHTML = (await ruruServer).ruruHTML;
    }
    const config = {};
    return {
      statusCode: 200,
      type: "html",
      payload: Buffer.from(ruruHTML(config), "utf8"),
    };
  };
}
