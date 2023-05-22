import "./global.js";
import "./interfaces.js";

import { applyHooks, AsyncHooks, resolvePresets } from "graphile-config";
import type { GraphQLSchema } from "graphql";
import {
  getIntrospectionQuery,
  graphqlSync,
  lexicographicSortSchema,
  printSchema,
} from "graphql";

import extend from "./extend.js";
import { makeInitialInflection } from "./inflection.js";
import {
  AddNodeInterfaceToSuitableTypesPlugin,
  BuiltinScalarConnectionsPlugin,
  ClientMutationIdDescriptionPlugin,
  CommonTypesPlugin,
  CursorTypePlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  NodeAccessorPlugin,
  NodeIdCodecBase64JSONPlugin,
  NodeIdCodecPipeStringPlugin,
  NodePlugin,
  PageInfoStartEndCursorPlugin,
  QueryPlugin,
  QueryQueryPlugin,
  RegisterQueryNodePlugin,
  StreamDeferPlugin,
  SubscriptionPlugin,
  SwallowErrorsPlugin,
  TrimEmptyDescriptionsPlugin,
} from "./plugins/index.js";
import SchemaBuilder from "./SchemaBuilder.js";
export {
  camelCase,
  constantCase,
  constantCaseAll,
  EXPORTABLE,
  formatInsideUnderscores,
  pluralize,
  singularize,
  upperCamelCase,
  upperFirst,
} from "./utils.js";
import { isPromiseLike } from "grafast";

import type { GatherPluginContext } from "./interfaces.js";
import type { NewWithHooksFunction } from "./newWithHooks/index.js";
// export globals for TypeDoc
export { GraphileBuild, GraphileConfig };

export { NewWithHooksFunction, SchemaBuilder };

const EMPTY_OBJECT = Object.freeze(Object.create(null));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getSchemaHooks = (plugin: GraphileConfig.Plugin) => plugin.schema?.hooks;

/**
 * Generate 'build.inflection' from the given preset.
 */
export const buildInflection = (
  preset: GraphileConfig.Preset,
): GraphileBuild.Inflection => {
  const resolvedPreset = resolvePresets([preset]);
  const { plugins, inflection: _options = {} } = resolvedPreset;

  const inflectors: Partial<GraphileBuild.Inflection> = makeInitialInflection();

  // Add the base inflectors
  if (plugins) {
    for (const plugin of plugins) {
      if (plugin.inflection?.add) {
        const inflectorsToAdd = plugin.inflection.add;
        for (const inflectorName of Object.keys(
          inflectorsToAdd,
        ) as (keyof GraphileBuild.Inflection)[]) {
          const fn = inflectorsToAdd[inflectorName];
          if (fn) {
            const inflector = (fn as any).bind(
              inflectors as GraphileBuild.Inflection,
              preset,
            );
            extend(
              inflectors,
              { [inflectorName]: inflector },
              `Adding inflectors from ${plugin.name}`,
            );
          }
        }
      }
    }

    // Overwrite the inflectors
    applyHooks(
      plugins,
      (plugin) => plugin.inflection?.replace,
      (inflectorName, replacementFunction, plugin) => {
        const previous = inflectors[inflectorName];
        const ignore = plugin.inflection?.ignoreReplaceIfNotExists ?? [];
        if (!previous && ignore?.includes(inflectorName)) {
          // Do nothing
        } else {
          if (!previous) {
            console.warn(
              `Plugin '${plugin.name}' attempted to overwrite inflector '${inflectorName}', but no such inflector exists.`,
            );
          }
          const inflector = (replacementFunction as any).bind(
            inflectors as GraphileBuild.Inflection,
            previous,
            preset,
          );
          inflectors[inflectorName as keyof GraphileBuild.Inflection] =
            inflector;
        }
      },
    );
  }

  return inflectors as GraphileBuild.Inflection;
};

/**
 * @internal
 */
