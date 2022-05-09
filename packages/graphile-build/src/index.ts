import "./global.js";
import "./interfaces.js";

import "graphile-plugin";
import { applyHooks, AsyncHooks, resolvePresets } from "graphile-plugin";
import type { GraphQLSchema } from "graphql";

import extend from "./extend.js";
import { makeInitialInflection } from "./inflection.js";
import {
  ClientMutationIdDescriptionPlugin,
  CursorTypePlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  QueryPlugin,
  QueryQueryPlugin,
  SubscriptionPlugin,
  SwallowErrorsPlugin,
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
import type { NewWithHooksFunction } from "./newWithHooks/index.js";
// export globals for TypeDoc
export { GraphileBuild, GraphilePlugin };

export { SchemaBuilder, NewWithHooksFunction };

const getSchemaHooks = (plugin: GraphilePlugin.Plugin) => plugin.schema?.hooks;

/**
 * Generate 'build.inflection' from the given preset.
 */
export const buildInflection = (
  preset: GraphilePlugin.Preset,
): GraphileBuild.Inflection => {
  const config = resolvePresets([preset]);
  const { plugins, inflection: _options = {} } = config;

  const inflectors: Partial<GraphileBuild.Inflection> = makeInitialInflection();

  // Add the base inflectors
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
      inflectors[inflectorName as any] = inflector;
    },
  );

  return inflectors as GraphileBuild.Inflection;
};

/**
 * One-time gather; see `watchGather` for watch mode.
 */
export const gather = async (
  preset: GraphilePlugin.Preset,
  {
    inflection,
  }: {
    inflection: GraphileBuild.Inflection;
  } = { inflection: buildInflection(preset) },
): Promise<GraphileBuild.BuildInput> => {
  const config = resolvePresets([preset]);
  const options = config.gather || {};
  const plugins = config.plugins;
  const globalState: { [key: string]: any } = {};
  const gatherState: { [key: string]: any } = {};
  const helpers: { [key: string]: any } = {}; // GatherHelpers

  const hooks = new AsyncHooks<GraphilePlugin.GatherHooks>();

  const pluginContext = new Map<
    GraphilePlugin.Plugin,
    {
      inflection: GraphileBuild.Inflection;
      helpers: GraphilePlugin.GatherHelpers;
      options: typeof options;
      cache: any;
      state: any;
      process: typeof hooks.process;
    }
  >();

  // Prepare the plugins to run by preparing their initial states, and registering the helpers (hooks area already done).
  for (const plugin of plugins) {
    const spec = plugin.gather;
    if (!spec) {
      continue;
    }
    if (spec.namespace in globalState) {
      // TODO: track who registers which namespace, output more helpful error.
      throw new Error(
        `Namespace '${spec.namespace}' was already registered, it cannot be registered by two plugins - namespaces must be unique.`,
      );
    }
    const cache = (globalState[spec.namespace] = spec.initialCache?.() ?? {});
    const state = (gatherState[spec.namespace] = spec.initialState?.() ?? {});
    const context = {
      helpers: helpers as GraphilePlugin.GatherHelpers,
      options,
      state,
      cache,
      process: hooks.process.bind(hooks),
      inflection,
    };
    pluginContext.set(plugin, context);
    helpers[spec.namespace] = {};
    for (const helperName of Object.keys(spec.helpers)) {
      helpers[spec.namespace][helperName] = (...args: any[]): any => {
        return spec.helpers[helperName](context, ...args);
      };
    }
  }

  // Register the hooks
  applyHooks(
    plugins,
    (p) => p.gather?.hooks,
    (name, fn, plugin) => {
      const context = pluginContext.get(plugin);
      if (!context) {
        throw new Error("No context for this plugin?");
      }
      (hooks.hook as any)(
        name as any,
        ((...args: any[]) => (fn as any)(context, ...args)) as any,
      );
    },
  );

  // Now call the main functions
  const output: Partial<GraphileBuild.BuildInput> = {};
  for (const plugin of plugins) {
    if (plugin.gather?.main) {
      const context = pluginContext.get(plugin);
      if (!context) {
        throw new Error("No context for this plugin?");
      }
      await plugin.gather.main(output, context);
    }
  }

  return output as GraphileBuild.BuildInput;
};

/**
 * Gets a SchemaBuilder object for the given preset and inflection.  It's rare
 * you would need this, typically you'll want `buildSchema` instead.
 */
export const getBuilder = (
  preset: GraphilePlugin.Preset,
  inflection: GraphileBuild.Inflection = buildInflection(preset),
): SchemaBuilder => {
  const config = resolvePresets([preset]);
  const { plugins, schema: options } = config;
  const builder = new SchemaBuilder(options || {}, inflection);
  applyHooks(plugins, getSchemaHooks, (hookName, hookFn, plugin) => {
    builder._setPluginName(plugin.name);
    builder.hook(hookName, hookFn);
    builder._setPluginName(null);
  });
  return builder;
};

/**
 * Builds a GraphQL schema according to the given preset and input data.
 */
export const buildSchema = (
  preset: GraphilePlugin.Preset,
  input: GraphileBuild.BuildInput,
  options: {
    inflection?: GraphileBuild.Inflection;
  } = {},
): GraphQLSchema => {
  const builder = getBuilder(preset, options.inflection);
  return builder.buildSchema(input);
};

export {
  ClientMutationIdDescriptionPlugin,
  CursorTypePlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  QueryPlugin,
  QueryQueryPlugin,
  SubscriptionPlugin,
  SwallowErrorsPlugin,
};
export { GatherPluginContext } from "./interfaces.js";
export { defaultPreset } from "./preset";
// TODO: remove this hack!
export const version = require("../package.json").version;
