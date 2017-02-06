"use strict";
var _this = this;
var tslib_1 = require("tslib");
jest.mock('send');
var graphql_1 = require("graphql");
var pgClientFromContext_1 = require("../../../postgres/inventory/pgClientFromContext");
var createPostGraphQLHttpRequestHandler_1 = require("../createPostGraphQLHttpRequestHandler");
var path = require('path');
var http = require('http');
var request = require('supertest');
var connect = require('connect');
var express = require('express');
var Koa = require('koa'); // tslint:disable-line variable-name
var sendFile = require('send');
sendFile.mockImplementation(function () { return ({ pipe: jest.fn(function (res) { return res.end(); }) }); });
var gqlSchema = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: {
            hello: {
                type: graphql_1.GraphQLString,
                resolve: function () { return 'world'; },
            },
            greetings: {
                type: graphql_1.GraphQLString,
                args: {
                    name: { type: graphql_1.GraphQLString },
                },
                resolve: function (source, _a) {
                    var name = _a.name;
                    return "Hello, " + name + "!";
                },
            },
            query: {
                type: graphql_1.GraphQLString,
                resolve: function (source, args, context) {
                    return context[pgClientFromContext_1.$$pgClient].query('EXECUTE');
                },
            },
        },
    }),
    mutation: new graphql_1.GraphQLObjectType({
        name: 'Mutation',
        fields: {
            hello: {
                type: graphql_1.GraphQLString,
                resolve: function () { return 'world'; },
            },
        },
    }),
});
var pgClient = {
    query: jest.fn(function () { return Promise.resolve(); }),
    release: jest.fn(),
};
var pgPool = {
    connect: jest.fn(function () { return pgClient; }),
};
var defaultOptions = {
    getGqlSchema: function () { return gqlSchema; },
    pgPool: pgPool,
    disableQueryLog: true,
};
var serverCreators = new Map([
    ['http', function (handler) {
            return http.createServer(handler);
        }],
    ['connect', function (handler) {
            var app = connect();
            app.use(handler);
            return http.createServer(app);
        }],
    ['express', function (handler) {
            var app = express();
            app.use(handler);
            return http.createServer(app);
        }],
    ['koa', function (handler) {
            var app = new Koa();
            app.use(handler);
            return http.createServer(app.callback());
        }],
]);
var _loop_1 = function (name, createServerFromHandler) {
    var createServer = function (options) {
        return createServerFromHandler(createPostGraphQLHttpRequestHandler_1.default(Object.assign({}, defaultOptions, options)));
    };
    describe(name, function () {
        test('will 404 for route other than that specified', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server1, server2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server1 = createServer();
                        server2 = createServer({ graphqlRoute: '/x' });
                        return [4 /*yield*/, (request(server1)
                                .post('/x')
                                .expect(404))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server2)
                                .post('/graphql')
                                .expect(404))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will respond to queries on a different route', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer({ graphqlRoute: '/x' });
                        return [4 /*yield*/, (request(server)
                                .post('/x')
                                .send({ query: '{hello}' })
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { hello: 'world' } }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will always respond with CORS to an OPTIONS request when enabled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer({ enableCors: true });
                        return [4 /*yield*/, (request(server)
                                .options('/graphql')
                                .expect(200)
                                .expect('Access-Control-Allow-Origin', '*')
                                .expect('Access-Control-Request-Method', 'HEAD, GET, POST')
                                .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
                                .expect(''))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will always respond to any request with CORS headers when enabled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer({ enableCors: true });
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .expect('Access-Control-Allow-Origin', '*')
                                .expect('Access-Control-Request-Method', 'HEAD, GET, POST')
                                .expect('Access-Control-Allow-Headers', /Accept, Authorization/))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will not allow requests other than POST', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .get('/graphql')
                                .expect(405)
                                .expect('Allow', 'POST, OPTIONS'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server)
                                .delete('/graphql')
                                .expect(405)
                                .expect('Allow', 'POST, OPTIONS'))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (request(server)
                                .put('/graphql')
                                .expect(405)
                                .expect('Allow', 'POST, OPTIONS'))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will run a query on a POST request with JSON data', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify({ query: '{hello}' }))
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { hello: 'world' } }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will run a query on a POST request with form data', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .set('Content-Type', 'application/x-www-form-urlencoded')
                                .send("query=" + encodeURIComponent('{hello}'))
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { hello: 'world' } }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will run a query on a POST request with GraphQL data', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .set('Content-Type', 'application/graphql')
                                .send('{hello}')
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { hello: 'world' } }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will error if query parse fails', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: '{' })
                                .expect(400)
                                .expect('Content-Type', /json/)
                                .expect({ errors: [{ message: 'Syntax Error GraphQL Http Request (1:2) Expected Name, found <EOF>\n\n1: {\n    ^\n', locations: [{ line: 1, column: 2 }] }] }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will error if validation fails', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: '{notFound}' })
                                .expect(400)
                                .expect('Content-Type', /json/)
                                .expect({ errors: [{ message: 'Cannot query field "notFound" on type "Query".', locations: [{ line: 1, column: 2 }] }] }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will allow mutations with POST', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: 'mutation {hello}' })
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { hello: 'world' } }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will connect and release a Postgres client from the pool on every request', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pgPool.connect.mockClear();
                        pgClient.query.mockClear();
                        pgClient.release.mockClear();
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: '{hello}' })
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { hello: 'world' } }))];
                    case 1:
                        _a.sent();
                        expect(pgPool.connect.mock.calls).toEqual([[]]);
                        expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']]);
                        expect(pgClient.release.mock.calls).toEqual([[]]);
                        return [2 /*return*/];
                }
            });
        }); });
        test('will setup a transaction for requests that use the Postgres client', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pgPool.connect.mockClear();
                        pgClient.query.mockClear();
                        pgClient.release.mockClear();
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: '{query}' })
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { query: null } }))];
                    case 1:
                        _a.sent();
                        expect(pgPool.connect.mock.calls).toEqual([[]]);
                        expect(pgClient.query.mock.calls).toEqual([['begin'], ['EXECUTE'], ['commit']]);
                        expect(pgClient.release.mock.calls).toEqual([[]]);
                        return [2 /*return*/];
                }
            });
        }); });
        test('will setup a transaction and pass down options for requests that use the Postgres client', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var jwtSecret, pgDefaultRole, server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pgPool.connect.mockClear();
                        pgClient.query.mockClear();
                        pgClient.release.mockClear();
                        jwtSecret = 'secret';
                        pgDefaultRole = 'pg_default_role';
                        server = createServer({ jwtSecret: jwtSecret, pgDefaultRole: pgDefaultRole });
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: '{query}' })
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { query: null } }))];
                    case 1:
                        _a.sent();
                        expect(pgPool.connect.mock.calls).toEqual([[]]);
                        expect(pgClient.query.mock.calls).toEqual([
                            ['begin'],
                            [{ text: 'select set_config($1, $2, true)', values: ['role', 'pg_default_role'] }],
                            ['EXECUTE'],
                            ['commit'],
                        ]);
                        expect(pgClient.release.mock.calls).toEqual([[]]);
                        return [2 /*return*/];
                }
            });
        }); });
        test('will respect an operation name', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: 'query A { a: hello } query B { b: hello }', operationName: 'A' })
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { a: 'world' } }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: 'query A { a: hello } query B { b: hello }', operationName: 'B' })
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { b: 'world' } }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will use variables', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: 'query A($name: String!) { greetings(name: $name) }', variables: JSON.stringify({ name: 'Joe' }), operationName: 'A' })
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { greetings: 'Hello, Joe!' } }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .set('Content-Type', 'application/x-www-form-urlencoded')
                                .send("operationName=A&query=" + encodeURIComponent('query A($name: String!) { greetings(name: $name) }') + "&variables=" + encodeURIComponent(JSON.stringify({ name: 'Joe' })))
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .expect({ data: { greetings: 'Hello, Joe!' } }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will ignore empty string variables', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: '{hello}', variables: '' })
                                .expect(200)
                                .expect({ data: { hello: 'world' } }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will error with variables of the incorrect type', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: '{hello}', variables: 2 })
                                .expect(400)
                                .expect({ errors: [{ message: 'Variables must be an object, not \'number\'.' }] }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will error with an operation name of the incorrect type', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer();
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: '{hello}', operationName: 2 })
                                .expect(400)
                                .expect({ errors: [{ message: 'Operation name must be a string, not \'number\'.' }] }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will serve a favicon when graphiql is enabled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server1, server2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server1 = createServer({ graphiql: true });
                        server2 = createServer({ graphiql: true, route: '/graphql' });
                        return [4 /*yield*/, (request(server1)
                                .get('/favicon.ico')
                                .expect(200)
                                .expect('Cache-Control', 'public, max-age=86400')
                                .expect('Content-Type', 'image/x-icon'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server2)
                                .get('/favicon.ico')
                                .expect(200)
                                .expect('Cache-Control', 'public, max-age=86400')
                                .expect('Content-Type', 'image/x-icon'))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will not serve a favicon when graphiql is disabled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server1, server2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server1 = createServer({ graphiql: false });
                        server2 = createServer({ graphiql: false, route: '/graphql' });
                        return [4 /*yield*/, (request(server1)
                                .get('/favicon.ico')
                                .expect(404))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server2)
                                .get('/favicon.ico')
                                .expect(404))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will serve any assets for graphiql', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sendFile.mockClear();
                        server = createServer({ graphiql: true });
                        return [4 /*yield*/, (request(server)
                                .get('/_postgraphql/graphiql/anything.css')
                                .expect(200))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server)
                                .get('/_postgraphql/graphiql/something.js')
                                .expect(200))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (request(server)
                                .get('/_postgraphql/graphiql/very/deeply/nested')
                                .expect(200))];
                    case 3:
                        _a.sent();
                        expect(sendFile.mock.calls.map(function (_a) {
                            var res = _a[0], filepath = _a[1], options = _a[2];
                            return [path.relative(createPostGraphQLHttpRequestHandler_1.graphiqlDirectory, filepath), options];
                        }))
                            .toEqual([
                            ['anything.css', { index: false }],
                            ['something.js', { index: false }],
                            ['very/deeply/nested', { index: false }],
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        test('will not serve some graphiql assets', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer({ graphiql: true });
                        return [4 /*yield*/, (request(server)
                                .get('/_postgraphql/graphiql/index.html')
                                .expect(404))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server)
                                .get('/_postgraphql/graphiql/asset-manifest.json')
                                .expect(404))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will not serve any assets for graphiql when disabled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sendFile.mockClear();
                        server = createServer({ graphiql: false });
                        return [4 /*yield*/, (request(server)
                                .get('/_postgraphql/graphiql/anything.css')
                                .expect(404))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server)
                                .get('/_postgraphql/graphiql/something.js')
                                .expect(404))];
                    case 2:
                        _a.sent();
                        expect(sendFile.mock.calls.length).toEqual(0);
                        return [2 /*return*/];
                }
            });
        }); });
        test('will not allow if no text/event-stream headers are set', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = createServer({ graphiql: true });
                        return [4 /*yield*/, (request(server)
                                .get('/_postgraphql/stream')
                                .expect(405))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will render GraphiQL if enabled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server1, server2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server1 = createServer();
                        server2 = createServer({ graphiql: true });
                        return [4 /*yield*/, (request(server1)
                                .get('/graphiql')
                                .expect(404))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server2)
                                .get('/graphiql')
                                .expect(200)
                                .expect('Content-Type', 'text/html; charset=utf-8'))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('will render GraphiQL on another route if desired', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var server1, server2, server3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server1 = createServer({ graphiqlRoute: '/x' });
                        server2 = createServer({ graphiql: true, graphiqlRoute: '/x' });
                        server3 = createServer({ graphiql: false, graphiqlRoute: '/x' });
                        return [4 /*yield*/, (request(server1)
                                .get('/x')
                                .expect(404))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (request(server2)
                                .get('/x')
                                .expect(200)
                                .expect('Content-Type', 'text/html; charset=utf-8'))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (request(server3)
                                .get('/x')
                                .expect(404))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (request(server3)
                                .get('/graphiql')
                                .expect(404))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('cannot use a rejected GraphQL schema', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var rejectedGraphQLSchema, server, origConsoleError;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rejectedGraphQLSchema = Promise.reject(new Error('Uh oh!'));
                        // We don’t want Jest to complain about uncaught promise rejections.
                        rejectedGraphQLSchema.catch(function () { });
                        server = createServer({ getGqlSchema: function () { return rejectedGraphQLSchema; } });
                        origConsoleError = console.error;
                        console.error = function () { };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, (request(server)
                                .post('/graphql')
                                .send({ query: '{hello}' })
                                .expect(500))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        console.error = origConsoleError;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
};
for (var _i = 0, _a = Array.from(serverCreators); _i < _a.length; _i++) {
    var _b = _a[_i], name = _b[0], createServerFromHandler = _b[1];
    _loop_1(name, createServerFromHandler);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUG9zdEdyYXBoUUxIdHRwUmVxdWVzdEhhbmRsZXItdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9odHRwL19fdGVzdHNfXy9jcmVhdGVQb3N0R3JhcGhRTEh0dHBSZXF1ZXN0SGFuZGxlci10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQkEwaEJBOztBQTFoQkEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUVqQixtQ0FBeUU7QUFDekUsdUZBQTRFO0FBQzVFLDhGQUErRztBQUUvRyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDNUIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzVCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUNwQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDLG9DQUFvQztBQUMvRCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFFaEMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLGNBQU0sT0FBQSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQVQsQ0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFyQyxDQUFxQyxDQUFDLENBQUE7QUFFeEUsSUFBTSxTQUFTLEdBQUcsSUFBSSx1QkFBYSxDQUFDO0lBQ2xDLEtBQUssRUFBRSxJQUFJLDJCQUFpQixDQUFDO1FBQzNCLElBQUksRUFBRSxPQUFPO1FBQ2IsTUFB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