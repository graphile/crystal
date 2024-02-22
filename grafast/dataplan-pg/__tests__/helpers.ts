// It's helpful to see the full error stack
Error.stackTraceLimit = Infinity;

// Normally tests complete well under 5 seconds, but sporadic issues in the
// subscriptions test on CI mean we've bumped this up
jest.setTimeout(15000);
if (process.env.DEBUG) {
  // When debug is set, outputting the console logs makes the tests slow.
  jest.setTimeout(30000);
}

import { promises as fsp } from "fs";
import {
  execute as grafastExecute,
  stringifyPayload,
  subscribe as grafastSubscribe,
} from "grafast";
import type {
  AsyncExecutionResult,
  ExecutionPatchResult,
  GraphQLError,
  GraphQLSchema,
} from "grafast/graphql";
import {
  getOperationAST,
  parse,
  validate,
  validateSchema,
} from "grafast/graphql";
import { planToMermaid } from "grafast/mermaid";
import { isAsyncIterable } from "iterall";
import JSON5 from "json5";
import { relative } from "path";
import type { PoolClient } from "pg";
import { Pool } from "pg";

import { PgSubscriber } from "../src/adaptors/pg.js";
import { makeExampleSchema } from "../src/examples/exampleSchema.js";
//import prettier from "prettier";
import type { PgClientQuery } from "../src/index.js";
import { withTestWithPgClient } from "./sharedHelpers.js";

/**
 * We go beyond what Jest snapshots allow; so we have to manage it ourselves.
 * If UPDATE_SNAPSHOTS is set then we'll write updated snapshots, otherwise
 * we'll do the default behaviour of comparing to existing snapshots.
 */
export const UPDATE_SNAPSHOTS = process.env.UPDATE_SNAPSHOTS === "1";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

/** Schema with optimizations enabled */
let optimizedSchema!: GraphQLSchema;
/** Schema with optimizations disabled */
let deoptimizedSchema!: GraphQLSchema;
/** Postgres pool */
let testPool!: Pool;

beforeAll(() => {
  optimizedSchema = makeExampleSchema();
  deoptimizedSchema = makeExampleSchema({ deoptimize: true });
  testPool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL || "graphile_grafast",
  });
  testPool.on("connect", (client) => {
    client.query(`set TimeZone to 'UTC'`);
  });
  testPool.on("error", (e) => {
    console.error("Pool error:", e);
  });
});

afterAll(async () => {
  await testPool.end();
  const p = testPool as any;
  if (p._clients.length > 0) {
    console.warn(`Warning: ${p._clients.length} clients are still in the pool`);
  }
  testPool = null as any;
  optimizedSchema = deoptimizedSchema = null as any;
});

async function resetSequences() {
  await testPool.query(
    await fsp.readFile(`${__dirname}/sequence_reset.sql`, "utf8"),
  );
}

export async function runTestQuery(
  source: string,
  config: {
    variableValues?: { [key: string]: any };
    directPg?: boolean;
    checkErrorSnapshots?: boolean;
  },
  options: {
    callback?: (
      client: PoolClient | null,
      payloads: Omit<AsyncExecutionResult, "hasNext">[],
    ) => Promise<void>;
    path: string;
    deoptimize?: boolean;
    outputDataAsString?: boolean;
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
  const { variableValues, checkErrorSnapshots } = config;
  const { path, outputDataAsString, deoptimize } = options;
  await resetSequences();

  const queries: PgClientQuery[] = [];
  const schema = deoptimize ? deoptimizedSchema : optimizedSchema;
  return withTestWithPgClient(
    testPool,
    queries,
    Boolean(config.directPg),
    async (withPgClient) => {
      const pgSubscriber = new PgSubscriber(testPool);
      try {
        const contextValue: Grafast.Context = {
          pgSettings: {},
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

        const document = parse(source);

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

        const execute = grafastExecute;
        const subscribe = grafastSubscribe;
        const preset: GraphileConfig.ResolvedPreset = {
          grafast: {
            explain: ["plan"],
          },
        };
        const result =
          operationType === "subscription"
            ? await subscribe(
                {
                  schema,
                  document,
                  variableValues,
                  contextValue,
                },
                preset,
                outputDataAsString,
              )
            : await execute(
                {
                  schema,
                  document,
                  variableValues,
                  contextValue,
                },
                preset,
                outputDataAsString,
              );

        if (isAsyncIterable(result)) {
          let errors: GraphQLError[] | undefined = undefined;
          // hasNext changes based on payload order; remove it.
          const originalPayloads: Omit<AsyncExecutionResult, "hasNext">[] = [];

          // Start collecting the payloads
          const promise = (async () => {
            for await (const rawEntry of result) {
              const entry = outputDataAsString
                ? JSON.parse(
                    stringifyPayload(rawEntry as any, outputDataAsString),
                  )
                : rawEntry;
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

            if (operationType === "subscription") {
              // Wait a moment for Postgres to synchronize across threads,
              // otherwise we might hit a race condition.
              await sleep(200);
            }

            const poolClient = await testPool.connect();
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
              } else if (typeof key1 === "number" && typeof key2 === "number") {
                const res = key1 - key2;
                if (res !== 0) {
                  return res;
                }
              } else if (typeof key1 === "string" && typeof key2 === "string") {
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
          const payloads = [
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
            stringifyPayload(result as any, outputDataAsString),
          );
          if (!checkErrorSnapshots && errors) {
            console.error(errors[0].originalError || errors[0]);
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
  ) as any;
}

/**
 * If UPDATE_SNAPSHOTS is set then wrotes the given snapshot to the given
 * filePath, otherwise it asserts that the snapshot matches the previous
 * snapshot.
 */
async function snapshot(actual: string, filePath: string) {
  let expected: string | null = null;
  try {
    expected = await fsp.readFile(filePath, "utf8");
  } catch (e) {
    /* noop */
  }
  if (expected == null || UPDATE_SNAPSHOTS) {
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
  if (payload == null) {
    return payload;
  }
  const p = { ...payload };
  delete p.extensions;
  return makeResultSnapshotSafe(p, replacements);
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
  const { path, result, ext } = props;
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
    const formattedData =
      //prettier.format(
      JSON5.stringify(processedResults, {
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
    // Consistently end in a newline
    await snapshot(formattedQueries + "\n", sqlFileName);
  } else if (only === "mermaid") {
    const planOp = extensions?.explain?.operations?.find(
      (op) => op.type === "plan",
    );
    const graphString = planToMermaid(planOp.plan);
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
): Promise<void> => {
  const { data: data1 } = await result1;
  const { data: data2 } = await result2;
  expect(data2).toEqual(data1);
};

export const assertErrorsMatch = async (
  result1: ReturnType<typeof runTestQuery>,
  result2: ReturnType<typeof runTestQuery>,
): Promise<void> => {
  const { errors: errors1 } = await result1;
  const { errors: errors2 } = await result2;
  const toJSON = (obj) =>
    typeof obj.toJSON === "function" ? obj.toJSON() : obj;
  const jsonified1 = errors1 ? errors1.map(toJSON) : errors1;
  const jsonified2 = errors2 ? errors2.map(toJSON) : errors2;
  expect(jsonified1).toEqual(jsonified2);
};
