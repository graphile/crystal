import "./global.js";
import "./interfaces.js";

import type {
  GatherHelpers,
  GatherHooks,
  Plugin,
  Preset,
} from "graphile-plugin";
import { applyHooks, AsyncHooks, resolvePresets } from "graphile-plugin";
import type { GraphQLSchema } from "graphql";

import extend from "./extend.js";
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

export { GraphileEngine, SchemaBuilder };

const getSchemaHooks = (plugin: Plugin) => plugin.schema?.hooks;

/**
 * Generate 'build.inflection' from the given preset.
 */
export const inflection = (preset: Preset): GraphileEngine.Inflection => {
  const config = resolvePresets([preset]);
  const { plugins, inflection: options = {} } = config;

  const inflectors: Partial<GraphileEngine.Inflection> = {};

  // Add the base inflectors
  for (const plugin of plugins) {
    if (plugin.inflection?.add) {
      const inflectorsToAdd = plugin.inflection.add;
      for (const inflectorName of Object.keys(inflectorsToAdd)) {
        extend(
          inflectors,
          { [inflectorName]: inflectorsToAdd[inflectorName](options) },
          `Adding inflectors from ${plugin.name}`,
        );
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
      inflectors[inflectorName] = replacementFunction(options, previous);
    },
  );

  return inflectors as GraphileEngine.Inflection;
};

/**
 * One-time gather; see `watchGather` for watch mode.
 */
export const gather = async (
  preset: Preset,
): Promise<GraphileEngine.BuildInput> => {
  const config = resolvePresets([preset]);
  const options = config.gather || {};
  const plugins = config.plugins;
  const globalState: { [key: string]: any } = {};
  const gatherState: { [key: string]: any } = {};
  const helpers: { [key: string]: any } = {}; // GatherHelpers

  const hooks = new AsyncHooks<GatherHooks>();

  const pluginContext = new Map<
    Plugin,
    {
      helpers: GatherHelpers;
      options: typeof options;
      cache: any;
      state: any;
      process: typeof hooks.process;
    }
  >();

  // Prepare the plugins to run by preparing their initial states, and registering the helpers (hooks area already done).
  for (const plugin of plugins) {
    console.log(plugin.name + "...");
    const spec = plugin.gather;
    if (!spec) {
      continue;
    }
    console.log(plugin.name);
    if (spec.namespace in globalState) {
      // TODO: track who registers which namespace, output more helpful error.
      throw new Error(
        `Namespace '${spec.namespace}' was already registered, it cannot be registered by two plugins - namespaces must be unique.`,
      );
    }
    const cache = (globalState[spec.namespace] = spec.initialCache?.() ?? {});
    const state = (gatherState[spec.namespace] = spec.initialState?.() ?? {});
    const context = {
      helpers: helpers as GatherHelpers,
      options,
      state,
      cache,
      process: hooks.process.bind(hooks),
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
  const output: Partial<GraphileEngine.BuildInput> = {};
  for (const plugin of plugins) {
    if (plugin.gather?.main) {
      const context = pluginContext.get(plugin);
      if (!context) {
        throw new Error("No context for this plugin?");
      }
      await plugin.gather.main(output, context);
    }
  }

  return output as GraphileEngine.BuildInput;
};

export const getBuilder = (preset: Preset): SchemaBuilder => {
  const config = resolvePresets([preset]);
  const { plugins, schema: options } = config;
  const builder = new SchemaBuilder(options || {});
  applyHooks(plugins, getSchemaHooks, (hookName, hookFn, plugin) => {
    builder._setPluginName(plugin.name);
    builder.hook(hookName, hookFn);
    builder._setPluginName(null);
  });
  return builder;
};

export const buildSchema = (
  preset: Preset,
  input: GraphileEngine.BuildInput,
): GraphQLSchema => {
  const builder = getBuilder(preset);
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
export const version = require("../package.json").version;
