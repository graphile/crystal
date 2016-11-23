import { IncomingMessage } from 'http'
import { Client } from 'pg'
import { sql } from '../../postgres/utils'

const httpError = require('http-errors')
const jwt = require('jsonwebtoken')

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
export default async function setupRequestPgClientTransaction (request, pgClient, { jwtSecret, pgDefaultRole } = {}) {
  // Get the JWT token string from our request.
  const jwtToken = getJWTToken(request)

  // If a JWT token was defined, but a secret was not procided to the server
  // throw a 403 error.
  if (jwtToken && !jwtSecret)
    throw httpError(403, 'Not allowed to provide a JWT token.')

  // Setup our default role. Once we decode our token, the role may change.
  let role = pgDefaultRole
  let jwtClaims

  // If we were provided a JWT token, let us try to verify it. If verification
  // fails we want to throw an error.
  if (jwtToken) {
    // Try to run `jwt.verify`. If it fails, capture the error and re-throw it
    // as a 403 error because the token is not trustworthy.
    try {
      jwtClaims = jwt.verify(jwtToken, jwtSecret, { audience: 'postgraphql' })

      // If there is a `role` property in the claims, use that instead of our
      // default role.
      if (jwtClaims.role != null)
        role = jwtClaims.role
    }
    catch (error) {
      error.statusCode = 403
      throw error
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
  ].filter(Boolean))

  // If there is at least one local setting.
  if (localSettings.size !== 0) {
    // Actually create our query.
    const query = sql.compile(sql.query`select ${sql.join(Array.from(localSettings).map(([key, value]) =>
      // Make sure that the third config is always `true` so that we are only
      // ever setting variables on the transaction.
      sql.query`set_config(${sql.value(key)}, ${sql.value(value)}, true)`,
    ), ', ')}`)

    // Execute the query.
    await pgClient.query(query)
  }

  return role
}

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
const authorizationBearerRex = /^\s*bearer\s+([a-z0-9\-._~+/]+=*)\s*$/i

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
function getJWTToken (request) {
  const { authorization } = request.headers

  // If there was no authorization header, just return null.
  if (authorization == null)
    return null

  const match = authorizationBearerRex.exec(authorization)

  // If we did not match the authorization header with our expected format,
  // throw a 400 error.
  if (!match)
    throw httpError(400, 'Authorization header is not of the correct bearer scheme format.')

  // Return the token from our match.
  return match[1]
}
