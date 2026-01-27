// Copy the types through for our dependents
import "graphile-build-pg";

import type { PromiseOrDirect } from "grafast";
import { isPromiseLike, promiseWithResolve } from "grafast";
import type { GraphQLSchema } from "grafast/graphql";
import type { GrafservBase, GrafservConfig } from "grafserv";
import type { SchemaResult } from "graphile-build";
import { makeSchema, watchSchema } from "graphile-build";
import { resolvePreset } from "graphile-config";

export { makeSchema, watchSchema };

export interface PostGraphileInstance {
  createServ<TGrafserv extends GrafservBase>(
    grafserv: (config: GrafservConfig) => TGrafserv,
  ): TGrafserv;
  getSchemaResult(): PromiseOrDirect<SchemaResult>;
  getSchema(): PromiseOrDirect<GraphQLSchema>;
  getResolvedPreset(): GraphileConfig.ResolvedPreset;
  release(): PromiseOrDirect<void>;
}

export function postgraphile(
  preset: GraphileConfig.Preset,
): PostGraphileInstance {
  const resolvedPreset = resolvePreset(preset);
  let schemaResult: PromiseLike<SchemaResult> | SchemaResult;
  let stopWatchingPromise: Promise<() => void> | null = null;
  let released = false;
  let server: GrafservBase | undefined;
  if (resolvedPreset.grafserv?.watch) {
    let resolve: null | ((r: SchemaResult) => void);
    ({ resolve, promise: schemaResult } = promiseWithResolve<SchemaResult>());
    stopWatchingPromise = watchSchema(preset, async (error, newParams) => {
      if (error || !newParams) {
        console.error("Watch error: ", error);
        if (!released) {
          released = true;
          if (server) {
            try {
              await server.release();
            } catch (e) {
              console.error(`Failed to release server: `, e);
            }
          }
        }
        return;
      }
      schemaResult = newParams;
      if (resolve != null) {
        resolve(schemaResult);
        resolve = null;
      }
      if (server) {
        await server.ready();
        try {
          await server.setPreset(schemaResult.resolvedPreset);
          server.setSchema(schemaResult.schema);
        } catch (e) {
          console.error(
            "Error occurred whilst setting preset and schema to new result:",
          );
          console.error(e);
        }
      }
    });
  } else {
    schemaResult = makeSchema(preset);
  }

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
      const schema = isPromiseLike(schemaResult)
        ? schemaResult.then((p) => p.schema)
        : schemaResult.schema;
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
    async getSchemaResult() {
      assertAlive();
      return schemaResult;
    },
    async getSchema() {
      assertAlive();
      return (await schemaResult).schema;
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
