import type { SchemaResult } from "../interfaces.js";
import type { HandlerResult } from "./interfaces.js";
import { readFileSync } from "fs";
import * as path from "path";
import { graphileInspectHTML } from "graphile-inspect/server";

// TODO: use a specific version of mermaid
export function makeGraphiQLHandler(schemaResult: SchemaResult) {
  return async (): Promise<HandlerResult> => {
    const config = {};
    return {
      statusCode: 200,
      type: "html",
      payload: graphileInspectHTML(config),
    };
  };
}
