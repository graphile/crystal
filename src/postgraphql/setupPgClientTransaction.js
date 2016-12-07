import { Client } from 'pg'
import { sql } from '../postgres/utils'

const httpError = require('http-errors')
const jwt = require('jsonwebtoken')

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
export default async function setupPgClientTransaction (jwtToken, pgClient, { jwtSecret, pgDefaultRole } = {}) {
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
