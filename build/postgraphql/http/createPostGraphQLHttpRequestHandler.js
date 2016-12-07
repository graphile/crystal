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
const pgClientFromContext_1 = require('../../postgres/inventory/pgClientFromContext');
const renderGraphiQL_1 = require('./renderGraphiQL');
const setupRequestPgClientTransaction_1 = require('./setupRequestPgClientTransaction');
const debugPgClient_1 = require('./debugPgClient');
const chalk = require('chalk');
const Debugger = require('debug'); // tslint:disable-line variable-name
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
            // Connect a new Postgres client and start a transaction.
            const pgClient = yield pgPool.connect();
            // Enhance our Postgres client with debugging stuffs.
            debugPgClient_1.default(pgClient);
            // Begin our transaction and set it up.
            yield pgClient.query('begin');
            pgRole = yield setupRequestPgClientTransaction_1.default(req, pgClient, {
                jwtSecret: options.jwtSecret,
                pgDefaultRole: options.pgDefaultRole,
            });
            try {
                result = yield graphql_1.execute(gqlSchema, queryDocumentAst, null, { [pgClientFromContext_1.$$pgClient]: pgClient }, params.variables, params.operationName);
            }
            finally {
                yield pgClient.query('commit');
                pgClient.release();
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
                // tslint:disable-next-line no-console
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
                // tslint:disable-next-line no-console
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUG9zdEdyYXBoUUxIdHRwUmVxdWVzdEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvaHR0cC9jcmVhdGVQb3N0R3JhcGhRTEh0dHBSZXF1ZXN0SGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx1QkFBdUMsTUFDdkMsQ0FBQyxDQUQ0QztBQUM3QyxxQkFBeUIsSUFDekIsQ0FBQyxDQUQ0QjtBQUU3QiwwQkFRTyxTQUNQLENBQUMsQ0FEZTtBQUNoQixzQ0FBMkIsOENBQzNCLENBQUMsQ0FEd0U7QUFDekUsaUNBQTJCLGtCQUMzQixDQUFDLENBRDRDO0FBQzdDLGtEQUE0QyxtQ0FDNUMsQ0FBQyxDQUQ4RTtBQUMvRSxnQ0FBMEIsaUJBRTFCLENBQUMsQ0FGMEM7QUFFM0MsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzlCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQSxDQUFDLG9DQUFvQztBQUN0RSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDeEMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3BDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUM1QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFFekMsTUFBTSxZQUFZLEdBQUcsSUFBSSxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUN4RCxNQUFNLFlBQVksR0FBRyxJQUFJLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBRXhELE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07SUFDMUMsYUFBUSxDQUFDLGNBQVcsQ0FBQyxTQUFTLEVBQUUsZ0NBQWdDLENBQUMs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