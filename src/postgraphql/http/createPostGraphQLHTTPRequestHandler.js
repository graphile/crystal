import { resolve as resolvePath } from 'path'
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
import { $$pgClient } from '../../postgres/inventory/pgClientFromContext'
import renderGraphiQL from './renderGraphiQL'

const Debugger = require('debug')
const httpError = require('http-errors')
const parseUrl = require('parseurl')
const finalHandler = require('finalhandler')
const bodyParser = require('body-parser')

export const $$pgClientOrigQuery = Symbol()

const debugGraphql = new Debugger('postgraphql:graphql')
const debugPG = new Debugger('postgraphql:postgres')

const favicon = new Promise((resolve, reject) => {
  readFile(resolvePath(__dirname, '../../../resources/favicon.ico'), (error, data) => {
    if (error) reject(error)
    else resolve(data)
  })
})

/**
 * Creates a GraphQL request handler, this is untyped besides some JSDoc types
 * for intellisense.
 *
 * @param {GraphQLSchema} graphqlSchema
 */
export default function createPostGraphQLHTTPRequestHandler (options) {
  const { graphqlSchema, pgPool } = options

  // Gets the route names for our GraphQL endpoint, and our GraphiQL endpoint.
  const graphqlRoute = options.graphqlRoute || '/graphql'
  const graphiqlRoute = options.graphiql === true ? options.graphiqlRoute || '/graphiql' : null

  // Throw an error of the GraphQL and GraphiQL routes are the same.
  if (graphqlRoute === graphiqlRoute)
    throw new Error(`Cannot use the same route '${graphqlRoute}' for both GraphQL and GraphiQL.`)

  // Formats an error using the default GraphQL `formatError` function, and
  // custom formatting using some other options.
  const formatError = error => {
    // Get the default formatted error object.
    const formattedError = defaultFormatError(error)

    // If the user wants to see the error’s stack, let’s add it to the
    // formatted error.
    if (options.showErrorStack)
      formattedError.stack = options.showErrorStack === 'json' ? error.stack.split('\n') : error.stack

    return formattedError
  }

  // Define a list of middlewares that will get run before our request handler.
  // Note though that none of these middlewares will intercept a request (i.e.
  // not call `next`). Middlewares that handle a request like favicon
  // middleware will result in a promise that never resolves, and we don’t
  // want that.
  const bodyParserMiddlewares = [
    // Parse JSON bodies.
    bodyParser.json(),
    // Parse URL encoded bodies (forms).
    bodyParser.urlencoded({ extended: false }),
    // Parse `application/graphql` content type bodies as text.
    bodyParser.text({ type: 'application/graphql' }),
  ]

  /**
   * The actual request handler. It’s an async function so it will return a
   * promise when complete. If the function doesn’t handle anything, it calls
   * `next` to let the next middleware try and handle it.
   *
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   */
  const requestHandler = async (req, res, next) => {
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

    // If this is the GraphiQL route, show GraphiQL and stop execution.
    if (parseUrl(req).pathname === graphiqlRoute) {
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
      res.end(renderGraphiQL(graphqlRoute))
      return
    }

    // Don’t handle any requests if this is not the correct route.
    if (parseUrl(req).pathname !== graphqlRoute)
      return next()

    // If we didn’t call `next` above, all requests will return 200 by default!
    res.statusCode = 200

    // Add our CORS headers to be good web citizens (there are perf
    // implications though so be careful!)
    if (options.enableCORS)
      addCORSHeaders(res)

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

    // This big `try`/`catch`/`finally` block represents the execution of our
    // GraphQL query. All errors thrown in this block will be returned to the
    // client as GraphQL errors.
    try {
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
      await bodyParserMiddlewares.reduce((promise, middleware) => (
        promise.then(() => new Promise((resolve, reject) => {
          middleware(req, res, error => {
            if (error) reject(error)
            else resolve()
          })
        }))
      ), Promise.resolve())

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

      // Throw an error if no query string was defined.
      if (!params.query)
        throw httpError(400, 'Must provide a query string.')

      // If variables is a string, we assume it is a JSON string and that it
      // needs to be parsed.
      if (typeof params.variables === 'string') {
        // If variables is just an empty string, we should set it to null and
        // ignore it.
        if (params.variables === '') {
          params.variables = null
        }
        // Otherwise, let us try to parse it as JSON.
        else {
          try {
            params.variables = JSON.parse(params.variables)
          }
          catch (error) {
            error.statusCode = 400
            throw error
          }
        }
      }

      // Throw an error if `variables` is not an object.
      if (params.variables != null && typeof params.variables !== 'object')
        throw httpError(400, `Variables must be an object, not '${typeof params.variables}'.`)

      // Throw an error if `operationName` is not a string.
      if (params.operationName != null && typeof params.operationName !== 'string')
        throw httpError(400, `Operation name must be a string, not '${typeof params.operationName}'.`)

      const source = new Source(params.query, 'GraphQL HTTP Request')
      let queryDocumentAST

      // Catch an errors while parsing so that we can set the `statusCode` to
      // 400. Otherwise we don’t need to parse this way.
      try {
        queryDocumentAST = parseGraphql(source)
      }
      catch (error) {
        res.statusCode = 400
        throw error
      }

      // Validate our GraphQL query using given rules.
      // TODO: Add a complexity GraphQL rule.
      const validationErrors = validateGraphql(graphqlSchema, queryDocumentAST)

      // If we have some validation errors, don’t execute the query. Instead
      // send the errors to the client with a `400` code.
      if (validationErrors.length > 0) {
        res.statusCode = 400
        result = { errors: validationErrors }
        return
      }

      // Lazily log the query. If this debugger isn’t enabled, don’t run it.
      if (debugGraphql.enabled)
        debugGraphql(printGraphql(queryDocumentAST).replace(/\s+/g, ' ').trim())

      // Connect a new Postgres client and start a transaction.
      const pgClient = await pgPool.connect()
      let pgClientInTransaction = false

      // Set the original query method to a key on our client. If that key is
      // already set, use that.
      pgClient[$$pgClientOrigQuery] = pgClient[$$pgClientOrigQuery] || pgClient.query

      pgClient.query = function (...args) {
        // If the client is not currently in a transaction, run the `begin`
        // command and then run the actual query.
        if (!pgClientInTransaction) {
          pgClientInTransaction = true
          return pgClient.query('begin').then(() => pgClient.query(...args))
        }

        // Debug just the query text. We don’t want to debug variables because
        // there may be passwords in there.
        debugPG(args[0] && args[0].text ? args[0].text : args[0])

        // Call the original query method.
        return pgClient[$$pgClientOrigQuery].apply(this, args)
      }

      try {
        result = await executeGraphql(
          graphqlSchema,
          queryDocumentAST,
          null,
          { [$$pgClient]: pgClient },
          params.variables,
          params.operationName,
        )
      }
      // Cleanup our Postgres client by ending the transaction and releasing
      // the client back to the pool. Always do this even if the query fails.
      finally {
        // Don’t run the commit statement unless our client is in a
        // transaction. We don’t open a transaction if no Postgres resources
        // were needed for the query (like in an introspection query).
        if (pgClientInTransaction)
          await pgClient.query('commit')

        pgClient.release()
      }
    }
    catch (error) {
      // Set our status code and send the client our results!
      if (res.statusCode === 200) res.statusCode = error.status || 500
      result = { errors: [error] }

      // If the status code is 500, let’s log our error.
      if (res.statusCode === 500)
        console.error(error.stack)
    }
    // Finally, we send the client the contents of `result`.
    finally {
      // Format our errors so the client doesn’t get the full thing.
      if (result && result.errors)
        result.errors = result.errors.map(formatError)

      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(result))
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
  return (a, b, c) => {
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
    }
    else {
      // Set the correct `connect` style variable names. If there was no `next`
      // defined (likely the case if the client is using `http`) we use the
      // final handler.
      const req = a
      const res = b
      const next = c || finalHandler(req, res)

      // Execute our request handler.
      requestHandler(req, res, next).then(
        // If the request was fulfilled, noop.
        () => {},
        // If the request errored out, call `next` with the error.
        error => next(error)
      )
    }
  }
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
function addCORSHeaders (res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', 'POST')
  res.setHeader('Access-Control-Allow-Headers', [
    'Origin',
    'X-Requested-With',
    // Used by `express-graphql` to determine whether to expose the GraphiQL
    // interface (`text/html`) or not.
    'Accept',
    // Used by PostGraphQL for auth purposes.
    'Authorization',
    // The `Content-*` headers are used when making requests with a body,
    // like in a POST request.
    'Content-Type',
    'Content-Length',
  ].join(', '))
}
