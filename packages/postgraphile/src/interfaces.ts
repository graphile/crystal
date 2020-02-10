/* tslint:disable:no-any */
import {
  GraphQLError,
  GraphQLSchema,
  SourceLocation,
  DocumentNode,
} from "graphql";
import { IncomingMessage, ServerResponse } from "http";
import { PluginHookFn } from "./postgraphile/pluginHook";
import { Pool, PoolClient } from "pg";
import { Plugin, PostGraphileCoreOptions } from "postgraphile-core";
import jwt = require("jsonwebtoken");
import { EventEmitter } from "events";
import { GraphileResolverContext } from "postgraphile-core";

export interface GraphileClaims {
  [claimName: string]: undefined | null | string | number | boolean;
}

declare module "postgraphile-core" {
  interface GraphileResolverContext {
    pgClient: PoolClient;
    pgRole?: string;
    jwtClaims?: GraphileClaims | null;
    getExplainResults?: () => any;
  }
}

type PromiseOrDirect<T> = T | Promise<T>;
type DirectOrCallback<Request, T> = T | ((req: Request) => PromiseOrDirect<T>);

/**
 * A narrower type than `any` that won’t swallow errors from assumptions about
 * code.
 *
 * For example `(x as any).anything()` is ok. That function then returns `any`
 * as well so the problem compounds into `(x as any).anything().else()` and the
 * problem just goes from there. `any` is a type black hole that swallows any
 * useful type information and shouldn’t be used unless you know what you’re
 * doing.
 *
 * With `mixed` you must *prove* the type is what you want to use.
 *
 * The `mixed` type is identical to the `mixed` type in Flow.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/9999
 * @see https://flowtype.org/docs/builtins.html#mixed
 */
export type mixed = {} | string | number | boolean | undefined | null;

export type Middleware<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> = (req: Request, res: Response, next: (err?: Error) => void) => void;

