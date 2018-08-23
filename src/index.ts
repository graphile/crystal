import {
  postgraphile,
  createPostGraphileSchema,
  watchPostGraphileSchema,
  withPostGraphileContext,
} from './postgraphile';
import { makePluginHook, PostGraphilePlugin } from './postgraphile/pluginHook';

export * from './interfaces';

export default postgraphile;

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
