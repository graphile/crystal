import "./global.js";
import "./interfaces.js";

import * as grafast from "grafast";
import {
  getIntrospectionQuery,
  graphqlSync,
  lexicographicSortSchema,
  printSchema,
} from "grafast/graphql";
import { AsyncHooks, orderedApply, resolvePreset } from "graphile-config";

export { isValidBehaviorString } from "./behavior.js";
import extend from "./extend.js";
import { makeInitialInflection } from "./inflection.js";
import {
  AddNodeInterfaceToSuitableTypesPlugin,
  BuiltinScalarConnectionsPlugin,
  ClientMutationIdDescriptionPlugin,
  CommonBehaviorsPlugin,
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
  EXPORTABLE_OBJECT_CLONE,
  formatInsideUnderscores,
  gatherConfig,
  pluralize,
  singularize,
  upperCamelCase,
  upperFirst,
} from "./utils.js";
import type {
  GrafastArgumentConfig,
  GrafastFieldConfig,
  GrafastFieldConfigArgumentMap,
  PromiseOrDirect,
} from "grafast";
import { isPromiseLike } from "grafast";
import type {
  GraphQLArgumentConfig,
  GraphQLEnumTypeConfig,
  GraphQLEnumValueConfig,
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLScalarTypeConfig,
  GraphQLSchema,
  GraphQLSchemaConfig,
} from "grafast/graphql";
import type { PluginHook } from "graphile-config";

import type { GatherPluginContext } from "./interfaces.js";
import type { NewWithHooksFunction } from "./newWithHooks/index.js";
import { EXPORTABLE } from "./utils.js";

// export globals for TypeDoc
export { GraphileBuild, GraphileConfig };

export { NewWithHooksFunction, SchemaBuilder };

const EMPTY_OBJECT = Object.freeze(Object.create(null));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate 'build.inflection' from the given preset.
 */
