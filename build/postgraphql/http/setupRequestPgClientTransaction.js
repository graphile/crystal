"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const setupPgClientTransaction_1 = require('../setupPgClientTransaction');
const httpError = require('http-errors');
/**
 * Sets up the Postgres client transaction by decoding the JSON web token and
 * doing some other cool things.
 *
 * @param {IncomingMessage} request
 * @param {Client} pgClient
 */
// THIS METHOD SHOULD NEVER RETURN EARLY. If this method returns early then it
// may skip the super important step of setting the role on the Postgres
// client. If this happens it’s a huge security vulnerability. Never using the
// keyword `return` in this function is a good first step. You can still throw
// errors, however, as this will stop the request execution.
function setupRequestPgClientTransaction(request, pgClient, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the JWT token string from our request.
        const jwtToken = getJWTToken(request);
        // Pass it onto the core logic
        return yield setupPgClientTransaction_1.default(jwtToken, pgClient, options);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupRequestPgClientTransaction;
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
const authorizationBearerRex = /^\s*bearer\s+([a-z0-9\-._~+/]+=*)\s*$/i;
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
function getJWTToken(request) {
    const { authorization } = request.headers;
    // If there was no authorization header, just return null.
    if (authorization == null)
        return null;
    const match = authorizationBearerRex.exec(authorization);
    // If we did not match the authorization header with our expected format,
    // throw a 400 error.
    if (!match)
        throw httpError(400, 'Authorization header is not of the correct bearer scheme format.');
    // Return the token from our match.
    return match[1];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBSZXF1ZXN0UGdDbGllbnRUcmFuc2FjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9odHRwL3NldHVwUmVxdWVzdFBnQ2xpZW50VHJhbnNhY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUEsMkNBQXFDLDZCQUVyQyxDQUFDLENBRmlFO0FBRWxFLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUV4Qzs7Ozs7O0dBTUc7QUFDSCw4RUFBOEU7QUFDOUUsd0VBQXdFO0FBQ3hFLDhFQUE4RTtBQUM5RSw4RUFBOEU7QUFDOUUsNERBQTREO0FBQzVELHlDQUErRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sR0FBRyxFQUFFOztRQUM1Riw2Q0FBNkM7UUFDN0MsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3JDLDhCQUE4QjtRQUM5QixNQUFNLENBQUMsTUFBTSxrQ0FBd0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3BFLENBQUM7O0FBTEQ7aURBS0MsQ0FBQTtBQUVEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLHNCQUFzQixHQUFHLHdDQUF3QyxDQUFBO0FBRXZFOzs7Ozs7Ozs7R0FTRztBQUNILHFCQUFzQixPQUFPO0lBQzNCLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFBO0lBRXpDLDBEQUEwRDtJQUMxRCxFQUFFLENBQUMsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFFYixNQUFNLEtBQUssR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7SUFFeEQseUVBQXlFO0lBQ3pFLHFCQUFxQjtJQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNULE1BQU0sU0FBUyxDQUFDLEdBQUcsRUFBRSxrRUFBa0UsQ0FBQyxDQUFBO0lBRTFGLG1DQUFtQztJQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pCLENBQUMifQ==