import createDebugger from "debug";
import jwt from "jsonwebtoken";
import { Pool, PoolClient, QueryConfig, QueryResult } from "pg";
import { ExecutionResult, OperationDefinitionNode, Kind } from "graphql";
import sql, { SQLQuery } from "pg-sql2";
import { $$pgClient } from "../postgres/inventory/pgClientFromContext";
import { pluginHookFromOptions } from "./pluginHook";
import {
  mixed,
  WithPostGraphileContextOptions,
  GraphileClaims,
} from "../interfaces";
import {
  formatSQLForDebugging,
  GraphileResolverContext,
} from "postgraphile-core";

const undefinedIfEmpty = (
  o?: Array<string | RegExp> | string | RegExp,
): undefined | Array<string | RegExp> | string | RegExp =>
  o && (!Array.isArray(o) || o.length) ? o : undefined;

export type WithPostGraphileContextFn<TResult = ExecutionResult> = (
  options: WithPostGraphileContextOptions,
  callback: (context: GraphileResolverContext) => Promise<TResult> | TResult,
) => Promise<TResult>;

const debugPg = createDebugger("postgraphile:postgres");
const debugPgError = createDebugger("postgraphile:postgres:error");
const debugPgNotice = createDebugger("postgraphile:postgres:notice");

/**
 * Formats an error/notice from `pg` and feeds it into a `debug` function.
 */
function debugPgErrorObject(
  debugFn: createDebugger.IDebugger,
  object: PgNotice,
) {
  debugFn(
    "%s%s: %s%s%s",
    object.severity || "ERROR",
    object.code ? `[${object.code}]` : "",
    object.message || object,
    object.where ? ` | WHERE: ${object.where}` : "",
    object.hint ? ` | HINT: ${object.hint}` : "",
  );
}

type WithAuthenticatedPgClientFunction = <T>(
  cb: (pgClient: PoolClient) => Promise<T>,
) => Promise<T>;

const simpleWithPgClientCache = new WeakMap<
  Pool,
  WithAuthenticatedPgClientFunction
>();
function simpleWithPgClient(pgPool: Pool) {
  const cached = simpleWithPgClientCache.get(pgPool);
  if (cached) {
    return cached;
  }
  const func: WithAuthenticatedPgClientFunction = async cb => {
    const pgClient = await pgPool.connect();
    try {
      return await cb(pgClient);
    } finally {
      pgClient.release();
    }
  };
  simpleWithPgClientCache.set(pgPool, func);
  return func;
}

