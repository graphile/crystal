/* tslint:disable:no-any */
import {
  Source,
  parse as parseGraphql,
  validate as validateGraphql,
  execute as executeGraphql,
  formatError as defaultFormatError,
  GraphQLError,
  GraphQLSchema,
  print as printGraphql,
  specifiedRules,
  DocumentNode,
} from 'graphql';
import { extendedFormatError } from '../extendedFormatError';
import { IncomingMessage, ServerResponse } from 'http';
import { isKoaApp, middleware as koaMiddleware } from './koaMiddleware';
import { pluginHookFromOptions } from '../pluginHook';
import { HttpRequestHandler, mixed, CreateRequestHandlerOptions } from '../../interfaces';
import setupServerSentEvents from './setupServerSentEvents';
import withPostGraphileContext from '../withPostGraphileContext';
import { Context as KoaContext } from 'koa';

import chalk = require('chalk');
import Debugger = require('debug'); // tslint:disable-line variable-name
import httpError = require('http-errors');
import parseUrl = require('parseurl');
import finalHandler = require('finalhandler');
import bodyParser = require('body-parser');
import LRU = require('lru-cache');
import crypto = require('crypto');

/**
 * The favicon file in `Buffer` format. We can send a `Buffer` directly to the
 * client.
 *
 * @type {Buffer}
 */
import favicon from '../../assets/favicon.ico';

/**
 * The GraphiQL HTML file as a string. We need it to be a string, because we
 * will use a regular expression to replace some variables.
 */
import baseGraphiqlHtml from '../../assets/graphiql.html';
import { enhanceHttpServerWithSubscriptions } from './subscriptions';

/**
 * When writing JSON to the browser, we need to be careful that it doesn't get
 * interpretted as HTML.
 */
const JS_ESCAPE_LOOKUP = {
  '<': '\\u003c',
  '>': '\\u003e',
  '/': '\\u002f',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};
function safeJSONStringify(obj: {}) {
  return JSON.stringify(obj).replace(/[<>\/\u2028\u2029]/g, chr => JS_ESCAPE_LOOKUP[chr]);
}

/**
 * When people webpack us up, e.g. for lambda, if they don't want GraphiQL then
 * they can seriously reduce bundle size by omitting the assets.
 */
const shouldOmitAssets = process.env.POSTGRAPHILE_OMIT_ASSETS === '1';

// Used by `createPostGraphileHttpRequestHandler`
const calculateQueryHash = (queryString: string): string =>
  crypto
    .createHash('sha1')
    .update(queryString)
    .digest('base64');