export const buildInflection = (
  preset: GraphileConfig.Preset,
): GraphileBuild.Inflection => {
  const resolvedPreset = resolvePreset(preset);
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
    orderedApply(
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

function pluginNamespace(plugin: GraphileConfig.Plugin): string {
  return plugin.gather?.namespace ?? plugin.name;
}

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
  const resolvedPreset = resolvePreset(preset);
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
      const specNamespace = pluginNamespace(plugin);
      if (specNamespace in globalState) {
        // ERRORS: track who registers which namespace, output more helpful error.
        throw new Error(
          `Namespace '${specNamespace}' was already registered, it cannot be registered by two plugins - namespaces must be unique. Latest plugin was '${plugin.name}'.`,
        );
      }
      const cache = (globalState[specNamespace] =
        spec.initialCache?.() ?? Object.create(null));
      if (typeof cache.then === "function") {
        // ENHANCE: can we just make `initialCache` allow promises?
        throw new Error(
          `\`initialCache\` may not return a promise directly; instead set one of the keys on the object it returns to a promise and await that in \`initialState\` (which is allowed to be async)`,
        );
      }
      const state = EMPTY_OBJECT;
      const context: GatherPluginContext<any, any> = {
        // Global libraries/helpers
        lib: resolvedPreset.lib,

        // DEPRECATED: use `lib` instead:
        grafast,
        EXPORTABLE,

        // Established by the config
        resolvedPreset,
        options,

        // Established by the start of the gather phase
        inflection,
        process: hooks.process.bind(hooks),

        // Specific to this call
        helpers: helpers as GraphileConfig.GatherHelpers,
        state,
        cache,
      };
      pluginContext.set(plugin, context);
      helpers[specNamespace] = Object.create(null);
      if (spec.helpers != null) {
        if (!spec.namespace) {
          throw new Error(
            `Plugin '${plugin.name}' tries to add helpers but is using an implicit namespace. Please use an explicit \`plugin.gather.namespace\`.`,
          );
        }
        const specHelpers = spec.helpers;
        for (const helperName of Object.keys(specHelpers)) {
          helpers[specNamespace][helperName] = (...args: any[]): any => {
            return (specHelpers as Record<string, any>)[helperName](
              context,
              ...args,
            );
          };
        }
      }
    }

    // Register the hooks
    orderedApply(
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
        const specNamespace = pluginNamespace(plugin);
        const context = pluginContext.get(plugin)!;
        const val =
          typeof spec.initialState === "function"
            ? await spec.initialState(context.cache, context)
            : Object.create(null);
        context.state = gatherState[specNamespace] = val;
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
            // ERRORS: this indicates a bug in user code; how to handle?
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
            // ERRORS: this indicates a bug in user code; how to handle?
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
  const resolvedPreset = resolvePreset(preset);
  if (!resolvedPreset.plugins || resolvedPreset.plugins.length === 0) {
    throw new Error(
      `You're attempting to build a GraphQL schema, but no plugins are specified in your preset. Please check the 'extends' key in your preset - you may have forgotten to add the relevant presets, or the presets may not have been imported correctly.`,
    );
  }

  if (!resolvedPreset.plugins.includes(QueryPlugin)) {
    console.warn(
      `[WARNING] You're attempting to build a GraphQL schema, but the QueryPlugin is missing from your configuration. Unless you have done this very deliberately, this is probably a mistake - please check the 'extends' key in your preset - you may have forgotten to add the relevant presets, or the presets may not have been imported correctly.`,
    );
  }

  const builder = new SchemaBuilder(resolvedPreset, inflection);
  return builder;
};

async function writeFileIfDiffers(
  path: string,
  contents: string,
): Promise<void> {
  // COMPAT: support other environments than Node
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
  CommonBehaviorsPlugin,
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
  // ENHANCE: AbortSignal
): Promise<SchemaResult> {
  const resolvedPreset = resolvePreset(preset);
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
  const resolvedPreset = resolvePreset(preset);
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

export { version } from "./version.js";

declare global {
  namespace GraphileBuild {
    type EntityBehaviorHook<
      entityType extends keyof GraphileBuild.BehaviorEntities,
    > = PluginHook<
      (
        behavior: GraphileBuild.BehaviorString,
        entity: GraphileBuild.BehaviorEntities[entityType],
        build: GraphileBuild.Build,
      ) => GraphileBuild.BehaviorString | GraphileBuild.BehaviorString[]
    >;
  }
  namespace GraphileConfig {
    interface Provides {
      default: true;
      inferred: true;
      override: true;
    }
    interface Preset {
      /**
       * The inflection phase is the first phase that occurs when building a
       * schema with Graphile Build. It is responsible for naming things - both
       * things that are generated in the `gather` phase, and the ultimate
       * types, fields, arguments, directives and so on in the GraphQL schema.
       */
      inflection?: GraphileBuild.InflectionOptions;
      /**
       * The `gather` phase is the second phase that occurs when building a
       * schema with Graphile Build. It is responsible for looking at
       * everything that can influence the shape of your schema, and turning
       * that into an "input" for the `schema` phase.
       */
      gather?: GraphileBuild.GatherOptions;
      /**
       * The `schema` phase is the final phase that occurs when building a
       * schema with Graphile Build. It is responsible for taking the inputs
       * from the `gather` phase (and using the inflectors from the
       * `inflection` phase) and generating a final GraphQL schema.
       */
      schema?: GraphileBuild.SchemaOptions;
    }

    interface PluginInflectionConfig {
      /**
       * Define new inflectors here
       */
      add?: {
        [key in keyof GraphileBuild.Inflection]?: (
          this: GraphileBuild.Inflection,
          options: ResolvedPreset,
          ...args: Parameters<GraphileBuild.Inflection[key]>
        ) => ReturnType<GraphileBuild.Inflection[key]>;
      };

      /**
       * Overwrite existing inflectors here.
       */
      replace?: {
        [key in keyof GraphileBuild.Inflection]?: (
          this: GraphileBuild.Inflection,
          previous:
            | // This is specifically so the `this` argument is removed
            ((
                ...args: Parameters<GraphileBuild.Inflection[key]>
              ) => ReturnType<GraphileBuild.Inflection[key]>)
            | undefined,
          options: ResolvedPreset,
          ...args: Parameters<GraphileBuild.Inflection[key]>
        ) => ReturnType<GraphileBuild.Inflection[key]>;
      };

      /**
       * If set and you attempt to replace a non-existent inflector of one of
       * the given names, we won't warn you.
       */
      ignoreReplaceIfNotExists?: Array<keyof GraphileBuild.Inflection>;
    }

    interface GatherHelpers {
      // Extend this with declaration merging
    }

    interface GatherHooks {
      // Extend this with declaration merging
    }

    interface PluginGatherConfig<
      TNamespace extends keyof GatherHelpers,
      TState extends { [key: string]: any } = { [key: string]: any },
      TCache extends { [key: string]: any } = { [key: string]: any },
    > {
      /**
       * A unique namespace for this plugin to use.
       */
      namespace?: TNamespace;

      /**
       * If this plugin supports a persistant internal state (aka a cache, this
       * is an optimisation for watch mode), this returns the value to initialise
       * this cache to.
       */
      initialCache?: () => TCache;

      /**
       * The initial value to use for this plugin when a new gather run
       * executes.
       */
      initialState?: (
        cache: TCache,
        context: GatherPluginContext<TState, TCache>,
      ) => PromiseOrDirect<TState>;

      /**
       * The plugin must register helpers to allow other plugins to access its
       * internal state. (Just use an empty object if you don't need any.)
       */
      helpers?: {
        [key in keyof GatherHelpers[TNamespace]]: (
          info: GatherPluginContext<TState, TCache>,
          ...args: Parameters<GatherHelpers[TNamespace][key]>
        ) => ReturnType<GatherHelpers[TNamespace][key]>;
      };

      hooks?: {
        [key in keyof GatherHooks]?: PluginHook<
          GatherHooks[key] extends (...args: infer UArgs) => infer UResult
            ? (
                info: GatherPluginContext<TState, TCache>,
                ...args: UArgs
              ) => UResult
            : never
        >;
      };

      /**
       * Responsible for kicking off the data collection - ask for data from
       * other plugins (or your own helpers), write data needed by the 'schema'
       * phase to the 'output' object.
       */
      main?: (
        output: Partial<GraphileBuild.BuildInput>,
        info: GatherPluginContext<TState, TCache>,
      ) => Promise<void>;

      /**
       * Called when the plugin is put into watch mode; the plugin should call
       * the given callback whenever a change is detected, and should return a
       * function that prevents this behaviour.
       */
      watch?: (
        info: GatherPluginContext<TState, TCache>,
        callback: () => void,
      ) => PromiseOrDirect<() => void>;
    }

    interface Plugin {
      inflection?: PluginInflectionConfig;

      gather?: PluginGatherConfig<keyof GatherHelpers, any, any>;

      schema?: {
        globalBehavior?:
          | GraphileBuild.BehaviorString
          | GraphileBuild.BehaviorString[]
          | ((
              behavior: GraphileBuild.BehaviorString,
              build: GraphileBuild.Build,
            ) => GraphileBuild.BehaviorString | GraphileBuild.BehaviorString[]);

        behaviorRegistry?: {
          add?: Partial<
            Record<
              keyof GraphileBuild.BehaviorStrings,
              {
                description: string;
                entities: ReadonlyArray<keyof GraphileBuild.BehaviorEntities>;
              }
            >
          >;
        };

        /**
         * You should use `before`, `after` and `provides` to ensure that the entity
         * behaviors apply in order. The order should be roughly:
         *
         * - `default` - default global behaviors like "update"
         * - `inferred` - behaviors that are inferred based on the entity, e.g. a plugin might disable filtering _by default_ on a relation if it's unindexed
         * - `override` - overrides set explicitly by the user
         */
        entityBehavior?: {
          [entityType in keyof GraphileBuild.BehaviorEntities]?:
            | GraphileBuild.BehaviorString
            | GraphileBuild.BehaviorString[]
            | {
                inferred?: GraphileBuild.EntityBehaviorHook<entityType>;
                override?: GraphileBuild.EntityBehaviorHook<entityType>;
              };
        };

        hooks?: {
          /**
           * The build object represents the current schema build and is passed to all
           * hooks, hook the 'build' event to extend this object. Note: you MUST NOT
           * generate GraphQL objects during this phase.
           */
          build?: PluginHook<
            GraphileBuild.Hook<
              Partial<GraphileBuild.Build> & GraphileBuild.BuildBase,
              GraphileBuild.ContextBuild,
              Partial<GraphileBuild.Build> & GraphileBuild.BuildBase
            >
          >;

          /**
           * The `init` phase runs after `build` is complete but before any types
           * or the schema are actually built. It is the only phase in which you
           * can register GraphQL types; do so using `build.registerType`.
           */
          init?: PluginHook<
            GraphileBuild.Hook<
              Record<string, never>,
              GraphileBuild.ContextInit,
              GraphileBuild.Build
            >
          >;

          /**
           * 'finalize' phase is called once the schema is built; typically you
           * shouldn't use this, but it's useful for interfacing with external
           * libraries that mutate an already constructed schema.
           */
          finalize?: PluginHook<
            GraphileBuild.Hook<
              GraphQLSchema,
              GraphileBuild.ContextFinalize,
              GraphileBuild.Build
            >
          >;

          /**
           * Add 'query', 'mutation' or 'subscription' types in this hook:
           */
          GraphQLSchema?: PluginHook<
            GraphileBuild.Hook<
              GraphQLSchemaConfig,
              GraphileBuild.ContextSchema,
              GraphileBuild.Build
            >
          >;

          /**
           * Add any types that need registering (typically polymorphic types) here
           */
          GraphQLSchema_types?: PluginHook<
            GraphileBuild.Hook<
              GraphQLNamedType[],
              GraphileBuild.ContextSchemaTypes,
              GraphileBuild.Build
            >
          >;

          /**
           * When creating a GraphQLObjectType via `newWithHooks`, we'll
           * execute, the following hooks:
           * - 'GraphQLObjectType' to add any root-level attributes, e.g. add a description
           * - 'GraphQLObjectType_interfaces' to add additional interfaces to this object type
           * - 'GraphQLObjectType_fields' to add additional fields to this object type (is
           *   ran asynchronously and gets a reference to the final GraphQL Object as
           *   `Self` in the context)
           * - 'GraphQLObjectType_fields_field' to customize an individual field from above
           * - 'GraphQLObjectType_fields_field_args' to add additional arguments to a field
           * - 'GraphQLObjectType_fields_field_args_arg' to customize an individual argument from above
           */
          GraphQLObjectType?: PluginHook<
            GraphileBuild.Hook<
              GraphileBuild.GrafastObjectTypeConfig<any, any>,
              GraphileBuild.ContextObject,
              GraphileBuild.Build
            >
          >;
          GraphQLObjectType_interfaces?: PluginHook<
            GraphileBuild.Hook<
              GraphQLInterfaceType[],
              GraphileBuild.ContextObjectInterfaces,
              GraphileBuild.Build
            >
          >;
          GraphQLObjectType_fields?: PluginHook<
            GraphileBuild.Hook<
              GraphileBuild.GrafastFieldConfigMap<any, any>,
              GraphileBuild.ContextObjectFields,
              GraphileBuild.Build
            >
          >;
          GraphQLObjectType_fields_field?: PluginHook<
            GraphileBuild.Hook<
              GrafastFieldConfig<any, any, any, any, any>,
              GraphileBuild.ContextObjectFieldsField,
              GraphileBuild.Build
            >
          >;
          GraphQLObjectType_fields_field_args?: PluginHook<
            GraphileBuild.Hook<
              GrafastFieldConfigArgumentMap<any, any, any, any>,
              GraphileBuild.ContextObjectFieldsFieldArgs,
              GraphileBuild.Build
            >
          >;
          GraphQLObjectType_fields_field_args_arg?: PluginHook<
            GraphileBuild.Hook<
              GrafastArgumentConfig<any, any, any, any, any, any>,
              GraphileBuild.ContextObjectFieldsFieldArgsArg,
              GraphileBuild.Build
            >
          >;

          /**
           * When creating a GraphQLInputObjectType via `newWithHooks`, we'll
           * execute, the following hooks:
           * - 'GraphQLInputObjectType' to add any root-level attributes, e.g. add a description
           * - 'GraphQLInputObjectType_fields' to add additional fields to this object type (is
           *   ran asynchronously and gets a reference to the final GraphQL Object as
           *   `Self` in the context)
           * - 'GraphQLInputObjectType_fields_field' to customize an individual field from above
           */
          GraphQLInputObjectType?: PluginHook<
            GraphileBuild.Hook<
              GraphileBuild.GrafastInputObjectTypeConfig,
              GraphileBuild.ContextInputObject,
              GraphileBuild.Build
            >
          >;
          GraphQLInputObjectType_fields?: PluginHook<
            GraphileBuild.Hook<
              GraphQLInputFieldConfigMap,
              GraphileBuild.ContextInputObjectFields,
              GraphileBuild.Build
            >
          >;
          GraphQLInputObjectType_fields_field?: PluginHook<
            GraphileBuild.Hook<
              GraphQLInputFieldConfig,
              GraphileBuild.ContextInputObjectFieldsField,
              GraphileBuild.Build
            >
          >;

          /**
           * When creating a GraphQLEnumType via `newWithHooks`, we'll
           * execute, the following hooks:
           * - 'GraphQLEnumType' to add any root-level attributes, e.g. add a description
           * - 'GraphQLEnumType_values' to add additional values
           * - 'GraphQLEnumType_values_value' to change an individual value
           */
          GraphQLEnumType?: PluginHook<
            GraphileBuild.Hook<
              GraphQLEnumTypeConfig,
              GraphileBuild.ContextEnum,
              GraphileBuild.Build
            >
          >;
          GraphQLEnumType_values?: PluginHook<
            GraphileBuild.Hook<
              GraphQLEnumValueConfigMap,
              GraphileBuild.ContextEnumValues,
              GraphileBuild.Build
            >
          >;
          GraphQLEnumType_values_value?: PluginHook<
            GraphileBuild.Hook<
              GraphQLEnumValueConfig,
              GraphileBuild.ContextEnumValuesValue,
              GraphileBuild.Build
            >
          >;

          /**
           * When creating a GraphQLUnionType via `newWithHooks`, we'll
           * execute, the following hooks:
           * - 'GraphQLUnionType' to add any root-level attributes, e.g. add a description
           * - 'GraphQLUnionType_types' to add additional types to this union
           */
          GraphQLUnionType?: PluginHook<
            GraphileBuild.Hook<
              GraphileBuild.GrafastUnionTypeConfig<any, any>,
              GraphileBuild.ContextUnion,
              GraphileBuild.Build
            >
          >;
          GraphQLUnionType_types?: PluginHook<
            GraphileBuild.Hook<
              GraphQLObjectType[],
              GraphileBuild.ContextUnionTypes,
              GraphileBuild.Build
            >
          >;

          /**
           * When creating a GraphQLInterfaceType via `newWithHooks`, we'll
           *  execute, the following hooks:
           *  - 'GraphQLInterfaceType' to add any root-level attributes, e.g. add a description
           *  - 'GraphQLInterfaceType_fields' to add additional fields to this interface type (is
           *    ran asynchronously and gets a reference to the final GraphQL Interface as
           *    `Self` in the context)
           *  - 'GraphQLInterfaceType_fields_field' to customise an individual field from above
           *  - 'GraphQLInterfaceType_fields_field_args' to add additional arguments to a field
           *  - 'GraphQLInterfaceType_fields_field_args_arg' to customize an individual arguments from the above
           */
          GraphQLInterfaceType?: PluginHook<
            GraphileBuild.Hook<
              GraphileBuild.GrafastInterfaceTypeConfig<any, any>,
              GraphileBuild.ContextInterface,
              GraphileBuild.Build
            >
          >;
          GraphQLInterfaceType_fields?: PluginHook<
            GraphileBuild.Hook<
              GraphQLFieldConfigMap<any, any>,
              GraphileBuild.ContextInterfaceFields,
              GraphileBuild.Build
            >
          >;
          GraphQLInterfaceType_fields_field?: PluginHook<
            GraphileBuild.Hook<
              GraphQLFieldConfig<any, any>,
              GraphileBuild.ContextInterfaceFieldsField,
              GraphileBuild.Build
            >
          >;
          GraphQLInterfaceType_fields_field_args?: PluginHook<
            GraphileBuild.Hook<
              GraphQLFieldConfigArgumentMap,
              GraphileBuild.ContextInterfaceFieldsFieldArgs,
              GraphileBuild.Build
            >
          >;
          GraphQLInterfaceType_fields_field_args_arg?: PluginHook<
            GraphileBuild.Hook<
              GraphQLArgumentConfig,
              GraphileBuild.ContextInterfaceFieldsFieldArgsArg,
              GraphileBuild.Build
            >
          >;
          GraphQLInterfaceType_interfaces?: PluginHook<
            GraphileBuild.Hook<
              GraphQLInterfaceType[],
              GraphileBuild.ContextInterfaceInterfaces,
              GraphileBuild.Build
            >
          >;

          /**
           * For scalars
           */
          GraphQLScalarType?: PluginHook<
            GraphileBuild.Hook<
              GraphQLScalarTypeConfig<any, any>,
              GraphileBuild.ContextScalar,
              GraphileBuild.Build
            >
          >;
        };
      };
    }
  }
}