const gatherBase = (
  preset: GraphileConfig.Preset,
  {
    inflection,
  }: {
    inflection: GraphileBuild.Inflection;
  } = { inflection: buildInflection(preset) },
) => {
  const resolvedPreset = resolvePresets([preset]);
  const options = resolvedPreset.gather || {};
  const plugins = resolvedPreset.plugins;
  const globalState: { [key: string]: any } = Object.create(null);
  const gatherState: { [key: string]: any } = Object.create(null);
  const helpers: { [key: string]: any } = Object.create(null); // GatherHelpers

  const hooks = new AsyncHooks<GraphileConfig.GatherHooks>();

  const pluginContext = new Map<
    GraphileConfig.Plugin,
    GatherPluginContext<any, any>
  >();

  const gatherPlugins = plugins?.filter((p) => p.gather);

  if (gatherPlugins) {
    // Prepare the plugins to run by preparing their initial states, and registering the helpers (hooks area already done).
    for (const plugin of gatherPlugins) {
      const spec = plugin.gather!;
      if (spec.namespace != null) {
        if (spec.namespace in globalState) {
          // TODO: track who registers which namespace, output more helpful error.
          throw new Error(
            `Namespace '${spec.namespace}' was already registered, it cannot be registered by two plugins - namespaces must be unique.`,
          );
        }
      }
      const cache =
        spec.namespace != null
          ? (globalState[spec.namespace] =
              spec.initialCache?.() ?? Object.create(null))
          : EMPTY_OBJECT;
      if (typeof cache.then === "function") {
        // TODO: can we just make `initialCache` allow promises?
        throw new Error(
          `\`initialCache\` may not return a promise directly; instead set one of the keys on the object it returns to a promise and await that in \`initialState\` (which is allowed to be async)`,
        );
      }
      const state = EMPTY_OBJECT;
      const context: GatherPluginContext<any, any> = {
        helpers: helpers as GraphileConfig.GatherHelpers,
        options,
        state,
        cache,
        process: hooks.process.bind(hooks),
        inflection,
        resolvedPreset,
      };
      pluginContext.set(plugin, context);
      if (spec.namespace != null) {
        helpers[spec.namespace] = Object.create(null);
        if (spec.helpers != null) {
          const specHelpers = spec.helpers;
          for (const helperName of Object.keys(specHelpers)) {
            helpers[spec.namespace][helperName] = (...args: any[]): any => {
              return (specHelpers as Record<string, any>)[helperName](
                context,
                ...args,
              );
            };
          }
        }
      }
    }

    // Register the hooks
    applyHooks(
      gatherPlugins,
      (p) => p.gather!.hooks,
      (name, fn, plugin) => {
        const context = pluginContext.get(plugin)!;

        // hooks.hook(name, (...args) => fn(context, ...args));
        (hooks.hook as any)(
          name as any,
          ((...args: any[]) => (fn as any)(context, ...args)) as any,
        );
      },
    );
  }

  async function run() {
    const output: Partial<GraphileBuild.BuildInput> = Object.create(null);
    if (gatherPlugins) {
      // Reset state
      for (const plugin of gatherPlugins) {
        const spec = plugin.gather!;
        const context = pluginContext.get(plugin)!;
        if (spec.namespace != null) {
          const val =
            typeof spec.initialState === "function"
              ? await spec.initialState(context.cache)
              : {};
          context.state = gatherState[spec.namespace] = val;
        }
      }

      // Now call the main functions
      for (const plugin of gatherPlugins) {
        const spec = plugin.gather!;
        if (spec.main) {
          const context = pluginContext.get(plugin)!;
          await spec.main(output, context);
        }
      }
    }

    return output as GraphileBuild.BuildInput;
  }

  async function watch(
    callback: (
      gather: GraphileBuild.BuildInput | null,
      error: Error | undefined,
      retry: () => void,
    ) => void,
  ): Promise<() => void> {
    let stopped = false;
    const unlisten: Array<() => void> = [];
    let runAgain = false;
    let runInProgress = true;
    let counter = 0;
    const handleChange = () => {
      if (stopped) {
        return;
      }
      if (runInProgress) {
        runAgain = true;
        return;
      }
      ++counter;
      runAgain = false;
      runInProgress = true;
      run().then(
        (v) => {
          runInProgress = false;
          if (stopped) return;
          try {
            callback(v, undefined, makeRetry(counter));
          } catch {
            // TODO: this indicates a bug in user code; how to handle?
            /*nom nom nom*/
          }
          if (runAgain) handleChange();
        },
        (e) => {
          runInProgress = false;
          if (stopped) return;
          try {
            callback(null, e, makeRetry(counter));
          } catch {
            // TODO: this indicates a bug in user code; how to handle?
            /*nom nom nom*/
          }
          if (runAgain) handleChange();
        },
      );
    };
    const makeRetry = (currentCounter: number): (() => void) => {
      return () => {
        if (currentCounter === counter) {
          handleChange();
        } else {
          // Another change was already registered; ignore
        }
      };
    };

    if (gatherPlugins) {
      // Put all the plugins into watch mode.
      for (const plugin of gatherPlugins) {
        const spec = plugin.gather!;
        if (spec.watch) {
          const context = pluginContext.get(plugin)!;
          unlisten.push(await spec.watch(context, handleChange));
        }
      }
    }

    // Trigger the first build, being sure it completes before resolving
    try {
      // Clear 'runAgain' since we're starting now
      runAgain = false;
      const firstResult = await run();
      callback(firstResult, undefined, makeRetry(counter));
    } catch (e) {
      callback(null, e, makeRetry(counter));
    }
    runInProgress = false;

    if (runAgain) {
      handleChange();
    }

    // Return the unlistener.
    return () => {
      stopped = true;
      unlisten.forEach((cb) => cb());
    };
  }

  return {
    run,
    watch,
  };
};

