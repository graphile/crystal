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
    var getGqlSchema = options.getGqlSchema, pgPool = options.pgPool;
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
        bodyParser.json(),
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
        var _a, _b, _c, assetPath, _d, _e, _f, params, result, queryDocumentAst, queryTimeStart, pgRole, gqlSchema_1, source, validationErrors, jwtToken, error_1, prettyQuery, errorCount, timeDiff, ms;
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
                    if (!options.graphiql) return [3 /*break*/, 4];
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
                    // ======================================================================
                    // GraphiQL `create-react-app` Assets
                    // ======================================================================
                    // Serve the assets for GraphiQL on a namespaced path. This will basically
                    // serve up the built GraphiQL directory.
                    if (parseUrl(req).pathname.startsWith('/_postgraphql/graphiql/')) {
                        // If using the incorrect method, let the user know.
                        if (!(req.method === 'GET' || req.method === 'HEAD')) {
                            res.statusCode = req.method === 'OPTIONS' ? 200 : 405;
                            res.setHeader('Allow', 'GET, HEAD, OPTIONS');
                            res.end();
                            return [2 /*return*/];
                        }
                        assetPath = parseUrl(req).pathname.slice('/_postgraphql/graphiql/'.length);
                        // Don’t allow certain files generated by `create-react-app` to be
                        // inspected.
                        if (assetPath === 'index.html' || assetPath === 'asset-manifest.json') {
                            res.statusCode = 404;
                            res.end();
                            return [2 /*return*/];
                        }
                        // Sends the asset at this path. Defaults to a `statusCode` of 200.
                        res.statusCode = 200;
                        sendFile(req, path_1.join(exports.graphiqlDirectory, assetPath), { index: false }).pipe(res);
                        return [2 /*return*/];
                    }
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
                    if (!(parseUrl(req).pathname === graphiqlRoute)) return [3 /*break*/, 4];
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
                case 3:
                    // Actually renders GraphiQL.
                    _e.apply(_d, [_g.sent()]);
                    return [2 /*return*/];
                case 4:
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
                    _g.label = 5;
                case 5:
                    _g.trys.push([5, 9, 10, 11]);
                    return [4 /*yield*/, getGqlSchema()];
                case 6:
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
                case 7:
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
                    jwtToken = getJwtToken(req);
                    return [4 /*yield*/, withPostGraphQLContext_1.default({
                            pgPool: pgPool,
                            jwtToken: jwtToken,
                            jwtSecret: options.jwtSecret,
                            pgDefaultRole: options.pgDefaultRole,
                        }, function (context) {
                            pgRole = context.pgRole;
                            return graphql_1.execute(gqlSchema_1, queryDocumentAst, null, context, params.variables, params.operationName);
                        })];
                case 8:
                    result = _g.sent();
                    return [3 /*break*/, 11];
                case 9:
                    error_1 = _g.sent();
                    // Set our status code and send the client our results!
                    if (res.statusCode === 200)
                        res.statusCode = error_1.status || error_1.statusCode || 500;
                    result = { errors: [error_1] };
                    // If the status code is 500, let’s log our error.
                    if (res.statusCode === 500)
                        // tslint:disable-next-line no-console
                        console.error(error_1.stack);
                    return [3 /*break*/, 11];
                case 10:
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
                case 11: return [2 /*return*/];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUG9zdEdyYXBoUUxIdHRwUmVxdWVzdEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvaHR0cC9jcmVhdGVQb3N0R3JhcGhRTEh0dHBSZXF1ZXN0SGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUErRDtBQUMvRCx5QkFBNkI7QUFFN0IsbUNBUWdCO0FBSWhCLGlFQUEyRDtBQUUzRCxvRUFBOEQ7QUFFOUQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzlCLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQSxDQUFDLG9DQUFvQztBQUN0RSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDeEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3BDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUM1QyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDekMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBRXhCLElBQUEsNkNBQWUsQ0FBZ0I7QUFFdkMsSUFBTSxZQUFZLEdBQUcsSUFBSSxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUN4RCxJQUFNLFlBQVksR0FBRyxJQUFJLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBRTNDLFFBQUEsaUJBQWlCLEdBQUcsY0FBVyxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBO0FBRTdFOzs7OztHQUtHO0FBQ0gsSUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtJQUMxQyxhQUFRLENBQUMsY0FBVyxDQUFDLFNBQVMsRUFBRSxnQ0FBZ0MsQ0FBQyxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUk7UUFDN0UsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3hCLElBQUk7WUFBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGOzs7OztHQUtHO0FBQ0gsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO0lBQ25ELGFBQVEsQ0FBQyxjQUFXLENBQUMsU0FBUyxFQUFFLCtCQUErQixDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUk7UUFDcEYsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3hCLElBQUk7WUFBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGOzs7OztHQUtHO0FBQ0gsNkNBQTZELE9BQU87SUFBcEUsaUJBK1pDO0lBOVpTLElBQUEsbUNBQVksRUFBRSx1QkFBTSxDQUFZO0lBRXhDLDRFQUE0RTtJQUM1RSxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxJQUFJLFVBQVUsQ0FBQTtJQUN2RCxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUE7SUFFN0Ysa0VBQWtFO0lBQ2xFLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxhQUFhLENBQUM7UUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBK0IsWUFBWSxtRUFBZ0UsQ0FBQyxDQUFBO0lBRTlILHlFQUF5RTtJQUN6RSw4Q0FBOEM7SUFDOUMsSUFBTSxXQUFXLEdBQUcsVUFBQSxLQUFLO1FBQ3ZCLDBDQUEwQztRQUMxQyxJQUFNLGNBQWMsR0FBRyxxQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUVoRCxrRUFBa0U7UUFDbEUsbUJBQW1CO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7WUFDekIsY0FBYyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsY0FBYyxLQUFLLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFBO1FBRWxHLE1BQU0sQ0FBQyxjQUFjLENBQUE7SUFDdkIsQ0FBQyxDQUFBO0lBRUQsNkVBQTZFO0lBQzdFLDRFQUE0RTtJQUM1RSxtRUFBbUU7SUFDbkUsd0VBQXdFO0lBQ3hFLGFBQWE7SUFDYixJQUFNLHFCQUFxQixHQUFHO1FBQzVCLHFCQUFxQjtRQUNyQixVQUFVLENBQUMsSUFBSSxFQUFFO1FBQ2pCLG9DQUFvQztRQUNwQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQzFDLDJEQUEyRDtRQUMzRCxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFLENBQUM7S0FDakQsQ0FBQTtJQUVELGdGQUFnRjtJQUNoRixJQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsT0FBTyxDQUM3RCwyQ0FBMkMsRUFDM0MsNENBQTBDLFlBQVkscUJBQWUsT0FBTyxDQUFDLE9BQU8sR0FBRywwQkFBMEIsR0FBRyxNQUFNLE9BQUcsQ0FDOUgsRUFIa0QsQ0FHbEQsQ0FBQyxDQUFBO0lBRUY7Ozs7Ozs7T0FPRztJQUNILElBQU0sY0FBYyxHQUFHLFVBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO3dCQTZEaEMsU0FBUyxjQXdGZixNQUFNLEVBQ04sTUFBTSxFQUNOLGdCQUFnQixFQUNkLGNBQWMsRUFDaEIsTUFBTSxlQWlGRixNQUFNLEVBZ0JOLGdCQUFnQixFQWdCaEIsUUFBUSxXQTJDTixXQUFXLEVBQ1gsVUFBVSxFQUNWLFFBQVEsRUFDUixFQUFFOzs7O29CQXZUWiwrREFBK0Q7b0JBQy9ELHNDQUFzQztvQkFDdEMsRUFBRTtvQkFDRiwwRUFBMEU7b0JBQzFFLGdCQUFnQjtvQkFDaEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxlQUFlLEtBQUssYUFBYSxDQUFDO3dCQUMxRCxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7eUJBTWpCLE9BQU8sQ0FBQyxRQUFRLEVBQWhCLHdCQUFnQjt5QkFPZCxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEtBQUssY0FBYyxDQUFBLEVBQXpDLHdCQUF5QztvQkFDM0MsOERBQThEO29CQUM5RCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxLQUFLLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JELEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTt3QkFDckQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQTt3QkFDNUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO3dCQUNULE1BQU0sZ0JBQUE7b0JBQ1IsQ0FBQztvQkFFRCxvRUFBb0U7b0JBQ3BFLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFBO29CQUNwQixHQUFHLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFBO29CQUN2RCxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQTtvQkFFN0MscUNBQXFDO29CQUNyQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQzFCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTt3QkFDVCxNQUFNLGdCQUFBO29CQUNSLENBQUM7b0JBRUQsS0FBQSxDQUFBLEtBQUEsR0FBRyxDQUFBLENBQUMsR0FBRyxDQUFBO29CQUFDLHFCQUFNLE9BQU8sRUFBQTs7b0JBQXJCLGNBQVEsU0FBYSxFQUFDLENBQUE7b0JBQ3RCLHNCQUFNOztvQkFHUix5RUFBeUU7b0JBQ3pFLHFDQUFxQztvQkFDckMseUVBQXlFO29CQUV6RSwwRUFBMEU7b0JBQzFFLHlDQUF5QztvQkFDekMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pFLG9EQUFvRDt3QkFDcEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNyRCxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEtBQUssU0FBUyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7NEJBQ3JELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUE7NEJBQzVDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTs0QkFDVCxNQUFNLGdCQUFBO3dCQUNSLENBQUM7b0NBSWlCLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQzt3QkFFaEYsa0VBQWtFO3dCQUNsRSxhQUFhO3dCQUNiLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxZQUFZLElBQUksU0FBUyxLQUFLLHFCQUFxQixDQUFDLENBQUMsQ0FBQzs0QkFDdEUsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUE7NEJBQ3BCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTs0QkFDVCxNQUFNLGdCQUFBO3dCQUNSLENBQUM7d0JBRUQsbUVBQW1FO3dCQUNuRSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQTt3QkFDcEIsUUFBUSxDQUFDLEdBQUcsRUFBRSxXQUFRLENBQUMseUJBQWlCLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7d0JBQ2pGLE1BQU0sZ0JBQUE7b0JBQ1IsQ0FBQztvQkFFRCx5RUFBeUU7b0JBQ3pFLHdCQUF3QjtvQkFDeEIseUVBQXlFO29CQUV6RSxxRUFBcUU7b0JBQ3JFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEtBQUssc0JBQXNCLENBQUMsQ0FBQyxDQUFDO3dCQUN0RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7NEJBQy9DLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFBOzRCQUNwQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUE7NEJBQ1QsTUFBTSxnQkFBQTt3QkFDUixDQUFDO3dCQUNELCtCQUFxQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7d0JBQ3hDLE1BQU0sZ0JBQUE7b0JBQ1IsQ0FBQzt5QkFPRyxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEtBQUssYUFBYSxDQUFBLEVBQXhDLHdCQUF3QztvQkFDMUMsMkRBQTJEO29CQUMzRCxFQUFFLENBQUMsQ0FBQyxlQUFlLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQzt3QkFDdEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxDQUFBO3dCQUN6RCxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUE7d0JBQ1QsTUFBTSxnQkFBQTtvQkFDUixDQUFDO29CQUVELG9EQUFvRDtvQkFDcEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyRCxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEtBQUssU0FBUyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7d0JBQ3JELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUE7d0JBQzVDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTt3QkFDVCxNQUFNLGdCQUFBO29CQUNSLENBQUM7b0JBRUQsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUE7b0JBQ3BCLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLDBCQUEwQixDQUFDLENBQUE7b0JBRXpELHFDQUFxQztvQkFDckMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUE7d0JBQ1QsTUFBTSxnQkFBQTtvQkFDUixDQUFDO29CQUVELDZCQUE2QjtvQkFDN0IsS0FBQSxDQUFBLEtBQUEsR0FBRyxDQUFBLENBQUMsR0FBRyxDQUFBO29CQUFDLHFCQUFNLFlBQVksRUFBQTs7b0JBRDFCLDZCQUE2QjtvQkFDN0IsY0FBUSxTQUFrQixFQUFDLENBQUE7b0JBQzNCLHNCQUFNOztvQkFJViw4REFBOEQ7b0JBQzlELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEtBQUssWUFBWSxDQUFDO3dCQUMxQyxNQUFNLGdCQUFDLElBQUksRUFBRSxFQUFBO29CQUVmLDJFQUEyRTtvQkFDM0UsMEJBQTBCO29CQUMxQiwyRUFBMkU7b0JBRTNFLDJFQUEyRTtvQkFDM0UsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUE7b0JBRXBCLDJEQUEyRDtvQkFDM0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUM3QixHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQTt3QkFDcEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO3dCQUNULE1BQU0sZ0JBQUE7b0JBQ1IsQ0FBQztxQ0FRc0IsT0FBTyxDQUFDLE1BQU0sRUFBRTtvQkFHdkMsWUFBWSxDQUFDLGtDQUFrQyxDQUFDLENBQUE7Ozs7b0JBUTVCLHFCQUFNLFlBQVksRUFBRSxFQUFBOztrQ0FBcEIsU0FBb0I7b0JBRXRDLGlFQUFpRTtvQkFDakUscUVBQXFFO29CQUNyRSx3RUFBd0U7b0JBQ3hFLHFCQUFxQjtvQkFDckIsRUFBRTtvQkFDRix3RUFBd0U7b0JBQ3hFLHlFQUF5RTtvQkFDekUsZ0VBQWdFO29CQUNoRSxFQUFFO29CQUNGLHlFQUF5RTtvQkFDekUsMkNBQTJDO29CQUMzQyxxQkFBTSxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPLEVBQUUsVUFBVSxJQUFLLE9BQUEsQ0FDMUQsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTs0QkFDN0MsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsVUFBQSxLQUFLO2dDQUN4QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7b0NBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dDQUN4QixJQUFJO29DQUFDLE9BQU8sRUFBRSxDQUFBOzRCQUNoQixDQUFDLENBQUMsQ0FBQTt3QkFDSixDQUFDLENBQUMsRUFMaUIsQ0FLakIsQ0FBQyxDQUNKLEVBUDJELENBTzNELEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUE7O29CQWxCckIsaUVBQWlFO29CQUNqRSxxRUFBcUU7b0JBQ3JFLHdFQUF3RTtvQkFDeEUscUJBQXFCO29CQUNyQixFQUFFO29CQUNGLHdFQUF3RTtvQkFDeEUseUVBQXlFO29CQUN6RSxnRUFBZ0U7b0JBQ2hFLEVBQUU7b0JBQ0YseUVBQXlFO29CQUN6RSwyQ0FBMkM7b0JBQzNDLFNBT3FCLENBQUE7b0JBRXJCLDZEQUE2RDtvQkFDN0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQTt3QkFDdkMsTUFBTSxTQUFTLENBQUMsR0FBRyxFQUFFLG1DQUFtQyxDQUFDLENBQUE7b0JBQzNELENBQUM7b0JBRUQsd0VBQXdFO29CQUN4RSxXQUFXO29CQUNYLEVBQUU7b0JBQ0YsZ0RBQWdEO29CQUNoRCx1RUFBdUU7b0JBQ3ZFLHdFQUF3RTtvQkFDeEUsa0JBQWtCO29CQUNsQixNQUFNLEdBQUcsT0FBTyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtvQkFFdEUsb0NBQW9DO29CQUNwQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO3dCQUFDLE1BQU0sU0FBUyxDQUFDLEdBQUcsRUFBRSx1REFBdUQsQ0FBQyxDQUFBO29CQUNqRyxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUM7d0JBQUMsTUFBTSxTQUFTLENBQUMsR0FBRyxFQUFFLG1EQUFpRCxPQUFPLE1BQU0sT0FBSSxDQUFDLENBQUE7b0JBQ3hILEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQUMsTUFBTSxTQUFTLENBQUMsR0FBRyxFQUFFLDhGQUE4RixDQUFDLENBQUE7b0JBQy9JLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzt3QkFBQyxNQUFNLFNBQVMsQ0FBQyxHQUFHLEVBQUUsOEJBQThCLENBQUMsQ0FBQTtvQkFFdkUsc0VBQXNFO29CQUN0RSxzQkFBc0I7b0JBQ3RCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUN6QyxxRUFBcUU7d0JBQ3JFLGFBQWE7d0JBQ2IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUM1QixNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTt3QkFDekIsQ0FBQzt3QkFFRCxJQUFJLENBQUMsQ0FBQzs0QkFDSixJQUFJLENBQUM7Z0NBQ0gsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTs0QkFDakQsQ0FBQzs0QkFDRCxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dDQUNiLEtBQUssQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFBO2dDQUN0QixNQUFNLEtBQUssQ0FBQTs0QkFDYixDQUFDO3dCQUNILENBQUM7b0JBQ0gsQ0FBQztvQkFFRCxrREFBa0Q7b0JBQ2xELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksSUFBSSxJQUFJLE9BQU8sTUFBTSxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUM7d0JBQ25FLE1BQU0sU0FBUyxDQUFDLEdBQUcsRUFBRSx1Q0FBcUMsT0FBTyxNQUFNLENBQUMsU0FBUyxPQUFJLENBQUMsQ0FBQTtvQkFFeEYscURBQXFEO29CQUNyRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxJQUFJLElBQUksSUFBSSxPQUFPLE1BQU0sQ0FBQyxhQUFhLEtBQUssUUFBUSxDQUFDO3dCQUMzRSxNQUFNLFNBQVMsQ0FBQyxHQUFHLEVBQUUsMkNBQXlDLE9BQU8sTUFBTSxDQUFDLGFBQWEsT0FBSSxDQUFDLENBQUE7NkJBRWpGLElBQUksZ0JBQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLHNCQUFzQixDQUFDO29CQUUvRCx1RUFBdUU7b0JBQ3ZFLGtEQUFrRDtvQkFDbEQsSUFBSSxDQUFDO3dCQUNILGdCQUFnQixHQUFHLGVBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQTtvQkFDekMsQ0FBQztvQkFDRCxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNiLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFBO3dCQUNwQixNQUFNLEtBQUssQ0FBQTtvQkFDYixDQUFDO29CQUVELFlBQVksQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO3VDQUlmLGtCQUFlLENBQUMsV0FBUyxFQUFFLGdCQUFnQixDQUFDO29CQUVyRSxzRUFBc0U7b0JBQ3RFLG1EQUFtRDtvQkFDbkQsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2hDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFBO3dCQUNwQixNQUFNLEdBQUcsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQTt3QkFDckMsTUFBTSxnQkFBQTtvQkFDUixDQUFDO29CQUVELFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO29CQUUzQyxzRUFBc0U7b0JBQ3RFLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7d0JBQ3ZCLFlBQVksQ0FBQyxlQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7K0JBRXpELFdBQVcsQ0FBQyxHQUFHLENBQUM7b0JBRXhCLHFCQUFNLGdDQUFzQixDQUFDOzRCQUNwQyxNQUFNLFFBQUE7NEJBQ04sUUFBUSxVQUFBOzRCQUNSLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUzs0QkFDNUIsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhO3lCQUNyQyxFQUFFLFVBQUEsT0FBTzs0QkFDUixNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQTs0QkFDdkIsTUFBTSxDQUFDLGlCQUFjLENBQ25CLFdBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsSUFBSSxFQUNKLE9BQU8sRUFDUCxNQUFNLENBQUMsU0FBUyxFQUNoQixNQUFNLENBQUMsYUFBYSxDQUNyQixDQUFBO3dCQUNILENBQUMsQ0FBQyxFQUFBOztvQkFmRixNQUFNLEdBQUcsU0FlUCxDQUFBOzs7O29CQUdGLHVEQUF1RDtvQkFDdkQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUM7d0JBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxPQUFLLENBQUMsTUFBTSxJQUFJLE9BQUssQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFBO29CQUNwRixNQUFNLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxPQUFLLENBQUMsRUFBRSxDQUFBO29CQUU1QixrREFBa0Q7b0JBQ2xELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDO3dCQUN6QixzQ0FBc0M7d0JBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBOzs7b0JBSTVCLFlBQVksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO29CQUNoRCw4REFBOEQ7b0JBQzlELEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDO3dCQUMxQixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUVoRCxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFBO29CQUNoRSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtvQkFFL0IsWUFBWSxDQUFDLGlDQUFpQyxDQUFDLENBQUE7b0JBRS9DLCtEQUErRDtvQkFDL0QsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztzQ0FDN0IsZUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUU7cUNBQzNELENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNO21DQUM5QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQzs2QkFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUc7d0JBRTVFLG1FQUFtRTt3QkFDbkUsc0NBQXNDO3dCQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUssQ0FBQyxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBSSxVQUFVLGNBQVcsQ0FBQyxVQUFJLE1BQU0sSUFBSSxJQUFJLEdBQUcsUUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFHLEdBQUcsRUFBRSxZQUFNLEtBQUssQ0FBQyxJQUFJLENBQUksRUFBRSxPQUFJLENBQUMsWUFBTyxXQUFhLENBQUMsQ0FBQTtvQkFDNUwsQ0FBQzs7Ozs7U0FFSixDQUFBO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNILE1BQU0sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNiLHNFQUFzRTtRQUN0RSxvQkFBb0I7UUFDcEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDOUMsd0NBQXdDO1lBQ3hDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQTtZQUNiLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQTtZQUVkLG9FQUFvRTtZQUNwRSxvRUFBb0U7WUFDcEUsb0JBQW9CO1lBQ3BCLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQy9DLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNKLHlFQUF5RTtZQUN6RSxxRUFBcUU7WUFDckUsaUJBQWlCO1lBQ2pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQTtZQUNiLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQTtZQUNiLElBQU0sTUFBSSxHQUFHLENBQUMsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBRXhDLCtCQUErQjtZQUMvQixjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFJLENBQUMsQ0FBQyxJQUFJO1lBQ2pDLHNDQUFzQztZQUN0QyxjQUFtQixDQUFDO1lBQ3BCLDBEQUEwRDtZQUMxRCxVQUFBLEtBQUssSUFBSSxPQUFBLE1BQUksQ0FBQyxLQUFLLENBQUMsRUFBWCxDQUFXLENBQ3JCLENBQUE7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxDQUFBO0FBQ0gsQ0FBQzs7QUEvWkQsc0RBK1pDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCx3QkFBeUIsR0FBRztJQUMxQixHQUFHLENBQUMsU0FBUyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQ2pELEdBQUcsQ0FBQyxTQUFTLENBQUMsK0JBQStCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQTtJQUNqRSxHQUFHLENBQUMsU0FBUyxDQUFDLDhCQUE4QixFQUFFO1FBQzVDLFFBQVE7UUFDUixrQkFBa0I7UUFDbEIsd0VBQXdFO1FBQ3hFLGtDQUFrQztRQUNsQyxRQUFRO1FBQ1IseUNBQXlDO1FBQ3pDLGVBQWU7UUFDZixxRUFBcUU7UUFDckUsMEJBQTBCO1FBQzFCLGNBQWM7UUFDZCxnQkFBZ0I7S0FDakIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUNmLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsSUFBTSxzQkFBc0IsR0FBRyx3Q0FBd0MsQ0FBQTtBQUV2RTs7Ozs7Ozs7O0dBU0c7QUFDSCxxQkFBc0IsT0FBTztJQUNuQixJQUFBLDZDQUFhLENBQW9CO0lBRXpDLDBEQUEwRDtJQUMxRCxFQUFFLENBQUMsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFFYixJQUFNLEtBQUssR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7SUFFeEQseUVBQXlFO0lBQ3pFLHFCQUFxQjtJQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNULE1BQU0sU0FBUyxDQUFDLEdBQUcsRUFBRSxrRUFBa0UsQ0FBQyxDQUFBO0lBRTFGLG1DQUFtQztJQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pCLENBQUMifQ==