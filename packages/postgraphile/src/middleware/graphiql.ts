import { graphileInspectHTML } from "graphile-inspect/server";

import type { SchemaResult } from "../interfaces.js";
import type { HandlerResult } from "./interfaces.js";

// TODO: use a specific version of mermaid
export function makeGraphiQLHandler(_schemaResult: SchemaResult) {
  return async (): Promise<HandlerResult> => {
    const config = {};
    return {
      statusCode: 200,
      type: "html",
      payload: graphileInspectHTML(config),
    };
  };
}
