import "./global.js";

import type { Plugin, Preset } from "graphile-plugin";
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

export const buildSchema = (preset: Preset): GraphQLSchema => {
  const builder = getBuilder(preset);
  return builder.buildSchema();
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
