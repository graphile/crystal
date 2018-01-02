import createDebugger = require('debug')
import jwt = require('jsonwebtoken')
import { Pool, Client } from 'pg'
import { ExecutionResult } from 'graphql'
import * as sql from 'pg-sql2'
import { $$pgClient } from '../postgres/inventory/pgClientFromContext'

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
export default async function withPostGraphQLContext(
  {
    pgPool,
    jwtToken,
    jwtSecret,
    jwtAudiences,
    jwtRole = ['role'],
    jwtVerifyOptions,
    pgDefaultRole,
    pgSettings,
  }: {
    pgPool: Pool,
    jwtToken?: string,
    jwtSecret?: string,
    jwtAudiences?: Array<string>,
    jwtRole: Array<string>,
    jwtVerifyOptions?: jwt.VerifyOptions,
    pgDefaultRole?: string,
    pgSettings?: { [key: string]: mixed },
  },
  callback: (context: mixed) => Promise<ExecutionResult>,
): Promise<ExecutionResult> {
  // Connect a new Postgres client and start a transaction.
  const pgClient = await pgPool.connect()

  // Enhance our Postgres client with debugging stuffs.
  debugPgClient(pgClient)

  // Begin our transaction and set it up.
  await pgClient.query('begin')

  // Run the function with a context object that can be passed through
  try {
    const pgRole = await setupPgClientTransaction({
      pgClient,
      jwtToken,
      jwtSecret,
      jwtAudiences,
      jwtRole,
      jwtVerifyOptions,
      pgDefaultRole,
      pgSettings,
    })

    return await callback({
      [$$pgClient]: pgClient,
      pgRole,
    })
  }
  // Cleanup our Postgres client by ending the transaction and releasing
  // the client back to the pool. Always do this even if the query fails.
  finally {
    await pgClient.query('commit')
    pgClient.release()
  }
}

/**
 * Sets up the Postgres client transaction by decoding the JSON web token and
 * doing some other cool things.
 */
