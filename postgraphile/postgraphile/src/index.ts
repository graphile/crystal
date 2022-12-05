// Copy the types through for our dependents
import "graphile-build";
import "graphile-build-pg";

import type { Deferred } from "grafast";
import { defer } from "grafast";
// TODO: duplicate ServerParams locally to avoid the extra dependency?
import type { Grafserv, ServerParams } from "grafserv";
import { resolvePresets } from "graphile-config";
import type { GraphQLSchema } from "graphql";

import { makeSchema, watchSchema } from "./schema.js";

export { makePgSources, makeSchema } from "./schema.js";

export { GraphileBuild, GraphileConfig };

export function postgraphile(preset: GraphileConfig.Preset): {
  getGrafserv(): Promise<Grafserv>;
  getServerParams(): Promise<ServerParams>;
  getSchema(): Promise<GraphQLSchema>;
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
  function assertAlive() {
    if (released) {
      throw new Error(`PostGraphile instance has been released`);
    }
  }

  return {
    async getGrafserv() {
      assertAlive();
      if (!server) {
        const { grafserv } = await import("grafserv");

        server = grafserv(config, serverParams);
        server.onRelease(() => {
          if (!released) {
            throw new Error(
              `Grafserv instance released before PostGraphile instance; this is forbidden.`,
            );
          }
        });
      }
      return server;
    },
    async getServerParams() {
      assertAlive();
      return serverParams;
    },
    async getSchema() {
      assertAlive();
      return (await serverParams).schema;
    },
    async release() {
      assertAlive();
      released = true;
      if (server) {
        await server.release();
      }
      if (stopWatchingPromise) {
        try {
          const cb = await stopWatchingPromise;
          cb();
        } catch (e) {
          /* nom nom nom */
        }
      }
    },
  };
}

export default postgraphile;
