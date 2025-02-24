// It's helpful to see the full error stack

Error.stackTraceLimit = Infinity;

if (process.env.DEBUG) {
  // When debug is set, outputting the console logs makes the tests slow.
  jest.setTimeout(60000);
}

import "graphile-config";
import "graphile-build-pg";

import type { PgClientQuery } from "@dataplan/pg";
import { PgSubscriber } from "@dataplan/pg/adaptors/pg";
import * as adaptor from "@dataplan/pg/adaptors/pg";
import { promises as fsp } from "fs";
import { mkdir, mkdtemp, rmdir, unlink } from "fs/promises";
import {
  execute as grafastExecute,
  hookArgs,
  subscribe as grafastSubscribe,
} from "grafast";
import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionPatchResult,
  GraphQLError,
  GraphQLSchema,
  SubscriptionArgs,
} from "grafast/graphql";
import {
  execute as graphqlExecute,
  getOperationAST,
  parse,
  subscribe as graphqlSubscribe,
  validate,
  validateSchema,
} from "grafast/graphql";
import { planToMermaid } from "grafast/mermaid";
import { StreamDeferPlugin } from "graphile-build";
import { exportSchema } from "graphile-export";
import { isAsyncIterable } from "iterall";
import JSON5 from "json5";
import type { JwtPayload } from "jsonwebtoken";
import * as jsonwebtoken from "jsonwebtoken";
import { decode } from "jsonwebtoken";
import { relative } from "path";
import type { PoolClient } from "pg";
import { Pool } from "pg";

import {
  createTestDatabase,
  dropTestDatabase,
  withTestWithPgClient,
} from "../../../grafast/dataplan-pg/__tests__/sharedHelpers.js";
import { makeSchema } from "../src/index.js";
import AmberPreset from "../src/presets/amber.js";
import { makeV4Preset } from "../src/presets/v4.js";

/**
 * We go beyond what Jest snapshots allow; so we have to manage it ourselves.
 * If UPDATE_SNAPSHOTS is set then we'll write updated snapshots, otherwise
 * we'll do the default behaviour of comparing to existing snapshots.
 *
 * Set UPDATE_SNAPSHOTS=1 to update all snapshots. Alternatively, set it to a
 * comma separated list of snapshot types to update.
 */
const { UPDATE_SNAPSHOTS } = process.env;
const updateSnapshotExtensions = UPDATE_SNAPSHOTS?.split(",");
function shouldUpdateSnapshot(filePath: string) {
  // Never update snapshots in CI
  if (process.env.CI) return false;
  if (UPDATE_SNAPSHOTS === "1") return true;
  if (!updateSnapshotExtensions) return false;
  return updateSnapshotExtensions.some((e) => filePath.endsWith(e));
}

const EXPORT_SCHEMA_MODE = process.env.EXPORT_SCHEMA as
  | undefined
  | "graphql-js"
  | "typeDefs";

if (
  EXPORT_SCHEMA_MODE &&
  EXPORT_SCHEMA_MODE !== "graphql-js" &&
  EXPORT_SCHEMA_MODE !== "typeDefs"
) {
  throw new Error(
    `EXPORT_SCHEMA must be unset, or set to 'graphql-js' or 'typeDefs'`,
  );
}

async function getServerVersionNum(pgClient: Pool | PoolClient) {
  const versionResult = await pgClient.query("show server_version_num;");
  return parseInt(versionResult.rows[0].server_version_num, 10);
}

const kitchenSinkData = () =>
  fsp.readFile(`${__dirname}/kitchen-sink-data.sql`, "utf8");

const pg11Data = () => fsp.readFile(`${__dirname}/pg11-data.sql`, "utf8");

const SHARED_JWT_SECRET =
  "This is static for the tests, use a better one if you set one!";

// TODO: this file shares a lot in common with the equivalent file in
// dataplan-pg; we should extract the common utilities.

