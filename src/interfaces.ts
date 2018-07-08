import { GraphQLErrorExtended } from './postgraphile/extendedFormatError'
import { PluginHookFn } from './postgraphile/pluginHook'
import { IncomingMessage, ServerResponse } from 'http'
import { GraphQLSchema } from 'graphql'
import { Pool } from 'pg'
import jwt = require('jsonwebtoken')
import { GraphQLError } from 'graphql/error'

export namespace PostGraphile {

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
  export type mixed = {} | string | number | boolean | undefined | null

  // Please note that the comments for this type are turned into documentation
  // automatically. We try and specify the options in the same order as the CLI.
  // Anything tagged `@middlewareOnly` will not appear in the schema-only docs.
  // Only comments written beginning with `//` will be put in the docs.
  export type PostGraphileOptions = {
    // When true, PostGraphile will watch your database schemas and re-create the
    // GraphQL API whenever your schema changes, notifying you as it does. This
    // feature requires an event trigger to be added to the database by a
    // superuser. When enabled PostGraphile will try to add this trigger, if you
    // did not connect as a superuser you will get a warning and the trigger
    // won’t be added.
    /* @middlewareOnly */
    watchPg?: boolean,
    // The default Postgres role to use. If no role was provided in a provided
    // JWT token, this role will be used.
    pgDefaultRole?: string,
    // Setting this to `true` enables dynamic JSON which will allow you to use
    // any JSON as input and get any arbitrary JSON as output. By default JSON
    // types are just a JSON string.
    dynamicJson?: boolean,
    // If none of your `RETURNS SETOF compound_type` functions mix NULLs with the
    // results then you may set this true to reduce the nullables in the GraphQL
    // schema
    setofFunctionsContainNulls?: boolean,
    // Enables classic ids for Relay support. Instead of using the field name
    // `nodeId` for globally unique ids, PostGraphile will instead use the field
    // name `id` for its globally unique ids. This means that table `id` columns
    // will also get renamed to `rowId`.
    classicIds?: boolean,
    // Setting this to `true` will prevent the creation of the default mutation
    // types & fields. Database mutation will only be possible through Postgres
    // functions.
    disableDefaultMutations?: boolean,
    // By default, PostGraphile excludes fields, queries and mutations that the
    // user isn't permitted to access; set this option true to skip these checks
    // and expose everything.
    ignoreRBAC?: boolean,
    // By default, tables and functions that come from extensions are excluded
    // from the generated GraphQL schema as general applications don't need them
    // to be exposed to the end user. You can use this flag to include them in
    // the generated schema. It's recommended that you expose a schema other than
    // `public` so that the schema is not polluted with extension resources
    // anyway.
    includeExtensionResources?: boolean,
    // Enables adding a `stack` field to the error response.  Can be either the
    // boolean `true` (which results in a single stack string) or the string
    // `json` (which causes the stack to become an array with elements for each
    // line of the stack).
    showErrorStack?: boolean,
    // Enables ability to modify errors before sending them down to the client
    // optionally can send down custom responses
    /* @middlewareOnly */
    handleErrors?: ((
      errors: Array<GraphQLError>,
      req: IncomingMessage,
      res: ServerResponse,
    ) => Array<GraphQLErrorExtended>);
    // Extends the error response with additional details from the Postgres
    // error.  Can be any combination of `['hint', 'detail', 'errcode']`.
    // Default is `[]`.
    extendedErrors?: Array<string>,
    // an array of [Graphile Build](/graphile-build/plugins/) plugins to load
    // after the default plugins
    appendPlugins?: Array<(builder: mixed) => {}>,
    // an array of [Graphile Build](/graphile-build/plugins/) plugins to load
    // before the default plugins (you probably don't want this)
    prependPlugins?: Array<(builder: mixed) => {}>,
    // the full array of [Graphile Build](/graphile-build/plugins/) plugins to
    // use for schema generation (you almost definitely don't want this!)
    replaceAllPlugins?: Array<(builder: mixed) => {}>,
    // A file path string. Reads cached values from local cache file to improve
    // startup time (you may want to do this in production).
    readCache?: string,
    // A file path string. Writes computed values to local cache file so startup
    // can be faster (do this during the build phase).
    writeCache?: string,
    // Enables saving the detected schema, in JSON format, to the given location.
    // The directories must exist already, if the file exists it will be
    // overwritten.
    /* @middlewareOnly */
    exportJsonSchemaPath?: string,
    // Enables saving the detected schema, in GraphQL schema format, to the given
    // location. The directories must exist already, if the file exists it will
    // be overwritten.
    /* @middlewareOnly */
    exportGqlSchemaPath?: string,
    // The endpoint the GraphQL executer will listen on. Defaults to `/graphql`.
    /* @middlewareOnly */
    graphqlRoute?: string,
    // The endpoint the GraphiQL query interface will listen on (**NOTE:**
    // GraphiQL will not be enabled unless the `graphiql` option is set to
    // `true`). Defaults to `/graphiql`.
    /* @middlewareOnly */
    graphiqlRoute?: string,
    // Set this to `true` to enable the GraphiQL interface.
    /* @middlewareOnly */
    graphiql?: boolean,
    // Enables some generous CORS settings for the GraphQL endpoint. There are
    // some costs associated when enabling this, if at all possible try to put
    // your API behind a reverse proxy.
    /* @middlewareOnly */
    enableCors?: boolean,
    // Set the maximum size of JSON bodies that can be parsed (default 100kB).
    // The size can be given as a human-readable string, such as '200kB' or '5MB'
    // (case insensitive).
    /* @middlewareOnly */
    bodySizeLimit?: string,
    // [Experimental] Enable the middleware to process multiple GraphQL queries
    // in one request
    /* @middlewareOnly */
    enableQueryBatching?: string,
    // The secret for your JSON web tokens. This will be used to verify tokens in
    // the `Authorization` header, and signing JWT tokens you return in
    // procedures.
    jwtSecret?: string,
    // Options with which to perform JWT verification - see
    // https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    // If 'audience' property is unspecified, it will default to
    // ['postgraphile']; to prevent audience verification set it explicitly to
    // null.
    /* @middlewareOnly */
    jwtVerifyOptions?: jwt.VerifyOptions,
    // A comma separated list of strings that give a path in the jwt from which
    // to extract the postgres role. If none is provided it will use the key
    // `role` on the root of the jwt.
    /* @middlewareOnly */
    jwtRole?: Array<string>,
    // The Postgres type identifier for the compound type which will be signed as
    // a JWT token if ever found as the return type of a procedure. Can be of the
    // form: `my_schema.my_type`. You may use quotes as needed:
    // `"my-special-schema".my_type`.
    jwtPgTypeIdentifier?: string,
    // [DEPRECATED] The audience to use when verifing the JWT token. Deprecated,
    // use `jwtVerifyOptions.audience` instead.
    /* @middlewareOnly */
    jwtAudiences?: Array<string>,
    // Some one-to-one relations were previously detected as one-to-many - should
    // we export 'only' the old relation shapes, both new and old but mark the
    // old ones as 'deprecated', or 'omit' the old relation shapes entirely
    legacyRelations?: 'only' | 'deprecated' | 'omit',
    // ONLY use this option if you require the v3 typenames 'Json' and 'Uuid'
    // over 'JSON' and 'UUID'
    legacyJsonUuid?: boolean,
    // Turns off GraphQL query logging. By default PostGraphile will log every
    // GraphQL query it processes along with some other information. Set this to
    // `true` to disable that feature.
    /* @middlewareOnly */
    disableQueryLog?: boolean,
    // A plain object specifying custom config values to set in the PostgreSQL
    // transaction (accessed via `current_setting('my.custom.setting')`) or a
    // function which will return the same (or a Promise to the same) based on
    // the incoming web request (e.g. to extract session data)
    /* @middlewareOnly */
    pgSettings?: { [key: string]: mixed } | ((req: IncomingMessage) => Promise<{ [key: string]: mixed }>),
    // Some graphile-build plugins may need additional information available on
    // the `context` argument to the resolver - you can use this function to
    // provide such information based on the incoming request - you can even use
    // this to change the response [experimental], e.g. setting cookies
    /* @middlewareOnly */
    additionalGraphQLContextFromRequest?: (req: IncomingMessage, res: ServerResponse) => Promise<{}>,
    // [experimental] Plugin hook function, enables functionality within
    // PostGraphile to be expanded with plugins. Generate with
    // `makePluginHook(plugins)` passing a list of plugin objects.
    /* @middlewareOnly */
    pluginHook?: PluginHookFn,
    // Should we use relay pagination, or simple collections?
    // "omit" (default) - relay connections only,
    // "only" - simple collections only (no Relay connections),
    // "both" - both
    simpleCollections?: 'omit' | 'both' | 'only',
  }

  /**
   * A request handler for one of many different `http` frameworks.
   */
  export interface HttpRequestHandler {
    (req: IncomingMessage, res: ServerResponse, next?: (error?: mixed) => void): void
    (ctx: { req: IncomingMessage, res: ServerResponse }, next: () => void): Promise<void>
    getGraphQLSchema: () => Promise<GraphQLSchema>
    formatError: (e: GraphQLError) => GraphQLError
    pgPool: Pool
  }

}
