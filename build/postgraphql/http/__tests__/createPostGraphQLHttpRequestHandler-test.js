"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
jest.mock('../setupRequestPgClientTransaction');
const graphql_1 = require('graphql');
const pgClientFromContext_1 = require('../../../postgres/inventory/pgClientFromContext');
const setupRequestPgClientTransaction_1 = require('../setupRequestPgClientTransaction');
const createPostGraphQLHttpRequestHandler_1 = require('../createPostGraphQLHttpRequestHandler');
const http = require('http');
const request = require('supertest-as-promised');
const connect = require('connect');
const express = require('express');
const Koa = require('koa'); // tslint:disable-line variable-name
const gqlSchema = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: {
            hello: {
                type: graphql_1.GraphQLString,
                resolve: () => 'world',
            },
            greetings: {
                type: graphql_1.GraphQLString,
                args: {
                    name: { type: graphql_1.GraphQLString },
                },
                resolve: (source, { name }) => `Hello, ${name}!`,
            },
            query: {
                type: graphql_1.GraphQLString,
                resolve: (source, args, context) => context[pgClientFromContext_1.$$pgClient].query(),
            },
        },
    }),
    mutation: new graphql_1.GraphQLObjectType({
        name: 'Mutation',
        fields: {
            hello: {
                type: graphql_1.GraphQLString,
                resolve: () => 'world',
            },
        },
    }),
});
const pgClient = {
    query: jest.fn(() => Promise.resolve()),
    release: jest.fn(),
};
const pgPool = {
    connect: jest.fn(() => pgClient),
};
const defaultOptions = {
    getGqlSchema: () => gqlSchema,
    pgPool,
    disableQueryLog: true,
};
const serverCreators = new Map([
    ['http', handler => {
            return http.createServer(handler);
        }],
    ['connect', handler => {
            const app = connect();
            app.use(handler);
            return http.createServer(app);
        }],
    ['express', handler => {
            const app = express();
            app.use(handler);
            return http.createServer(app);
        }],
    ['koa', handler => {
            const app = new Koa();
            app.use(handler);
            return http.createServer(app.callback());
        }],
]);
for (const [name, createServerFromHandler] of serverCreators) {
    const createServer = options => createServerFromHandler(createPostGraphQLHttpRequestHandler_1.default(Object.assign({}, defaultOptions, options)));
    describe(name, () => {
        test('will 404 for route other than that specified', () => __awaiter(this, void 0, void 0, function* () {
            const server1 = createServer();
            const server2 = createServer({ graphqlRoute: '/x' });
            yield (request(server1)
                .post('/x')
                .expect(404));
            yield (request(server2)
                .post('/graphql')
                .expect(404));
        }));
        test('will respond to queries on a different route', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer({ graphqlRoute: '/x' });
            yield (request(server)
                .post('/x')
                .send({ query: '{hello}' })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { hello: 'world' } }));
        }));
        test('will always respond with CORS to an OPTIONS request when enabled', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer({ enableCors: true });
            yield (request(server)
                .options('/graphql')
                .expect(200)
                .expect('Access-Control-Allow-Origin', '*')
                .expect('Access-Control-Request-Method', 'POST')
                .expect('Access-Control-Allow-Headers', /Accept, Authorization/)
                .expect(''));
        }));
        test('will always respond to any request with CORS headers when enabled', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer({ enableCors: true });
            yield (request(server)
                .post('/graphql')
                .expect('Access-Control-Allow-Origin', '*')
                .expect('Access-Control-Request-Method', 'POST')
                .expect('Access-Control-Allow-Headers', /Accept, Authorization/));
        }));
        test('will not allow requests other than POST', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .get('/graphql')
                .expect(405)
                .expect('Allow', 'POST, OPTIONS'));
            yield (request(server)
                .delete('/graphql')
                .expect(405)
                .expect('Allow', 'POST, OPTIONS'));
            yield (request(server)
                .put('/graphql')
                .expect(405)
                .expect('Allow', 'POST, OPTIONS'));
        }));
        test('will run a query on a POST request with JSON data', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send(JSON.stringify({ query: '{hello}' }))
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { hello: 'world' } }));
        }));
        test('will run a query on a POST request with form data', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(`query=${encodeURIComponent('{hello}')}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { hello: 'world' } }));
        }));
        test('will run a query on a POST request with GraphQL data', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send('{hello}')
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { hello: 'world' } }));
        }));
        test('will error if query parse fails', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .send({ query: '{' })
                .expect(400)
                .expect('Content-Type', /json/)
                .expect({ errors: [{ message: 'Syntax Error GraphQL Http Request (1:2) Expected Name, found <EOF>\n\n1: {\n    ^\n', locations: [{ line: 1, column: 2 }] }] }));
        }));
        test('will error if validation fails', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .send({ query: '{notFound}' })
                .expect(400)
                .expect('Content-Type', /json/)
                .expect({ errors: [{ message: 'Cannot query field "notFound" on type "Query".', locations: [{ line: 1, column: 2 }] }] }));
        }));
        test('will allow mutations with POST', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .send({ query: 'mutation {hello}' })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { hello: 'world' } }));
        }));
        test('will connect and release a Postgres client from the pool on every request', () => __awaiter(this, void 0, void 0, function* () {
            pgPool.connect.mockClear();
            pgClient.query.mockClear();
            pgClient.release.mockClear();
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .send({ query: '{hello}' })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { hello: 'world' } }));
            expect(pgPool.connect.mock.calls).toEqual([[]]);
            expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']]);
            expect(pgClient.release.mock.calls).toEqual([[]]);
        }));
        test('will setup a transaction for requests that use the Postgres client', () => __awaiter(this, void 0, void 0, function* () {
            pgPool.connect.mockClear();
            pgClient.query.mockClear();
            pgClient.release.mockClear();
            setupRequestPgClientTransaction_1.default.mockClear();
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .send({ query: '{query}' })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { query: null } }));
            expect(pgPool.connect.mock.calls).toEqual([[]]);
            expect(pgClient.query.mock.calls).toEqual([['begin'], [], ['commit']]);
            expect(pgClient.release.mock.calls).toEqual([[]]);
            expect(setupRequestPgClientTransaction_1.default.mock.calls.length).toEqual(1);
            expect(setupRequestPgClientTransaction_1.default.mock.calls[0].length).toEqual(3);
            expect(setupRequestPgClientTransaction_1.default.mock.calls[0][1]).toBe(pgClient);
            expect(setupRequestPgClientTransaction_1.default.mock.calls[0][2]).toEqual({});
        }));
        test('will setup a transaction and pass down options for requests that use the Postgres client', () => __awaiter(this, void 0, void 0, function* () {
            pgPool.connect.mockClear();
            pgClient.query.mockClear();
            pgClient.release.mockClear();
            setupRequestPgClientTransaction_1.default.mockClear();
            const jwtSecret = Symbol('jwtSecret');
            const pgDefaultRole = Symbol('pgDefaultRole');
            const server = createServer({ jwtSecret, pgDefaultRole });
            yield (request(server)
                .post('/graphql')
                .send({ query: '{query}' })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { query: null } }));
            expect(pgPool.connect.mock.calls).toEqual([[]]);
            expect(pgClient.query.mock.calls).toEqual([['begin'], [], ['commit']]);
            expect(pgClient.release.mock.calls).toEqual([[]]);
            expect(setupRequestPgClientTransaction_1.default.mock.calls.length).toEqual(1);
            expect(setupRequestPgClientTransaction_1.default.mock.calls[0].length).toEqual(3);
            expect(setupRequestPgClientTransaction_1.default.mock.calls[0][1]).toBe(pgClient);
            expect(setupRequestPgClientTransaction_1.default.mock.calls[0][2]).toEqual({ jwtSecret, pgDefaultRole });
        }));
        test('will respect an operation name', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .send({ query: 'query A { a: hello } query B { b: hello }', operationName: 'A' })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { a: 'world' } }));
            yield (request(server)
                .post('/graphql')
                .send({ query: 'query A { a: hello } query B { b: hello }', operationName: 'B' })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { b: 'world' } }));
        }));
        test('will use variables', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .send({ query: 'query A($name: String!) { greetings(name: $name) }', variables: JSON.stringify({ name: 'Joe' }), operationName: 'A' })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { greetings: 'Hello, Joe!' } }));
            yield (request(server)
                .post('/graphql')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(`operationName=A&query=${encodeURIComponent('query A($name: String!) { greetings(name: $name) }')}&variables=${encodeURIComponent(JSON.stringify({ name: 'Joe' }))}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({ data: { greetings: 'Hello, Joe!' } }));
        }));
        test('will ignore empty string variables', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .send({ query: '{hello}', variables: '' })
                .expect(200)
                .expect({ data: { hello: 'world' } }));
        }));
        test('will error with variables of the incorrect type', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .send({ query: '{hello}', variables: 2 })
                .expect(400)
                .expect({ errors: [{ message: 'Variables must be an object, not \'number\'.' }] }));
        }));
        test('will error with an operation name of the incorrect type', () => __awaiter(this, void 0, void 0, function* () {
            const server = createServer();
            yield (request(server)
                .post('/graphql')
                .send({ query: '{hello}', operationName: 2 })
                .expect(400)
                .expect({ errors: [{ message: 'Operation name must be a string, not \'number\'.' }] }));
        }));
        test('will serve a favicon', () => __awaiter(this, void 0, void 0, function* () {
            const server1 = createServer();
            const server2 = createServer({ route: '/graphql' });
            yield (request(server1)
                .get('/favicon.ico')
                .expect(200)
                .expect('Cache-Control', 'public, max-age=86400')
                .expect('Content-Type', 'image/x-icon'));
            yield (request(server2)
                .get('/favicon.ico')
                .expect(200)
                .expect('Cache-Control', 'public, max-age=86400')
                .expect('Content-Type', 'image/x-icon'));
        }));
        test('will render GraphiQL if enabled', () => __awaiter(this, void 0, void 0, function* () {
            const server1 = createServer();
            const server2 = createServer({ graphiql: true });
            yield (request(server1)
                .get('/graphiql')
                .expect(404));
            yield (request(server2)
                .get('/graphiql')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=utf-8'));
        }));
        test('will render GraphiQL on another route if desired', () => __awaiter(this, void 0, void 0, function* () {
            const server1 = createServer({ graphiqlRoute: '/x' });
            const server2 = createServer({ graphiql: true, graphiqlRoute: '/x' });
            const server3 = createServer({ graphiql: false, graphiqlRoute: '/x' });
            yield (request(server1)
                .get('/x')
                .expect(404));
            yield (request(server2)
                .get('/x')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=utf-8'));
            yield (request(server3)
                .get('/x')
                .expect(404));
            yield (request(server3)
                .get('/graphiql')
                .expect(404));
        }));
        test('cannot use a rejected GraphQL schema', () => __awaiter(this, void 0, void 0, function* () {
            const rejectedGraphQLSchema = Promise.reject(new Error('Uh oh!'));
            // We don’t want Jest to complain about uncaught promise rejections.
            rejectedGraphQLSchema.catch(() => { });
            const server = createServer({ getGqlSchema: () => rejectedGraphQLSchema });
            // We want to hide `console.error` warnings because we are intentionally
            // generating some here.
            const origConsoleError = console.error;
            console.error = () => { };
            try {
                yield (request(server)
                    .post('/graphql')
                    .send({ query: '{hello}' })
                    .expect(500));
            }
            finally {
                console.error = origConsoleError;
            }
        }));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUG9zdEdyYXBoUUxIdHRwUmVxdWVzdEhhbmRsZXItdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9odHRwL19fdGVzdHNfXy9jcmVhdGVQb3N0R3JhcGhRTEh0dHBSZXF1ZXN0SGFuZGxlci10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQTtBQUUvQywwQkFBZ0UsU0FDaEUsQ0FBQyxDQUR3RTtBQUN6RSxzQ0FBMkIsaURBQzNCLENBQUMsQ0FEMkU7QUFDNUUsa0RBQTRDLG9DQUM1QyxDQUFDLENBRCtFO0FBQ2hGLHNEQUFnRCx3Q0FFaEQsQ0FBQyxDQUZ1RjtBQUV4RixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDNUIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUE7QUFDaEQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNsQyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyxvQ0FBb0M7QUFFL0QsTUFBTSxTQUFTLEdBQUcsSUFBSSx1QkFBYSxDQUFDO0lBQ2xDLEtBQUssRUFBRSxJQUFJLDJCQUFpQixDQUFDO1FBQzNCLElBQUksRUFBRSxPQUFPO1FBQ2IsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRSx1QkFBYTtnQkFDbkIsT0FBTyxFQUFFLE1BQU0sT0FBTzthQUN2QjtZQUNELFNBQVMsRUFBRTtnQkFDVCxJQUFJLEVBQUUsdUJBQWE7Z0JBQ25CLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQWEsRUFBRTtpQkFD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