/** Sorts two GraphQLError paths. */
const pathCompare = (
  path1: readonly (string | number)[],
  path2: readonly (string | number)[],
) => {
  const l = Math.min(path1.length, path2.length);
  for (let i = 0; i < l; i++) {
    const a = path1[i];
    const z = path2[i];
    if (typeof a === "number") {
      if (typeof z !== "number") {
        throw new Error("Type mismatch; expected number");
      }
      const v = a - z;
      if (v !== 0) {
        return v;
      }
    } else if (typeof a === "string") {
      if (typeof z !== "string") {
        throw new Error("Type mismatch; expected string");
      }
      const v = a.localeCompare(z, "en-US");
      if (v !== 0) {
        return v;
      }
    } else {
      throw new Error("Unexpected type");
    }
  }
  return path1.length - path2.length;
};

/** Postgres pool */
let pgPool: Pool | null = null;
let connectionString = "";
let databaseName = "";

beforeAll(async () => {
  ({ connectionString, databaseName } = await createTestDatabase());
  pgPool = new Pool({
    connectionString,
  });
  pgPool.on("connect", (client) => {
    client.on("error", () => {});
    client.query(`set TimeZone to '+04:00'`).catch(() => {});
  });
  pgPool.on("error", (e) => {
    console.error("Pool error:", e);
  });
}, 30000);

afterAll(async () => {
  await pgPool!.end();
  await dropTestDatabase(databaseName);
  const p = pgPool as any;
  if (p._clients.length > 0) {
    console.warn(`Warning: ${p._clients.length} clients are still in the pool`);
  }
  pgPool = null;
}, 30000);

export async function withPoolClient<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const poolClient = await pgPool!.connect();
  try {
    return await callback(poolClient);
  } finally {
    poolClient.release();
  }
}

export async function withPoolClientTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  return withPoolClient(async (poolClient) => {
    await poolClient.query("begin;");
    try {
      return await callback(poolClient);
    } finally {
      await poolClient.query("rollback");
    }
  });
}

// Has to be within `postgraphile` folder otherwise imports won't work
const TMPDIR = `${__dirname}/../.tests_tmp`;

let mktmpPromise: any;
function mktmp() {
  if (!mktmpPromise) {
    mktmpPromise = (async () => {
      try {
        await mkdir(TMPDIR);
      } catch (e) {
        if (e.code === "EEXIST") {
          // NOOP
        } else {
          throw e;
        }
      }
    })();
  }
  return mktmpPromise;
}

async function importExportedSchema(schema: GraphQLSchema) {
  await mktmp();
  const tempDir = await mkdtemp(`${TMPDIR}/postgraphiletests-`);
  const targetFile = tempDir + "/schema.js";
  await exportSchema(schema, targetFile, {
    mode: EXPORT_SCHEMA_MODE,
    modules: {
      jsonwebtoken,
    },
  });
  try {
    const module = await import(targetFile);
    await unlink(targetFile);
    await rmdir(tempDir);
    return module.schema;
  } catch (e) {
    console.log(`Importing ${targetFile} (schema export) failed: ${e}`);
    throw e;
  }
}

