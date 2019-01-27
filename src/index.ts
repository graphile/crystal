import {
  postgraphile,
  createPostGraphileSchema,
  watchPostGraphileSchema,
  withPostGraphileContext,
} from './postgraphile';
import { makePluginHook, PostGraphilePlugin } from './postgraphile/pluginHook';

export {
  Plugin,
  Build,
  Context,
  SchemaBuilder,
  SchemaListener,
  Inflection,
  Options,
  postGraphileBaseOverrides,
  postGraphileClassicIdsOverrides,
  PostGraphileInflectionPlugin,
  PostGraphileClassicIdsInflectionPlugin,
} from 'postgraphile-core';

export {
  postgraphile,
  createPostGraphileSchema,
  watchPostGraphileSchema,
  withPostGraphileContext,
  makePluginHook,
  PostGraphilePlugin,
  // Backwards compatability
  postgraphile as postgraphql,
  createPostGraphileSchema as createPostGraphQLSchema,
  watchPostGraphileSchema as watchPostGraphQLSchema,
  withPostGraphileContext as withPostGraphQLContext,
};

export * from './interfaces';

export default postgraphile;
