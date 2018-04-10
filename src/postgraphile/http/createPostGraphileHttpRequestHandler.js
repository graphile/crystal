/* eslint-disable */// Because we use tslint
import {
  join as joinPath,
  resolve as resolvePath,
  relative as relativePath,
} from 'path'
import { readFile } from 'fs'
import { IncomingMessage, ServerResponse } from 'http'
import {
  Source,
  parse as parseGraphql,
  validate as validateGraphql,
  execute as executeGraphql,
  getOperationAST,
  formatError as defaultFormatError,
  print as printGraphql,
} from 'graphql'
import { extendedFormatError } from '../extendedFormatError'
import { $$pgClient } from '../../postgres/inventory/pgClientFromContext'
import renderGraphiQL from './renderGraphiQL'
import debugPgClient from './debugPgClient'
import setupServerSentEvents from './setupServerSentEvents'
import setupPgClientTransaction from '../setupPgClientTransaction'
import withPostGraphileContext from '../withPostGraphileContext'
import mapKeys from 'lodash/mapKeys'

const chalk = require('chalk')
const Debugger = require('debug') // tslint:disable-line variable-name
const httpError = require('http-errors')
const parseUrl = require('parseurl')
const finalHandler = require('finalhandler')
const bodyParser = require('body-parser')
const sendFile = require('send')

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
 *
 * @type {Promise<string>}
 */
