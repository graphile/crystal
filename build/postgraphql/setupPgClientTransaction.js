"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const utils_1 = require('../postgres/utils');
const httpError = require('http-errors');
const jwt = require('jsonwebtoken');
/**
 * Sets up the Postgres client transaction by decoding the JSON web token and
 * doing some other cool things.
 *
 * @param {string | undefined} jwtToken
 * @param {Client} pgClient
 */
// THIS METHOD SHOULD NEVER RETURN EARLY. If this method returns early then it
// may skip the super important step of setting the role on the Postgres
// client. If this happens it’s a huge security vulnerability. Never using the
// keyword `return` in this function is a good first step. You can still throw
// errors, however, as this will stop the request execution.
function setupPgClientTransaction(jwtToken, pgClient, { jwtSecret, pgDefaultRole } = {}) {
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
exports.default = setupPgClientTransaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBQZ0NsaWVudFRyYW5zYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Bvc3RncmFwaHFsL3NldHVwUGdDbGllbnRUcmFuc2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSx3QkFBb0IsbUJBRXBCLENBQUMsQ0FGc0M7QUFFdkMsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3hDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUVuQzs7Ozs7O0dBTUc7QUFDSCw4RUFBOEU7QUFDOUUsd0VBQXdFO0FBQ3hFLDhFQUE4RTtBQUM5RSw4RUFBOEU7QUFDOUUsNERBQTREO0FBQzVELGtDQUF3RCxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUU7O1FBQzNHLDBFQUEwRTtRQUMxRSxxQkFBcUI7UUFDckIsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3pCLE1BQU0sU0FBUyxDQUFDLEdBQUcsRUFBRSxxQ0FBcUMsQ0FBQyxDQUFBO1FBRTdELHlFQUF5RTtRQUN6RSxJQUFJLElBQUksR0FBRyxhQUFhLENBQUE7UUFDeEIsSUFBSSxTQUFTLENBQUE7UUFFYiw0RUFBNEU7UUFDNUUsbUNBQW1DO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDYiwwRUFBMEU7WUFDMUUsdURBQXVEO1lBQ3ZELElBQUksQ0FBQztnQkFDSCxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUE7Z0JBRXhFLHVFQUF1RTtnQkFDdkUsZ0JBQWdCO2dCQUNoQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztvQkFDekIsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUE7WUFDekIsQ0FDQTtZQUFBLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUE7Z0JBQ3RCLE1BQU0sS0FBSyxDQUFBO1lBQ2IsQ0FBQztRQUNILENBQUM7UUFFRCwyRUFBMkU7UUFDM0UsYUFBYTtRQUNiLE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDO1lBQzVCLDBFQUEwRTtZQUMxRSx3RUFBd0U7WUFDeEUsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJO1lBRXBDLG1FQUFtRTtZQUNuRSw0Q0FBNEM7WUFDNUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNsRixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBRWxCLDBDQUEwQztRQUMxQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsNkJBQTZCO1lBQzdCLE1BQU0sS0FBSyxHQUFHLFdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBRyxDQUFDLEtBQUssQ0FBQSxVQUFVLFdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUM7WUFDL0YsdUVBQXVFO1lBQ3ZFLDZDQUE2QztZQUM3QyxXQUFHLENBQUMsS0FBSyxDQUFBLGNBQWMsV0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxXQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQ3BFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBRVgscUJBQXFCO1lBQ3JCLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM3QixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNiLENBQUM7O0FBdkREOzBDQXVEQyxDQUFBIn0=