export async function runTestQuery(
  source: string,
  config: {
    variableValues?: { [key: string]: any };
    directPg?: boolean;
    schema?: string | string[];
    graphileBuildOptions?: any;
    ignoreRBAC?: boolean;
    setofFunctionsContainNulls?: boolean;
    viewUniqueKey?: string;
    subscriptions?: boolean;
    setupSql?: string;
    cleanupSql?: string;
    extends?: string | string[];
    pgIdentifiers?: "qualified" | "unqualified";
    search_path?: string;
  },
  options: {
    callback?: (
      client: PoolClient | null,
      payloads: Omit<AsyncExecutionResult, "hasNext">[],
    ) => Promise<void>;
    path: string;
    prepare?: boolean;
  } = Object.create(null),
): Promise<{
  payloads?: Array<{
    data?: { [key: string]: any };
    errors?: readonly GraphQLError[];
    extensions?: any;
  }>;
  data?: { [key: string]: any };
  errors?: readonly GraphQLError[];
  queries: PgClientQuery[];
  extensions?: any;
}> {
  const {
    variableValues,
    graphileBuildOptions,
    setupSql,
    cleanupSql,
    pgIdentifiers,
    search_path,
  } = config;
  const { path } = options;

  const queries: PgClientQuery[] = [];
  const schemas = Array.isArray(config.schema)
    ? config.schema
    : typeof config.schema === "string"
    ? [config.schema]
    : ["a", "b", "c"];
  const extendsRaw = Array.isArray(config.extends)
    ? config.extends
    : config.extends
    ? [config.extends]
    : [];
  const presets = await Promise.all(
    extendsRaw.map(async (extendRaw) => {
      const [modulePath, name = "default"] = extendRaw.split(":");
      const mod = await import(modulePath);
      const imported = mod[name];
      if (!imported) {
        throw new Error(
          `Invalid 'extends': '${extendRaw}' - '${name}' export doesn't exist; found: ${Object.keys(
            mod,
          )}`,
        );
      }
      return imported;
    }),
  );
  const preset: GraphileConfig.Preset = {
    extends: [AmberPreset, ...presets],
    plugins: [StreamDeferPlugin],
    pgServices: [
      {
        adaptor,
        name: "main",
        withPgClientKey: "withPgClient",
        pgSettingsKey: "pgSettings",
        pgSettingsForIntrospection:
          config.ignoreRBAC == false
            ? {
                role: "postgraphile_test_authenticator",
              }
            : null,
        pgSettings:
          config.ignoreRBAC === false
            ? () => ({
                role: "postgraphile_test_visitor",
                "jwt.claims.user_id": "3",
                search_path,
              })
            : search_path
            ? {
                search_path,
              }
            : undefined,
        schemas: schemas,
        adaptorSettings: {
          connectionString,
        },
      } satisfies GraphileConfig.PgServiceConfiguration<"@dataplan/pg/adaptors/pg">,
    ],
    schema: {
      pgForbidSetofFunctionsToReturnNull:
        config.setofFunctionsContainNulls === false,
      ...graphileBuildOptions,
    },
    gather: {
      pgIdentifiers,
    },
    grafast: {
      explain: ["plan"],
    },
  };

  if (
    path.includes("/v4") ||
    path.includes("/polymorphic") ||
    path.includes("/relay")
  ) {
    applyV4Stuff(preset, config);
  }

  if (!pgPool) {
    throw new Error("No pool!");
  }

  // Load test data
  await pgPool.query(await kitchenSinkData());
  const serverVersionNum = await getServerVersionNum(pgPool);
  if (serverVersionNum >= 110000) {
    await pgPool.query(await pg11Data());
  }

  if (setupSql) {
    await pgPool.query(setupSql);
  }
  try {
    const { schema: rawSchema, resolvedPreset } = await makeSchema(preset);

    const schema = EXPORT_SCHEMA_MODE
      ? await importExportedSchema(rawSchema)
      : rawSchema;
    return await withTestWithPgClient<any>(
      pgPool,
      queries,
      Boolean(config.directPg),
      async (withPgClient) => {
        const pgSubscriber = new PgSubscriber(pgPool);
        try {
          const document = parse(source);
          const args: ExecutionArgs = {
            schema,
            document,
            variableValues,
          };

          await hookArgs(args, resolvedPreset, {});

          // We must override the context so that we can listen to the SQL queries.
          args.contextValue = {
            pgSettings: (args.contextValue as any).pgSettings,
            withPgClient,
            pgSubscriber,
          };

          const schemaValidationErrors = validateSchema(schema);
          if (schemaValidationErrors.length > 0) {
            throw new Error(
              `Invalid schema: ${schemaValidationErrors
                .map((e) => String(e))
                .join(",")}`,
            );
          }

          const operationAST = getOperationAST(document, undefined);
          const operationType = operationAST!.operation;

          const validationErrors = validate(schema, document);
          if (validationErrors.length > 0) {
            throw new Error(
              `Invalid operation document: ${validationErrors
                .map((e) => String(e))
                .join(",")}`,
            );
          }

          const execute =
            options.prepare ?? true
              ? grafastExecute
              : (args: ExecutionArgs) => graphqlExecute(args);
          const subscribe =
            options.prepare ?? true
              ? grafastSubscribe
              : (args: SubscriptionArgs) => graphqlSubscribe(args);

          const result =
            operationType === "subscription"
              ? await subscribe(args, resolvedPreset)
              : await execute(args, resolvedPreset);

          if (isAsyncIterable(result)) {
            let errors: GraphQLError[] | undefined = undefined;
            // hasNext changes based on payload order; remove it.
            const originalPayloads: Omit<AsyncExecutionResult, "hasNext">[] =
              [];

            // Start collecting the payloads
            const promise = (async () => {
              for await (const entry of result) {
                const { hasNext, ...rest } = entry;
                if (Object.keys(rest).length > 0 || hasNext) {
                  // Do not add the trailing `{hasNext: false}` entry to the snapshot
                  originalPayloads.push(rest);
                }
                if (entry.errors) {
                  if (!errors) {
                    errors = [];
                  }
                  errors.push(...entry.errors);
                }
              }
            })();

            // In parallel to collecting the payloads, run the callback
            if (options.callback) {
              if (!config.directPg) {
                throw new Error("Can only use callback in directPg mode");
              }
              const poolClient = await pgPool.connect();
              try {
                await options.callback(poolClient, originalPayloads);
              } catch (e) {
                console.error(
                  "Detected error during test callback; here's the payloads we have thus far:",
                );
                console.error(originalPayloads);
                throw e;
              } finally {
                poolClient.release();
              }
            }

            if (operationType === "subscription") {
              const iterator = result[Symbol.asyncIterator]();
              // Terminate the subscription
              iterator.return?.();
            }

            // Now wait for all payloads to have been collected
            await promise;

            // Now we're going to reorder the payloads so that they're always in a
            // consistent order for the snapshots.
            const sortPayloads = (
              payload1: ExecutionPatchResult,
              payload2: ExecutionPatchResult,
            ) => {
              const ONE_AFTER_TWO = 1;
              const ONE_BEFORE_TWO = -1;
              if (!payload1.path) {
                return 0;
              }
              if (!payload2.path) {
                return 0;
              }

              // Make it so we can assume payload1 has the longer (or equal) path
              if (payload2.path.length > payload1.path.length) {
                return -sortPayloads(payload2, payload1);
              }

              for (let i = 0, l = payload1.path.length; i < l; i++) {
                let key1 = payload1.path[i];
                let key2 = payload2.path[i];
                if (key2 === undefined) {
                  return ONE_AFTER_TWO;
                }
                if (key1 === key2) {
                  /* continue */
                } else if (
                  typeof key1 === "number" &&
                  typeof key2 === "number"
                ) {
                  const res = key1 - key2;
                  if (res !== 0) {
                    return res;
                  }
                } else if (
                  typeof key1 === "string" &&
                  typeof key2 === "string"
                ) {
                  const res = key1.localeCompare(key2, "en-US");
                  if (res !== 0) {
                    return res;
                  }
                } else {
                  throw new Error("Type mismatch");
                }
              }
              // We should do canonical JSON... but whatever.
              return JSON.stringify(payload1).localeCompare(
                JSON.stringify(payload2),
                "en-US",
              );
            };
            const payloads: AsyncExecutionResult[] = [
              originalPayloads[0],
              ...originalPayloads.slice(1).sort(sortPayloads),
            ];

            return {
              payloads,
              errors,
              queries,
              extensions: payloads[0].extensions,
            };
          } else {
            // Throw away symbol keys/etc
            const { data, errors, extensions } = JSON.parse(
              JSON.stringify(result),
            );
            if (errors) {
              console.error(result.errors?.[0].originalError || errors[0]);
            }
            if (options.callback) {
              throw new Error(
                "Callback is only appropriate when operation returns an async iterable" +
                  String(errors ? errors[0].originalError || errors[0] : ""),
              );
            }
            return { data, errors, queries, extensions };
          }
        } finally {
          await pgSubscriber.release();
        }
      },
    );
  } finally {
    if (cleanupSql) {
      await pgPool.query(cleanupSql);
    }
  }
}