/**
 * One-time gather. See `watchGather` for watch mode.
 */
export const gather = (
  preset: GraphileConfig.Preset,
  helpers?: {
    inflection: GraphileBuild.Inflection;
  },
): Promise<GraphileBuild.BuildInput> => {
  const { run } = gatherBase(preset, helpers);
  return run();
};

/**
 * Tells your gather plugins to monitor their sources, and passes the resulting
 * BuildInput to the callback each time a new one is generated. It is
 * guaranteed that the `callback` will be called at least once before the
 * promise resolves.
 *
 * @returns A callback to call to stop watching.
 */
export const watchGather = (
  preset: GraphileConfig.Preset,
  helpers:
    | {
        inflection: GraphileBuild.Inflection;
      }
    | undefined,
  callback: (
    gather: GraphileBuild.BuildInput | null,
    error: Error | undefined,
    retry: () => void,
  ) => void,
): Promise<() => void> => {
  const { watch } = gatherBase(preset, helpers);
  return watch(callback);
};

/**
 * Gets a SchemaBuilder object for the given preset and inflection.  It's rare
 * you would need this, typically you'll want `buildSchema` instead.
 */
export const getBuilder = (
  preset: GraphileConfig.Preset,
  inflection: GraphileBuild.Inflection = buildInflection(preset),
): SchemaBuilder => {
  const resolvedPreset = resolvePresets([preset]);
  const { plugins, schema: options } = resolvedPreset;
  const builder = new SchemaBuilder(options || {}, inflection);
  if (plugins) {
    applyHooks(plugins, getSchemaHooks, (hookName, hookFn, plugin) => {
      builder._setPluginName(plugin.name);
      builder.hook(hookName, hookFn);
      builder._setPluginName(null);
    });
  }
  return builder;
};

async function writeFileIfDiffers(
  path: string,
  contents: string,
): Promise<void> {
  // TODO: support other environments than Node
  const { readFile, writeFile } = await import("node:fs/promises");
  let oldContents: string | null = null;
  try {
    oldContents = await readFile(path, "utf8");
  } catch (e) {
    /* noop */
  }
  if (oldContents !== contents) {
    await writeFile(path, contents);
  }
}

