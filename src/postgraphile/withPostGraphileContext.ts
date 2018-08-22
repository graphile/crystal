import createDebugger = require('debug');
import jwt = require('jsonwebtoken');
import { Pool, PoolClient } from 'pg';
import { ExecutionResult, DocumentNode, OperationDefinitionNode, Kind } from 'graphql';
import * as sql from 'pg-sql2';
import { $$pgClient } from '../postgres/inventory/pgClientFromContext';
import { pluginHookFromOptions } from './pluginHook';
import { mixed } from '../interfaces';

const undefinedIfEmpty = (o?: Array<string> | string): undefined | Array<string> | string =>
  o && o.length ? o : undefined;

export type WithPostGraphileContextFn = (
  options: {
    pgPool: Pool;
    jwtToken?: string;
    jwtSecret?: string;
    jwtAudiences?: Array<string>;
    jwtRole: Array<string>;
    jwtVerifyOptions?: jwt.VerifyOptions;
    pgDefaultRole?: string;
    pgSettings?: { [key: string]: mixed };
  },
  callback: (context: mixed) => Promise<ExecutionResult>,
) => Promise<ExecutionResult>;

const withDefaultPostGraphileContext: WithPostGraphileContextFn = async (
  options: {
    pgPool: Pool;
    jwtToken?: string;
    jwtSecret?: string;
    jwtAudiences?: Array<string>;
    jwtRole: Array<string>;
    jwtVerifyOptions?: jwt.VerifyOptions;
    pgDefaultRole?: string;
    pgSettings?: { [key: string]: mixed };
    queryDocumentAst?: DocumentNode;
    operationName?: string;
    pgForceTransaction?: boolean;
  },
  callback: (context: mixed) => Promise<ExecutionResult>,
): Promise<ExecutionResult> => {
  const {
    pgPool,
    jwtToken,
    jwtSecret,
    jwtAudiences,
    jwtRole = ['role'],
    jwtVerifyOptions,
    pgDefaultRole,
    pgSettings,
    queryDocumentAst,
    operationName,
    pgForceTransaction,
  } = options;

  let operation: OperationDefinitionNode | void;
  if (!pgForceTransaction && queryDocumentAst) {
    // tslint:disable-next-line
    for (let i = 0, l = queryDocumentAst.definitions.length; i < l; i++) {
      const definition = queryDocumentAst.definitions[i];
      if (definition.kind === Kind.OPERATION_DEFINITION) {
        if (!operationName && operation) {
          throw new Error('Multiple unnamed operations present in GraphQL query.');
        } else if (!operationName || (definition.name && definition.name.value === operationName)) {
          operation = definition;
        }
      }
    }
  }

  // Warning: this is only set if pgForceTransaction is falsy
  const operationType = operation != null ? operation.operation : null;

  const { role: pgRole, localSettings, jwtClaims } = await getSettingsForPgClientTransaction({
    jwtToken,
    jwtSecret,
    jwtAudiences,
    jwtRole,
    jwtVerifyOptions,
    pgDefaultRole,
    pgSettings,
  });

  // If we can avoid transactions, we get greater performance.
  const needTransaction =
    pgForceTransaction ||
    localSettings.length > 0 ||
    (operationType !== 'query' && operationType !== 'subscription');

  // Now we've caught as many errors as we can at this stage, let's create a DB connection.

  // Connect a new Postgres client
  const pgClient = await pgPool.connect();

  // Enhance our Postgres client with debugging stuffs.
  if ((debugPg.enabled || debugPgError.enabled) && !pgClient[$$pgClientOrigQuery]) {
    debugPgClient(pgClient);
  }

  // Begin our transaction, if necessary.
  if (needTransaction) {
    await pgClient.query('begin');
  }

  try {
    // If there is at least one local setting, load it into the database.
    if (needTransaction && localSettings.length !== 0) {
      // Later settings should win, so we're going to loop backwards and not
      // add settings for keys we've already seen.
      const seenKeys: Array<string> = [];

      const sqlSettings: Array<sql.SQLQuery> = [];
      for (let i = localSettings.length - 1; i >= 0; i--) {
        const [key, value] = localSettings[i];
        if (seenKeys.indexOf(key) < 0) {
          seenKeys.push(key);
          // Make sure that the third config is always `true` so that we are only
          // ever setting variables on the transaction.
          // Also, we're using `unshift` to undo the reverse-looping we're doing
          sqlSettings.unshift(
            sql.fragment`set_config(${sql.value(key)}, ${sql.value(value)}, true)`,
          );
        }
      }

      const query = sql.compile(sql.query`select ${sql.join(sqlSettings, ', ')}`);

      await pgClient.query(query);
    }

    return await callback({
      [$$pgClient]: pgClient,
      pgRole,
      jwtClaims,
    });
  } finally {
    // Cleanup our Postgres client by ending the transaction and releasing
    // the client back to the pool. Always do this even if the query fails.
    if (needTransaction) {
      await pgClient.query('commit');
    }
    pgClient.release();
  }
};

