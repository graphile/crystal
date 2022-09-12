import type { Deferred } from "grafast";
import { defer } from "grafast";
import type { SchemaResult } from "grafserv";
import { grafserv } from "grafserv";
import { resolvePresets } from "graphile-config";

import { makeSchema, watchSchema } from "./schema.js";

export { makeSchema } from "./schema.js";

export { GraphileBuild, GraphileConfig };

export function postgraphile(preset: GraphileConfig.Preset) {
  const config = resolvePresets([preset]);
  let schemaResult:
    | PromiseLike<SchemaResult>
    | Deferred<SchemaResult>
    | SchemaResult;
  let stopWatchingPromise: Promise<() => void> | null = null;
  if (config.server?.watch) {
    schemaResult = defer<SchemaResult>();
    stopWatchingPromise = watchSchema(preset, (error, result) => {
      if (error || !result) {
        console.error("Watch error: ", error);
        return;
      }
      const oldSchemaResult = schemaResult;
      schemaResult = result;
      if (
        oldSchemaResult !== null &&
        "resolve" in oldSchemaResult &&
        typeof oldSchemaResult.resolve === "function"
      ) {
        oldSchemaResult.resolve(schemaResult);
      }
      server.setSchema(schemaResult);
    });
  } else {
    schemaResult = makeSchema(preset);
  }
  const server = grafserv(config, schemaResult);
  if (stopWatchingPromise) {
    const p = stopWatchingPromise;
    server.onRelease(async () => {
      try {
        const cb = await p;
        cb();
      } catch (e) {
        /* nom nom nom */
      }
    });
  }
  return server;
}