/**
 * Builds a GraphQL schema according to the given preset and input data.
 */
export const buildSchema = (
  preset: GraphileConfig.Preset,
  input: GraphileBuild.BuildInput,
  shared: {
    inflection?: GraphileBuild.Inflection;
  } = {},
): GraphQLSchema => {
  const builder = getBuilder(preset, shared.inflection);
  const schema = builder.buildSchema(input);
  const {
    exportSchemaSDLPath,
    exportSchemaIntrospectionResultPath,
    sortExport = false,
  } = builder.options;
  const schemaToExport =
    (exportSchemaSDLPath || exportSchemaIntrospectionResultPath) && sortExport
      ? lexicographicSortSchema(schema)
      : schema;
  if (exportSchemaSDLPath) {
    const text = printSchema(schemaToExport) + "\n";
    writeFileIfDiffers(exportSchemaSDLPath, text).catch((e) => {
      console.error(
        `Failed to write schema in GraphQL format to '${exportSchemaSDLPath}': ${e}`,
      );
    });
  }
  if (exportSchemaIntrospectionResultPath) {
    const introspectionQuery = getIntrospectionQuery();
    const introspectionResult = graphqlSync({
      source: introspectionQuery,
      schema: schemaToExport,
    });
    const text = JSON.stringify(introspectionResult, null, 2) + "\n";
    writeFileIfDiffers(exportSchemaIntrospectionResultPath, text).catch((e) => {
      console.error(
        `Failed to write schema introspection results in JSON format to '${exportSchemaIntrospectionResultPath}': ${e}`,
      );
    });
  }

  return schema;
};

export {
  AddNodeInterfaceToSuitableTypesPlugin,
  BuiltinScalarConnectionsPlugin,
  ClientMutationIdDescriptionPlugin,
  CommonTypesPlugin,
  CursorTypePlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  NodeAccessorPlugin,
  NodeIdCodecBase64JSONPlugin,
  NodeIdCodecPipeStringPlugin,
  NodePlugin,
  PageInfoStartEndCursorPlugin,
  QueryPlugin,
  QueryQueryPlugin,
  RegisterQueryNodePlugin,
  StreamDeferPlugin,
  SubscriptionPlugin,
  SwallowErrorsPlugin,
  TrimEmptyDescriptionsPlugin,
};
export { GatherPluginContext } from "./interfaces.js";
export { defaultPreset } from "./preset.js";

export interface SchemaResult {
  schema: GraphQLSchema;
  resolvedPreset: GraphileConfig.ResolvedPreset;
}

/**
 * Builds the GraphQL schema by resolving the preset, running inflection then
 * gather and building the schema. Returns the results.
 *
 * @experimental
 */
export async function makeSchema(
  preset: GraphileConfig.Preset,
  // TODO: AbortSignal
): Promise<SchemaResult> {
  const resolvedPreset = resolvePresets([preset]);
  // An error caused here cannot be solved by retrying, so don't catch it.
  const inflection = buildInflection(resolvedPreset);
  const shared = { inflection };

  const retryOnInitFail = resolvedPreset.schema?.retryOnInitFail;

  let phase: "GATHER" | "SCHEMA" | "UNKNOWN" = "UNKNOWN";
  const make = async () => {
    phase = "GATHER";
    const input = await gather(resolvedPreset, shared);

    phase = "SCHEMA";
    const schema = buildSchema(resolvedPreset, input, shared);

    return { schema, resolvedPreset };
  };
  if (retryOnInitFail) {
    // eslint-disable-next-line no-constant-condition
    for (let attempts = 1; true; attempts++) {
      try {
        const result = await make();
        if (attempts > 1) {
          console.warn(
            `Schema constructed successfully on attempt ${attempts}.`,
          );
        }
        return result;
      } catch (error) {
        await sleepFromRetryOnInitFail(retryOnInitFail, phase, attempts, error);
      }
    }
  } else {
    return make();
  }
}

