import "./global.js";
import "./interfaces.js";

import { applyHooks, AsyncHooks, resolvePresets } from "graphile-config";
import type { GraphQLSchema } from "graphql";

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
  formatInsideUnderscores,
  pluralize,
  singularize,
  upperCamelCase,
  upperFirst,
} from "./utils.js";
import type { GatherPluginContext } from "./interfaces.js";
import type { NewWithHooksFunction } from "./newWithHooks/index.js";
// export globals for TypeDoc
export { GraphileBuild, GraphileConfig };

export { NewWithHooksFunction, SchemaBuilder };

const EMPTY_OBJECT = Object.freeze(Object.create(null));

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
        if (!previous && !ignore?.includes(inflectorName)) {
          console.warn(
            `Plugin '${plugin.name}' attempted to overwrite inflector '${inflectorName}', but no such inflector exists.`,
          );
        }
        const inflector = (replacementFunction as any).bind(
          inflectors as GraphileBuild.Inflection,
          previous,
          preset,
        );
        inflectors[inflectorName as any] = inflector;
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
  const globalState: { [key: string]: any } = {};
  const gatherState: { [key: string]: any } = {};
  const helpers: { [key: string]: any } = {}; // GatherHelpers

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
          ? (globalState[spec.namespace] = spec.initialCache?.() ?? {})
          : EMPTY_OBJECT;
      const state =
        spec.namespace != null
          ? (gatherState[spec.namespace] = spec.initialState?.() ?? {})
          : EMPTY_OBJECT;
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
        helpers[spec.namespace] = {};
        if (spec.helpers != null) {
          const specHelpers = spec.helpers;
          for (const helperName of Object.keys(specHelpers)) {
            helpers[spec.namespace][helperName] = (...args: any[]): any => {
              return specHelpers[helperName](context, ...args);
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
    const output: Partial<GraphileBuild.BuildInput> = {};
    if (gatherPlugins) {
      // Reset state
      for (const plugin of gatherPlugins) {
        const spec = plugin.gather!;
        const context = pluginContext.get(plugin)!;
        if (spec.namespace != null) {
          context.state = gatherState[spec.namespace] =
            spec.initialState?.() ?? {};
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
    callback: (gather: GraphileBuild.BuildInput | null, error?: Error) => void,
  ): Promise<() => void> {
    let stopped = false;
    const unlisten: Array<() => void> = [];
    let runAgain = false;
    let runInProgress = true;
    const handleChange = () => {
      if (stopped) return;
      if (runInProgress) {
        runAgain = true;
        return;
      }
      runAgain = false;
      runInProgress = true;
      run().then(
        (v) => {
          if (stopped) return;
          try {
            callback(v);
          } catch {
            // TODO: this indicates a bug in user code; how to handle?
            /*nom nom nom*/
          }
          runInProgress = false;
          if (runAgain) handleChange();
        },
        (e) => {
          if (stopped) return;
          try {
            callback(null, e);
          } catch {
            // TODO: this indicates a bug in user code; how to handle?
            /*nom nom nom*/
          }
          runInProgress = false;
          if (runAgain) handleChange();
        },
      );
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
      callback(firstResult);
    } catch (e) {
      callback(null, e);
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
  callback: (gather: GraphileBuild.BuildInput | null, error?: Error) => void,
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
  return builder.buildSchema(input);
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
// TODO: remove this hack!
export const version = require("../package.json").version;
