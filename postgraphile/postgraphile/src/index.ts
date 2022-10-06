import type { Deferred } from "grafast";
import { defer } from "grafast";
import type { Grafserv, ServerParams } from "grafserv";
import { grafserv } from "grafserv";
import { resolvePresets } from "graphile-config";

import { makeSchema, watchSchema } from "./schema.js";

export { makePgSourcesFromConnectionString, makeSchema } from "./schema.js";

export { GraphileBuild, GraphileConfig };

export function postgraphile(preset: GraphileConfig.Preset): {
  getServer(): Grafserv;
  getSchemaDetails(): Promise<ServerParams> | ServerParams;
  release(): Promise<void>;
} {
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
      if (server) {
        server.setParams(serverParams);
      }
    });
  } else {
    serverParams = makeSchema(preset);
  }
  let server: Grafserv | undefined;
  let released = false;
  return {
    getServer() {
      if (released) {
        throw new Error(`PostGraphile instance has been released`);
      }
      if (!server) {
        server = grafserv(config, serverParams);
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
      }
      return server;
    },
    async getSchemaDetails() {
      if (released) {
        throw new Error(`PostGraphile instance has been released`);
      }
      return serverParams;
    },
    async release() {
      if (released) {
        throw new Error(`PostGraphile instance has been released`);
      }
      released = true;
      if (server) {
        await server.release();
      }
    },
  };
}