const origGraphiqlHtml = new Promise((resolve, reject) => {
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
const withPostGraphileContextFromReqResGenerator = options => {
  const {
    getGqlSchema,
    pgSettings,
    jwtSecret,
    additionalGraphQLContextFromRequest,
  } = options
  return async (req, res, moreOptions, fn) => {
    const jwtToken = options.jwtSecret ? getJwtToken(req) : null
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


/**
 * Runs a GraphQL Query. Can be mapped over a list of batched queries
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
const runQuery = async (
  req,
  res,
  handleErrors,
  disableQueryLog,
  gqlSchema,
  withPostGraphileContextFromReqRes,
  pgRole,
  queryTimeStart,
  params
)=>{

  let queryDocumentAst

  debugRequest('Running Query.')

  // Validate our params object a bit.
  if (params == null){
    return {
      status:400,
      errors:'Must provide an object parameters, not nullish value.'
    }
  }

  if (typeof params !== 'object'){
    return {
      status:400,
      errors:`Expected parameter object, not value of type '${typeof params}'.`
    }
  }

  if (!params.query){
    return {
      status:400,
      errors:'Must provide a query string.'
    }
  }

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
        return {
          status:400,
          errors:`Error parsing variables: ${error}`
        }
      }
    }
  }

  // Throw an error if `variables` is not an object.
  if (params.variables != null && typeof params.variables !== 'object'){
    return {
      status:400,
      errors:`Variables must be an object, not '${typeof params.variables}'.`
    }
  }

  // Throw an error if `operationName` is not a string.
  if (
    params.operationName != null &&
    typeof params.operationName !== 'string'
  ){
    return {
      status:400,
      errors:`Operation name must be a string, not '${typeof params.operationName}'.`
    }
  }

  const source = new Source(params.query, 'GraphQL Http Request')
  // Catch an errors while parsing so that we can set the `statusCode` to
  // 400. Otherwise we don’t need to parse this way.
  try {
    queryDocumentAst = parseGraphql(source)
  } catch (error) {
    return {
      status:400,
      errors:`Error parsing query: '${error}'.`
    }
  }

  debugRequest('GraphQL query is parsed.')

  // Validate our GraphQL query using given rules.
  // TODO: Add a complexity GraphQL rule.
  const validationErrors = validateGraphql(gqlSchema, queryDocumentAst)

  // If we have some validation errors, don’t execute the query. Instead
  // send the errors to the client with a `400` code.
  if (validationErrors.length > 0) {
    return {
      status:400,
      errors:validationErrors
    }
  }

  debugRequest('GraphQL query is validated.')

  // Lazily log the query. If this debugger isn’t enabled, don’t run it.
  if (debugGraphql.enabled)
  debugGraphql(
    printGraphql(queryDocumentAst)
    .replace(/\s+/g, ' ')
    .trim(),
  )

  const result = await withPostGraphileContextFromReqRes(req, res, {singleStatement: false}, graphqlContext => {
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

  // Log the query. If this debugger isn’t enabled, don’t run it.
  if (queryDocumentAst && !disableQueryLog) {
    const prettyQuery = printGraphql(queryDocumentAst)
    .replace(/\s+/g, ' ')
    .trim()
    const errorCount = (result.errors || []).length
    const timeDiff = process.hrtime(queryTimeStart)
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
  }

  return result

}

/**
 * Creates a GraphQL request handler, this is untyped besides some JSDoc types
 * for intellisense.
 *
 * @param {GraphQLSchema} graphqlSchema
 */
export default function createPostGraphileHttpRequestHandler(options) {
  const {
    getGqlSchema,
    pgPool,
    pgSettings,
    pgDefaultRole,
  } = options

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
  const formatError = error => {
    // Get the appropriate formatted error object, including any extended error
    // fields if the user wants them.
    const formattedError =
      options.extendedErrors && options.extendedErrors.length
        ? extendedFormatError(error, options.extendedErrors)
        : defaultFormatError(error)

    // If the user wants to see the error’s stack, let’s add it to the
    // formatted error.
    if (options.showErrorStack)
      formattedError.stack =
        options.showErrorStack === 'json'
          ? error.stack.split('\n')
          : error.stack

    return formattedError
  }

  // Define a list of middlewares that will get run before our request handler.
  // Note though that none of these middlewares will intercept a request (i.e.
  // not call `next`). Middlewares that handle a request like favicon
  // middleware will result in a promise that never resolves, and we don’t
  // want that.
  const bodyParserMiddlewares = [
    // Parse JSON bodies.
    bodyParser.json({ limit: options.bodySizeLimit }),
    // Parse URL encoded bodies (forms).
    bodyParser.urlencoded({ extended: false }),
    // Parse `application/graphql` content type bodies as text.
    bodyParser.text({ type: 'application/graphql' }),
  ]

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

  /**
   * The actual request handler. It’s an async function so it will return a
   * promise when complete. If the function doesn’t handle anything, it calls
   * `next` to let the next middleware try and handle it.
   *
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   */
  const requestHandler = async (req, res, next) => {
    // Add our CORS headers to be good web citizens (there are perf
    // implications though so be careful!)
    //
    // Always enable CORS when developing PostGraphile because GraphiQL will be
    // on port 5783.
    if (options.enableCors || POSTGRAPHILE_ENV === 'development')
      addCORSHeaders(res)

    // ========================================================================
    // Serve GraphiQL and Related Assets
    // ========================================================================

    if (options.graphiql) {
      // ======================================================================
      // Favicon
      // ======================================================================

      // If this is the favicon path and it has not yet been handled, let us
      // serve our GraphQL favicon.
      if (parseUrl(req).pathname === '/favicon.ico') {
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
      if (parseUrl(req).pathname.startsWith('/_postgraphile/graphiql/')) {
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
            parseUrl(req).pathname.slice('/_postgraphile/graphiql/'.length),
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
        await new Promise((resolve, reject) => {
          const stream = sendFile(req, assetPathRelative, {
            index: false,
            root: graphiqlDirectory,
            dotfiles: 'ignore',
          })
            .on('end', resolve)
            .on('error', reject)
            .pipe(res)
        })
        return
      }

      // ======================================================================
      // GraphiQL Watch Stream
      // ======================================================================

      // Setup an event stream so we can broadcast events to graphiql, etc.
      if (parseUrl(req).pathname === '/_postgraphile/stream') {
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
      if (parseUrl(req).pathname === graphiqlRoute) {
        // If we are developing PostGraphile, instead just redirect.
        if (POSTGRAPHILE_ENV === 'development') {
          res.writeHead(302, { Location: 'http://localhost:5783' })
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
    if (parseUrl(req).pathname !== graphqlRoute) return next()

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
    let params
    let result
    const queryTimeStart = process.hrtime()
    let pgRole

    debugRequest('GraphQL query request has begun.')

    // This big `try`/`catch`/`finally` block represents the execution of our
    // GraphQL query. All errors thrown in this block will be returned to the
    // client as GraphQL errors.
    try {
      // First thing we need to do is get the GraphQL schema for this request.
      // It should never really change unless we are in watch mode.
      const gqlSchema = await getGqlSchema()

      // Run all of our middleware by converting them into promises and
      // chaining them together. Remember that if we have a middleware that
      // never calls `next`, we will have a promise that never resolves! Avoid
      // those middlewares.
      //
      // Note that we also run our middleware after we make sure we are on the
      // correct route. This is so that if our middleware modifies the `req` or
      // `res` objects, only we downstream will see the modifications.
      //
      // We also run our middleware inside the `try` so that we get the GraphQL
      // error reporting style for syntax errors.
      await bodyParserMiddlewares.reduce(
        (promise, middleware) =>
          promise.then(
            () =>
              new Promise((resolve, reject) => {
                middleware(req, res, error => {
                  if (error) reject(error)
                  else resolve()
                })
              }),
          ),
        Promise.resolve(),
      )

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
      params = typeof req.body === 'string' ? { query: req.body } : req.body

      if (Array.isArray(params)){
        result = await Promise.all(params.map(param=>runQuery(
          req,
          res,
          handleErrors,
          options.disableQueryLog,
          gqlSchema,
          withPostGraphileContextFromReqRes,
          pgRole,
          queryTimeStart,
          param
        )))
      }else{
        result = await runQuery(
          req,
          res,
          handleErrors,
          options.disableQueryLog,
          gqlSchema,
          withPostGraphileContextFromReqRes,
          pgRole,
          queryTimeStart,
          params
        )
      }

    } catch (error) {

      // Set our status code and send the client our results!
      if (res.statusCode === 200)
      res.statusCode = error.status || error.statusCode || 500
      result = { errors: [error] }

      // If the status code is 500, let’s log our error.
      if (res.statusCode === 500)
      // tslint:disable-next-line no-console
      console.error(error.stack)
    } finally {
      // Finally, we send the client the contents of `result`.
      debugRequest('GraphQL queries have been executed.')

      res.setHeader('Content-Type', 'application/json; charset=utf-8')

      // Format our errors so the client doesn’t get the full thing.
      const handleErrors = options.handleErrors || (errors => errors.map(formatError))

      if (result && result.errors) {
        result.errors = handleErrors(result.errors, req, res)
      }

      res.end(JSON.stringify(result))

      debugRequest(`GraphQL query request finished.`)

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
  const middleware = (a, b, c) => {
    // If are arguments look like the arguments to koa middleware, this is
    // `koa` middleware.
    if (a.req && a.res && typeof b === 'function') {
      // Set the correct `koa` variable names…
      const ctx = a
      const next = b

      // Execute our request handler. If an error is thrown, we don’t call
      // `next` with an error. Instead we return the promise and let `koa`
      // handle the error.
      return requestHandler(ctx.req, ctx.res, next)
    } else {
      // Set the correct `connect` style variable names. If there was no `next`
      // defined (likely the case if the client is using `http`) we use the
      // final handler.
      const req = a
      const res = b
      const next = c || finalHandler(req, res)

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
  middleware.getGraphQLSchema = getGqlSchema
  middleware.formatError = formatError
  middleware.pgPool = pgPool
  middleware.withPostGraphileContextFromReqRes = withPostGraphileContextFromReqRes
  return middleware
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
function addCORSHeaders(res) {
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
function getJwtToken(request) {
  const { authorization } = request.headers

  // If there was no authorization header, just return null.
  if (authorization == null) return null

  const match = authorizationBearerRex.exec(authorization)

  // If we did not match the authorization header with our expected format,
  // throw a 400 error.
  if (!match)
    throw httpError(
      400,
      'Authorization header is not of the correct bearer scheme format.',
    )

  // Return the token from our match.
  return match[1]
}
