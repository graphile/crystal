"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const setupRequestPgClientTransaction_1 = require('../setupRequestPgClientTransaction');
const jwt = require('jsonwebtoken');
/**
 * Expects an Http error. Passes if there is an error of the correct form,
 * fails if there is not.
 */
function expectHttpError(promise, statusCode, message) {
    return promise.then(() => { throw new Error('Expected a Http error.'); }, error => {
        expect(error.statusCode).toBe(statusCode);
        expect(error.message).toBe(message);
    });
}
test('will be a noop for no token, secret, or default role', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: {} };
    const pgClient = { query: jest.fn() };
    yield setupRequestPgClientTransaction_1.default(request, pgClient);
    expect(pgClient.query.mock.calls).toEqual([]);
}));
test('will throw an error for poorly formed authorization headers', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: 'asd' } };
    const pgClient = { query: jest.fn() };
    yield expectHttpError(setupRequestPgClientTransaction_1.default(request, pgClient), 400, 'Authorization header is not of the correct bearer scheme format.');
    expect(pgClient.query.mock.calls).toEqual([]);
}));
test('will throw an error if a correct authorization header was provided, but there was no secret', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: 'Bearer asd' } };
    const pgClient = { query: jest.fn() };
    yield expectHttpError(setupRequestPgClientTransaction_1.default(request, pgClient), 403, 'Not allowed to provide a JWT token.');
    expect(pgClient.query.mock.calls).toEqual([]);
}));
test('will throw an error if authorization header does not provide a JWT token', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: 'Bearer asd' } };
    const pgClient = { query: jest.fn() };
    yield expectHttpError(setupRequestPgClientTransaction_1.default(request, pgClient, { jwtSecret: 'secret' }), 403, 'jwt malformed');
    expect(pgClient.query.mock.calls).toEqual([]);
}));
test('will throw an error if JWT token was signed with the wrong signature', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: `Bearer ${jwt.sign({ a: 1, b: 2, c: 3 }, 'wrong secret', { noTimestamp: true })}` } };
    const pgClient = { query: jest.fn() };
    yield expectHttpError(setupRequestPgClientTransaction_1.default(request, pgClient, { jwtSecret: 'secret' }), 403, 'invalid signature');
    expect(pgClient.query.mock.calls).toEqual([]);
}));
test('will throw an error if the JWT token does not an audience', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: `Bearer ${jwt.sign({}, 'secret', { noTimestamp: true })}` } };
    const pgClient = { query: jest.fn() };
    yield expectHttpError(setupRequestPgClientTransaction_1.default(request, pgClient, { jwtSecret: 'secret' }), 403, 'jwt audience invalid. expected: postgraphql');
    expect(pgClient.query.mock.calls).toEqual([]);
}));
test('will throw an error if the JWT token does not have the correct audience', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgrest' }, 'secret', { noTimestamp: true })}` } };
    const pgClient = { query: jest.fn() };
    yield expectHttpError(setupRequestPgClientTransaction_1.default(request, pgClient, { jwtSecret: 'secret' }), 403, 'jwt audience invalid. expected: postgraphql');
    expect(pgClient.query.mock.calls).toEqual([]);
}));
test('will succeed with all the correct things', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgraphql' }, 'secret', { noTimestamp: true })}` } };
    const pgClient = { query: jest.fn() };
    yield setupRequestPgClientTransaction_1.default(request, pgClient, { jwtSecret: 'secret' });
    expect(pgClient.query.mock.calls).toEqual([[{
                text: 'select set_config($1, $2, true)',
                values: ['jwt.claims.aud', 'postgraphql'],
            }]]);
}));
test('will add extra claims as available', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3 }, 'secret', { noTimestamp: true })}` } };
    const pgClient = { query: jest.fn() };
    yield setupRequestPgClientTransaction_1.default(request, pgClient, { jwtSecret: 'secret' });
    expect(pgClient.query.mock.calls).toEqual([[{
                text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true)',
                values: [
                    'jwt.claims.aud', 'postgraphql',
                    'jwt.claims.a', 1,
                    'jwt.claims.b', 2,
                    'jwt.claims.c', 3,
                ],
            }]]);
}));
test('will set the default role if available', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: {} };
    const pgClient = { query: jest.fn() };
    yield setupRequestPgClientTransaction_1.default(request, pgClient, { pgDefaultRole: 'test_default_role' });
    expect(pgClient.query.mock.calls).toEqual([[{
                text: 'select set_config($1, $2, true)',
                values: ['role', 'test_default_role'],
            }]]);
}));
test('will set the default role if not role was provided in the JWT', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgraphql', a: 1, b: 2, c: 3 }, 'secret', { noTimestamp: true })}` } };
    const pgClient = { query: jest.fn() };
    yield setupRequestPgClientTransaction_1.default(request, pgClient, { jwtSecret: 'secret', pgDefaultRole: 'test_default_role' });
    expect(pgClient.query.mock.calls).toEqual([[{
                text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true)',
                values: [
                    'role', 'test_default_role',
                    'jwt.claims.aud', 'postgraphql',
                    'jwt.claims.a', 1,
                    'jwt.claims.b', 2,
                    'jwt.claims.c', 3,
                ],
            }]]);
}));
test('will set a role provided in the JWT', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgraphql', role: 'test_jwt_role' }, 'secret', { noTimestamp: true })}` } };
    const pgClient = { query: jest.fn() };
    yield setupRequestPgClientTransaction_1.default(request, pgClient, { jwtSecret: 'secret' });
    expect(pgClient.query.mock.calls).toEqual([[{
                text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true)',
                values: [
                    'role', 'test_jwt_role',
                    'jwt.claims.aud', 'postgraphql',
                    'jwt.claims.role', 'test_jwt_role',
                ],
            }]]);
}));
test('will set a role provided in the JWT superceding the default role', () => __awaiter(this, void 0, void 0, function* () {
    const request = { headers: { authorization: `Bearer ${jwt.sign({ aud: 'postgraphql', role: 'test_jwt_role' }, 'secret', { noTimestamp: true })}` } };
    const pgClient = { query: jest.fn() };
    yield setupRequestPgClientTransaction_1.default(request, pgClient, { jwtSecret: 'secret', pgDefaultRole: 'test_default_role' });
    expect(pgClient.query.mock.calls).toEqual([[{
                text: 'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true)',
                values: [
                    'role', 'test_jwt_role',
                    'jwt.claims.aud', 'postgraphql',
                    'jwt.claims.role', 'test_jwt_role',
                ],
            }]]);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBSZXF1ZXN0UGdDbGllbnRUcmFuc2FjdGlvbi10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL2h0dHAvX190ZXN0c19fL3NldHVwUmVxdWVzdFBnQ2xpZW50VHJhbnNhY3Rpb24tdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSxrREFBNEMsb0NBRTVDLENBQUMsQ0FGK0U7QUFFaEYsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBRW5DOzs7R0FHRztBQUNILHlCQUEwQixPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU87SUFDcEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2pCLFFBQVEsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBLENBQUMsQ0FBQyxFQUNuRCxLQUFLO1FBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDckMsQ0FBQyxDQUNGLENBQUE7QUFDSCxDQUFDO0FBRUQsSUFBSSxDQUFDLHNEQUFzRCxFQUFFO0lBQzNELE1BQU0sT0FBTyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFBO0lBQy9CLE1BQU0sUUFBUSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFBO0lBQ3JDLE1BQU0seUNBQStCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ3hELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDL0MsQ0FBQyxDQUFBLENBQUMsQ0FBQTtB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