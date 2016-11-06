"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
jest.useFakeTimers();
const watchPgSchemas_1 = require('../watchPgSchemas');
const chalk = require('chalk');
test('will connect a client from the provided pool, run some SQL, and listen for notifications', () => __awaiter(this, void 0, void 0, function* () {
    const pgClient = { query: jest.fn(() => Promise.resolve()), on: jest.fn() };
    const pgPool = { connect: jest.fn(() => Promise.resolve(pgClient)) };
    yield watchPgSchemas_1.default({ pgPool });
    expect(pgPool.connect.mock.calls).toEqual([[]]);
    expect(pgClient.query.mock.calls).toEqual([[yield watchPgSchemas_1._watchFixturesQuery], ['listen postgraphql_watch']]);
    expect(pgClient.on.mock.calls.length).toBe(1);
    expect(pgClient.on.mock.calls[0].length).toBe(2);
    expect(pgClient.on.mock.calls[0][0]).toBe('notification');
    expect(typeof pgClient.on.mock.calls[0][1]).toBe('function');
}));
test('will log some stuff and continue if the watch fixtures query fails', () => __awaiter(this, void 0, void 0, function* () {
    const pgClient = {
        query: jest.fn((query) => __awaiter(this, void 0, void 0, function* () {
            if (query === (yield watchPgSchemas_1._watchFixturesQuery))
                throw new Error('oops!');
        })),
        on: jest.fn(),
    };
    const pgPool = {
        connect: jest.fn(() => Promise.resolve(pgClient)),
    };
    const mockWarn = jest.fn();
    const origWarn = console.warn;
    console.warn = mockWarn;
    yield watchPgSchemas_1.default({ pgPool });
    console.warn = origWarn;
    expect(pgPool.connect.mock.calls).toEqual([[]]);
    expect(pgClient.query.mock.calls).toEqual([[yield watchPgSchemas_1._watchFixturesQuery], ['listen postgraphql_watch']]);
    expect(pgClient.on.mock.calls.length).toBe(1);
    expect(pgClient.on.mock.calls[0].length).toBe(2);
    expect(pgClient.on.mock.calls[0][0]).toBe('notification');
    expect(typeof pgClient.on.mock.calls[0][1]).toBe('function');
    expect(mockWarn.mock.calls).toEqual([
        [chalk.bold.yellow('Failed to setup watch fixtures in Postgres database') + ' ️️⚠️'],
        [chalk.yellow('This is likely because your Postgres user is not a superuser. If the')],
        [chalk.yellow('fixtures already exist, the watch functionality may still work.')],
    ]);
}));
test('will call `onChange` with the appropriate commands from the notification listener', () => __awaiter(this, void 0, void 0, function* () {
    const onChange = jest.fn();
    let notificationListener;
    const pgClient = { query: jest.fn(), on: jest.fn((event, listener) => notificationListener = listener) };
    const pgPool = { connect: jest.fn(() => pgClient) };
    yield watchPgSchemas_1.default({ pgPool, pgSchemas: ['a', 'b'], onChange });
    const notifications = [
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
    notifications.forEach(notification => notificationListener(notification));
    jest.runAllTimers();
    expect(onChange.mock.calls).toEqual([[{ commands: ['1', '2', '3', '4', '6', '8'] }]]);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hQZ1NjaGVtYXMtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC93YXRjaC9fX3Rlc3RzX18vd2F0Y2hQZ1NjaGVtYXMtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7QUFFcEIsaUNBQW9ELG1CQUVwRCxDQUFDLENBRnNFO0FBRXZFLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUU5QixJQUFJLENBQUMsMEZBQTBGLEVBQUU7SUFDL0YsTUFBTSxRQUFRLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQTtJQUMzRSxNQUFNLE1BQU0sR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUE7SUFDcEUsTUFBTSx3QkFBYyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUMvQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLG9DQUFtQixDQUFDLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN0RyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUks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