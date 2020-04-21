export * from "graphile-utils";

export {
  mixed,
  Middleware,
  PostGraphileOptions,
  CreateRequestHandlerOptions,
  GraphQLFormattedErrorExtended,
  GraphQLErrorExtended,
  HttpRequestHandler,
  WithPostGraphileContextOptions,
} from "./interfaces";

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
  GraphileResolverContext,
} from "postgraphile-core";

export {
  postgraphile,
  createPostGraphileSchema,
  watchPostGraphileSchema,
  withPostGraphileContext,
  enhanceHttpServerWithSubscriptions,
  // Backwards compatibility
  postgraphile as postgraphql,
  createPostGraphileSchema as createPostGraphQLSchema,
  watchPostGraphileSchema as watchPostGraphQLSchema,
  withPostGraphileContext as withPostGraphQLContext,
} from "./postgraphile";

export { makePluginHook, PostGraphilePlugin } from "./postgraphile/pluginHook";

import { postgraphile } from "./postgraphile";
export default postgraphile;

export * from "./plugins";
