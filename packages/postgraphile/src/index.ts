import type { Deferred } from "grafast";
import { defer } from "grafast";
import type { ServerParams } from "grafserv";
import { grafserv } from "grafserv";
import { resolvePresets } from "graphile-config";

import { makeSchema, watchSchema } from "./schema.js";

export { makeSchema } from "./schema.js";

export { GraphileBuild, GraphileConfig };

export function postgraphile(preset: GraphileConfig.Preset) {
  const config = resolvePresets([preset]);
  let serverParams:
    | PromiseLike<ServerParams>
    | Deferred<ServerParams>
    | ServerParams;
  let stopWatchingPromise: Promise<() => void> | null = null;
  if (config.server?.watch) {
    serverParams = defer<ServerParams>();
    stopWatchingPromise = watchSchema(preset, (error, newParams) => {
      if (error || !newParams) {
        console.error("Watch error: ", error);
        return;
      }
      const oldServerParams = serverParams;
      serverParams = newParams;
      if (
        oldServerParams !== null &&
        "resolve" in oldServerParams &&
        typeof oldServerParams.resolve === "function"
      ) {
        oldServerParams.resolve(serverParams);
      }
      server.setParams(serverParams);
    });
  } else {
    serverParams = makeSchema(preset);
  }
  const server = grafserv(config, serverParams);
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
