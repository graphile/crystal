// tslint:disable no-empty
"use strict";
var _this = this;
var tslib_1 = require("tslib");
var pgClientFromContext_1 = require("../../postgres/inventory/pgClientFromContext");
var withPostGraphQLContext_1 = require("../withPostGraphQLContext");
var jwt = require('jsonwebtoken');
/**
 * Expects an Http error. Passes if there is an error of the correct form,
 * fails if there is not.
 */
function expectHttpError(promise, statusCode, message) {
    return promise.then(function () { throw new Error('Expected a Http error.'); }, function (error) {
        expect(error.statusCode).toBe(statusCode);
        expect(error.message).toBe(message);
    });
}
test('will be a noop for no token, secret, or default role', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, withPostGraphQLContext_1.default({ pgPool: pgPool }, function () { })];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will pass in a context object with the client', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, withPostGraphQLContext_1.default({ pgPool: pgPool }, function (client) {
                        expect(client[pgClientFromContext_1.$$pgClient]).toBe(pgClient);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('will record queries run inside the transaction', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var query1, query2, pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query1 = Symbol();
                query2 = Symbol();
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, withPostGraphQLContext_1.default({ pgPool: pgPool }, function (client) {
                        client[pgClientFromContext_1.$$pgClient].query(query1);
                        client[pgClientFromContext_1.$$pgClient].query(query2);
                    })];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], [query1], [query2], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will return the value from the callback', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var value, pgClient, pgPool, _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                value = Symbol();
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                _a = expect;
                return [4 /*yield*/, withPostGraphQLContext_1.default({ pgPool: pgPool }, function () { return value; })];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBe(value);
                return [2 /*return*/];
        }
    });
}); });
test('will return the asynchronous value from the callback', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var value, pgClient, pgPool, _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                value = Symbol();
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                _a = expect;
                return [4 /*yield*/, withPostGraphQLContext_1.default({ pgPool: pgPool }, function () { return Promise.resolve(value); })];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBe(value);
                return [2 /*return*/];
        }
    });
}); });
test('will throw an error if there was a `jwtToken`, but no `jwtSecret`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, expectHttpError(withPostGraphQLContext_1.default({ pgPool: pgPool, jwtToken: 'asd' }, function () { }), 403, 'Not allowed to provide a JWT token.')];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will throw an error for a malformed `jwtToken`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, expectHttpError(withPostGraphQLContext_1.default({ pgPool: pgPool, jwtToken: 'asd', jwtSecret: 'secret' }, function () { }), 403, 'jwt malformed')];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will throw an error if the JWT token was signed with the wrong signature', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, expectHttpError(withPostGraphQLContext_1.default({
                        pgPool: pgPool,
                        jwtToken: jwt.sign({ a: 1, b: 2, c: 3 }, 'wrong secret', { noTimestamp: true }),
                        jwtSecret: 'secret',
                    }, function () { }), 403, 'invalid signature')];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will throw an error if the JWT token does not have an audience', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, expectHttpError(withPostGraphQLContext_1.default({
                        pgPool: pgPool,
                        jwtToken: jwt.sign({ a: 1, b: 2, c: 3 }, 'secret', { noTimestamp: true }),
                        jwtSecret: 'secret',
                    }, function () { }), 403, 'jwt audience invalid. expected: postgraphql')];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will throw an error if the JWT token does not have an appropriate audience', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, expectHttpError(withPostGraphQLContext_1.default({
                        pgPool: pgPool,
                        jwtToken: jwt.sign({ a: 1, b: 2, c: 3, aud: 'postgrest' }, 'secret', { noTimestamp: true }),
                        jwtSecret: 'secret',
                    }, function () { }), 403, 'jwt audience invalid. expected: postgraphql')];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will succeed with all the correct thigns', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, withPostGraphQLContext_1.default({
                        pgPool: pgPool,
                        jwtToken: jwt.sign({ aud: 'postgraphql' }, 'secret', { noTimestamp: true }),
                        jwtSecret: 'secret',
                    }, function () { })];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], [{
                            text: 'select set_config($1, $2, true)',
                            values: ['jwt.claims.aud', 'postgraphql'],
                        }], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will add extra claims as available', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, withPostGraphQLContext_1.default({
                        pgPool: pgPool,
                        jwtToken: jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3 }, 'secret', { noTimestamp: true }),
                        jwtSecret: 'secret',
                    }, function () { })];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], [{
                            text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true)',
                            values: [
                                'jwt.claims.aud', 'postgraphql',
                                'jwt.claims.a', 1,
                                'jwt.claims.b', 2,
                                'jwt.claims.c', 3,
                            ],
                        }], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will set the default role if available', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, withPostGraphQLContext_1.default({
                        pgPool: pgPool,
                        jwtSecret: 'secret',
                        pgDefaultRole: 'test_default_role',
                    }, function () { })];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], [{
                            text: 'select set_config($1, $2, true)',
                            values: ['role', 'test_default_role'],
                        }], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will set the default role if no other role was provided in the JWT', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, withPostGraphQLContext_1.default({
                        pgPool: pgPool,
                        jwtToken: jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3 }, 'secret', { noTimestamp: true }),
                        jwtSecret: 'secret',
                        pgDefaultRole: 'test_default_role',
                    }, function () { })];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], [{
                            text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true)',
                            values: [
                                'role', 'test_default_role',
                                'jwt.claims.aud', 'postgraphql',
                                'jwt.claims.a', 1,
                                'jwt.claims.b', 2,
                                'jwt.claims.c', 3,
                            ],
                        }], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will set a role provided in the JWT', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, withPostGraphQLContext_1.default({
                        pgPool: pgPool,
                        jwtToken: jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3, role: 'test_jwt_role' }, 'secret', { noTimestamp: true }),
                        jwtSecret: 'secret',
                    }, function () { })];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], [{
                            text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true)',
                            values: [
                                'role', 'test_jwt_role',
                                'jwt.claims.aud', 'postgraphql',
                                'jwt.claims.a', 1,
                                'jwt.claims.b', 2,
                                'jwt.claims.c', 3,
                                'jwt.claims.role', 'test_jwt_role',
                            ],
                        }], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