// Please note that the comments for this type are turned into documentation
// automatically. We try and specify the options in the same order as the CLI.
// Anything tagged `@middlewareOnly` will not appear in the schema-only docs.
// Only comments written beginning with `//` will be put in the docs.
export interface PostGraphileOptions<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> extends PostGraphileCoreOptions {
  // When true, PostGraphile will update the GraphQL API whenever your database
  // schema changes. This feature requires some changes to your database in the
  // form of the
  // [`postgraphile_watch`](https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build-pg/res/watch-fixtures.sql)
  // schema; PostGraphile will try to add this itself but requires DB superuser
  // privileges to do so. If PostGraphile can't install it, you can do so
  // manually. PostGraphile will not drop the schema when it exits, to remove
  // it you can execute:
  //
  //   `DROP SCHEMA postgraphile_watch CASCADE;`
  /* @middlewareOnly */
  watchPg?: boolean;
  // When false (default), PostGraphile will exit if it fails to build the
  // initial schema (for example if it cannot connect to the database, or if
  // there are fatal naming conflicts in the schema). When true, PostGraphile
  // will keep trying to rebuild the schema indefinitely, using an exponential
  // backoff between attempts, starting at 100ms and increasing up to 30s delay
  // between retries.
  /* @middlewareOnly */
  retryOnInitFail?: boolean;
  // Connection string to use to connect to the database as a privileged user (e.g. for setting up watch fixtures, logical decoding, etc).
  ownerConnectionString?: string;
  // Enable GraphQL websocket transport support for subscriptions (you still need a subscriptions plugin currently)
  subscriptions?: boolean;
  // [EXPERIMENTAL] Enables live-query support via GraphQL subscriptions (sends updated payload any time nested collections/records change)
  live?: boolean;
  // [EXPERIMENTAL] If you're using websockets (subscriptions || live) then you
  // may want to authenticate your users using sessions or similar. You can
  // pass some simple middlewares here that will be executed against the
  // websocket connection in order to perform authentication. We current only
  // support express (not Koa) middlewares here.
  /* @middlewareOnly */
  websocketMiddlewares?: Array<Middleware<Request, Response>>;
  // The default Postgres role to use. If no role was provided in a provided
  // JWT token, this role will be used.
  pgDefaultRole?: string;
  // By default, JSON and JSONB fields are presented as strings (JSON encoded)
  // from the GraphQL schema. Setting this to `true` (recommended) enables raw
  // JSON input and output, saving the need to parse / stringify JSON manually.
  dynamicJson?: boolean;
  // If none of your `RETURNS SETOF compound_type` functions mix NULLs with the
  // results then you may set this false to reduce the nullables in the GraphQL
  // schema.
  setofFunctionsContainNulls?: boolean;
  // Enables classic ids for Relay support. Instead of using the field name
  // `nodeId` for globally unique ids, PostGraphile will instead use the field
  // name `id` for its globally unique ids. This means that table `id` columns
  // will also get renamed to `rowId`.
  classicIds?: boolean;
  // Setting this to `true` will prevent the creation of the default mutation
  // types & fields. Database mutation will only be possible through Postgres
  // functions.
  disableDefaultMutations?: boolean;
  // Set false (recommended) to exclude fields, queries and mutations that are
  // not available to any possible user (determined from the user in connection
  // string and any role they can become); set this option true to skip these
  // checks and create GraphQL fields and types for everything.
  // The default is `true`, in v5 the default will change to `false`.
  ignoreRBAC?: boolean;
  // Set false (recommended) to exclude filters, orderBy, and relations that
  // would be expensive to access due to missing indexes. Changing this from
  // true to false is a breaking change, but false to true is not, so we
  // recommend you start with it set to `false`.
  // The default is `true`, in v5 the default may change to `false`.
  ignoreIndexes?: boolean;
  // By default, tables and functions that come from extensions are excluded
  // from the generated GraphQL schema as general applications don't need them
  // to be exposed to the end user. You can use this flag to include them in
  // the generated schema (not recommended).
  includeExtensionResources?: boolean;
  // Enables adding a `stack` field to the error response.  Can be either the
  // boolean `true` (which results in a single stack string) or the string
  // `json` (which causes the stack to become an array with elements for each
  // line of the stack). Recommended in development, not recommended in
  // production.
  /* @middlewareOnly */
  showErrorStack?: boolean | "json";
  // Extends the error response with additional details from the Postgres
  // error.  Can be any combination of `['hint', 'detail', 'errcode']`.
  // Default is `[]`.
  /* @middlewareOnly */
  extendedErrors?: Array<string>;
  // Enables ability to modify errors before sending them down to the client.
  // Optionally can send down custom responses. If you use this then
  // `showErrorStack` and `extendedError` may have no
  // effect.
  /* @middlewareOnly */
  handleErrors?: (
    errors: ReadonlyArray<GraphQLError>,
    req: Request,
    res: Response,
  ) => Array<GraphQLErrorExtended>;
  // An array of [Graphile Engine](/graphile-build/plugins/) schema plugins to load
  // after the default plugins.
  appendPlugins?: Array<Plugin>;
  // An array of [Graphile Engine](/graphile-build/plugins/) schema plugins to load
  // before the default plugins (you probably don't want this).
  prependPlugins?: Array<Plugin>;
  // The full array of [Graphile Engine](/graphile-build/plugins/) schema plugins to
  // use for schema generation (you almost definitely don't want this!).
  replaceAllPlugins?: Array<Plugin>;
  // An array of [Graphile Engine](/graphile-build/plugins/) schema plugins to skip.
  skipPlugins?: Array<Plugin>;
  // A file path string. Reads cached values from local cache file to improve
  // startup time (you may want to do this in production).
  readCache?: string;
  // A file path string. Writes computed values to local cache file so startup
  // can be faster (do this during the build phase).
  writeCache?: string;
  // Enables saving the detected schema, in JSON format, to the given location.
  // The directories must exist already, if the file exists it will be
  // overwritten.
  /* @middlewareOnly */
  exportJsonSchemaPath?: string;
  // Enables saving the detected schema, in GraphQL schema format, to the given
  // location. The directories must exist already, if the file exists it will
  // be overwritten.
  /* @middlewareOnly */
  exportGqlSchemaPath?: string;
  // If true, lexicographically (alphabetically) sort exported schema for
  // more stable diffing.
  /* @middlewareOnly */
  sortExport?: boolean;
  // The endpoint the GraphQL executer will listen on. Defaults to `/graphql`.
  /* @middlewareOnly */
  graphqlRoute?: string;
  // The endpoint the GraphiQL query interface will listen on (**NOTE:**
  // GraphiQL will not be enabled unless the `graphiql` option is set to
  // `true`). Defaults to `/graphiql`.
  /* @middlewareOnly */
  graphiqlRoute?: string;
  // If you are using watch mode, or have enabled GraphiQL, and you either
  // mount PostGraphile under a path, or use PostGraphile behind some kind of
  // proxy that puts PostGraphile under a subpath (or both!) then you must
  // specify this setting so that PostGraphile can figure out it's external
  // URL.
  // (e.g. if you do `app.use('/path/to', postgraphile(...))`), which is not
  // officially supported, then you should pass `externalUrlBase: '/path/to'`.)
  // This setting should never end in a slash (`/`). To specify that the
  // external URL is the expected one, either omit this setting or set it to the
  // empty string `''`.
  /* @middlewareOnly */
  externalUrlBase?: string;
  // Set this to `true` to enable the GraphiQL interface.
  /* @middlewareOnly */
  graphiql?: boolean;
  // Set this to `true` to add some enhancements to GraphiQL; intended for development usage only (automatically enables with `subscriptions` and `live`).
  /* @middlewareOnly */
  enhanceGraphiql?: boolean;
  // Enables some generous CORS settings for the GraphQL endpoint. There are
  // some costs associated when enabling this, if at all possible try to put
  // your API behind a reverse proxy.
  /* @middlewareOnly */
  enableCors?: boolean;
  // Set the maximum size of HTTP request bodies that can be parsed (default
  // 100kB).  The size can be given as a human-readable string, such as '200kB'
  // or '5MB' (case insensitive).
  /* @middlewareOnly */
  bodySizeLimit?: string;
  // [Experimental] Enable the middleware to process multiple GraphQL queries
  // in one request.
  /* @middlewareOnly */
  enableQueryBatching?: boolean;
  // The secret for your JSON web tokens. This will be used to verify tokens in
  // the `Authorization` header, and signing JWT tokens you return in
  // procedures.
  jwtSecret?: jwt.Secret;
  jwtPublicKey?: jwt.Secret | jwt.GetPublicKeyOrSecret;
  // Options with which to perform JWT verification - see
  // https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
  // If 'audience' property is unspecified, it will default to
  // ['postgraphile']; to prevent audience verification set it explicitly to
  // null.
  /* @middlewareOnly */
  jwtVerifyOptions?: jwt.VerifyOptions;
  // An array of (strings) path components that make up the path in the jwt from which to extract the postgres role.
  // By default, the role is extracted from `token.role`, so the default value is `['role']`.
  // e.g. `{ iat: 123456789, creds: { local: { role: "my_role" } } }`
  // the path would be `token.creds.local.role` i.e. `['creds', 'local', 'role']`
  /* @middlewareOnly */
  jwtRole?: Array<string>;
  // The Postgres type identifier for the compound type which will be signed as
  // a JWT token if ever found as the return type of a procedure. Can be of the
  // form: `my_schema.my_type`. You may use quotes as needed:
  // `"my-special-schema".my_type`.
  jwtPgTypeIdentifier?: string;
  // [DEPRECATED] The audience to use when verifing the JWT token. Deprecated,
  // use `jwtVerifyOptions.audience` instead.
  /* @middlewareOnly */
  jwtAudiences?: Array<string>;
  // Some one-to-one relations were previously detected as one-to-many - should
  // we export 'only' the old relation shapes, both new and old but mark the
  // old ones as 'deprecated' (default), or 'omit' (recommended) the old
  // relation shapes entirely.
  legacyRelations?: "only" | "deprecated" | "omit";
  // ONLY use this option if you require the v3 typenames 'Json' and 'Uuid'
  // over 'JSON' and 'UUID'.
  legacyJsonUuid?: boolean;
  // Turns off GraphQL query logging. By default PostGraphile will log every
  // GraphQL query it processes along with some other information. Set this to
  // `true` (recommended in production) to disable that feature.
  /* @middlewareOnly */
  disableQueryLog?: boolean;
  // A plain object specifying custom config values to set in the PostgreSQL
  // transaction (accessed via `current_setting('my.custom.setting')`) **or**
  // an (optionally asynchronous) function which will return the same (or a
  // Promise to the same) based on the incoming web request (e.g. to extract
  // session data).
  /* @middlewareOnly */
  pgSettings?: DirectOrCallback<Request, GraphileClaims>;
  // [Experimental] Determines if the 'Explain' feature in GraphiQL can be used
  // to show the user the SQL statements that were executed. Set to a boolean to
  // enable all users to use this, or to a function that filters each request to
  // determine if the request may use Explain. DO NOT USE IN PRODUCTION unless
  // you're comfortable with the security repurcussions of doing so.
  /* @middlewareOnly */
  allowExplain?: DirectOrCallback<Request, boolean>;
  // Some Graphile Engine schema plugins may need additional information
  // available on the `context` argument to the resolver - you can use this
  // function to provide such information based on the incoming request - you
  // can even use this to change the response [experimental], e.g. setting
  // cookies.
  /* @middlewareOnly */
  additionalGraphQLContextFromRequest?: (
    req: Request,
    res: Response,
  ) => Promise<Partial<GraphileResolverContext>>;
  // [experimental] Plugin hook function, enables functionality within
  // PostGraphile to be expanded with plugins. Generate with
  // `makePluginHook(plugins)` passing a list of plugin objects.
  /* @middlewareOnly */
  pluginHook?: PluginHookFn;
  // Should we use relay pagination, or simple collections?
  // "omit" (default) - relay connections only,
  // "only" (not recommended) - simple collections only (no Relay connections),
  // "both" - both.
  simpleCollections?: "omit" | "both" | "only";
  // Max query cache size in bytes (extremely approximate, not
  // accurate at all). Default `50000000` (~50MB). Set to 0 to
  // disable.
  /* @middlewareOnly */
  queryCacheMaxSize?: number;
}

