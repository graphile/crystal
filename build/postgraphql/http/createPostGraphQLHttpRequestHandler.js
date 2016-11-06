"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path_1 = require('path');
const fs_1 = require('fs');
const graphql_1 = require('graphql');
const renderGraphiQL_1 = require('./renderGraphiQL');
const executeQuery_1 = require('./executeQuery');
const setupRequestPgClientTransaction_1 = require('./setupRequestPgClientTransaction');
const chalk = require('chalk');
const Debugger = require('debug');
const httpError = require('http-errors');
const parseUrl = require('parseurl');
const finalHandler = require('finalhandler');
const bodyParser = require('body-parser');
const debugGraphql = new Debugger('postgraphql:graphql');
const debugRequest = new Debugger('postgraphql:request');
const favicon = new Promise((resolve, reject) => {
    fs_1.readFile(path_1.resolve(__dirname, '../../../resources/favicon.ico'), (error, data) => {
        if (error)
            reject(error);
        else
            resolve(data);
    });
});
/**
 * Creates a GraphQL request handler, this is untyped besides some JSDoc types
 * for intellisense.
 *
 * @param {GraphQLSchema} graphqlSchema
 */
function createPostGraphQLHttpRequestHandler(options) {
    const { getGqlSchema, pgPool } = options;
    // Gets the route names for our GraphQL endpoint, and our GraphiQL endpoint.
    const graphqlRoute = options.graphqlRoute || '/graphql';
    const graphiqlRoute = options.graphiql === true ? options.graphiqlRoute || '/graphiql' : null;
    // Throw an error of the GraphQL and GraphiQL routes are the same.
    if (graphqlRoute === graphiqlRoute)
        throw new Error(`Cannot use the same route, '${graphqlRoute}', for both GraphQL and GraphiQL. Please use different routes.`);
    // Formats an error using the default GraphQL `formatError` function, and
    // custom formatting using some other options.
    const formatError = error => {
        // Get the default formatted error object.
        const formattedError = graphql_1.formatError(error);
        // If the user wants to see the error’s stack, let’s add it to the
        // formatted error.
        if (options.showErrorStack)
            formattedError.stack = options.showErrorStack === 'json' ? error.stack.split('\n') : error.stack;
        return formattedError;
    };
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
    ];
    /**
     * The actual request handler. It’s an async function so it will return a
     * promise when complete. If the function doesn’t handle anything, it calls
     * `next` to let the next middleware try and handle it.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    const requestHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        // If this is the favicon path and it has not yet been handled, let us
        // serve our GraphQL favicon.
        if (parseUrl(req).pathname === '/favicon.ico') {
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
            res.end(yield favicon);
            return;
        }
        // If this is the GraphiQL route, show GraphiQL and stop execution.
        if (parseUrl(req).pathname === graphiqlRoute) {
            if (!(req.method === 'GET' || req.method === 'HEAD')) {
                res.statusCode = req.method === 'OPTIONS' ? 200 : 405;
                res.setHeader('Allow', 'GET, HEAD, OPTIONS');
                res.end();
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            // End early if the method is `HEAD`.
            if (req.method === 'HEAD') {
                res.end();
                return;
            }
            // Actually renders GraphiQL.
            res.end(renderGraphiQL_1.default(graphqlRoute));
            return;
        }
        // Don’t handle any requests if this is not the correct route.
        if (parseUrl(req).pathname !== graphqlRoute)
            return next();
        // If we didn’t call `next` above, all requests will return 200 by default!
        res.statusCode = 200;
        // Add our CORS headers to be good web citizens (there are perf
        // implications though so be careful!)
        if (options.enableCors)
            addCORSHeaders(res);
        // Don’t execute our GraphQL stuffs for `OPTIONS` requests.
        if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
        }
        // The `result` will be used at the very end in our `finally` block.
        // Statements inside the `try` will assign to `result` when they get
        // a result. We also keep track of `params`.
        let params;
        let result;
        let queryDocumentAst;
        const queryTimeStart = process.hrtime();
        let pgRole;
        debugRequest('GraphQL query request has begun.');
        // This big `try`/`catch`/`finally` block represents the execution of our
        // GraphQL query. All errors thrown in this block will be returned to the
        // client as GraphQL errors.
        try {
            // First thing we need to do is get the GraphQL schema for this request.
            // It should never really change unless we are in watch mode.
            const gqlSchema = yield getGqlSchema();
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
            yield bodyParserMiddlewares.reduce((promise, middleware) => (promise.then(() => new Promise((resolve, reject) => {
                middleware(req, res, error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }))), Promise.resolve());
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
            params = typeof req.body === 'string' ? { query: req.body } : req.body;
            // Validate our params object a bit.
            if (params == null)
                throw httpError(400, 'Must provide an object parameters, not nullish value.');
            if (typeof params !== 'object')
                throw httpError(400, `Expected parameter object, not value of type '${typeof params}'.`);
            if (Array.isArray(params))
                throw httpError(501, 'Batching queries as an array is currently unsupported. Please provide a single query object.');
            if (!params.query)
                throw httpError(400, 'Must provide a query string.');
            // If variables is a string, we assume it is a JSON string and that it
            // needs to be parsed.
            if (typeof params.variables === 'string') {
                // If variables is just an empty string, we should set it to null and
                // ignore it.
                if (params.variables === '') {
                    params.variables = null;
                }
                else {
                    try {
                        params.variables = JSON.parse(params.variables);
                    }
                    catch (error) {
                        error.statusCode = 400;
                        throw error;
                    }
                }
            }
            // Throw an error if `variables` is not an object.
            if (params.variables != null && typeof params.variables !== 'object')
                throw httpError(400, `Variables must be an object, not '${typeof params.variables}'.`);
            // Throw an error if `operationName` is not a string.
            if (params.operationName != null && typeof params.operationName !== 'string')
                throw httpError(400, `Operation name must be a string, not '${typeof params.operationName}'.`);
            const source = new graphql_1.Source(params.query, 'GraphQL Http Request');
            // Catch an errors while parsing so that we can set the `statusCode` to
            // 400. Otherwise we don’t need to parse this way.
            try {
                queryDocumentAst = graphql_1.parse(source);
            }
            catch (error) {
                res.statusCode = 400;
                throw error;
            }
            debugRequest('GraphQL query is parsed.');
            // Validate our GraphQL query using given rules.
            // TODO: Add a complexity GraphQL rule.
            const validationErrors = graphql_1.validate(gqlSchema, queryDocumentAst);
            // If we have some validation errors, don’t execute the query. Instead
            // send the errors to the client with a `400` code.
            if (validationErrors.length > 0) {
                res.statusCode = 400;
                result = { errors: validationErrors };
                return;
            }
            debugRequest('GraphQL query is validated.');
            // Lazily log the query. If this debugger isn’t enabled, don’t run it.
            if (debugGraphql.enabled)
                debugGraphql(graphql_1.print(queryDocumentAst).replace(/\s+/g, ' ').trim());
            // Get the JWT token string from our request.
            const jwtToken = setupRequestPgClientTransaction_1.getJWTToken(req);
            try {
                ;
                ({ result, pgRole } = yield executeQuery_1.default(pgPool, options, jwtToken, gqlSchema, queryDocumentAst, params.variables, params.operationName));
            }
            finally {
                debugRequest('GraphQL query has been executed.');
            }
        }
        catch (error) {
            // Set our status code and send the client our results!
            if (res.statusCode === 200)
                res.statusCode = error.status || 500;
            result = { errors: [error] };
            // If the status code is 500, let’s log our error.
            if (res.statusCode === 500)
                console.error(error.stack);
        }
        finally {
            // Format our errors so the client doesn’t get the full thing.
            if (result && result.errors)
                result.errors = result.errors.map(formatError);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(result));
            debugRequest('GraphQL query request finished.');
            // Log the query. If this debugger isn’t enabled, don’t run it.
            if (queryDocumentAst && !options.disableQueryLog) {
                const prettyQuery = graphql_1.print(queryDocumentAst).replace(/\s+/g, ' ').trim();
                const errorCount = (result.errors || []).length;
                const timeDiff = process.hrtime(queryTimeStart);
                const ms = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) * 10e-7 * 100) / 100;
                // If we have enabled the query log for the Http handler, use that.
                console.log(`${chalk[errorCount === 0 ? 'green' : 'red'](`${errorCount} error(s)`)} ${pgRole != null ? `as ${chalk.magenta(pgRole)} ` : ''}in ${chalk.grey(`${ms}ms`)} :: ${prettyQuery}`);
            }
        }
    });
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
            const ctx = a;
            const next = b;
            // Execute our request handler. If an error is thrown, we don’t call
            // `next` with an error. Instead we return the promise and let `koa`
            // handle the error.
            return requestHandler(ctx.req, ctx.res, next);
        }
        else {
            // Set the correct `connect` style variable names. If there was no `next`
            // defined (likely the case if the client is using `http`) we use the
            // final handler.
            const req = a;
            const res = b;
            const next = c || finalHandler(req, res);
            // Execute our request handler.
            requestHandler(req, res, next).then(
            // If the request was fulfilled, noop.
                () => { }, 
            // If the request errored out, call `next` with the error.
            error => next(error));
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPostGraphQLHttpRequestHandler;
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', 'POST');
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
    ].join(', '));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUG9zdEdyYXBoUUxIdHRwUmVxdWVzdEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvaHR0cC9jcmVhdGVQb3N0R3JhcGhRTEh0dHBSZXF1ZXN0SGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx1QkFBdUMsTUFDdkMsQ0FBQyxDQUQ0QztBQUM3QyxxQkFBeUIsSUFDekIsQ0FBQyxDQUQ0QjtBQUU3QiwwQkFRTyxTQUNQLENBQUMsQ0FEZTtBQUNoQixpQ0FBMkIsa0JBQzNCLENBQUMsQ0FENEM7QUFDN0MsK0JBQXlCLGdCQUN6QixDQUFDLENBRHdDO0FBQ3pDLGtEQUEwQixtQ0FFMUIsQ0FBQyxDQUY0RDtBQUU3RCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDOUIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ2pDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUN4QyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDcEMsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQzVDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUV6QyxNQUFNLFlBQVksR0FBRyxJQUFJLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQ3hELE1BQU0sWUFBWSxHQUFHLElBQUksUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUE7QUFFeEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUMxQyxhQUFRLENBQUMsY0FBVyxDQUFDLFNBQVMsRUFBRSxnQ0FBZ0MsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUk7UUFDN0UsRUFBRSxDQUFDLENB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