test('will set a role provided in the JWT superceding the default role', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pgClient = { query: jest.fn(), release: jest.fn() };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, withPostGraphQLContext_1.default({
                        pgPool: pgPool,
                        jwtToken: jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3, role: 'test_jwt_role' }, 'secret', { noTimestamp: true }),
                        jwtSecret: 'secret',
                        pgDefaultRole: 'test_default_role',
                    }, function () { })];
            case 1:
                _a.sent();
                expect(pgClient.query.mock.calls).toEqual([['begin'], [{
                            text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true)',
                            values: [
                                'role', 'test_jwt_role',
                                'jwt.claims.aud', 'postgraphql',
                                'jwt.claims.a', 1,
                                'jwt.claims.b', 2,
                                'jwt.claims.c', 3,
                                'jwt.claims.role', 'test_jwt_role',
                            ],
                        }], ['commit']]);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aFBvc3RHcmFwaFFMQ29udGV4dC10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL19fdGVzdHNfXy93aXRoUG9zdEdyYXBoUUxDb250ZXh0LXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEJBQTBCOztBQUUxQixpQkF5TkE7O0FBek5BLG9GQUF5RTtBQUN6RSxvRUFBOEQ7QUFFOUQsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBRW5DOzs7R0FHRztBQUNILHlCQUEwQixPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU87SUFDcEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2pCLGNBQVEsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBLENBQUMsQ0FBQyxFQUNuRCxVQUFBLEtBQUs7UUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNyQyxDQUFDLENBQ0YsQ0FBQTtBQUNILENBQUM7QUFFRCxJQUFJLENBQUMsc0RBQXNELEVBQUU7UUFDckQsUUFBUSxFQUNSLE1BQU07Ozs7MkJBREssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUU7eUJBQzFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBTSxPQUFBLFFBQVEsRUFBUixDQUFRLENBQUMsRUFBRTtnQkFDbkQscUJBQU0sZ0NBQXNCLENBQUMsRUFBRSxNQUFNLFFBQUEsRUFBRSxFQUFFLGNBQU8sQ0FBQyxDQUFDLEVBQUE7O2dCQUFsRCxTQUFrRCxDQUFBO2dCQUNsRCxNQUFNLENB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