/**
 * Creates a PostGraphile context object which should be passed into a GraphQL
 * execution. This function will also connect a client from a Postgres pool and
 * setup a transaction in that client.
 *
 * This function is intended to wrap a call to GraphQL-js execution like so:
 *
 * ```js
 * const result = await withPostGraphileContext({
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
const withPostGraphileContext: WithPostGraphileContextFn = async (
  options: {
    pgPool: Pool;
    jwtToken?: string;
    jwtSecret?: string;
    jwtAudiences?: Array<string>;
    jwtRole: Array<string>;
    jwtVerifyOptions?: jwt.VerifyOptions;
    pgDefaultRole?: string;
    pgSettings?: { [key: string]: mixed };
  },
  callback: (context: mixed) => Promise<ExecutionResult>,
): Promise<ExecutionResult> => {
  const pluginHook = pluginHookFromOptions(options);
  const withContext = pluginHook('withPostGraphileContext', withDefaultPostGraphileContext, {
    options,
  });
  return withContext(options, callback);
};

export default withPostGraphileContext;

/**
 * Sets up the Postgres client transaction by decoding the JSON web token and
 * doing some other cool things.
 */
// THIS METHOD SHOULD NEVER RETURN EARLY. If this method returns early then it
// may skip the super important step of setting the role on the Postgres
// client. If this happens it’s a huge security vulnerability. Never using the
// keyword `return` in this function is a good first step. You can still throw
// errors, however, as this will stop the request execution.
async function getSettingsForPgClientTransaction({
  jwtToken,
  jwtSecret,
  jwtAudiences,
  jwtRole,
  jwtVerifyOptions,
  pgDefaultRole,
  pgSettings,
}: {
  jwtToken?: string;
  jwtSecret?: string;
  jwtAudiences?: Array<string>;
  jwtRole: Array<string>;
  jwtVerifyOptions?: jwt.VerifyOptions;
  pgDefaultRole?: string;
  pgSettings?: { [key: string]: mixed };
}): Promise<{
  role: string | undefined;
  localSettings: Array<[string, string]>;
  jwtClaims: { [claimName: string]: mixed } | null;
}> {
  // Setup our default role. Once we decode our token, the role may change.
  let role = pgDefaultRole;
  let jwtClaims: { [claimName: string]: mixed } = {};

  // If we were provided a JWT token, let us try to verify it. If verification
  // fails we want to throw an error.
  if (jwtToken) {
    // Try to run `jwt.verify`. If it fails, capture the error and re-throw it
    // as a 403 error because the token is not trustworthy.
    try {
      // If a JWT token was defined, but a secret was not provided to the server
      // throw a 403 error.
      if (typeof jwtSecret !== 'string') throw new Error('Not allowed to provide a JWT token.');

      if (jwtAudiences != null && jwtVerifyOptions && 'audience' in jwtVerifyOptions)
        throw new Error(
          `Provide either 'jwtAudiences' or 'jwtVerifyOptions.audience' but not both`,
        );

      jwtClaims = jwt.verify(jwtToken, jwtSecret, {
        ...jwtVerifyOptions,
        audience:
          jwtAudiences ||
          (jwtVerifyOptions && 'audience' in (jwtVerifyOptions as object)
            ? undefinedIfEmpty(jwtVerifyOptions.audience)
            : ['postgraphile']),
      });

      const roleClaim = getPath(jwtClaims, jwtRole);

      // If there is a `role` property in the claims, use that instead of our
      // default role.
      if (typeof roleClaim !== 'undefined') {
        if (typeof roleClaim !== 'string')
          throw new Error(
            `JWT \`role\` claim must be a string. Instead found '${typeof jwtClaims['role']}'.`,
          );

        role = roleClaim;
      }
    } catch (error) {
      // In case this error is thrown in an HTTP context, we want to add status code
      // Note. jwt.verify will add a name key to its errors. (https://github.com/auth0/node-jsonwebtoken#errors--codes)
      error.statusCode =
        'name' in error && error.name === 'TokenExpiredError'
          ? // The correct status code for an expired ( but otherwise acceptable token is 401 )
            401
          : // All other authentication errors should get a 403 status code.
            403;

      throw error;
    }
  }

  // Instantiate a map of local settings. This map will be transformed into a
  // Sql query.
  const localSettings: Array<[string, string]> = [];

  // Set the custom provided settings before jwt claims and role are set
  // this prevents an accidentional overwriting
  if (pgSettings && typeof pgSettings === 'object') {
    for (const key in pgSettings) {
      if (pgSettings.hasOwnProperty(key) && isPgSettingValid(pgSettings[key])) {
        if (key === 'role') {
          role = String(pgSettings[key]);
        } else {
          localSettings.push([key, String(pgSettings[key])]);
        }
      }
    }
  }

  // If there is a rule, we want to set the root `role` setting locally
  // to be our role. The role may only be null if we have no default role.
  if (typeof role === 'string') {
    localSettings.push(['role', role]);
  }

  // If we have some JWT claims, we want to set those claims as local
  // settings with the namespace `jwt.claims`.
  for (const key in jwtClaims) {
    if (jwtClaims.hasOwnProperty(key)) {
      const rawValue = jwtClaims[key];
      // Unsafe to pass raw object/array to pg.query -> set_config; instead JSONify
      const value: mixed =
        rawValue != null && typeof rawValue === 'object' ? JSON.stringify(rawValue) : rawValue;
      if (isPgSettingValid(value)) {
        localSettings.push([`jwt.claims.${key}`, String(value)]);
      }
    }
  }

  return {
    localSettings,
    role,
    jwtClaims: jwtToken ? jwtClaims : null,
  };
}

