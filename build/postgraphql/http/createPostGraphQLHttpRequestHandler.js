"use strict";
var tslib_1 = require("tslib");
var path_1 = require("path");
var fs_1 = require("fs");
var graphql_1 = require("graphql");
var setupServerSentEvents_1 = require("./setupServerSentEvents");
var withPostGraphQLContext_1 = require("../withPostGraphQLContext");
var chalk = require('chalk');
var Debugger = require('debug'); // tslint:disable-line variable-name
var httpError = require('http-errors');
var parseUrl = require('parseurl');
var finalHandler = require('finalhandler');
var bodyParser = require('body-parser');
var sendFile = require('send');
var POSTGRAPHQL_ENV = process.env.POSTGRAPHQL_ENV;
var debugGraphql = new Debugger('postgraphql:graphql');
var debugRequest = new Debugger('postgraphql:request');
exports.graphiqlDirectory = path_1.resolve(__dirname, '../graphiql/public');
/**
 * The favicon file in `Buffer` format. We can send a `Buffer` directly to the
 * client.
 *
 * @type {Promise<Buffer>}
 */
var favicon = new Promise(function (resolve, reject) {
    fs_1.readFile(path_1.resolve(__dirname, '../../../resources/favicon.ico'), function (error, data) {
        if (error)
            reject(error);
        else
            resolve(data);
    });
});
/**
 * The GraphiQL HTML file as a string. We need it to be a string, because we
 * will use a regular expression to replace some variables.
 *
 * @type {Promise<string>}
 */