// THIS METHOD SHOULD NEVER RETURN EARLY. If this method returns early then it
// may skip the super important step of setting the role on the Postgres
// client. If this happens it’s a huge security vulnerability. Never using the
// keyword `return` in this function is a good first step. You can still throw
// errors, however, as this will stop the request execution.
async function setupPgClientTransaction({
  pgClient,
  jwtToken,
  jwtSecret,
  jwtAudiences,
  jwtRole,
  jwtVerifyOptions,
  pgDefaultRole,
  pgSettings,
}: {
  pgClient: Client,
  jwtToken?: string,
  jwtSecret?: string,
  jwtAudiences?: Array<string>,
  jwtRole: Array<string>,
  jwtVerifyOptions?: jwt.VerifyOptions,
  pgDefaultRole?: string,
  pgSettings?: { [key: string]: mixed },
}): Promise<string | undefined> {
  // Setup our default role. Once we decode our token, the role may change.
  let role = pgDefaultRole
  let jwtClaims: { [claimName: string]: mixed } = {}

  // If we were provided a JWT token, let us try to verify it. If verification
  // fails we want to throw an error.
  if (jwtToken) {
    // Try to run `jwt.verify`. If it fails, capture the error and re-throw it
    // as a 403 error because the token is not trustworthy.
    try {
      // If a JWT token was defined, but a secret was not provided to the server
      // throw a 403 error.
      if (typeof jwtSecret !== 'string')
        throw new Error('Not allowed to provide a JWT token.')

      if (jwtAudiences && jwtVerifyOptions && jwtVerifyOptions.audience)
        throw new Error(`Provide either 'jwtAudiences' or 'jwtVerifyOptions.audience' but not both`)

      jwtClaims = jwt.verify(jwtToken, jwtSecret, {
        audience: jwtAudiences || ['postgraphql'],
        ...jwtVerifyOptions,
      })

      const roleClaim = getPath(jwtClaims, jwtRole)

      // If there is a `role` property in the claims, use that instead of our
      // default role.
      if (typeof roleClaim !== 'undefined') {
        if (typeof roleClaim !== 'string')
          throw new Error(`JWT \`role\` claim must be a string. Instead found '${typeof jwtClaims['role']}'.`)

        role = roleClaim
      }
    }
    catch (error) {
      // In case this error is thrown in an HTTP context, we want to add status code
      // Note. jwt.verify will add a name key to its errors. (https://github.com/auth0/node-jsonwebtoken#errors--codes)
      if ( ('name' in error) && error.name === 'TokenExpiredError') {
        // The correct status code for an expired ( but otherwise acceptable token is 401 )
        error.statusCode = 401
      } else {
        // All other authentication errors should get a 403 status code.
        error.statusCode = 403
      }

      throw error
    }
  }

  // Instantiate a map of local settings. This map will be transformed into a
  // Sql query.
  const localSettings = new Map<string, mixed>()

  // Set the custom provided settings before jwt claims and role are set
  // this prevents an accidentional overwriting
  if (typeof pgSettings === 'object') {
    for (const key of Object.keys(pgSettings)) {
      if (isPgSettingValid(pgSettings[key])) {
        localSettings.set(key, String(pgSettings[key]))
      }
    }
  }

  // If there is a rule, we want to set the root `role` setting locally
  // to be our role. The role may only be null if we have no default role.
  if (typeof role === 'string') {
    localSettings.set('role', role)
  }

  // If we have some JWT claims, we want to set those claims as local
  // settings with the namespace `jwt.claims`.
  for (const key of Object.keys(jwtClaims)) {
    localSettings.set(`jwt.claims.${key}`, jwtClaims[key])
  }

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

const $$pgClientOrigQuery = Symbol()

const debugPg = createDebugger('postgraphql:postgres')
const debugPgError = createDebugger('postgraphql:postgres:error')

/**
 * Adds debug logging funcionality to a Postgres client.
 *
 * @private
 */
// tslint:disable no-any
function debugPgClient(pgClient: Client): Client {
  // If Postgres debugging is enabled, enhance our query function by adding
  // a debug statement.
  if (debugPg.enabled || debugPgError.enabled) {
    // Set the original query method to a key on our client. If that key is
    // already set, use that.
    pgClient[$$pgClientOrigQuery] = pgClient[$$pgClientOrigQuery] || pgClient.query

    // tslint:disable-next-line only-arrow-functions
    pgClient.query = function (...args: Array<any>): any {
      // Debug just the query text. We don’t want to debug variables because
      // there may be passwords in there.
      debugPg(args[0] && args[0].text ? args[0].text : args[0])

      // tslint:disable-next-line no-invalid-this
      const promiseResult = pgClient[$$pgClientOrigQuery].apply(this, args)

      // Report the error with our Postgres debugger.
      promiseResult.catch((error: any) => debugPgError(error))

      return promiseResult
    }
  }

  return pgClient
}

/**
 * Safely gets the value at `path` (array of keys) of `inObject`.
 *
 * @private
 */
function getPath(inObject: mixed, path: Array<string>): any {
  let object = inObject
  // From https://github.com/lodash/lodash/blob/master/.internal/baseGet.js
  let index = 0
  const length = path.length

  while (object && index < length) {
    object = object[path[index++]]
  }
  return (index && index === length) ? object : undefined
}

/**
 * Check if a pgSetting is a string or a number.
 * Null and Undefined settings are not valid and will be ignored.
 * pgSettings of other types throw an error.
 *
 * @private
 */
function isPgSettingValid(pgSetting: mixed): boolean {
  const supportedSettingTypes = ['string', 'number']
  if (supportedSettingTypes.indexOf(typeof pgSetting) >= 0) {
    return true
  }
  if (pgSetting === undefined || pgSetting === null) {
    return false
  }
  throw new Error(`Error converting pgSetting: ${typeof pgSetting} needs to be of type ${supportedSettingTypes.join(' or ')}.`)
}
// tslint:enable no-any