const withDefaultPostGraphileContext = async <TResult = ExecutionResult>(
  options: WithPostGraphileContextOptions,
  callback: (context: GraphileResolverContext) => Promise<TResult> | TResult,
): Promise<TResult> => {
  const {
    pgPool,
    jwtToken,
    jwtSecret,
    jwtPublicKey,
    jwtAudiences,
    jwtRole = ["role"],
    jwtVerifyOptions,
    pgDefaultRole,
    pgSettings,
    explain,
    queryDocumentAst,
    operationName,
    pgForceTransaction,
    singleStatement,
  } = options;

  let operation: OperationDefinitionNode | void;
  if (!pgForceTransaction && queryDocumentAst) {
    // tslint:disable-next-line
    for (let i = 0, l = queryDocumentAst.definitions.length; i < l; i++) {
      const definition = queryDocumentAst.definitions[i];
      if (definition.kind === Kind.OPERATION_DEFINITION) {
        if (!operationName && operation) {
          throw new Error(
            "Multiple operations present in GraphQL query, you must specify an `operationName` so we know which one to execute.",
          );
        } else if (
          !operationName ||
          (definition.name && definition.name.value === operationName)
        ) {
          operation = definition;
        }
      }
    }
  }

  // Warning: this is only set if pgForceTransaction is falsy
  const operationType = operation != null ? operation.operation : null;

  const {
    role: pgRole,
    localSettings,
    jwtClaims,
  } = await getSettingsForPgClientTransaction({
    jwtToken,
    jwtSecret,
    jwtPublicKey,
    jwtAudiences,
    jwtRole,
    jwtVerifyOptions,
    pgDefaultRole,
    pgSettings,
  });

  const sqlSettings: Array<SQLQuery> = [];
  if (localSettings.length > 0) {
    // Later settings should win, so we're going to loop backwards and not
    // add settings for keys we've already seen.
    const seenKeys: Array<string> = [];
    // TODO:perf: looping backwards is slow
    for (let i = localSettings.length - 1; i >= 0; i--) {
      const [key, value] = localSettings[i];
      if (!seenKeys.includes(key)) {
        seenKeys.push(key);
        // Make sure that the third config is always `true` so that we are only
        // ever setting variables on the transaction.
        // Also, we're using `unshift` to undo the reverse-looping we're doing
        sqlSettings.unshift(
          sql.fragment`set_config(${sql.value(key)}, ${sql.value(
            value,
          )}, true)`,
        );
      }
    }
  }

  const sqlSettingsQuery =
    sqlSettings.length > 0
      ? sql.compile(sql.query`select ${sql.join(sqlSettings, ", ")}`)
      : null;

  // If we can avoid transactions, we get greater performance.
  const needTransaction =
    pgForceTransaction ||
    !!sqlSettingsQuery ||
    (operationType !== "query" && operationType !== "subscription");

  // Now we've caught as many errors as we can at this stage, let's create a DB connection.
  const withAuthenticatedPgClient: WithAuthenticatedPgClientFunction = !needTransaction
    ? simpleWithPgClient(pgPool)
    : async cb => {
        // Connect a new Postgres client
        const pgClient = await pgPool.connect();

        // Begin our transaction
        await pgClient.query("begin");

        try {
          // If there is at least one local setting, load it into the database.
          if (sqlSettingsQuery) {
            await pgClient.query(sqlSettingsQuery);
          }

          // Use the client, wait for it to be finished with, then go to 'finally'
          return await cb(pgClient);
        } finally {
          // Cleanup our Postgres client by ending the transaction and releasing
          // the client back to the pool. Always do this even if the query fails.
          try {
            await pgClient.query("commit");
          } finally {
            pgClient.release();
          }
        }
      };

  if (singleStatement) {
    // TODO:v5: remove this workaround
    /*
     * This is a workaround for subscriptions; the GraphQL context is allocated
     * for the entire duration of the subscription, however hogging a pgClient
     * for more than a few milliseconds (let alone hours!) is a no-no. So we
     * fake a PG client that will set up the transaction each time `query` is
     * called. It's a very thin/dumb wrapper, so it supports nothing but
     * `query`.
     */
    const fakePgClient: PoolClient = {
      query(
        textOrQueryOptions?: string | QueryConfig,
        values?: Array<any>, // tslint:disable-line no-any
        cb?: void,
      ): Promise<QueryResult> {
        if (!textOrQueryOptions) {
          throw new Error(
            "Incompatible call to singleStatement - no statement passed?",
          );
        } else if (typeof textOrQueryOptions === "object") {
          if (values || cb) {
            throw new Error(
              "Incompatible call to singleStatement - expected no callback",
            );
          }
        } else if (typeof textOrQueryOptions !== "string") {
          throw new Error("Incompatible call to singleStatement - bad query");
        } else if (values && !Array.isArray(values)) {
          throw new Error("Incompatible call to singleStatement - bad values");
        } else if (cb) {
          throw new Error(
            "Incompatible call to singleStatement - expected to return promise",
          );
        }
        // Generate an authenticated client on the fly
        return withAuthenticatedPgClient(pgClient =>
          pgClient.query(textOrQueryOptions, values),
        );
      },
    } as any; // tslint:disable-line no-any

    return callback({
      [$$pgClient]: fakePgClient,
      pgRole,
      jwtClaims,
    });
  } else {
    return withAuthenticatedPgClient(async pgClient => {
      let results: Promise<Array<ExplainResult>> | null = null;
      if (explain) {
        pgClient.startExplain();
      }
      try {
        return await callback({
          [$$pgClient]: pgClient,
          pgRole,
          jwtClaims,
          ...(explain
            ? {
                getExplainResults: (): Promise<Array<ExplainResult>> => {
                  results = results || pgClient.stopExplain();
                  return results;
                },
              }
            : null),
        });
      } finally {
        if (explain) {
          results = results || pgClient.stopExplain();
        }
      }
    });
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
async function withPostGraphileContext<TResult = ExecutionResult>(
  options: WithPostGraphileContextOptions,
  callback: (context: GraphileResolverContext) => Promise<TResult> | TResult,
): Promise<TResult> {
  const pluginHook = pluginHookFromOptions(options);
  const withContext = pluginHook(
    "withPostGraphileContext",
    withDefaultPostGraphileContext,
    {
      options,
    },
  );
  return withContext(options, callback);
}

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
  jwtPublicKey,
  jwtAudiences,
  jwtRole,
  jwtVerifyOptions,
  pgDefaultRole,
  pgSettings,
}: {
  jwtToken?: string;
  jwtSecret?: jwt.Secret;
  jwtPublicKey?: jwt.Secret | jwt.GetPublicKeyOrSecret;
  jwtAudiences?: Array<string>;
  jwtRole: Array<string>;
  jwtVerifyOptions?: jwt.VerifyOptions;
  pgDefaultRole?: string;
  pgSettings?: { [key: string]: mixed };
}): Promise<{
  role: string | undefined;
  localSettings: Array<[string, string]>;
  jwtClaims: GraphileClaims | null;
}> {
  // Setup our default role. Once we decode our token, the role may change.
  let role = pgDefaultRole;
  let jwtClaims: GraphileClaims = {};

  // If we were provided a JWT token, let us try to verify it. If verification
  // fails we want to throw an error.
  if (jwtToken) {
    // Try to run `jwt.verify`. If it fails, capture the error and re-throw it
    // as a 403 error because the token is not trustworthy.
    try {
      const jwtVerificationSecret = jwtPublicKey || jwtSecret;
      // If a JWT token was defined, but a secret was not provided to the server or
      // secret had unsupported type, throw a 403 error.
      if (
        !Buffer.isBuffer(jwtVerificationSecret) &&
        typeof jwtVerificationSecret !== "string" &&
        typeof jwtVerificationSecret !== "function"
      ) {
        // tslint:disable-next-line no-console
        console.error(
          `ERROR: '${
            jwtPublicKey ? "jwtPublicKey" : "jwtSecret"
          }' was not set to a string or buffer - rejecting JWT-authenticated request.`,
        );
        throw new Error("Not allowed to provide a JWT token.");
      }

      if (
        jwtAudiences != null &&
        jwtVerifyOptions &&
        "audience" in jwtVerifyOptions
      )
        throw new Error(
          `Provide either 'jwtAudiences' or 'jwtVerifyOptions.audience' but not both`,
        );

      const claims = await new Promise((resolve, reject) => {
        jwt.verify(
          jwtToken,
          jwtVerificationSecret,
          {
            ...jwtVerifyOptions,
            audience:
              jwtAudiences ||
              (jwtVerifyOptions && "audience" in (jwtVerifyOptions as object)
                ? undefinedIfEmpty(jwtVerifyOptions.audience)
                : ["postgraphile"]),
          },
          (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
          },
        );
      });

      if (typeof claims === "string") {
        throw new Error("Invalid JWT payload");
      }

      // jwt.verify returns `object | string`; but the `object` part is really a map
      jwtClaims = claims as GraphileClaims;

      const roleClaim = getPath(jwtClaims, jwtRole);

      // If there is a `role` property in the claims, use that instead of our
      // default role.
      if (typeof roleClaim !== "undefined") {
        if (typeof roleClaim !== "string")
          throw new Error(
            `JWT \`role\` claim must be a string. Instead found '${typeof jwtClaims[
              "role"
            ]}'.`,
          );

        role = roleClaim;
      }
    } catch (error) {
      // In case this error is thrown in an HTTP context, we want to add status code
      // Note. jwt.verify will add a name key to its errors. (https://github.com/auth0/node-jsonwebtoken#errors--codes)
      error.statusCode =
        "name" in error && error.name === "TokenExpiredError"
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
  if (pgSettings && typeof pgSettings === "object") {
    for (const key in pgSettings) {
      if (
        Object.prototype.hasOwnProperty.call(pgSettings, key) &&
        isPgSettingValid(pgSettings[key])
      ) {
        if (key === "role") {
          role = String(pgSettings[key]);
        } else {
          localSettings.push([key, String(pgSettings[key])]);
        }
      }
    }
  }

  // If there is a rule, we want to set the root `role` setting locally
  // to be our role. The role may only be null if we have no default role.
  if (typeof role === "string") {
    localSettings.push(["role", role]);
  }

  // If we have some JWT claims, we want to set those claims as local
  // settings with the namespace `jwt.claims`.
  for (const key in jwtClaims) {
    if (Object.prototype.hasOwnProperty.call(jwtClaims, key)) {
      const rawValue = jwtClaims[key];
      // Unsafe to pass raw object/array to pg.query -> set_config; instead JSONify
      const value: mixed =
        rawValue != null && typeof rawValue === "object"
          ? JSON.stringify(rawValue)
          : rawValue;
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

interface RawExplainResult {
  query: string;
  result: any;
}
type ExplainResult = Omit<RawExplainResult, "result"> & {
  plan: string;
};

declare module "pg" {
  interface ClientBase {
    _explainResults: Array<RawExplainResult> | null;
    startExplain: () => void;
    stopExplain: () => Promise<Array<ExplainResult>>;
  }
}

/**
 * Adds debug logging funcionality to a Postgres client.
 */
// tslint:disable no-any
export function debugPgClient(
  pgClient: PoolClient,
  allowExplain = false,
): PoolClient {
  // If Postgres debugging is enabled, enhance our query function by adding
  // a debug statement.
  if (!pgClient[$$pgClientOrigQuery]) {
    // Set the original query method to a key on our client. If that key is
    // already set, use that.
    pgClient[$$pgClientOrigQuery] = pgClient.query;

    pgClient.startExplain = () => {
      pgClient._explainResults = [];
    };

    pgClient.stopExplain = async () => {
      const results = pgClient._explainResults;
      pgClient._explainResults = null;
      if (!results) {
        return Promise.resolve([]);
      }
      return (
        await Promise.all(
          results.map(async r => {
            const { result: resultPromise, ...rest } = r;
            const result = await resultPromise;
            const firstKey = result && result[0] && Object.keys(result[0])[0];
            if (!firstKey) {
              return null;
            }
            const plan = result.map((r: any) => r[firstKey]).join("\n");
            return {
              ...rest,
              plan,
            };
          }),
        )
      ).filter((entry: unknown): entry is ExplainResult => !!entry);
    };

    if (debugPgNotice.enabled) {
      pgClient.on("notice", (msg: PgNotice) => {
        debugPgErrorObject(debugPgNotice, msg);
      });
    }
    const logError = (error: PgNotice | Error) => {
      if (error.name && error["severity"]) {
        debugPgErrorObject(debugPgError, error as PgNotice);
      } else {
        debugPgError("%O", error);
      }
    };

    if (debugPg.enabled || debugPgNotice.enabled || allowExplain) {
      // tslint:disable-next-line only-arrow-functions
      pgClient.query = function(...args: Array<any>): any {
        const [a, b, c] = args;
        // If we understand it (and it uses the promises API)
        if (
          (typeof a === "string" && !c && (!b || Array.isArray(b))) ||
          (typeof a === "object" && !b && !c)
        ) {
          if (debugPg.enabled) {
            // Debug just the query text. We don’t want to debug variables because
            // there may be passwords in there.
            debugPg("%s", formatSQLForDebugging(a && a.text ? a.text : a));
          }

          if (pgClient._explainResults) {
            const query = a && a.text ? a.text : a;
            const values = a && a.text ? a.values : b;
            if (
              query.match(/^\s*(select|insert|update|delete|with)\s/i) &&
              !query.includes(";")
            ) {
              // Explain it
              const explain = `explain ${query}`;
              pgClient._explainResults.push({
                query,
                result: pgClient[$$pgClientOrigQuery]
                  .call(this, explain, values)
                  .then((data: any) => data.rows),
              });
            }
          }

          const promiseResult = pgClient[$$pgClientOrigQuery].apply(this, args);

          if (debugPgError.enabled) {
            // Report the error with our Postgres debugger.
            promiseResult.catch(logError);
          }

          return promiseResult;
        } else {
          // We don't understand it (e.g. `pgPool.query`), just let it happen.
          return pgClient[$$pgClientOrigQuery].apply(this, args);
        }
      };
    }
  }

  return pgClient;
}

/**
 * Safely gets the value at `path` (array of keys) of `inObject`.
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
 */
function isPgSettingValid(pgSetting: mixed): boolean {
  if (pgSetting === undefined || pgSetting === null) {
    return false;
  }
  const typeOfPgSetting = typeof pgSetting;
  if (
    typeOfPgSetting === "string" ||
    typeOfPgSetting === "number" ||
    typeOfPgSetting === "boolean"
  ) {
    return true;
  }
  // TODO: booleans!
  throw new Error(
    `Error converting pgSetting: ${typeof pgSetting} needs to be of type string, number or boolean.`,
  );
}
// tslint:enable no-any
interface PgNotice extends Error {
  name: "notice";
  message: string;
  length: number;
  severity: string;
  code: string;
  detail: string | void;
  hint: string | void;
  where: string | void;
  schema: string | void;
  table: string | void;
  column: string | void;
  constraint: string | void;
  file: string;
  line: string;
  routine: string;
  /*
  Not sure what these are:

    position: any;
    internalPosition: any;
    internalQuery: any;
    dataType: any;
  */
}