async function sleepFromRetryOnInitFail(
  retryOnInitFail:
    | boolean
    | ((
        error: Error,
        attempts: number,
        delay: number,
      ) => boolean | Promise<boolean>),
  phase: "GATHER" | "SCHEMA" | "UNKNOWN",
  attempts: number,
  error: Error,
) {
  const delay = Math.min(100 * Math.pow(attempts, 2), 30000);

  const start = process.hrtime();
  const retryOrPromise =
    typeof retryOnInitFail === "function"
      ? retryOnInitFail(error, attempts, delay)
      : retryOnInitFail;

  if (retryOrPromise === false) {
    throw error;
  }

  console.warn(
    `Error occurred whilst building the schema (phase = ${phase}; attempt ${attempts}). We'll try again ${
      retryOrPromise === true ? `in ${delay}ms` : `shortly`
    }.\n  ${String(error.stack ?? error).replace(/\n/g, "\n  ")}`,
  );

  if (retryOrPromise === true) {
    await sleep(delay);
  } else if (!isPromiseLike(retryOrPromise)) {
    throw new Error(
      `Invalid retryOnInitFail setting; must be true, false, or an optionally async function that resolves to true/false`,
    );
  } else {
    const retry = await retryOrPromise;
    const diff = process.hrtime(start);
    const dur = diff[0] * 1e3 + diff[1] * 1e-6;
    if (!retry) {
      throw error;
    } else if (dur < 50) {
      // retryOnInitFail didn't wait long enough; use default wait.
      console.error(
        `Your retryOnInitFail function should include a delay of at least 50ms before resolving; falling back to a ${delay}ms wait (attempts = ${attempts}) to avoid overwhelming the database.`,
      );
      await sleep(delay);
    } else {
      // The promise already waited long enough, continue
    }
  }
}

/**
 * Runs the "gather" phase in watch mode and calls 'callback' with the
 * generated SchemaResult each time a new schema is generated.
 *
 * It is guaranteed that `callback` will be called at least once before the
 * promise resolves.
 *
 * Returns a function that can be called to stop watching.
 *
 * @experimental
 */
export async function watchSchema(
  preset: GraphileConfig.Preset,
  callback: (fatalError: Error | null, params?: SchemaResult) => void,
): Promise<() => void> {
  const resolvedPreset = resolvePresets([preset]);
  const shared = { inflection: buildInflection(resolvedPreset) };

  const retryOnInitFail = resolvedPreset.schema?.retryOnInitFail;
  let attempts = 0;
  let haveHadSuccess = false;

  const handleErrorWithRetry = (error: Error, retry: () => void) => {
    if (retryOnInitFail) {
      sleepFromRetryOnInitFail(retryOnInitFail, "GATHER", attempts, error).then(
        retry,
        callback,
      );
    } else {
      if (!haveHadSuccess) {
        // Inability to gather is fatal - database connection issue?
        callback(error);
      } else {
        console.error(`Error occurred during watch gather: ${error}`);
      }
    }
  };

  const stopWatching = await watchGather(
    resolvedPreset,
    shared,
    (input, error, retry) => {
      ++attempts;
      if (error) {
        // An error here could be a database connectivity issue or similar
        // issue, if retryOnInitFail is set we should automatically retry.
        handleErrorWithRetry(error, retry);
      } else {
        if (attempts > 1) {
          console.warn(`Gather completed successfully on attempt ${attempts}.`);
        }
        attempts = 0;
        haveHadSuccess = true;
        try {
          const schema = buildSchema(resolvedPreset, input!, shared);
          callback(null, { schema, resolvedPreset });
        } catch (e) {
          // Retrying this on its own is pointless, we need the gather phase to
          // give us more data so we can just await regular watch for that.
          console.error(`Error occurred during watch schema generation:`, e);
        }
      }
    },
  );
  return stopWatching;
}
