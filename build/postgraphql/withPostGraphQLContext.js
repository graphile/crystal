"use strict";
var tslib_1 = require("tslib");
var createDebugger = require("debug");
var jwt = require("jsonwebtoken");
var utils_1 = require("../postgres/utils");
var pgClientFromContext_1 = require("../postgres/inventory/pgClientFromContext");
/**
 * Creates a PostGraphQL context object which should be passed into a GraphQL
 * execution. This function will also connect a client from a Postgres pool and
 * setup a transaction in that client.
 *
 * This function is intended to wrap a call to GraphQL-js execution like so:
 *
 * ```js
 * const result = await withPostGraphQLContext({
 *   pgPool,
 *   jwtToken,
 *   jwtSecret,
 *   pgDefaultRole,
 * }, async context => {
 *   return await graphql(
 *     schema,
 *     query,
 *     null,
 *     { ...context },
 *     variables,
 *     operationName,
 *   );
 * });
 * ```
 */
function withPostGraphQLContext(_a, callback) {
    var pgPool = _a.pgPool, jwtToken = _a.jwtToken, jwtSecret = _a.jwtSecret, pgDefaultRole = _a.pgDefaultRole;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var pgClient, pgRole, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, pgPool.connect()];
                case 1:
                    pgClient = _b.sent();
                    // Enhance our Postgres client with debugging stuffs.
                    debugPgClient(pgClient);
                    // Begin our transaction and set it up.
                    return [4 /*yield*/, pgClient.query('begin')];
                case 2:
                    // Begin our transaction and set it up.
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, , 6, 8]);
                    return [4 /*yield*/, setupPgClientTransaction({
                            pgClient: pgClient,
                            jwtToken: jwtToken,
                            jwtSecret: jwtSecret,
                            pgDefaultRole: pgDefaultRole,
                        })];
                case 4:
                    pgRole = _b.sent();
                    return [4 /*yield*/, callback((_a = {},
                            _a[pgClientFromContext_1.$$pgClient] = pgClient,
                            _a.pgRole = pgRole,
                            _a))];
                case 5: return [2 /*return*/, _b.sent()];
                case 6: return [4 /*yield*/, pgClient.query('commit')];
                case 7:
                    _b.sent();
                    pgClient.release();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = withPostGraphQLContext;
/**
 * Sets up the Postgres client transaction by decoding the JSON web token and
 * doing some other cool things.
 */
// THIS METHOD SHOULD NEVER RETURN EARLY. If this method returns early then it
// may skip the super important step of setting the role on the Postgres
// client. If this happens it’s a huge security vulnerability. Never using the
// keyword `return` in this function is a good first step. You can still throw
// errors, however, as this will stop the request execution.
function setupPgClientTransaction(_a) {
    var pgClient = _a.pgClient, jwtToken = _a.jwtToken, jwtSecret = _a.jwtSecret, pgDefaultRole = _a.pgDefaultRole;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var role, jwtClaims, roleClaim, localSettings, _i, _a, key, query, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    role = pgDefaultRole;
                    jwtClaims = {};
                    // If we were provided a JWT token, let us try to verify it. If verification
                    // fails we want to throw an error.
                    if (jwtToken) {
                        // Try to run `jwt.verify`. If it fails, capture the error and re-throw it
                        // as a 403 error because the token is not trustworthy.
                        try {
                            // If a JWT token was defined, but a secret was not procided to the server
                            // throw a 403 error.
                            if (typeof jwtSecret !== 'string')
                                throw new Error('Not allowed to provide a JWT token.');
                            jwtClaims = jwt.verify(jwtToken, jwtSecret, { audience: 'postgraphql' });
                            roleClaim = jwtClaims['role'];
                            // If there is a `role` property in the claims, use that instead of our
                            // default role.
                            if (typeof roleClaim !== 'undefined') {
                                if (typeof roleClaim !== 'string')
                                    throw new Error("JWT `role` claim must be a string. Instead found '" + typeof jwtClaims['role'] + "'.");
                                role = roleClaim;
                            }
                        }
                        catch (error) {
                            // In case this error is thrown in an HTTP context, we want to add a 403
                            // status code.
                            error.statusCode = 403;
                            throw error;
                        }
                    }
                    localSettings = new Map();
                    // If there is a rule, we want to set the root `role` setting locally
                    // to be our role. The role may only be null if we have no default role.
                    if (typeof role === 'string') {
                        localSettings.set('role', role);
                    }
                    // If we have some JWT claims, we want to set those claims as local
                    // settings with the namespace `jwt.claims`.
                    for (_i = 0, _a = Object.keys(jwtClaims); _i < _a.length; _i++) {
                        key = _a[_i];
                        localSettings.set("jwt.claims." + key, jwtClaims[key]);
                    }
                    if (!(localSettings.size !== 0)) return [3 /*break*/, 2];
                    query = utils_1.sql.compile((_b = ["select ", ""], _b.raw = ["select ",
                        ""], utils_1.sql.query(_b, utils_1.sql.join(Array.from(localSettings).map(function (_a) {
                        var key = _a[0], value = _a[1];
                        // Make sure that the third config is always `true` so that we are only
                        // ever setting variables on the transaction.
                        return (_b = ["set_config(", ", ", ", true)"], _b.raw = ["set_config(", ", ", ", true)"], utils_1.sql.query(_b, utils_1.sql.value(key), utils_1.sql.value(value)));
                        var _b;
                    }), ', '))));
                    // Execute the query.
                    return [4 /*yield*/, pgClient.query(query)];
                case 1:
                    // Execute the query.
                    _c.sent();
                    _c.label = 2;
                case 2: return [2 /*return*/, role];
            }
        });
    });
}
var $$pgClientOrigQuery = Symbol();
var debugPg = createDebugger('postgraphql:postgres');
var debugPgError = createDebugger('postgraphql:postgres:error');
var debugPgExplain = createDebugger('postgraphql:postgres:explain');
/**
 * Adds debug logging funcionality to a Postgres client.
 *
 * @private
 */
