"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const utils_1 = require('../../postgres/utils');
const httpError = require('http-errors');
const jwt = require('jsonwebtoken');
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
function setupRequestPgClientTransaction(jwtToken, pgClient, { jwtSecret, pgDefaultRole } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // If a JWT token was defined, but a secret was not procided to the server
        // throw a 403 error.
        if (jwtToken && !jwtSecret)
            throw httpError(403, 'Not allowed to provide a JWT token.');
        // Setup our default role. Once we decode our token, the role may change.
        let role = pgDefaultRole;
        let jwtClaims;
        // If we were provided a JWT token, let us try to verify it. If verification
        // fails we want to throw an error.
        if (jwtToken) {
            // Try to run `jwt.verify`. If it fails, capture the error and re-throw it
            // as a 403 error because the token is not trustworthy.
            try {
                jwtClaims = jwt.verify(jwtToken, jwtSecret, { audience: 'postgraphql' });
                // If there is a `role` property in the claims, use that instead of our
                // default role.
                if (jwtClaims.role != null)
                    role = jwtClaims.role;
            }
            catch (error) {
                error.statusCode = 403;
                throw error;
            }
        }
        // Instantiate a map of local settings. This map will be transformed into a
        // Sql query.
        const localSettings = new Map([
            // If the role is not null, we want to set the root `role` setting locally
            // to be our role. The role may only be null if we have no default role.
            role != null ? ['role', role] : null,
            // If we have some JWT claims, we want to set those claims as local
            // settings with the namespace `jwt.claims`.
            ...Object.keys(jwtClaims || {}).map(key => [`jwt.claims.${key}`, jwtClaims[key]]),
        ].filter(Boolean));
        // If there is at least one local setting.
        if (localSettings.size !== 0) {
            // Actually create our query.
            const query = utils_1.sql.compile(utils_1.sql.query `select ${utils_1.sql.join(Array.from(localSettings).map(([key, value]) => 
            // Make sure that the third config is always `true` so that we are only
            // ever setting variables on the transaction.
            utils_1.sql.query `set_config(${utils_1.sql.value(key)}, ${utils_1.sql.value(value)}, true)`), ', ')}`);
            // Execute the query.
            yield pgClient.query(query);
        }
        return role;
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
exports.getJWTToken = getJWTToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBSZXF1ZXN0UGdDbGllbnRUcmFuc2FjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9odHRwL3NldHVwUmVxdWVzdFBnQ2xpZW50VHJhbnNhY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUEsd0JBQW9CLHNCQUVwQixDQUFDLENBRnlDO0FBRTFDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUN4QyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7QUFFbkM7Ozs7OztHQU1HO0FBQ0gsOEVBQThFO0FBQzlFLHdFQUF3RTtBQUN4RSw4RUFBOEU7QUFDOUUsOEVBQThFO0FBQzlFLDREQUE0RDtBQUM1RCx5Q0FBK0QsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFOztRQUVsSCwwRUFBMEU7UUFDMUUscUJBQXFCO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN6QixNQUFNLFNBQVMsQ0FBQyxHQUFHLEVBQUUscUNBQXFDLENBQUMsQ0FBQTtRQUU3RCx5RUFBeUU7UUFDekUsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFBO1FBQ3hCLElBQUksU0FBUyxDQUFBO1FBRWIsNEVBQTRFO1FBQzVFLG1DQUFtQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2IsMEVBQTBFO1lBQzFFLHVEQUF1RDtZQUN2RCxJQUFJLENBQUM7Z0JBQ0gsU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFBO2dCQUV4RSx1RUFBdUU7Z0JBQ3ZFLGdCQUFnQjtnQkFDaEIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElB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