/**
 * If UPDATE_SNAPSHOTS is set then wrotes the given snapshot to the given
 * filePath, otherwise it asserts that the snapshot matches the previous
 * snapshot.
 */
export async function snapshot(actual: string, filePath: string) {
  let expected: string | null = null;
  try {
    expected = await fsp.readFile(filePath, "utf8");
  } catch (e) {
    /* noop */
  }
  if (expected == null || shouldUpdateSnapshot(filePath)) {
    if (expected !== actual) {
      console.warn(`Updated snapshot in '${filePath}'`);
      await fsp.writeFile(filePath, actual);
    }
  } else {
    expect(actual).toEqual(expected);
  }
}

const sqlSnapshotAliases = new Map();
let sqlSnapshotAliasCount = 0;

beforeEach(() => {
  sqlSnapshotAliases.clear();
  sqlSnapshotAliasCount = 0;
});
afterAll(() => {
  sqlSnapshotAliases.clear();
});

/**
 * Replace non-deterministic parts of the query with more deterministic
 * equivalents.
 */
function makeSQLSnapshotSafe(sql: string): string {
  return sql.replace(/__cursor_[0-9]+__/g, (t) => {
    const substitute = sqlSnapshotAliases.get(t);
    if (substitute != null) {
      return substitute;
    } else {
      const sub = `__SNAPSHOT_CURSOR_${sqlSnapshotAliasCount++}__`;
      sqlSnapshotAliases.set(t, sub);
      return sub;
    }
  });
}