var origGraphiqlHtml = new Promise(function (resolve, reject) {
    fs_1.readFile(path_1.resolve(__dirname, '../graphiql/public/index.html'), 'utf8', function (error, data) {
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
    var _this = this;
    var getGqlSchema = options.getGqlSchema, pgPool = options.pgPool, pgSettings = options.pgSettings;
    // Gets the route names for our GraphQL endpoint, and our GraphiQL endpoint.
    var graphqlRoute = options.graphqlRoute || '/graphql';
    var graphiqlRoute = options.graphiql === true ? options.graphiqlRoute || '/graphiql' : null;
    // Throw an error of the GraphQL and GraphiQL routes are the same.
    if (graphqlRoute === graphiqlRoute)
        throw new Error("Cannot use the same route, '" + graphqlRoute + "', for both GraphQL and GraphiQL. Please use different routes.");
    // Formats an error using the default GraphQL `formatError` function, and
    // custom formatting using some other options.
    var formatError = function (error) {
        // Get the default formatted error object.
        var formattedError = graphql_1.formatError(error);
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
    var bodyParserMiddlewares = [
        // Parse JSON bodies.
        bodyParser.json({ limit: options.bodySizeLimit }),
        // Parse URL encoded bodies (forms).
        bodyParser.urlencoded({ extended: false }),
        // Parse `application/graphql` content type bodies as text.
        bodyParser.text({ type: 'application/graphql' }),
    ];
    // Takes the original GraphiQL HTML file and replaces the default config object.
    var graphiqlHtml = origGraphiqlHtml.then(function (html) { return html.replace(/window\.POSTGRAPHQL_CONFIG\s*=\s*\{[^]*\}/, "window.POSTGRAPHQL_CONFIG={graphqlUrl:'" + graphqlRoute + "',streamUrl:" + (options.watchPg ? '\'/_postgraphql/stream\'' : 'null') + "}"); });
    /**
     * The actual request handler. It’s an async function so it will return a
     * promise when complete. If the function doesn’t handle anything, it calls
     * `next` to let the next middleware try and handle it.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    var requestHandler = function (req, res, next) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, assetPath_1, _d, _e, _f, params, result, queryDocumentAst, queryTimeStart, pgRole, gqlSchema_1, source, validationErrors, jwtToken, error_1, prettyQuery, errorCount, timeDiff, ms;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    // Add our CORS headers to be good web citizens (there are perf
                    // implications though so be careful!)
                    //
                    // Always enable CORS when developing PostGraphQL because GraphiQL will be
                    // on port 5783.
                    if (options.enableCors || POSTGRAPHQL_ENV === 'development')
                        addCORSHeaders(res);
                    if (!options.graphiql) return [3 /*break*/, 6];
                    if (!(parseUrl(req).pathname === '/favicon.ico')) return [3 /*break*/, 2];
                    // If this is the wrong method, we should let the client know.
                    if (!(req.method === 'GET' || req.method === 'HEAD')) {
                        res.statusCode = req.method === 'OPTIONS' ? 200 : 405;
                        res.setHeader('Allow', 'GET, HEAD, OPTIONS');
                        res.end();
                        return [2 /*return*/];
                    }
                    // Otherwise we are good and should pipe the favicon to the browser.
                    res.statusCode = 200;
                    res.setHeader('Cache-Control', 'public, max-age=86400');
                    res.setHeader('Content-Type', 'image/x-icon');
                    // End early if the method is `HEAD`.
                    if (req.method === 'HEAD') {
                        res.end();
                        return [2 /*return*/];
                    }
                    _b = (_a = res).end;
                    return [4 /*yield*/, favicon];
                case 1:
                    _b.apply(_a, [_g.sent()]);
                    return [2 /*return*/];
                case 2:
                    if (!parseUrl(req).pathname.startsWith('/_postgraphql/graphiql/')) return [3 /*break*/, 4];
                    // If using the incorrect method, let the user know.
                    if (!(req.method === 'GET' || req.method === 'HEAD')) {
                        res.statusCode = req.method === 'OPTIONS' ? 200 : 405;
                        res.setHeader('Allow', 'GET, HEAD, OPTIONS');
                        res.end();
                        return [2 /*return*/];
                    }
                    assetPath_1 = parseUrl(req).pathname.slice('/_postgraphql/graphiql/'.length);
                    // Don’t allow certain files generated by `create-react-app` to be
                    // inspected.
                    if (assetPath_1 === 'index.html' || assetPath_1 === 'asset-manifest.json') {
                        res.statusCode = 404;
                        res.end();
                        return [2 /*return*/];
                    }
                    // Sends the asset at this path. Defaults to a `statusCode` of 200.
                    res.statusCode = 200;
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var stream = sendFile(req, path_1.join(exports.graphiqlDirectory, assetPath_1), { index: false })
                                .on('end', resolve)
                                .on('error', reject)
                                .pipe(res);
                        })];
                case 3:
                    _g.sent();
                    return [2 /*return*/];
                case 4:
                    // ======================================================================
                    // GraphiQL Watch Stream
                    // ======================================================================
                    // Setup an event stream so we can broadcast events to graphiql, etc.
                    if (parseUrl(req).pathname === '/_postgraphql/stream') {
                        if (req.headers.accept !== 'text/event-stream') {
                            res.statusCode = 405;
                            res.end();
                            return [2 /*return*/];
                        }
                        setupServerSentEvents_1.default(req, res, options);
                        return [2 /*return*/];
                    }
                    if (!(parseUrl(req).pathname === graphiqlRoute)) return [3 /*break*/, 6];
                    // If we are developing PostGraphQL, instead just redirect.
                    if (POSTGRAPHQL_ENV === 'development') {
                        res.writeHead(302, { Location: 'http://localhost:5783' });
                        res.end();
                        return [2 /*return*/];
                    }
                    // If using the incorrect method, let the user know.
                    if (!(req.method === 'GET' || req.method === 'HEAD')) {
                        res.statusCode = req.method === 'OPTIONS' ? 200 : 405;
                        res.setHeader('Allow', 'GET, HEAD, OPTIONS');
                        res.end();
                        return [2 /*return*/];
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                    // End early if the method is `HEAD`.
                    if (req.method === 'HEAD') {
                        res.end();
                        return [2 /*return*/];
                    }
                    // Actually renders GraphiQL.
                    _e = (_d = res).end;
                    return [4 /*yield*/, graphiqlHtml];
                case 5:
                    // Actually renders GraphiQL.
                    _e.apply(_d, [_g.sent()]);
                    return [2 /*return*/];
                case 6:
                    // Don’t handle any requests if this is not the correct route.
                    if (parseUrl(req).pathname !== graphqlRoute)
                        return [2 /*return*/, next()];
                    // ========================================================================
                    // Execute GraphQL Queries
                    // ========================================================================
                    // If we didn’t call `next` above, all requests will return 200 by default!
                    res.statusCode = 200;
                    // Don’t execute our GraphQL stuffs for `OPTIONS` requests.
                    if (req.method === 'OPTIONS') {
                        res.statusCode = 200;
                        res.end();
                        return [2 /*return*/];
                    }
                    queryTimeStart = process.hrtime();
                    debugRequest('GraphQL query request has begun.');
                    _g.label = 7;
                case 7:
                    _g.trys.push([7, 11, 12, 13]);
                    return [4 /*yield*/, getGqlSchema()];
                case 8:
                    gqlSchema_1 = _g.sent();
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
                    return [4 /*yield*/, bodyParserMiddlewares.reduce(function (promise, middleware) { return (promise.then(function () { return new Promise(function (resolve, reject) {
                            middleware(req, res, function (error) {
                                if (error)
                                    reject(error);
                                else
                                    resolve();
                            });
                        }); })); }, Promise.resolve())];
                case 9:
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
                    _g.sent();
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
                        throw httpError(400, "Expected parameter object, not value of type '" + typeof params + "'.");
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
                        throw httpError(400, "Variables must be an object, not '" + typeof params.variables + "'.");
                    // Throw an error if `operationName` is not a string.
                    if (params.operationName != null && typeof params.operationName !== 'string')
                        throw httpError(400, "Operation name must be a string, not '" + typeof params.operationName + "'.");
                    source = new graphql_1.Source(params.query, 'GraphQL Http Request');
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
                    validationErrors = graphql_1.validate(gqlSchema_1, queryDocumentAst);
                    // If we have some validation errors, don’t execute the query. Instead
                    // send the errors to the client with a `400` code.
                    if (validationErrors.length > 0) {
                        res.statusCode = 400;
                        result = { errors: validationErrors };
                        return [2 /*return*/];
                    }
                    debugRequest('GraphQL query is validated.');
                    // Lazily log the query. If this debugger isn’t enabled, don’t run it.
                    if (debugGraphql.enabled)
                        debugGraphql(graphql_1.print(queryDocumentAst).replace(/\s+/g, ' ').trim());
                    jwtToken = options.jwtSecret ? getJwtToken(req) : null;
                    return [4 /*yield*/, withPostGraphQLContext_1.default({
                            pgPool: pgPool,
                            jwtToken: jwtToken,
                            jwtSecret: options.jwtSecret,
                            jwtAudiences: options.jwtAudiences,
                            jwtRole: options.jwtRole,
                            pgDefaultRole: options.pgDefaultRole,
                            pgSettings: pgSettings,
                        }, function (context) {
                            pgRole = context.pgRole;
                            return graphql_1.execute(gqlSchema_1, queryDocumentAst, null, context, params.variables, params.operationName);
                        })];
                case 10:
                    result = _g.sent();
                    return [3 /*break*/, 13];
                case 11:
                    error_1 = _g.sent();
                    // Set our status code and send the client our results!
                    if (res.statusCode === 200)
                        res.statusCode = error_1.status || error_1.statusCode || 500;
                    result = { errors: [error_1] };
                    // If the status code is 500, let’s log our error.
                    if (res.statusCode === 500)
                        // tslint:disable-next-line no-console
                        console.error(error_1.stack);
                    return [3 /*break*/, 13];
                case 12:
                    debugRequest('GraphQL query has been executed.');
                    // Format our errors so the client doesn’t get the full thing.
                    if (result && result.errors)
                        result.errors = result.errors.map(formatError);
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(JSON.stringify(result));
                    debugRequest('GraphQL query request finished.');
                    // Log the query. If this debugger isn’t enabled, don’t run it.
                    if (queryDocumentAst && !options.disableQueryLog) {
                        prettyQuery = graphql_1.print(queryDocumentAst).replace(/\s+/g, ' ').trim();
                        errorCount = (result.errors || []).length;
                        timeDiff = process.hrtime(queryTimeStart);
                        ms = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) * 10e-7 * 100) / 100;
                        // If we have enabled the query log for the Http handler, use that.
                        // tslint:disable-next-line no-console
                        console.log(chalk[errorCount === 0 ? 'green' : 'red'](errorCount + " error(s)") + " " + (pgRole != null ? "as " + chalk.magenta(pgRole) + " " : '') + "in " + chalk.grey(ms + "ms") + " :: " + prettyQuery);
                    }
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); };
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
    return function (a, b, c) {
        // If are arguments look like the arguments to koa middleware, this is
        // `koa` middleware.
        if (a.req && a.res && typeof b === 'function') {
            // Set the correct `koa` variable names…
            var ctx = a;
            var next = b;
            // Execute our request handler. If an error is thrown, we don’t call
            // `next` with an error. Instead we return the promise and let `koa`
            // handle the error.
            return requestHandler(ctx.req, ctx.res, next);
        }
        else {
            // Set the correct `connect` style variable names. If there was no `next`
            // defined (likely the case if the client is using `http`) we use the
            // final handler.
            var req = a;
            var res = b;
            var next_1 = c || finalHandler(req, res);
            // Execute our request handler.
            requestHandler(req, res, next_1).then(
            // If the request was fulfilled, noop.
            function () { }, 
            // If the request errored out, call `next` with the error.
            function (error) { return next_1(error); });
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
    res.setHeader('Access-Control-Request-Method', 'HEAD, GET, POST');
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
var authorizationBearerRex = /^\s*bearer\s+([a-z0-9\-._~+/]+=*)\s*$/i;
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
    var authorization = request.headers.authorization;
    // If there was no authorization header, just return null.
    if (authorization == null)
        return null;
    var match = authorizationBearerRex.exec(authorization);
    // If we did not match the authorization header with our expected format,
    // throw a 400 error.
    if (!match)
        throw httpError(400, 'Authorization header is not of the correct bearer scheme format.');
    // Return the token from our match.
    return match[1];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUG9zdEdyYXBoUUxIdHRwUmVxdWVzdEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvaHR0cC9jcmVhdGVQb3N0R3JhcGhRTEh0dHBSZXF1ZXN0SGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUErRDtBQUMvRCx5QkFBNkI7QUFFN0IsbUNBUWdCO0FBSWhCLGlFQUEyRDtBQUUzRCxvRUFBOEQ7QUFFOUQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzlCLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQSxDQUFDLG9DQUFvQztBQUN0RSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDeEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3BDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUM1QyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDekMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBRXhCLElBQUEsNkNBQWUsQ0FBZ0I7QUFFdkMsSUFBTSxZQUFZLEdBQUcsSUFBSSxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUN4RCxJQUFNLFlBQVksR0FBRyxJQUFJLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBRTNDLFFBQUEsaUJBQWlCLEdBQUcsY0FBVyxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBO0FBRTdFOzs7OztHQUtHO0FBQ0gsSUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtJQUMxQyxhQUFRLENBQUMsY0FBVyxDQUFDLFNBQVMsRUFBRSxnQ0FBZ0MsQ0FBQyxFQUFFLFVBQUMs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