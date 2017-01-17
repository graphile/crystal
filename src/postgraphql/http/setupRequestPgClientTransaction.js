import { IncomingMessage } from 'http'
import { Client } from 'pg'

const httpError = require('http-errors')

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
export function getJWTToken (request) {
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
