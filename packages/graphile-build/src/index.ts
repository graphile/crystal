import "./global.js";
import "./interfaces.js";

import type { GatherHelpers, Plugin, Preset } from "graphile-plugin";
import { applyHooks, resolvePresets } from "graphile-plugin";
import type { GraphQLSchema } from "graphql";

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
 * One-time gather; see `watchGather` for watch mode.
 */
export const gather = async (
  preset: Preset,
): Promise<GraphileEngine.BuildInput> => {
  const config = resolvePresets([preset]);
  const options = config.gather;
  const plugins = config.plugins;
  const globalState: { [key: string]: any } = {};
  const gatherState: { [key: string]: any } = {};
  const helpers: { [key: string]: any } = {}; // GatherHelpers

  // Prepare the plugins to run by preparing their initial states and hooking up the helpers.
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
    helpers[spec.namespace] = {};
    for (const helperName of Object.keys(spec.helpers)) {
      helpers[spec.namespace][helperName] = (...args: any[]): any => {
        const info = { options, state, cache };
        return spec.helpers[helperName](info, ...args);
      };
    }
  }

  // Now call the main functions
  const output: Partial<GraphileEngine.BuildInput> = {};
  for (const plugin of plugins) {
    if (plugin.gather?.main) {
      await plugin.gather.main(output, helpers as GatherHelpers);
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

export { defaultPreset } from "./preset";
export const version = require("../package.json").version;