export interface CreateRequestHandlerOptions extends PostGraphileOptions {
  // The actual GraphQL schema we will use.
  getGqlSchema: () => Promise<GraphQLSchema>;
  // A Postgres client pool we use to connect Postgres clients.
  pgPool: Pool;
  _emitter: EventEmitter;
}

export interface GraphQLFormattedErrorExtended {
  message: string;
  locations: ReadonlyArray<SourceLocation> | void;
  path: ReadonlyArray<string | number> | void;
  extensions?: {
    [s: string]: any;
  };
}

export type GraphQLErrorExtended = GraphQLError & {
  extensions: {
    exception: {
      hint: string;
      detail: string;
      code: string;
    };
  };
};

/**
 * A request handler for one of many different `http` frameworks.
 */
export interface HttpRequestHandler<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> {
  (req: Request, res: Response, next?: (error?: mixed) => void): Promise<void>;
  (ctx: { req: Request; res: Response }, next: () => void): Promise<void>;
  formatError: (e: GraphQLError) => GraphQLFormattedErrorExtended;
  getGraphQLSchema: () => Promise<GraphQLSchema>;
  pgPool: Pool;
  withPostGraphileContextFromReqRes: <T>(
    req: Request,
    res: Response,
    moreOptions: any,
    fn: (ctx: GraphileResolverContext) => Promise<T> | T,
  ) => Promise<T>;
  options: CreateRequestHandlerOptions;
  handleErrors: (
    errors: ReadonlyArray<GraphQLError>,
    req: Request,
    res: Response,
  ) => Array<GraphQLErrorExtended>;
}

/**
 * Options passed to the `withPostGraphileContext` function
 */
export interface WithPostGraphileContextOptions {
  pgPool: Pool;
  jwtToken?: string;
  jwtSecret?: jwt.Secret;
  jwtPublicKey?: jwt.Secret | jwt.GetPublicKeyOrSecret;
  jwtAudiences?: Array<string>;
  jwtRole?: Array<string>;
  jwtVerifyOptions?: jwt.VerifyOptions;
  pgDefaultRole?: string;
  pgSettings?: GraphileClaims;
  explain?: boolean;
  queryDocumentAst?: DocumentNode;
  operationName?: string;
  pgForceTransaction?: boolean;
  singleStatement?: boolean;
  // tslint:disable-next-line no-any
  variables?: any;
}
