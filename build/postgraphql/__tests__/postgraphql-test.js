"use strict";
var _this = this;
var tslib_1 = require("tslib");
jest.mock('pg');
jest.mock('pg-connection-string');
jest.mock('../schema/createPostGraphQLSchema');
jest.mock('../http/createPostGraphQLHttpRequestHandler');
jest.mock('../watch/watchPgSchemas');
var pg_1 = require("pg");
var pg_connection_string_1 = require("pg-connection-string");
var createPostGraphQLSchema_1 = require("../schema/createPostGraphQLSchema");
var createPostGraphQLHttpRequestHandler_1 = require("../http/createPostGraphQLHttpRequestHandler");
var watchPgSchemas_1 = require("../watch/watchPgSchemas");
var postgraphql_1 = require("../postgraphql");
var chalk = require('chalk');
createPostGraphQLHttpRequestHandler_1.default.mockImplementation(function (_a) {
    var getGqlSchema = _a.getGqlSchema;
    return Promise.resolve(getGqlSchema()).then(function () { return null; });
});
watchPgSchemas_1.default.mockImplementation(function () { return Promise.resolve(); });
test('will use the first parameter as the pool if it is an instance of `Pool`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgPool = new pg_1.Pool();
                return [4 /*yield*/, postgraphql_1.default(pgPool)];
            case 1:
                _a.sent();
                expect(pgPool.connect.mock.calls).toEqual([[]]);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls.length).toBe(1);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls[0][0].pgPool).toBe(pgPool);
                return [2 /*return*/];
        }
    });
}); });
test('will use the config to create a new pool', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgPoolConfig;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pg_1.Pool.mockClear();
                createPostGraphQLHttpRequestHandler_1.default.mockClear();
                pgPoolConfig = Symbol('pgPoolConfig');
                return [4 /*yield*/, postgraphql_1.default(pgPoolConfig)];
            case 1:
                _a.sent();
                expect(pg_1.Pool.mock.calls).toEqual([[pgPoolConfig]]);
                expect(pg_1.Pool.mock.instances[0].connect.mock.calls).toEqual([[]]);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls.length).toBe(1);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls[0][0].pgPool).toBe(pg_1.Pool.mock.instances[0]);
                return [2 /*return*/];
        }
    });
}); });
test('will parse a string config before creating a new pool', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgPoolConnectionString, pgPoolConfig;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pg_1.Pool.mockClear();
                createPostGraphQLHttpRequestHandler_1.default.mockClear();
                pg_connection_string_1.parse.mockClear();
                pgPoolConnectionString = 'abcdefghijklmnopqrstuvwxyz';
                pgPoolConfig = Symbol('pgPoolConfig');
                pg_connection_string_1.parse.mockReturnValueOnce(pgPoolConfig);
                return [4 /*yield*/, postgraphql_1.default(pgPoolConnectionString)];
            case 1:
                _a.sent();
                expect(pg_connection_string_1.parse.mock.calls).toEqual([[pgPoolConnectionString]]);
                expect(pg_1.Pool.mock.calls).toEqual([[pgPoolConfig]]);
                expect(pg_1.Pool.mock.instances[0].connect.mock.calls).toEqual([[]]);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls.length).toBe(1);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls[0][0].pgPool).toBe(pg_1.Pool.mock.instances[0]);
                return [2 /*return*/];
        }
    });
}); });
test('will use a connected client from the pool, the schemas, and options to create a GraphQL schema', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgPool, schemas, options, pgClient;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                createPostGraphQLSchema_1.default.mockClear();
                createPostGraphQLHttpRequestHandler_1.default.mockClear();
                pgPool = new pg_1.Pool();
                schemas = [Symbol('schemas')];
                options = Symbol('options');
                pgClient = { release: jest.fn() };
                pgPool.connect.mockReturnValue(Promise.resolve(pgClient));
                return [4 /*yield*/, postgraphql_1.default(pgPool, schemas, options)];
            case 1:
                _a.sent();
                expect(pgPool.connect.mock.calls).toEqual([[]]);
                expect(createPostGraphQLSchema_1.default.mock.calls).toEqual([[pgClient, schemas, options]]);
                expect(pgClient.release.mock.calls).toEqual([[]]);
                return [2 /*return*/];
        }
    });
}); });
test('will use a connected client from the pool, the default schema, and options to create a GraphQL schema', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgPool, options, pgClient;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                createPostGraphQLSchema_1.default.mockClear();
                createPostGraphQLHttpRequestHandler_1.default.mockClear();
                pgPool = new pg_1.Pool();
                options = Symbol('options');
                pgClient = { release: jest.fn() };
                pgPool.connect.mockReturnValue(Promise.resolve(pgClient));
                return [4 /*yield*/, postgraphql_1.default(pgPool, options)];
            case 1:
                _a.sent();
                expect(pgPool.connect.mock.calls).toEqual([[]]);
                expect(createPostGraphQLSchema_1.default.mock.calls).toEqual([[pgClient, ['public'], options]]);
                expect(pgClient.release.mock.calls).toEqual([[]]);
                return [2 /*return*/];
        }
    });
}); });
test('will use a created GraphQL schema to create the HTTP request handler and pass down options', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgPool, gqlSchema, options, _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                createPostGraphQLHttpRequestHandler_1.default.mockClear();
                pgPool = new pg_1.Pool();
                gqlSchema = Symbol('gqlSchema');
                options = { a: 1, b: 2, c: 3 };
                createPostGraphQLSchema_1.default.mockReturnValueOnce(Promise.resolve(gqlSchema));
                return [4 /*yield*/, postgraphql_1.default(pgPool, [], options)];
            case 1:
                _c.sent();
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls.length).toBe(1);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls[0].length).toBe(1);
                expect(Object.keys(createPostGraphQLHttpRequestHandler_1.default.mock.calls[0][0])).toEqual(['a', 'b', 'c', 'getGqlSchema', 'pgPool', '_emitter']);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls[0][0].pgPool).toBe(pgPool);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls[0][0].a).toBe(options.a);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls[0][0].b).toBe(options.b);
                expect(createPostGraphQLHttpRequestHandler_1.default.mock.calls[0][0].c).toBe(options.c);
                _a = expect;
                return [4 /*yield*/, createPostGraphQLHttpRequestHandler_1.default.mock.calls[0][0].getGqlSchema()];
            case 2:
                _a.apply(void 0, [_c.sent()]).toBe(gqlSchema);
                return [2 /*return*/];
        }
    });
}); });
test('will watch Postgres schemas when `watchPg` is true', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgPool, pgSchemas;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgPool = new pg_1.Pool();
                pgSchemas = [Symbol('a'), Symbol('b'), Symbol('c')];
                return [4 /*yield*/, postgraphql_1.default(pgPool, pgSchemas, { watchPg: false })];
            case 1:
                _a.sent();
                return [4 /*yield*/, postgraphql_1.default(pgPool, pgSchemas, { watchPg: true })];
            case 2:
                _a.sent();
                expect(watchPgSchemas_1.default.mock.calls.length).toBe(1);
                expect(watchPgSchemas_1.default.mock.calls[0].length).toBe(1);
                expect(Object.keys(watchPgSchemas_1.default.mock.calls[0][0])).toEqual(['pgPool', 'pgSchemas', 'onChange']);
                expect(watchPgSchemas_1.default.mock.calls[0][0].pgPool).toBe(pgPool);
                expect(watchPgSchemas_1.default.mock.calls[0][0].pgSchemas).toBe(pgSchemas);
                expect(typeof watchPgSchemas_1.default.mock.calls[0][0].onChange).toBe('function');
                return [2 /*return*/];
        }
    });
}); });
test('will create a new PostGraphQL schema on when `watchPgSchemas` emits a change', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var gqlSchemas, gqlSchemaI, pgPool, pgClient, mockLog, origLog, onChange, getGqlSchema, _a, _b, _c, _d, _e, _f;
    return tslib_1.__generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                watchPgSchemas_1.default.mockClear();
                createPostGraphQLHttpRequestHandler_1.default.mockClear();
                gqlSchemas = [Symbol('a'), Symbol('b'), Symbol('c')];
                gqlSchemaI = 0;
                createPostGraphQLSchema_1.default.mockClear();
                createPostGraphQLSchema_1.default.mockImplementation(function () { return Promise.resolve(gqlSchemas[gqlSchemaI++]); });
                pgPool = new pg_1.Pool();
                pgClient = { release: jest.fn() };
                pgPool.connect.mockReturnValue(Promise.resolve(pgClient));
                mockLog = jest.fn();
                origLog = console.log;
                console.log = mockLog;
                return [4 /*yield*/, postgraphql_1.default(pgPool, [], { watchPg: true })];
            case 1:
                _g.sent();
                onChange = watchPgSchemas_1.default.mock.calls[0][0].onChange;
                getGqlSchema = createPostGraphQLHttpRequestHandler_1.default.mock.calls[0][0].getGqlSchema;
                expect(pgPool.connect.mock.calls).toEqual([[]]);
                expect(pgClient.release.mock.calls).toEqual([[]]);
                _a = expect;
                return [4 /*yield*/, getGqlSchema()];
            case 2:
                _a.apply(void 0, [_g.sent()]).toBe(gqlSchemas[0]);
                onChange({ commands: ['a', 'b', 'c'] });
                _c = expect;
                return [4 /*yield*/, getGqlSchema()];
            case 3:
                _c.apply(void 0, [_g.sent()]).toBe(gqlSchemas[1]);
                onChange({ commands: ['d', 'e'] });
                _e = expect;
                return [4 /*yield*/, getGqlSchema()];
            case 4:
                _e.apply(void 0, [_g.sent()]).toBe(gqlSchemas[2]);
                expect(pgPool.connect.mock.calls).toEqual([[], [], []]);
                expect(pgClient.release.mock.calls).toEqual([[], [], []]);
                expect(mockLog.mock.calls).toEqual([
                    ["Rebuilding PostGraphQL API after Postgres command(s): \uFE0F" + chalk.bold.cyan('a') + ", " + chalk.bold.cyan('b') + ", " + chalk.bold.cyan('c')],
                    ["Rebuilding PostGraphQL API after Postgres command(s): \uFE0F" + chalk.bold.cyan('d') + ", " + chalk.bold.cyan('e')],
                ]);
                console.log = origLog;
                return [2 /*return*/];
        }
    });
}); });
test('will not error if jwtSecret is provided without jwtPgTypeIdentifier', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgPool;
    return tslib_1.__generator(this, function (_a) {
        pgPool = new pg_1.Pool();
        expect(function () { return postgraphql_1.default(pgPool, [], { jwtSecret: 'test' }); }).not.toThrow();
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBocWwtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9fX3Rlc3RzX18vcG9zdGdyYXBocWwtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBaUpBOztBQWpKQSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtBQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUE7QUFDeEQsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBRXBDLHlCQUF5QjtBQUN6Qiw2REFBdUU7QUFDdkUsNkVBQXVFO0FBQ3ZFLG1HQUE2RjtBQUM3RiwwREFBb0Q7QUFDcEQsOENBQXdDO0FBRXhDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUU5Qiw2Q0FBbUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFDLEVBQWdCO1FBQWQsOEJBQVk7SUFBTyxPQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUM7QUFBaEQsQ0FBZ0QsQ0FBQyxDQUFBO0FBQzlILHdCQUFjLENBQUMsa0JBQWtCLENBQUMsY0FBTSxPQUFBLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFBO0FBRTFELElBQUksQ0FBQyx5RUFBeUUsRUFBRTtRQUN4RSxNQUFNOzs7O3lCQUFHLElBQUksU0FBSSxFQUFFO2dCQUN6QixxQkFBTSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxFQUFBOztnQkFBekIsU0FBeUIsQ0FBQTtnQkFDekIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENB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