// Fast way of checking if an object is empty,
// faster than `Object.keys(value).length === 0`
const hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(value: any): boolean {
  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

const isPostGraphileDevelopmentMode = process.env.POSTGRAPHILE_ENV === 'development';

const debugGraphql = Debugger('postgraphile:graphql');
const debugRequest = Debugger('postgraphile:request');

/**
 * We need to be able to share the withPostGraphileContext logic between HTTP
 * and websockets
 */
function withPostGraphileContextFromReqResGenerator(
  options: CreateRequestHandlerOptions,
): (
  req: IncomingMessage,
  res: ServerResponse,
  moreOptions: any,
  fn: (ctx: mixed) => any,
) => Promise<any> {
  const { pgSettings, jwtSecret, additionalGraphQLContextFromRequest } = options;
  return async (req, res, moreOptions, fn) => {
    const jwtToken = jwtSecret ? getJwtToken(req) : null;
    const additionalContext =
      typeof additionalGraphQLContextFromRequest === 'function'
        ? await additionalGraphQLContextFromRequest(req, res)
        : {};
    return withPostGraphileContext(
      {
        ...options,
        jwtToken,
        pgSettings: typeof pgSettings === 'function' ? await pgSettings(req) : pgSettings,
        ...moreOptions,
      },
      context => {
        const graphqlContext = { ...additionalContext, ...(context as object) };
        return fn(graphqlContext);
      },
    );
  };
}

/**
 * Creates a GraphQL request handler that can support many different `http` frameworks, including:
 *
 * - Native Node.js `http`.
 * - `connect`.
 * - `express`.
 * - `koa` (2.0).
 */
export default function createPostGraphileHttpRequestHandler(
  options: CreateRequestHandlerOptions,
): HttpRequestHandler {
  const MEGABYTE = 1024 * 1024;
  const {
    getGqlSchema,
    pgPool,
    pgSettings,
    pgDefaultRole,
    queryCacheMaxSize = 50 * MEGABYTE,
  } = options;
  if (options.absoluteRoutes) {
    throw new Error(
      'Sorry - the `absoluteRoutes` setting has been replaced with `externalUrlBase` which solves the issue in a cleaner way. Please update your settings. Thank you for testing a PostGraphile pre-release 🙏',
    );
  }

  // Using let because we might override it on the first request.
  let externalUrlBase = options.externalUrlBase;
  if (externalUrlBase && externalUrlBase.endsWith('/')) {
    throw new Error('externalUrlBase must not end with a slash (`/`)');
  }

  const pluginHook = pluginHookFromOptions(options);

  const origGraphiqlHtml = pluginHook('postgraphile:graphiql:html', baseGraphiqlHtml, { options });

  if (pgDefaultRole && typeof pgSettings === 'function') {
    throw new Error(
      'pgDefaultRole cannot be combined with pgSettings(req) - please remove pgDefaultRole and instead always return a `role` key from pgSettings(req).',
    );
  }
  if (
    pgDefaultRole &&
    pgSettings &&
    typeof pgSettings === 'object' &&
    Object.keys(pgSettings)
      .map(s => s.toLowerCase())
      .indexOf('role') >= 0
  ) {
    throw new Error(
      'pgDefaultRole cannot be combined with pgSettings.role - please use one or the other.',
    );
  }
  if (options.graphiql && shouldOmitAssets) {
    throw new Error('Cannot enable GraphiQL when POSTGRAPHILE_OMIT_ASSETS is set');
  }

  // Gets the route names for our GraphQL endpoint, and our GraphiQL endpoint.
  const graphqlRoute = options.graphqlRoute || '/graphql';
  const graphiqlRoute = options.graphiql === true ? options.graphiqlRoute || '/graphiql' : null;

  // Throw an error of the GraphQL and GraphiQL routes are the same.
  if (graphqlRoute === graphiqlRoute)
    throw new Error(
      `Cannot use the same route, '${graphqlRoute}', for both GraphQL and GraphiQL. Please use different routes.`,
    );

  // Formats an error using the default GraphQL `formatError` function, and
  // custom formatting using some other options.
  const formatError = (error: GraphQLError) => {
    // Get the appropriate formatted error object, including any extended error
    // fields if the user wants them.
    const formattedError =
      options.extendedErrors && options.extendedErrors.length
        ? extendedFormatError(error, options.extendedErrors)
        : defaultFormatError(error);

    // If the user wants to see the error’s stack, let’s add it to the
    // formatted error.
    if (options.showErrorStack)
      (formattedError as object)['stack'] =
        error.stack != null && options.showErrorStack === 'json'
          ? error.stack.split('\n')
          : error.stack;

    return formattedError;
  };

  const DEFAULT_HANDLE_ERRORS = (errors: Array<GraphQLError>) => errors.map(formatError);
  const handleErrors = options.handleErrors || DEFAULT_HANDLE_ERRORS;

  function convertKoaBodyParserToConnect(req: any, _res: any, next: any): any {
    if (req._koaCtx && req._koaCtx.request && req._koaCtx.request.body) {
      req._body = true;
      req.body = req._koaCtx.request.body;
    }
    next();
  }

  // Define a list of middlewares that will get run before our request handler.
  // Note though that none of these middlewares will intercept a request (i.e.
  // not call `next`). Middlewares that handle a request like favicon
  // middleware will result in a promise that never resolves, and we don’t
  // want that.
  const bodyParserMiddlewares = [
    // Convert koa body to connect-compatible body
    convertKoaBodyParserToConnect,
    // Parse JSON bodies.
    bodyParser.json({ limit: options.bodySizeLimit }),
    // Parse URL encoded bodies (forms).
    bodyParser.urlencoded({ extended: false, limit: options.bodySizeLimit }),
    // Parse `application/graphql` content type bodies as text.
    bodyParser.text({ type: 'application/graphql', limit: options.bodySizeLimit }),
  ];

  // We'll turn this into one function now so it can be better JIT optimised
  const bodyParserMiddlewaresComposed = bodyParserMiddlewares.reduce(
    (
      parent: (req: IncomingMessage, res: ServerResponse, next: (err?: Error) => void) => void,
      fn: (req: IncomingMessage, res: ServerResponse, next: (err?: Error) => void) => void,
    ): ((req: IncomingMessage, res: ServerResponse, next: (err?: Error) => void) => void) => {
      return (req, res, next) => {
        parent(req, res, error => {
          if (error) {
            return next(error);
          }
          fn(req, res, next);
        });
      };
    },
    (_req: IncomingMessage, _res: ServerResponse, next: (err?: Error) => void) => next(),
  );

  // And we really want that function to be await-able
  const parseBody = (req: IncomingMessage, res: ServerResponse) =>
    new Promise((resolve, reject) => {
      bodyParserMiddlewaresComposed(req, res, (error: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

  // We only need to calculate the graphiql HTML once; but we need to receive the first request to do so.
  let graphiqlHtml: string | null;

  const withPostGraphileContextFromReqRes = withPostGraphileContextFromReqResGenerator(options);

  const staticValidationRules = pluginHook('postgraphile:validationRules:static', specifiedRules, {
    options,
    httpError,
  });

  // Typically clients use static queries, so we can cache the parse and
  // validate stages for when we see the same query again. Limit the store size
  // to 50MB-worth of queries (or queryCacheMaxSize) so it doesn't consume too
  // much RAM.
  interface CacheEntry {
    queryDocumentAst: DocumentNode;
    validationErrors: ReadonlyArray<GraphQLError>;
    length: number;
  }
  const queryCache = LRU({
    max: queryCacheMaxSize,
    // The query is n.length bytes long; but by the time it's parsed and
    // turned into a GraphQL AST it's somewhat larger in memory. We use a
    // rough approximation here to guess at the memory size (based on some
    // experimentation). https://github.com/graphile/postgraphile/issues/851
    length: (n: CacheEntry, _key: string) => n.length * 110,
  });

  let lastGqlSchema: GraphQLSchema;
  const parseQuery = (
    gqlSchema: GraphQLSchema,
    queryString: string,
  ): {
    queryDocumentAst: DocumentNode;
    validationErrors: ReadonlyArray<GraphQLError>;
  } => {
    if (gqlSchema !== lastGqlSchema) {
      queryCache.reset();
      lastGqlSchema = gqlSchema;
    }

    // Only cache queries that are less than 100kB, we don't want DOS attacks
    // attempting to exhaust our memory.
    const canCache = queryCacheMaxSize > 0 && queryString.length < 100000;

    const hash = canCache ? calculateQueryHash(queryString) : null;
    const result = canCache ? queryCache.get(hash!) : null;
    if (result) {
      return result;
    } else {
      const source = new Source(queryString, 'GraphQL Http Request');
      let queryDocumentAst: DocumentNode | void;

      // Catch an errors while parsing so that we can set the `statusCode` to
      // 400. Otherwise we don’t need to parse this way.
      try {
        queryDocumentAst = parseGraphql(source);
      } catch (error) {
        error.statusCode = 400;
        throw error;
      }

      if (debugRequest.enabled) debugRequest('GraphQL query is parsed.');

      // Validate our GraphQL query using given rules.
      const validationErrors = validateGraphql(gqlSchema, queryDocumentAst, staticValidationRules);
      const cacheResult: CacheEntry = {
        queryDocumentAst,
        validationErrors,
        length: queryString.length,
      };
      if (canCache) {
        queryCache.set(hash!, cacheResult);
      }
      return cacheResult;
    }
  };

  let isFirstRequest = true;

  /**
   * The actual request handler. It’s an async function so it will return a
   * promise when complete. If the function doesn’t handle anything, it calls
   * `next` to let the next middleware try and handle it.
   */
  const requestHandler = async (
    incomingReq: IncomingMessage,
    res: ServerResponse,
    next: (err?: Error) => void,
  ) => {
    // You can use this hook either to modify the incoming request or to tell
    // PostGraphile not to handle the request further (return null). NOTE: if
    // you return `null` from this hook then you are also responsible for
    // calling `next()` (should that be required).
    const req = pluginHook('postgraphile:http:handler', incomingReq, {
      options,
      res,
      next,
    });
    if (req == null) {
      return;
    }

    // Add our CORS headers to be good web citizens (there are perf
    // implications though so be careful!)
    //
    // Always enable CORS when developing PostGraphile because GraphiQL will be
    // on port 5783.
    if (options.enableCors || isPostGraphileDevelopmentMode) addCORSHeaders(res);

    const { pathname = '' } = parseUrl(req) || {};

    // Certain things depend on externalUrlBase, which we guess if the user
    // doesn't supply it, so we calculate them on the first request.
    if (isFirstRequest) {
      isFirstRequest = false;

      if (externalUrlBase == null) {
        // User hasn't specified externalUrlBase; let's try and guess it
        const { pathname: originalPathname = '' } = parseUrl.original(req) || {};
        if (originalPathname !== pathname && originalPathname.endsWith(pathname)) {
          // We were mounted on a subpath (e.g. `app.use('/path/to', postgraphile(...))`).
          // Figure out our externalUrlBase for ourselves.
          externalUrlBase = originalPathname.substr(0, originalPathname.length - pathname.length);
        }
        // Make sure we have a string, at least
        externalUrlBase = externalUrlBase || '';
      }

      // Takes the original GraphiQL HTML file and replaces the default config object.
      graphiqlHtml = origGraphiqlHtml
        ? origGraphiqlHtml.replace(
            /<\/head>/,
            `  <script>window.POSTGRAPHILE_CONFIG=${safeJSONStringify({
              graphqlUrl: `${externalUrlBase}${graphqlRoute}`,
              streamUrl: options.watchPg ? `${externalUrlBase}${graphqlRoute}/stream` : null,
              enhanceGraphiql:
                options.enhanceGraphiql === false
                  ? false
                  : !!options.enhanceGraphiql || options.subscriptions || options.live,
              subscriptions: !!options.subscriptions,
            })};</script>\n  </head>`,
          )
        : null;

      if (options.subscriptions) {
        const server = req && req.connection && req.connection['server'];
        if (!server) {
          // tslint:disable-next-line no-console
          console.warn(
            "Failed to find server to add websocket listener to, you'll need to call `enhanceHttpServerWithSubscriptions` manually",
          );
        } else {
          // Relying on this means that a normal request must come in before an
          // upgrade attempt. It's better to call it manually.
          enhanceHttpServerWithSubscriptions(server, middleware);
        }
      }
    }
    const isGraphqlRoute = pathname === graphqlRoute;

    // ========================================================================
    // Serve GraphiQL and Related Assets
    // ========================================================================

    if (!shouldOmitAssets && options.graphiql && !isGraphqlRoute) {
      // ======================================================================
      // Favicon
      // ======================================================================

      // If this is the favicon path and it has not yet been handled, let us
      // serve our GraphQL favicon.
      if (pathname === '/favicon.ico') {
        // If this is the wrong method, we should let the client know.
        if (!(req.method === 'GET' || req.method === 'HEAD')) {
          res.statusCode = req.method === 'OPTIONS' ? 200 : 405;
          res.setHeader('Allow', 'GET, HEAD, OPTIONS');
          res.end();
          return;
        }

        // Otherwise we are good and should pipe the favicon to the browser.
        res.statusCode = 200;
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Content-Type', 'image/x-icon');

        // End early if the method is `HEAD`.
        if (req.method === 'HEAD') {
          res.end();
          return;
        }

        res.end(favicon);
        return;
      }

      // ======================================================================
      // GraphiQL Watch Stream
      // ======================================================================

      // Setup an event stream so we can broadcast events to graphiql, etc.
      if (pathname === `${graphqlRoute}/stream` || pathname === '/_postgraphile/stream') {
        if (!options.watchPg || req.headers.accept !== 'text/event-stream') {
          res.statusCode = 405;
          res.end();
          return;
        }
        setupServerSentEvents(req, res, options);
        return;
      }

      // ======================================================================
      // GraphiQL HTML
      // ======================================================================

      // If this is the GraphiQL route, show GraphiQL and stop execution.
      if (pathname === graphiqlRoute) {
        // If we are developing PostGraphile, instead just redirect.
        if (isPostGraphileDevelopmentMode) {
          res.statusCode = 302;
          res.setHeader('Location', 'http://localhost:5783');
          res.end();
          return;
        }

        // If using the incorrect method, let the user know.
        if (!(req.method === 'GET' || req.method === 'HEAD')) {
          res.statusCode = req.method === 'OPTIONS' ? 200 : 405;
          res.setHeader('Allow', 'GET, HEAD, OPTIONS');
          res.end();
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");

        // End early if the method is `HEAD`.
        if (req.method === 'HEAD') {
          res.end();
          return;
        }

        // Actually renders GraphiQL.
        res.end(graphiqlHtml);
        return;
      }
    }

    // Don’t handle any requests if this is not the correct route.
    if (!isGraphqlRoute) return next();

    // ========================================================================
    // Execute GraphQL Queries
    // ========================================================================

    // If we didn’t call `next` above, all requests will return 200 by default!
    res.statusCode = 200;
    if (options.watchPg) {
      // Inform GraphiQL and other clients that they can subscribe to events
      // (such as the schema being updated) at the following URL
      res.setHeader('X-GraphQL-Event-Stream', `${externalUrlBase}${graphqlRoute}/stream`);
    }

    // Don’t execute our GraphQL stuffs for `OPTIONS` requests.
    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      res.end();
      return;
    }

    // The `result` will be used at the very end in our `finally` block.
    // Statements inside the `try` will assign to `result` when they get
    // a result. We also keep track of `params`.
    let paramsList: any;
    let results: Array<{
      data?: any;
      errors?: Array<GraphQLError>;
      statusCode?: number;
    }> = [];
    const queryTimeStart = !options.disableQueryLog && process.hrtime();
    let pgRole: string;

    if (debugRequest.enabled) debugRequest('GraphQL query request has begun.');
    let returnArray = false;

    // This big `try`/`catch`/`finally` block represents the execution of our
    // GraphQL query. All errors thrown in this block will be returned to the
    // client as GraphQL errors.
    try {
      // First thing we need to do is get the GraphQL schema for this request.
      // It should never really change unless we are in watch mode.
      const gqlSchema = await getGqlSchema();

      // Note that we run our middleware after we make sure we are on the
      // correct route. This is so that if our middleware modifies the `req` or
      // `res` objects, only we downstream will see the modifications.
      //
      // We also run our middleware inside the `try` so that we get the GraphQL
      // error reporting style for syntax errors.
      await parseBody(req, res);

      // If this is not one of the correct methods, throw an error.
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST, OPTIONS');
        throw httpError(405, 'Only `POST` requests are allowed.');
      }

      // Get the parameters we will use to run a GraphQL request. `params` may
      // include:
      //
      // - `query`: The required GraphQL query string.
      // - `variables`: An optional JSON object containing GraphQL variables.
      // - `operationName`: The optional name of the GraphQL operation we will
      //   be executing.
      const body: string | object = (req as any).body;
      paramsList = typeof body === 'string' ? { query: body } : body;

      // Validate our paramsList object a bit.
      if (paramsList == null)
        throw httpError(400, 'Must provide an object parameters, not nullish value.');
      if (typeof paramsList !== 'object')
        throw httpError(
          400,
          `Expected parameter object, not value of type '${typeof paramsList}'.`,
        );
      if (Array.isArray(paramsList)) {
        if (!options.enableQueryBatching) {
          throw httpError(
            501,
            'Batching queries as an array is currently unsupported. Please provide a single query object.',
          );
        } else {
          returnArray = true;
        }
      } else {
        paramsList = [paramsList];
      }
      paramsList = pluginHook('postgraphile:httpParamsList', paramsList, {
        options,
        req,
        res,
        returnArray,
        httpError,
      });
      results = await Promise.all(
        paramsList.map(async (params: any) => {
          let queryDocumentAst: DocumentNode;
          let result: any;
          const meta = {};
          try {
            if (!params.query) throw httpError(400, 'Must provide a query string.');

            // If variables is a string, we assume it is a JSON string and that it
            // needs to be parsed.
            if (typeof params.variables === 'string') {
              // If variables is just an empty string, we should set it to null and
              // ignore it.
              if (params.variables === '') {
                params.variables = null;
              } else {
                // Otherwise, let us try to parse it as JSON.
                try {
                  params.variables = JSON.parse(params.variables);
                } catch (error) {
                  error.statusCode = 400;
                  throw error;
                }
              }
            }

            // Throw an error if `variables` is not an object.
            if (params.variables != null && typeof params.variables !== 'object')
              throw httpError(
                400,
                `Variables must be an object, not '${typeof params.variables}'.`,
              );

            // Throw an error if `operationName` is not a string.
            if (params.operationName != null && typeof params.operationName !== 'string')
              throw httpError(
                400,
                `Operation name must be a string, not '${typeof params.operationName}'.`,
              );

            let validationErrors: ReadonlyArray<GraphQLError>;
            ({ queryDocumentAst, validationErrors } = parseQuery(gqlSchema, params.query));

            if (validationErrors.length === 0) {
              // You are strongly encouraged to use
              // `postgraphile:validationRules:static` if possible - you should
              // only use this one if you need access to variables.
              const moreValidationRules = pluginHook('postgraphile:validationRules', [], {
                options,
                req,
                res,
                variables: params.variables,
                operationName: params.operationName,
                meta,
              });
              if (moreValidationRules.length) {
                validationErrors = validateGraphql(
                  gqlSchema,
                  queryDocumentAst,
                  moreValidationRules,
                );
              }
            }

            // If we have some validation errors, don’t execute the query. Instead
            // send the errors to the client with a `400` code.
            if (validationErrors.length > 0) {
              result = { errors: validationErrors, statusCode: 400 };
            } else {
              if (debugRequest.enabled) debugRequest('GraphQL query is validated.');

              // Lazily log the query. If this debugger isn’t enabled, don’t run it.
              if (debugGraphql.enabled)
                debugGraphql(
                  printGraphql(queryDocumentAst)
                    .replace(/\s+/g, ' ')
                    .trim(),
                );

              result = await withPostGraphileContextFromReqRes(
                req,
                res,
                {
                  singleStatement: false,
                  queryDocumentAst,
                  variables: params.variables,
                  operationName: params.operationName,
                },
                (graphqlContext: any) => {
                  pgRole = graphqlContext.pgRole;
                  return executeGraphql(
                    gqlSchema,
                    queryDocumentAst,
                    null,
                    graphqlContext,
                    params.variables,
                    params.operationName,
                  );
                },
              );
            }
          } catch (error) {
            result = {
              errors: [error],
              statusCode: error.status || error.statusCode || 500,
            };

            // If the status code is 500, let’s log our error.
            if (result.statusCode === 500)
              // tslint:disable-next-line no-console
              console.error(error.stack);
          } finally {
            // Format our errors so the client doesn’t get the full thing.
            if (result && result.errors) {
              result.errors = (handleErrors as any)(result.errors, req, res);
            }
            if (!isEmpty(meta)) {
              result.meta = meta;
            }
            result = pluginHook('postgraphile:http:result', result, {
              options,
              returnArray,
              queryDocumentAst: queryDocumentAst!,
              req,
              pgRole,
              // We don't pass `res` here because this is for just a single
              // result; if you need that, use postgraphile:http:end.
            });
            // Log the query. If this debugger isn’t enabled, don’t run it.
            if (
              !options.disableQueryLog &&
              queryDocumentAst! /* `!` is not strictly true, but stops TS complaining. */
            ) {
              // We must reference this before it's deleted!
              const resultStatusCode = result.statusCode;
              const timeDiff = queryTimeStart && process.hrtime(queryTimeStart);
              setImmediate(() => {
                const prettyQuery = printGraphql(queryDocumentAst)
                  .replace(/\s+/g, ' ')
                  .trim();
                const errorCount = (result.errors || []).length;
                const ms = timeDiff[0] * 1e3 + timeDiff[1] * 1e-6;

                let message: string;
                if (resultStatusCode === 401) {
                  // Users requested that JWT errors were raised differently:
                  //
                  //   https://github.com/graphile/postgraphile/issues/560
                  message = chalk.red(`401 authentication error`);
                } else if (resultStatusCode === 403) {
                  message = chalk.red(`403 forbidden error`);
                } else {
                  message = chalk[errorCount === 0 ? 'green' : 'red'](`${errorCount} error(s)`);
                }

                // tslint:disable-next-line no-console
                console.log(
                  `${message} ${
                    pgRole != null ? `as ${chalk.magenta(pgRole)} ` : ''
                  }in ${chalk.grey(`${ms.toFixed(2)}ms`)} :: ${prettyQuery}`,
                );
              });
            }
            if (debugRequest.enabled) debugRequest('GraphQL query has been executed.');
          }
          return result;
        }),
      );
    } catch (error) {
      // Set our status code and send the client our results!
      if (res.statusCode === 200) res.statusCode = error.status || error.statusCode || 500;

      // Overwrite entire response
      returnArray = false;
      results = [{ errors: [error] }];

      // If the status code is 500, let’s log our error.
      if (res.statusCode === 500)
        // tslint:disable-next-line no-console
        console.error(error.stack);
    } finally {
      // Finally, we send the client the results.
      if (!returnArray) {
        if (res.statusCode === 200 && results[0].statusCode) {
          res.statusCode = results[0].statusCode!;
        }
        delete results[0].statusCode;
      }

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      const { statusCode, result } = pluginHook(
        'postgraphile:http:end',
        {
          statusCode: res.statusCode,
          result: returnArray ? results : results[0]!,
        },
        {
          options,
          returnArray,
          req,
          res,
        },
      );

      if (statusCode) {
        res.statusCode = statusCode;
      }
      res.end(JSON.stringify(result));

      if (debugRequest.enabled)
        debugRequest('GraphQL ' + (returnArray ? 'queries' : 'query') + ' request finished.');
    }
  };

  /**
   * A polymorphic request handler that should detect what `http` framework is
   * being used and specifically handle that framework.
   *
   * Supported frameworks include:
   *
   * - Native Node.js `http`.
   * - `connect`.
   * - `express`.
   * - `koa` (2.0).
   */
  const middleware: any = (a: any, b: any, c: any) => {
    // If are arguments look like the arguments to koa middleware, this is
    // `koa` middleware.
    if (isKoaApp(a, b)) {
      // Set the correct `koa` variable names…
      const ctx = a as KoaContext;
      const next = b as (err?: Error) => Promise<any>;
      return koaMiddleware(ctx, next, requestHandler);
    } else {
      // Set the correct `connect` style variable names. If there was no `next`
      // defined (likely the case if the client is using `http`) we use the
      // final handler.
      const req = a as IncomingMessage;
      const res = b as ServerResponse;
      const next = c || finalHandler(req, res);

      // Execute our request handler.
      requestHandler(req, res, next).then(
        // If the request was fulfilled, noop.
        () => {
          /* noop */
        },
        // If the request errored out, call `next` with the error.
        error => next(error),
      );
    }
  };

  middleware.getGraphQLSchema = getGqlSchema;
  middleware.formatError = formatError;
  middleware.pgPool = pgPool;
  middleware.withPostGraphileContextFromReqRes = withPostGraphileContextFromReqRes;
  middleware.handleErrors = handleErrors;
  middleware.options = options;

  const hookedMiddleware = pluginHook('postgraphile:middleware', middleware, {
    options,
  });
  // Sanity check:
  if (!hookedMiddleware.getGraphQLSchema) {
    throw new Error(
      "Hook for 'postgraphile:middleware' has not copied over the helpers; e.g. missing `Object.assign(newMiddleware, oldMiddleware)`",
    );
  }

  return hookedMiddleware as HttpRequestHandler;
}

/**
 * Adds CORS to a request. See [this][1] flowchart for an explanation of how
 * CORS works. Note that these headers are set for all requests, CORS
 * algorithms normally run a preflight request using the `OPTIONS` method to
 * get these headers.
 *
 * Note though, that enabling CORS will incur extra costs when it comes to the
 * preflight requests. It is much better if you choose to use a proxy and
 * bypass CORS altogether.
 *
 * [1]: http://www.html5rocks.com/static/images/cors_server_flowchart.png
 */
function addCORSHeaders(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    [
      'Origin',
      'X-Requested-With',
      // Used by `express-graphql` to determine whether to expose the GraphiQL
      // interface (`text/html`) or not.
      'Accept',
      // Used by PostGraphile for auth purposes.
      'Authorization',
      // Used by GraphQL Playground and other Apollo-enabled servers
      'X-Apollo-Tracing',
      // The `Content-*` headers are used when making requests with a body,
      // like in a POST request.
      'Content-Type',
      'Content-Length',
    ].join(', '),
  );
  res.setHeader(
    'Access-Control-Expose-Headers',
    [
      'X-GraphQL-Event-Stream'
    ]
  );
}

function createBadAuthorizationHeaderError(): httpError.HttpError {
  return httpError(400, 'Authorization header is not of the correct bearer scheme format.');
}

/**
 * Parses the `Bearer` auth scheme token out of the `Authorization` header as
 * defined by [RFC7235][1].
 *
 * ```
 * Authorization = credentials
 * credentials   = auth-scheme [ 1*SP ( token68 / #auth-param ) ]
 * token68       = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" )*"="
 * ```
 *
 * [1]: https://tools.ietf.org/html/rfc7235
 *
 * @private
 */
const authorizationBearerRex = /^\s*bearer\s+([a-z0-9\-._~+/]+=*)\s*$/i;

/**
 * Gets the JWT token from the Http request’s headers. Specifically the
 * `Authorization` header in the `Bearer` format. Will throw an error if the
 * header is in the incorrect format, but will not throw an error if the header
 * does not exist.
 *
 * @private
 * @param {IncomingMessage} request
 * @returns {string | null}
 */
function getJwtToken(request: IncomingMessage): string | null {
  const { authorization } = request.headers;
  if (Array.isArray(authorization)) throw createBadAuthorizationHeaderError();

  // If there was no authorization header, just return null.
  if (authorization == null) return null;

  const match = authorizationBearerRex.exec(authorization);

  // If we did not match the authorization header with our expected format,
  // throw a 400 error.
  if (!match) throw createBadAuthorizationHeaderError();

  // Return the token from our match.
  return match[1];
}