const UUID_REGEXP = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

/**
 * Replaces non-deterministic parts of the response with more deterministic
 * equivalents.
 */
function makeResultSnapshotSafe(
  data: any,
  replacements: { uuid: Map<string, number>; uuidCounter: number },
): any {
  if (Array.isArray(data)) {
    return data.map((entry) => makeResultSnapshotSafe(entry, replacements));
  } else if (typeof data === "object") {
    if (data == null) {
      return data;
    }
    const keys = Object.keys(data);
    return keys.reduce((memo, key) => {
      if (key.startsWith("jwt") && typeof data[key] === "string") {
        try {
          const content = decode(data[key]) as JwtPayload;
          if (typeof content.iat === "number") {
            content.iat = "<number>" as any;
          }

          memo[key] = `JWT<${JSON5.stringify(content)} (unverified)>`;
          return memo;
        } catch (e) {
          // ignore
        }
      }
      memo[key] = makeResultSnapshotSafe(data[key], replacements);
      return memo;
    }, {} as any);
  } else if (
    typeof data === "string" &&
    UUID_REGEXP.test(data) &&
    !data.includes("-0000-0000-")
  ) {
    const uuidNumber = replacements.uuid.has(data)
      ? replacements.uuid.get(data)
      : replacements.uuidCounter++;
    if (!replacements.uuid.has(data)) {
      replacements.uuid.set(data, uuidNumber);
    }
    return `<UUID ${uuidNumber}>`;
  } else {
    return data;
  }
}

function makePayloadSnapshotSafe(
  payload: any,
  replacements: { uuid: Map<string, number>; uuidCounter: number },
) {
  const p = { ...payload };
  delete p.extensions;
  return makeResultSnapshotSafe(p, replacements);
}

function mask(data: any, config: any) {
  if (!config.mask) {
    return data;
  }
  const masks = Array.isArray(config.mask) ? config.mask : [config.mask];
  const copy = JSON.parse(JSON.stringify(data));
  const known: any[] = [];
  const maskIt = (v: any) => {
    if (!v) {
      // Make sure `null` and `undefined` don't get masked
      return v;
    }
    let i = known.indexOf(v);
    if (i < 0) {
      i = known.push(v) - 1;
    }
    return `<MASKED-${i}>`;
  };
  for (const mask of masks) {
    const parts = mask.split(".");
    let obj = copy;
    for (let i = 0, l = parts.length - 1; i < l && obj; i++) {
      obj = obj[parts[i]];
    }
    if (obj) {
      obj[parts[parts.length - 1]] = maskIt(obj[parts[parts.length - 1]]);
    }
  }
  return copy;
}

/**
 * Build the snapshot for the given mode ('only') and then assert it matches
 * (or store it).
 */
