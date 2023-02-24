// Copy the types through for our dependents
import "graphile-build";
import "graphile-build-pg";

import type { Deferred, PromiseOrDirect } from "grafast";
import { defer, isPromiseLike } from "grafast";
import type { GrafservBase, GrafservConfig } from "grafserv";
import { resolvePresets } from "graphile-config";
import type { GraphQLSchema } from "graphql";

import type { ServerParams } from "./interfaces.js";
import { makeSchema, watchSchema } from "./schema.js";

export { makeSchema } from "./schema.js";

export { GraphileBuild, GraphileConfig };

export interface PostGraphileInstance {
  createServ<TGrafserv extends GrafservBase>(
    grafserv: (config: GrafservConfig) => TGrafserv,
  ): TGrafserv;
  getServerParams(): PromiseOrDirect<ServerParams>;
  getSchema(): PromiseOrDirect<GraphQLSchema>;
  getResolvedPreset(): GraphileConfig.ResolvedPreset;
  release(): PromiseOrDirect<void>;
}

export function postgraphile(
  preset: GraphileConfig.Preset,
): PostGraphileInstance {
  const resolvedPreset = resolvePresets([preset]);
  let serverParams:
    | PromiseLike<ServerParams>
    | Deferred<ServerParams>
    | ServerParams;
  let stopWatchingPromise: Promise<() => void> | null = null;
  if (resolvedPreset.grafserv?.watch) {
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
        server.setPreset(serverParams.resolvedPreset);
        server.setSchema(serverParams.schema);
      }
    });
  } else {
    serverParams = makeSchema(preset);
  }
  let server: GrafservBase | undefined;

  let released = false;
  function assertAlive() {
    if (released) {
      throw new Error(`PostGraphile instance has been released`);
    }
  }

  return {
    createServ(grafserv) {
      assertAlive();
      if (server) {
        throw new Error(
          `createServ is currently only allowed to be called once; if you'd like to call it multiple times please file an issue with your use case and we can discuss implementing that.`,
        );
      }
      const schema = isPromiseLike(serverParams)
        ? serverParams.then((p) => p.schema)
        : serverParams.schema;
      const newServer = grafserv({
        preset,
        schema,
      });
      newServer.onRelease(() => {
        if (!released) {
          throw new Error(
            `Grafserv instance released before PostGraphile instance; this is forbidden.`,
          );
        }
      });
      server = newServer;
      return newServer;
    },
    async getServerParams() {
      assertAlive();
      return serverParams;
    },
    async getSchema() {
      assertAlive();
      return (await serverParams).schema;
    },
    getResolvedPreset() {
      return resolvedPreset;
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
