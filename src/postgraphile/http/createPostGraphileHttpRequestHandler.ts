/* eslint-disable */// Because we use tslint
/* tslint:disable:no-any no-var-requires */
import {
  join as joinPath,
  resolve as resolvePath,
  relative as relativePath,
} from 'path'
import { readFile } from 'fs'
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
} from 'graphql'
import { extendedFormatError } from '../extendedFormatError'
import { IncomingMessage, ServerResponse } from 'http'
import { isKoaApp, middleware as koaMiddleware } from './koaMiddleware'
import { pluginHookFromOptions } from '../pluginHook'
import { PostGraphile } from '../../interfaces'
import HttpRequestHandler = PostGraphile.HttpRequestHandler
import ICreateRequestHandler = PostGraphile.ICreateRequestHandler
import mixed = PostGraphile.mixed
import setupServerSentEvents from './setupServerSentEvents'
import withPostGraphileContext from '../withPostGraphileContext'


const chalk = require('chalk')
const Debugger = require('debug') // tslint:disable-line variable-name
const httpError = require('http-errors')
const parseUrl = require('parseurl')
const finalHandler = require('finalhandler')
const bodyParser = require('body-parser')
const sendFile = require('send')
const LRU = require('lru-cache')
const crypto = require('crypto')

const calculateQueryHash = (query: string) => crypto.createHash('sha1').update(query).digest('base64')

// Fast way of checking if an object is empty,
// faster than `Object.keys(value).length === 0`
const hasOwnProperty = Object.prototype.hasOwnProperty
function isEmpty(value: any): boolean {
  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false
    }
  }
  return true
}

const { POSTGRAPHILE_ENV } = process.env

const debugGraphql = new Debugger('postgraphile:graphql')
const debugRequest = new Debugger('postgraphile:request')

export const graphiqlDirectory = resolvePath(__dirname, '../graphiql/public')

/**
 * The favicon file in `Buffer` format. We can send a `Buffer` directly to the
 * client.
 *
 * @type {Promise<Buffer>}
 */
const favicon = new Promise((resolve, reject) => {
  readFile(
    resolvePath(__dirname, '../../../resources/favicon.ico'),
    (error, data) => {
      if (error) reject(error)
      else resolve(data)
    },
  )
})

/**
 * The GraphiQL HTML file as a string. We need it to be a string, because we
 * will use a regular expression to replace some variables.
 */
const origGraphiqlHtml: Promise<string> = new Promise((resolve, reject) => {
  readFile(
    resolvePath(__dirname, '../graphiql/public/index.html'),
    'utf8',
    (error, data) => {
      if (error) reject(error)
      else resolve(data)
    },
  )
})

/**
 * We need to be able to share the withPostGraphileContext logic between HTTP
 * and websockets
 */
function withPostGraphileContextFromReqResGenerator(options: ICreateRequestHandler) {
  const {
    pgSettings,
    jwtSecret,
    additionalGraphQLContextFromRequest,
  } = options
  return async (req: IncomingMessage, res: ServerResponse, moreOptions: any, fn: (ctx: mixed) => any): Promise<any> => {
    const jwtToken = jwtSecret ? getJwtToken(req) : null
    const additionalContext =
      typeof additionalGraphQLContextFromRequest === 'function'
        ? await additionalGraphQLContextFromRequest(req, res)
        : {}
    return withPostGraphileContext(
      {
        ...options,
        jwtToken,
        pgSettings:
          typeof pgSettings === 'function'
            ? await pgSettings(req)
            : pgSettings,
        ...moreOptions,
      },
      context => {
        const graphqlContext = Object.assign({}, additionalContext, context)
        return fn(graphqlContext)
      },
    )
  }
}