const $$pgClientOrigQuery = Symbol();

const debugPg = createDebugger('postgraphile:postgres');
const debugPgError = createDebugger('postgraphile:postgres:error');

/**
 * Adds debug logging funcionality to a Postgres client.
 *
 * @private
 */
// tslint:disable no-any
function debugPgClient(pgClient: PoolClient): PoolClient {
  // If Postgres debugging is enabled, enhance our query function by adding
  // a debug statement.
  if (!pgClient[$$pgClientOrigQuery]) {
    // Set the original query method to a key on our client. If that key is
    // already set, use that.
    pgClient[$$pgClientOrigQuery] = pgClient.query;

    // tslint:disable-next-line only-arrow-functions
    pgClient.query = function(...args: Array<any>): any {
      // Debug just the query text. We don’t want to debug variables because
      // there may be passwords in there.
      debugPg(args[0] && args[0].text ? args[0].text : args[0]);

      // tslint:disable-next-line no-invalid-this
      const promiseResult = pgClient[$$pgClientOrigQuery].apply(this, args);

      // Report the error with our Postgres debugger.
      promiseResult.catch((error: any) => debugPgError(error));

      return promiseResult;
    };
  }

  return pgClient;
}

/**
 * Safely gets the value at `path` (array of keys) of `inObject`.
 *
 * @private
 */
function getPath(inObject: mixed, path: Array<string>): any {
  let object = inObject;
  // From https://github.com/lodash/lodash/blob/master/.internal/baseGet.js
  let index = 0;
  const length = path.length;

  while (object && index < length) {
    object = object[path[index++]];
  }
  return index && index === length ? object : undefined;
}

/**
 * Check if a pgSetting is a string or a number.
 * Null and Undefined settings are not valid and will be ignored.
 * pgSettings of other types throw an error.
 *
 * @private
 */
function isPgSettingValid(pgSetting: mixed): boolean {
  if (pgSetting === undefined || pgSetting === null) {
    return false;
  }
  const typeOfPgSetting = typeof pgSetting;
  if (
    typeOfPgSetting === 'string' ||
    typeOfPgSetting === 'number' ||
    typeOfPgSetting === 'boolean'
  ) {
    return true;
  }
  // TODO: booleans!
  throw new Error(
    `Error converting pgSetting: ${typeof pgSetting} needs to be of type string, number or boolean.`,
  );
}
// tslint:enable no-any
