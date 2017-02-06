"use strict";
var _this = this;
var tslib_1 = require("tslib");
jest.useFakeTimers();
var watchPgSchemas_1 = require("../watchPgSchemas");
var chalk = require('chalk');
test('will connect a client from the provided pool, run some SQL, and listen for notifications', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgClient, pgPool, _a, _b, _c, _d, _e;
    return tslib_1.__generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                pgClient = { query: jest.fn(function () { return Promise.resolve(); }), on: jest.fn() };
                pgPool = { connect: jest.fn(function () { return Promise.resolve(pgClient); }) };
                return [4 /*yield*/, watchPgSchemas_1.default({ pgPool: pgPool })];
            case 1:
                _f.sent();
                expect(pgPool.connect.mock.calls).toEqual([[]]);
                _b = (_a = expect(pgClient.query.mock.calls)).toEqual;
                return [4 /*yield*/, watchPgSchemas_1._watchFixturesQuery];
            case 2:
                _b.apply(_a, [[[_f.sent()], ['listen postgraphql_watch']]]);
                expect(pgClient.on.mock.calls.length).toBe(1);
                expect(pgClient.on.mock.calls[0].length).toBe(2);
                expect(pgClient.on.mock.calls[0][0]).toBe('notification');
                expect(typeof pgClient.on.mock.calls[0][1]).toBe('function');
                return [2 /*return*/];
        }
    });
}); });
test('will log some stuff and continue if the watch fixtures query fails', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var pgClient, pgPool, mockWarn, origWarn, _a, _b, _c, _d, _e;
    return tslib_1.__generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                pgClient = {
                    query: jest.fn(function (query) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return tslib_1.__generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = query;
                                    return [4 /*yield*/, watchPgSchemas_1._watchFixturesQuery];
                                case 1:
                                    if (_a === (_b.sent()))
                                        throw new Error('oops!');
                                    return [2 /*return*/];
                            }
                        });
                    }); }),
                    on: jest.fn(),
                };
                pgPool = {
                    connect: jest.fn(function () { return Promise.resolve(pgClient); }),
                };
                mockWarn = jest.fn();
                origWarn = console.warn;
                console.warn = mockWarn;
                return [4 /*yield*/, watchPgSchemas_1.default({ pgPool: pgPool })];
            case 1:
                _f.sent();
                console.warn = origWarn;
                expect(pgPool.connect.mock.calls).toEqual([[]]);
                _b = (_a = expect(pgClient.query.mock.calls)).toEqual;
                return [4 /*yield*/, watchPgSchemas_1._watchFixturesQuery];
            case 2:
                _b.apply(_a, [[[_f.sent()], ['listen postgraphql_watch']]]);
                expect(pgClient.on.mock.calls.length).toBe(1);
                expect(pgClient.on.mock.calls[0].length).toBe(2);
                expect(pgClient.on.mock.calls[0][0]).toBe('notification');
                expect(typeof pgClient.on.mock.calls[0][1]).toBe('function');
                expect(mockWarn.mock.calls).toEqual([
                    [chalk.bold.yellow('Failed to setup watch fixtures in Postgres database') + ' ️️⚠️'],
                    [chalk.yellow('This is likely because your Postgres user is not a superuser. If the')],
                    [chalk.yellow('fixtures already exist, the watch functionality may still work.')],
                ]);
                return [2 /*return*/];
        }
    });
}); });
test('will call `onChange` with the appropriate commands from the notification listener', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var onChange, notificationListener, pgClient, pgPool, notifications;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                onChange = jest.fn();
                pgClient = { query: jest.fn(), on: jest.fn(function (event, listener) { return notificationListener = listener; }) };
                pgPool = { connect: jest.fn(function () { return pgClient; }) };
                return [4 /*yield*/, watchPgSchemas_1.default({ pgPool: pgPool, pgSchemas: ['a', 'b'], onChange: onChange })];
            case 1:
                _a.sent();
                notifications = [
                    {},
                    { payload: '' },
                    { channel: 'postgraphql_watch' },
                    { channel: 'unknown_channel', payload: 'error!' },
                    { channel: 'postgraphql_watch', payload: '' },
                    { channel: 'postgraphql_watch', payload: JSON.stringify([{ schema: 'a', command: '1' }]) },
                    { channel: 'postgraphql_watch', payload: JSON.stringify([{ schema: 'b', command: '2' }]) },
                    { channel: 'postgraphql_watch', payload: JSON.stringify([{ schema: 'a', command: '3' }, { schema: 'b', command: '4' }]) },
                    { channel: 'postgraphql_watch', payload: JSON.stringify([{ schema: 'c', command: '5' }]) },
                    { channel: 'postgraphql_watch', payload: JSON.stringify([{ schema: 'a', command: '6' }, { schema: 'c', command: '7' }, { schema: 'b', command: '8' }]) },
                ];
                notifications.forEach(function (notification) { return notificationListener(notification); });
                jest.runAllTimers();
                expect(onChange.mock.calls).toEqual([[{ commands: ['1', '2', '3', '4', '6', '8'] }]]);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hQZ1NjaGVtYXMtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC93YXRjaC9fX3Rlc3RzX18vd2F0Y2hQZ1NjaGVtYXMtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBcUVBOztBQXJFQSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7QUFFcEIsb0RBQXVFO0FBRXZFLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUU5QixJQUFJLENBQUMsMEZBQTBGLEVBQUU7UUFDekYsUUFBUSxFQUNSLE1BQU07Ozs7MkJBREssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFNLE9BQUEsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFqQixDQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRTt5QkFDNUQsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFNLE9BQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxFQUFFO2dCQUNwRSxxQkFBTSx3QkFBYyxDQUFDLEVBQUUsTUFBTSxRQUFBLEVBQUUsQ0FBQyxFQUFBOztnQkFBaEMsU0FBZ0MsQ0FBQTtnQkFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQy9DLEtBQUEsQ0FBQSxLQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDLE9BQU8sQ0FBQTtnQkFBRyxxQkFBTSxvQ0FBbUIsRUFBQTs7Z0JBQXJFLGdCQUE0QyxTQUF5QixHQUFHLENBQUMsMEJBQTBCLENBQUMsR0FBRSxDQUFBO2dCQUN0RyxN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