export default function createPostGraphileHttpRequestHandler(options: ICreateRequestHandler): HttpRequestHandler {
  const MEGABYTE = 1024 * 1024
  const {
    getGqlSchema,
    pgPool,
    pgSettings,
    pgDefaultRole,
    queryCacheMaxSize = 100 * MEGABYTE,
  } = options
  const pluginHook = pluginHookFromOptions(options)

  if (pgDefaultRole && typeof pgSettings === 'function') {
    throw new Error(
      'pgDefaultRole cannot be combined with pgSettings(req) - please remove pgDefaultRole and instead always return a `role` key from pgSettings(req).',
    )
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
    )
  }

  // Gets the route names for our GraphQL endpoint, and our GraphiQL endpoint.
  const graphqlRoute = options.graphqlRoute || '/graphql'
  const graphiqlRoute =
    options.graphiql === true ? options.graphiqlRoute || '/graphiql' : null

  // Throw an error of the GraphQL and GraphiQL routes are the same.
  if (graphqlRoute === graphiqlRoute)
    throw new Error(
      `Cannot use the same route, '${graphqlRoute}', for both GraphQL and GraphiQL. Please use different routes.`,
    )

  // Formats an error using the default GraphQL `formatError` function, and
  // custom formatting using some other options.
  const formatError = (error: GraphQLError) => {
    // Get the appropriate formatted error object, including any extended error
    // fields if the user wants them.
    const formattedError =
      options.extendedErrors && options.extendedErrors.length
        ? extendedFormatError(error, options.extendedErrors)
        : defaultFormatError(error)

    // If the user wants to see the error’s stack, let’s add it to the
    // formatted error.
    error.stack = error.stack || '[empty stack]'
    if (options.showErrorStack)
      formattedError.stack =
        options.showErrorStack
          ? error.stack.split('\n')
          : error.stack

    return formattedError
  }

  const DEFAULT_HANDLE_ERRORS = (errors: Array<GraphQLError>) => errors.map(formatError)
  const handleErrors = options.handleErrors || DEFAULT_HANDLE_ERRORS

  function convertKoaBodyParserToConnect(req: any, res: any, next: any): any {
    if (req._koaCtx && req._koaCtx.request && req._koaCtx.request.body) {
      req._body = true
      req.body = req._koaCtx.request.body
    }
    next()
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
    bodyParser.urlencoded({ extended: false }),
    // Parse `application/graphql` content type bodies as text.
    bodyParser.text({ type: 'application/graphql' }),
  ]

  // We'll turn this into one function now so it can be better JIT optimised
  const bodyParserMiddlewaresComposed = bodyParserMiddlewares.reduce(
    (parent: any, fn) => {
      return (req: IncomingMessage, res: ServerResponse, next: any) => {
        parent(req, res, (error: Error) => {
          if (error) {
            return next(error)
          }
          fn(req, res, next)
        })
      }
    },
    (req: any, res: any, next: any) => next(),
  )

  // And we really want that function to be await-able
  const parseBody = (req: IncomingMessage, res: ServerResponse) => new Promise((resolve, reject) => {
    bodyParserMiddlewaresComposed(req, res, (error: Error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })

  // Takes the original GraphiQL HTML file and replaces the default config object.
  const graphiqlHtml = origGraphiqlHtml.then(html =>
    html.replace(
      /window\.POSTGRAPHILE_CONFIG\s*=\s*\{[^]*\}/,
      `window.POSTGRAPHILE_CONFIG={graphqlUrl:'${graphqlRoute}',streamUrl:${
        options.watchPg ? '\'/_postgraphile/stream\'' : 'null'
      }}`,
    ),
  )

  const withPostGraphileContextFromReqRes = withPostGraphileContextFromReqResGenerator(options)

  const staticValidationRules = pluginHook('postgraphile:validationRules:static', specifiedRules, {
    options,
    httpError,
  })

  // Typically clients use static queries, so we can cache the parse and
  // validate stages for when we see the same query again. Limit the store size
  // to 100MB (or queryCacheMaxSize) so it doesn't consume too much RAM.
  const SHA1_BASE64_LENGTH = 28
  const queryCache = LRU({
    max: queryCacheMaxSize,
    length: (n: any) => n.length + SHA1_BASE64_LENGTH,
  })

  let lastGqlSchema: any
  const parseQuery = (gqlSchema: GraphQLSchema, queryString: string) => {
    if (gqlSchema !== lastGqlSchema) {
      queryCache.reset()
      lastGqlSchema = gqlSchema
    }

    // Only cache queries that are less than 100kB, we don't want DOS attacks
    // attempting to exhaust our memory.
    const canCache = queryString.length < 100000

    const hash = canCache && calculateQueryHash(queryString)
    const result = canCache && queryCache.get(hash)
    if (result) {
      return result
    } else {
      const source = new Source(queryString, 'GraphQL Http Request')
      let queryDocumentAst

      // Catch an errors while parsing so that we can set the `statusCode` to
      // 400. Otherwise we don’t need to parse this way.
      try {
        queryDocumentAst = parseGraphql(source)
      } catch (error) {
        error.statusCode = 400
        throw error
      }

      if (debugRequest.enabled) debugRequest('GraphQL query is parsed.')

      // Validate our GraphQL query using given rules.
      const validationErrors = validateGraphql(gqlSchema, queryDocumentAst, staticValidationRules)
      const cacheResult = { queryDocumentAst, validationErrors }
      if (canCache) {
        queryCache.set(hash, cacheResult)
      }
      return cacheResult
    }
  }

  /**
   * The actual request handler. It’s an async function so it will return a
   * promise when complete. If the function doesn’t handle anything, it calls
   * `next` to let the next middleware try and handle it.
   */
  const requestHandler = async (incomingReq: any, res: any, next: any) => {
    // You can use this hook either to modify the incoming request or to tell
    // PostGraphile not to handle the request further (return null). NOTE: if
    // you return `null` from this hook then you are also responsible for
    // calling `next()` (should that be required).
    const req = pluginHook('postgraphile:http:handler', incomingReq, {options, res, next})
    if (req == null) {
      return
    }

    // Add our CORS headers to be good web citizens (there are perf
    // implications though so be careful!)
    //
    // Always enable CORS when developing PostGraphile because GraphiQL will be
    // on port 5783.
    if (options.enableCors || POSTGRAPHILE_ENV === 'development')
      addCORSHeaders(res)

    const { pathname } = parseUrl(req)
    const isGraphqlRoute = pathname === graphqlRoute

    // ========================================================================
    // Serve GraphiQL and Related Assets
    // ========================================================================

    if (options.graphiql && !isGraphqlRoute) {
      // ======================================================================
      // Favicon
      // ======================================================================

      // If this is the favicon path and it has not yet been handled, let us
      // serve our GraphQL favicon.
      if (pathname === '/favicon.ico') {
        // If this is the wrong method, we should let the client know.
        if (!(req.method === 'GET' || req.method === 'HEAD')) {
          res.statusCode = req.method === 'OPTIONS' ? 200 : 405
          res.setHeader('Allow', 'GET, HEAD, OPTIONS')
          res.end()
          return
        }

        // Otherwise we are good and should pipe the favicon to the browser.
        res.statusCode = 200
        res.setHeader('Cache-Control', 'public, max-age=86400')
        res.setHeader('Content-Type', 'image/x-icon')

        // End early if the method is `HEAD`.
        if (req.method === 'HEAD') {
          res.end()
          return
        }

        res.end(await favicon)
        return
      }

      // ======================================================================
      // GraphiQL `create-react-app` Assets
      // ======================================================================

      // Serve the assets for GraphiQL on a namespaced path. This will basically
      // serve up the built GraphiQL directory.
      if (pathname.startsWith('/_postgraphile/graphiql/')) {
        // If using the incorrect method, let the user know.
        if (!(req.method === 'GET' || req.method === 'HEAD')) {
          res.statusCode = req.method === 'OPTIONS' ? 200 : 405
          res.setHeader('Allow', 'GET, HEAD, OPTIONS')
          res.end()
          return
        }

        // Gets the asset path (the path name with the PostGraphile prefix
        // stripped off) and turns it into a real filesystem path
        const assetPath = resolvePath(
          joinPath(
            graphiqlDirectory,
            pathname.slice('/_postgraphile/graphiql/'.length),
          ),
        )

        // Figures out the relative path for assetPath within graphiqlDirectory
        // so we can correctly filter 'index.html' and 'asset-manifest.json'
        const assetPathRelative = relativePath(graphiqlDirectory, assetPath)

        // Block any attempts at path traversal issues
        if (
          assetPath.substr(0, graphiqlDirectory.length) !== graphiqlDirectory ||
          assetPathRelative.substr(0, 2) === '..'
        ) {
          res.statusCode = 403
          res.end()
          return
        }

        // Don’t allow certain files generated by `create-react-app` to be
        // inspected.
        if (
          assetPathRelative === 'index.html' ||
          assetPathRelative === 'asset-manifest.json'
        ) {
          res.statusCode = 404
          res.end()
          return
        }

        // Sends the asset at this path. Defaults to a `statusCode` of 200.
        res.statusCode = 200
        if (req._koaCtx) {
          req._koaCtx.compress = false
        }
        await new Promise((resolve, reject) => {
          sendFile(req, assetPathRelative, {
            index: false,
            root: graphiqlDirectory,
            dotfiles: 'ignore',
          })
            .on('end', resolve)
            .on('error', reject)
            .pipe(res)
        })
      }

      // ======================================================================
      // GraphiQL Watch Stream
      // ======================================================================

      // Setup an event stream so we can broadcast events to graphiql, etc.
      if (pathname === '/_postgraphile/stream') {
        if (!options.watchPg || req.headers.accept !== 'text/event-stream') {
          res.statusCode = 405
          res.end()
          return
        }
        setupServerSentEvents(req, res, options)
        return
      }

      // ======================================================================
      // GraphiQL HTML
      // ======================================================================

      // If this is the GraphiQL route, show GraphiQL and stop execution.
      if (pathname === graphiqlRoute) {
        // If we are developing PostGraphile, instead just redirect.
        if (POSTGRAPHILE_ENV === 'development') {
          res.statusCode = 302
          res.setHeader('Location', 'http://localhost:5783')
          res.end()
          return
        }

        // If using the incorrect method, let the user know.
        if (!(req.method === 'GET' || req.method === 'HEAD')) {
          res.statusCode = req.method === 'OPTIONS' ? 200 : 405
          res.setHeader('Allow', 'GET, HEAD, OPTIONS')
          res.end()
          return
        }

        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html; charset=utf-8')

        // End early if the method is `HEAD`.
        if (req.method === 'HEAD') {
          res.end()
          return
        }

        // Actually renders GraphiQL.
        res.end(await graphiqlHtml)
        return
      }
    }

    // Don’t handle any requests if this is not the correct route.
    if (!isGraphqlRoute) return next()

    // ========================================================================
    // Execute GraphQL Queries
    // ========================================================================

    // If we didn’t call `next` above, all requests will return 200 by default!
    res.statusCode = 200
    if (options.watchPg) {
      // Inform GraphiQL and other clients that they can subscribe to events
      // (such as the schema being updated) at the following URL
      res.setHeader('X-GraphQL-Event-Stream', '/_postgraphile/stream')
    }

    // Don’t execute our GraphQL stuffs for `OPTIONS` requests.
    if (req.method === 'OPTIONS') {
      res.statusCode = 200
      res.end()
      return
    }

    // The `result` will be used at the very end in our `finally` block.
    // Statements inside the `try` will assign to `result` when they get
    // a result. We also keep track of `params`.
    let paramsList: any
    let results: Array<{data?: any, errors?: Array<GraphQLError>}> = []
    const queryTimeStart = !options.disableQueryLog && process.hrtime()
    let pgRole: string

    if (debugRequest.enabled) debugRequest('GraphQL query request has begun.')
    let returnArray = false

    // This big `try`/`catch`/`finally` block represents the execution of our
    // GraphQL query. All errors thrown in this block will be returned to the
    // client as GraphQL errors.
    try {
      // First thing we need to do is get the GraphQL schema for this request.
      // It should never really change unless we are in watch mode.
      const gqlSchema = await getGqlSchema()

      // Note that we run our middleware after we make sure we are on the
      // correct route. This is so that if our middleware modifies the `req` or
      // `res` objects, only we downstream will see the modifications.
      //
      // We also run our middleware inside the `try` so that we get the GraphQL
      // error reporting style for syntax errors.
      await parseBody(req, res)

      // If this is not one of the correct methods, throw an error.
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST, OPTIONS')
        throw httpError(405, 'Only `POST` requests are allowed.')
      }

      // Get the parameters we will use to run a GraphQL request. `params` may
      // include:
      //
      // - `query`: The required GraphQL query string.
      // - `variables`: An optional JSON object containing GraphQL variables.
      // - `operationName`: The optional name of the GraphQL operation we will
      //   be executing.
      paramsList = typeof req.body === 'string' ? { query: req.body } : req.body

      // Validate our paramsList object a bit.
      if (paramsList == null)
        throw httpError(
          400,
          'Must provide an object parameters, not nullish value.',
        )
      if (typeof paramsList !== 'object')
        throw httpError(
          400,
          `Expected parameter object, not value of type '${typeof paramsList}'.`,
        )
      if (Array.isArray(paramsList)) {
        if (!options.enableQueryBatching) {
          throw httpError(
            501,
            'Batching queries as an array is currently unsupported. Please provide a single query object.',
          )
        } else {
          returnArray = true
        }
      } else {
        paramsList = [paramsList]
      }
      paramsList = pluginHook('postgraphile:httpParamsList', paramsList, { options, req, res, returnArray, httpError })
      results = await Promise.all(paramsList.map(async (params: any) => {
        let queryDocumentAst: any
        let result: any
        let meta = {}
        try {
          if (!params.query) throw httpError(400, 'Must provide a query string.')

          // If variables is a string, we assume it is a JSON string and that it
          // needs to be parsed.
          if (typeof params.variables === 'string') {
            // If variables is just an empty string, we should set it to null and
            // ignore it.
            if (params.variables === '') {
              params.variables = null
            } else {
              // Otherwise, let us try to parse it as JSON.
              try {
                params.variables = JSON.parse(params.variables)
              } catch (error) {
                error.statusCode = 400
                throw error
              }
            }
          }

          // Throw an error if `variables` is not an object.
          if (params.variables != null && typeof params.variables !== 'object')
            throw httpError(
              400,
              `Variables must be an object, not '${typeof params.variables}'.`,
            )

          // Throw an error if `operationName` is not a string.
          if (
            params.operationName != null &&
            typeof params.operationName !== 'string'
          )
            throw httpError(
              400,
              `Operation name must be a string, not '${typeof params.operationName}'.`,
            )

          let validationErrors
          ({ queryDocumentAst, validationErrors } = parseQuery(gqlSchema, params.query))

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
            })
            if (moreValidationRules.length) {
              validationErrors = validateGraphql(gqlSchema, queryDocumentAst, moreValidationRules)
            }
          }

          // If we have some validation errors, don’t execute the query. Instead
          // send the errors to the client with a `400` code.
          if (validationErrors.length > 0) {
            result = { errors: validationErrors, statusCode: 400 }
          } else {
            if (debugRequest.enabled) debugRequest('GraphQL query is validated.')

            // Lazily log the query. If this debugger isn’t enabled, don’t run it.
            if (debugGraphql.enabled)
              debugGraphql(
                printGraphql(queryDocumentAst)
                  .replace(/\s+/g, ' ')
                  .trim(),
              )

            result = await withPostGraphileContextFromReqRes(req, res, {
              singleStatement: false,
              queryDocumentAst,
              variables: params.variables,
              operationName: params.operationName,
            }, (graphqlContext: any) => {
              pgRole = graphqlContext.pgRole
              return executeGraphql(
                gqlSchema,
                queryDocumentAst,
                null,
                graphqlContext,
                params.variables,
                params.operationName,
              )
            })
          }

        } catch (error) {
          result = { errors: [error], statusCode: error.status || error.statusCode || 500 }

          // If the status code is 500, let’s log our error.
          if (result.statusCode === 500)
            // tslint:disable-next-line no-console
            console.error(error.stack)
        } finally {
          // Format our errors so the client doesn’t get the full thing.
          if (result && result.errors) {
            result.errors = (handleErrors as any)(result.errors, req, res)
          }
          if (!isEmpty(meta)) {
            result.meta = meta
          }
          // Log the query. If this debugger isn’t enabled, don’t run it.
          if (!options.disableQueryLog && queryDocumentAst) {
            setTimeout(() => {
              const prettyQuery = printGraphql(queryDocumentAst)
                .replace(/\s+/g, ' ')
                .trim()
              const errorCount = (result.errors || []).length
              const timeDiff = queryTimeStart && process.hrtime(queryTimeStart)
              const ms =
                Math.round((timeDiff[0] * 1e9 + timeDiff[1]) * 10e-7 * 100) / 100

              // If we have enabled the query log for the Http handler, use that.
              // tslint:disable-next-line no-console
              console.log(
                `${chalk[errorCount === 0 ? 'green' : 'red'](
                  `${errorCount} error(s)`,
                )} ${
                  pgRole != null ? `as ${chalk.magenta(pgRole)} ` : ''
                }in ${chalk.grey(`${ms}ms`)} :: ${prettyQuery}`,
              )
            }, 0)
          }
          if (debugRequest.enabled) debugRequest('GraphQL query has been executed.')
        }
        return result
      }))
    } catch (error) {
      // Set our status code and send the client our results!
      if (res.statusCode === 200)
        res.statusCode = error.status || error.statusCode || 500

      // Overwrite entire response
      returnArray = false
      results = [{ errors: [error] }]

      // If the status code is 500, let’s log our error.
      if (res.statusCode === 500)
        // tslint:disable-next-line no-console
        console.error(error.stack)
    } finally {
      // Finally, we send the client the results.
      const firstResult: any = results[0] || {}
      if (!returnArray) {
        if (res.statusCode === 200 && firstResult.statusCode) {
          res.statusCode = firstResult.statusCode
        }
        delete firstResult.statusCode
      }

      res.setHeader('Content-Type', 'application/json; charset=utf-8')

      res.end(JSON.stringify(returnArray ? results : firstResult))

      if (debugRequest.enabled) debugRequest('GraphQL ' + (returnArray ? 'queries' : 'query') + ' request finished.')

    }
  }

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
  const middleware = (req: IncomingMessage, res: ServerResponse, next: (error?: mixed) => void): void => {
    if (isKoaApp(req, res)) {
      koaMiddleware(req as any, res, requestHandler)
    } else {
      // Set the correct `connect` style variable names. If there was no `next`
      // defined (likely the case if the client is using `http`) we use the
      // final handler.
      next = next || finalHandler(req, res)

      // Execute our request handler.
      requestHandler(req, res, next).then(
        // If the request was fulfilled, noop.
        () => {
          /* noop */
        },
        // If the request errored out, call `next` with the error.
        error => next(error),
      )
    }
  }

  // HttpRequestHandler is a fn w/ extra props.  use `assign` to get concise,
  // union type: https://stackoverflow.com/a/41853194/1438908
  return Object.assign(
    middleware,
    {
      formatError,
      getGraphQLSchema: getGqlSchema,
      pgPool,
      withPostGraphileContextFromReqRes,
    }
  ) as HttpRequestHandler
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
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', 'HEAD, GET, POST')
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
      // The `Content-*` headers are used when making requests with a body,
      // like in a POST request.
      'Content-Type',
      'Content-Length',
    ].join(', '),
  )
}

function createBadAuthorizationHeaderError(): void {
  throw httpError(
    400,
    'Authorization header is not of the correct bearer scheme format.',
  )
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
const authorizationBearerRex = /^\s*bearer\s+([a-z0-9\-._~+/]+=*)\s*$/i

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
  const { authorization } = request.headers
  if (Array.isArray(authorization)) throw createBadAuthorizationHeaderError()

  // If there was no authorization header, just return null.
  if (authorization == null) return null

  const match = authorizationBearerRex.exec(authorization)

  // If we did not match the authorization header with our expected format,
  // throw a 400 error.
  if (!match) throw createBadAuthorizationHeaderError()

  // Return the token from our match.
  return match[1]
}