// tslint:disable no-any
function debugPgClient(pgClient) {
    // If Postgres debugging is enabled, enhance our query function by adding
    // a debug statement.
    if (debugPg.enabled || debugPgExplain.enabled) {
        // Set the original query method to a key on our client. If that key is
        // already set, use that.
        pgClient[$$pgClientOrigQuery] = pgClient[$$pgClientOrigQuery] || pgClient.query;
        // tslint:disable-next-line only-arrow-functions
        pgClient.query = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Debug just the query text. We don’t want to debug variables because
            // there may be passwords in there.
            debugPg(args[0] && args[0].text ? args[0].text : args[0]);
            // tslint:disable-next-line no-invalid-this
            var promiseResult = pgClient[$$pgClientOrigQuery].apply(this, args);
            // Report the error with our Postgres debugger.
            promiseResult.catch(function (error) { return debugPgError(error); });
            // Call the original query method.
            return promiseResult.then(function (result) {
                // If we have enabled our explain debugger, we will log the
                // explanation for any query that we get. This does mean making a
                // Sql query though. We only want this to run if the query we are
                // explaining was successful and it was a command we can explain.
                if (debugPgExplain.enabled && ['SELECT'].indexOf(result.command) !== -1) {
                    pgClient[$$pgClientOrigQuery]
                        .call(_this, {
                        text: "explain analyze " + (args[0] && args[0].text ? args[0].text : args[0]),
                        values: args[0] && args[0].values ? args[0].values : args[1] || [],
                    })
                        .then(function (explainResult) {
                        return debugPgExplain("\n" + explainResult.rows.map(function (row) { return row['QUERY PLAN']; }).join('\n'));
                    })
                        .catch(function (error) {
                        return debugPgExplain(error);
                    });
                }
                return result;
            });
        };
    }
    return pgClient;
}
exports.debugPgClient = debugPgClient;
// tslint:enable no-any
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aFBvc3RHcmFwaFFMQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wb3N0Z3JhcGhxbC93aXRoUG9zdEdyYXBoUUxDb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXdDO0FBQ3hDLGtDQUFvQztBQUdwQywyQ0FBdUM7QUFDdkMsaUZBQXNFO0FBRXRFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFDSCxnQ0FDRSxFQVVDLEVBQ0QsUUFBc0Q7UUFWcEQsa0JBQU0sRUFDTixzQkFBUSxFQUNSLHdCQUFTLEVBQ1QsZ0NBQWE7Ozs7O3dCQVVFLHFCQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBQTs7K0JBQXRCLFNBQXNCO29CQUV2QyxxREFBcUQ7b0JBQ3JELGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtvQkFFdkIsdUNBQXVDO29CQUN2QyxxQkFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFBOztvQkFEN0IsdUNBQXVDO29CQUN2QyxTQUE2QixDQUFBOzs7O29CQUlaLHFCQUFNLHdCQUF3QixDQUFDOzRCQUM1QyxRQUFRLFVBQUE7NEJBQ1IsUUFBUSxVQUFBOzRCQUNSLFNBQVMsV0FBQTs0QkFDVCxhQUFhLGVBQUE7eUJBQ2QsQ0FBQyxFQUFBOzs2QkFMYSxTQUtiO29CQUVLLHFCQUFNLFFBQVE7NEJBQ25CLEdBQUMsZ0NBQVUsSUFBRyxRQUFROzRCQUN0QixrQkFBTTtnQ0FDTixFQUFBO3dCQUhGLHNCQUFPLFNBR0wsRUFBQTt3QkFLRixxQkFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFBOztvQkFBOUIsU0FBOEIsQ0FBQTtvQkFDOUIsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBOzs7Ozs7Q0FFckI7O0FBM0NELHlDQTJDQztBQUVEOzs7R0FHRztBQUNILDhFQUE4RTtBQUM5RSx3RUFBd0U7QUFDeEUsOEVBQThFO0FBQzlFLDhFQUE4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