export const assertSnapshotsMatch = async (
  only: "sql" | "result" | "errors" | "mermaid",
  props: {
    result: ReturnType<typeof runTestQuery>;
    document: string;
    path: string;
    config: any;
    ext?: string;
  },
): Promise<void> => {
  const { path, result, ext, config } = props;
  const basePath = path.replace(/\.test\.graphql$/, "");
  if (basePath === path) {
    throw new Error(`Failed to trim .test.graphql from '${path}'`);
  }

  const { data, payloads, queries, errors, extensions } = await result;

  const replacements = { uuid: new Map<string, number>(), uuidCounter: 1 };

  if (only === "result") {
    const resultFileName = basePath + (ext || "") + ".json5";
    const processedResults = payloads
      ? payloads.map((payload) =>
          makePayloadSnapshotSafe(payload, replacements),
        )
      : makePayloadSnapshotSafe(data, replacements);
    const maskedResults = mask(processedResults, config);
    const formattedData =
      //prettier.format(
      JSON5.stringify(maskedResults, {
        space: 2,
        quote: '"',
      }) + "\n";
    // , {
    //   parser: "json5",
    //   printWidth: 120,
    // });
    await snapshot(formattedData, resultFileName);
  } else if (only === "errors") {
    const errorsFileName = basePath + (ext || "") + ".errors.json5";
    const processedErrors = errors
      ? makeResultSnapshotSafe(errors, replacements).sort(
          (e1: GraphQLError, e2: GraphQLError) => {
            return pathCompare(e1.path, e2.path);
          },
        )
      : null;
    const formattedErrors = processedErrors //prettier.format(
      ? JSON5.stringify(processedErrors, null, 2)
      : "null";
    //   {
    //     parser: "json5",
    //     printWidth: 120,
    //   },
    // );
    await snapshot(formattedErrors, errorsFileName);
  } else if (only === "sql") {
    const sqlFileName = basePath + (ext || "") + ".sql";
    const formattedQueries = queries
      .map((q) => makeSQLSnapshotSafe(q.text))
      .join("\n\n");
    await snapshot(formattedQueries, sqlFileName);
  } else if (only === "mermaid") {
    const planOp = extensions?.explain?.operations?.find(
      (op) => op.type === "plan",
    );

    const graphString = planOp ? planToMermaid(planOp.plan) : undefined;
    const mermaidFileName = basePath + (ext || "") + ".mermaid";
    if (!graphString) {
      throw new Error("No plan was emitted for this test!");
    }
    const lines = graphString.split("\n");
    const relativePath = relative(__dirname, basePath);
    const i = lines.indexOf("    subgraph Buckets");
    if (i < 0) {
      lines.splice(1, 0, `    subgraph "${relativePath}"`, `    end`);
    } else {
      lines.splice(i, 1, `    subgraph "Buckets for ${relativePath}"`);
    }
    const content = `${lines.join("\n")}\n`;
    await snapshot(content, mermaidFileName);
  } else {
    throw new Error(
      `Unexpected argument to assertSnapshotsMatch; expected result|sql, received '${only}'`,
    );
  }
};

export const assertResultsMatch = async (
  result1: ReturnType<typeof runTestQuery>,
  result2: ReturnType<typeof runTestQuery>,
  { config }: { config: any },
): Promise<void> => {
  const { data: data1 } = await result1;
  const { data: data2 } = await result2;
  const data1a = makeResultSnapshotSafe(data1, {
    uuid: new Map<string, number>(),
    uuidCounter: 1,
  });
  const data2a = makeResultSnapshotSafe(data1, {
    uuid: new Map<string, number>(),
    uuidCounter: 1,
  });

  const maskedData1 = mask(data1a, config);
  const maskedData2 = mask(data2a, config);
  expect(maskedData2).toEqual(maskedData1);
};

export const assertErrorsMatch = async (
  result1: ReturnType<typeof runTestQuery>,
  result2: ReturnType<typeof runTestQuery>,
  { config }: { config: any },
): Promise<void> => {
  const { errors: errors1 } = await result1;
  const { errors: errors2 } = await result2;
  expect(errors2).toEqual(errors1);
};

function applyV4Stuff(
  preset: GraphileConfig.Preset,
  config: Record<string, any>,
): void {
  (preset.extends as Array<GraphileConfig.Preset>).push(
    makeV4Preset({
      ...config,
      ...(config.jwtSecret === true
        ? {
            jwtSecret: SHARED_JWT_SECRET,
          }
        : null),
    }),
  );
}

export const StripOidsPlugin: GraphileConfig.Plugin = {
  name: "StripOidsPlugin",
  version: "0.0.0",

  gather: {
    hooks: {
      pgCodecs_PgCodec(info, event) {
        delete event.pgCodec.extensions?.oid;
      },
    },
  },
};
