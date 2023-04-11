/**
 * This is an adaptor for the `pg` module.
 */

// TODO: don't import 'pg' or '@graphile/lru', we don't want these to be dependencies of @dataplan/pg.
// TODO: This file should only be available via direct (path) import, it should not be included in the main package exports.

import "../interfaces.js";

import LRU from "@graphile/lru";
import EventEmitter from "eventemitter3";
import type { Deferred, GrafastSubscriber, PromiseOrDirect } from "grafast";
import { defer } from "grafast";
import type {
  Notification,
  Pool,
  PoolClient,
  QueryArrayConfig,
  QueryConfig,
  QueryResultRow,
} from "pg";
import * as pg from "pg";

import type {
  PgClient,
  PgClientQuery,
  PgClientResult,
  WithPgClient,
} from "../executor.js";
import type { MakePgConfigOptions } from "../interfaces.js";

// Set `DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE=0` to disable prepared statements
const cacheSizeFromEnv = process.env.DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE
  ? parseInt(process.env.DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE, 10)
  : null;
/**
 * If 0, prepared statements are disabled. Otherwise how many prepared
 * statements should we keep around at any one time?
 */
const PREPARED_STATEMENT_CACHE_SIZE =
  !!cacheSizeFromEnv || cacheSizeFromEnv === 0 ? cacheSizeFromEnv : 100;

const $$isSetup = Symbol("isConfiguredForDataplanPg");

/**
 * \> JIT compilation is beneficial primarily for long-running CPU-bound
 * \> queries. Frequently these will be analytical queries. For short
 * \> queries the added overhead of performing JIT compilation will
 * \> often be higher than the time it can save.
 * -- https://www.postgresql.org/docs/14/jit-decision.html
 *
 * `@dataplan/pg` is designed for extremely fast queries, but sometimes
 * user code can make Postgres think the cost of the query is going to
 * be very high (this is especially the case when lots of "computed
 * column functions" are used), and thus enables JIT. In testing we've
 * seen queries that would take 50ms with `jit=off` take 8200ms with
 * jit on. As such we've made the decision to disable jit for all
 * queries.
 *
 * If you don't agree with our decision, disable this by setting the
 * environmental variable `DATAPLAN_PG_DONT_DISABLE_JIT=1`.
 */
const DONT_DISABLE_JIT = process.env.DATAPLAN_PG_DONT_DISABLE_JIT === "1";

function newNodePostgresPgClient(
  pgClient: pg.PoolClient,
  txLevel: number,
  alwaysQueue: boolean,
  alreadyInTransaction: boolean,
): PgClient {
  let queue: Promise<void> | null = null;
  const addToQueue = <T>(callback: () => Promise<T>): Promise<T> => {
    const result = queue ? queue.then(callback) : callback();

    const clearIfSame = () => {
      // Clear queue unless it has moved on
      if (queue === newQueue) {
        queue = null;
      }
    };
    const newQueue = result.then(clearIfSame, clearIfSame);
    queue = newQueue;

    return result;
  };
  return {
    withTransaction(callback) {
      // Transactions always queue; creating queue if need be
      return addToQueue(async () => {
        if (txLevel === 0 && !alreadyInTransaction) {
          await pgClient.query({ text: "begin" });
        } else {
          await pgClient.query({
            text: `savepoint tx${txLevel === 0 ? "" : txLevel}`,
          });
        }
        try {
          const newClient = newNodePostgresPgClient(
            pgClient,
            txLevel + 1,
            alwaysQueue,
            alreadyInTransaction,
          );
          const innerResult = await callback(newClient);
          if (txLevel === 0 && !alreadyInTransaction) {
            await pgClient.query({ text: "commit" });
          } else {
            await pgClient.query({
              text: `release savepoint tx${txLevel === 0 ? "" : txLevel}`,
            });
          }
          return innerResult;
        } catch (e) {
          try {
            if (txLevel === 0 && !alreadyInTransaction) {
              await pgClient.query({ text: "rollback" });
            } else {
              await pgClient.query({
                text: `rollback to savepoint tx${txLevel === 0 ? "" : txLevel}`,
              });
            }
          } catch (e2) {
            console.error(`Error occurred whilst rolling back: ${e}`);
          }
          throw e;
        }
      });
    },
    query<TData>(opts: PgClientQuery): Promise<PgClientResult<TData>> {
      // Queries only need to queue if there's a queue already
      if (queue || alwaysQueue) {
        return addToQueue(doIt);
      } else {
        return doIt();
      }
      function doIt() {
        const { text, name, values, arrayMode } = opts;
        const queryObj: QueryConfig | QueryArrayConfig = arrayMode
          ? {
              text,
              values,
              rowMode: "array",
            }
          : {
              text,
              values,
            };

        if (PREPARED_STATEMENT_CACHE_SIZE > 0 && name != null) {
          // Hacking into pgClient internals - this is dangerous, but it's the only way I know to get a prepared statement LRU
          const connection = (pgClient as any).connection;
          if (connection && connection.parsedStatements) {
            if (!connection._graphilePreparedStatementCache) {
              connection._graphilePreparedStatementCache = new LRU({
                maxLength: PREPARED_STATEMENT_CACHE_SIZE,
                dispose(key) {
                  if (connection.parsedStatements[key]) {
                    pgClient
                      .query(`deallocate ${pgClient.escapeIdentifier(key)}`)
                      .then(() => {
                        delete connection.parsedStatements[key];
                      })
                      .catch((e) => {
                        // eslint-disable-next-line no-console
                        console.error("Error releasing prepared query", e);
                      });
                  }
                },
              });
            }
            if (!connection._graphilePreparedStatementCache.get(name)) {
              // We're relying on dispose to clear out the old ones.
              connection._graphilePreparedStatementCache.set(name, true);
            }
            queryObj.name = name;
          }
        }

        // TODO: fix the never
        return pgClient.query<TData extends QueryResultRow ? TData : never>(
          queryObj,
        );
      }
    },
  };
}

const $$queue = Symbol("tag");
declare module "pg" {
  interface PoolClient {
    [$$queue]?: Promise<any> | null;
    [$$isSetup]?: true;
  }
}

async function makeNodePostgresWithPgClient_inner<T>(
  pgClient: pg.PoolClient,
  pgSettings: { [key: string]: string } | null,
  callback: (client: PgClient) => T | Promise<T>,
  alwaysQueue: boolean,
  alreadyInTransaction: boolean,
) {
  /** Transaction level; 0 = no transaction; 1 = begin; 2,... = savepoint */
  const pgSettingsEntries: Array<[string, string]> = [];
  if (pgSettings) {
    for (const [key, value] of Object.entries(pgSettings)) {
      if (value == null) continue;
      pgSettingsEntries.push([key, "" + value]);
    }
  }

  // PERF: under what situations is this actually required? We added it to
  // force test queries that were sharing the same client to run in series
  // rather than parallel (probably for the filter plugin test suite?) but it
  // adds a tiny bit of overhead and most likely is only needed for people
  // using makeWithPgClientViaPgClientAlreadyInTransaction.
  while (pgClient[$$queue]) {
    await pgClient[$$queue];
  }

  return (pgClient[$$queue] = (async () => {
    try {
      // If there's pgSettings; create a transaction and set them, otherwise no transaction needed
      if (pgSettingsEntries.length > 0) {
        await pgClient.query({
          text: alreadyInTransaction ? "savepoint tx" : "begin",
        });
        try {
          await pgClient.query({
            text: "select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el",
            values: [JSON.stringify(pgSettingsEntries)],
          });
          const client = newNodePostgresPgClient(
            pgClient,
            1,
            alwaysQueue,
            alreadyInTransaction,
          );
          const result = await callback(client);
          await pgClient.query({
            text: alreadyInTransaction ? "release savepoint tx" : "commit",
          });
          return result;
        } catch (e) {
          await pgClient.query({
            text: alreadyInTransaction
              ? "rollback to savepoint tx"
              : "rollback",
          });
          throw e;
        }
      } else {
        const client = newNodePostgresPgClient(
          pgClient,
          0,
          alwaysQueue,
          alreadyInTransaction,
        );
        return await callback(client);
      }
    } finally {
      pgClient[$$queue] = null;
    }
  })());
}

/**
 * Returns a `withPgClient` for the given `pg.Pool` instance.
 */
export function makePgAdaptorWithPgClient(
  pool: Pool,
  release: () => PromiseOrDirect<void> = () => {},
): WithPgClient {
  const withPgClient: WithPgClient = async (pgSettings, callback) => {
    const pgClient = await pool.connect();
    if (!pgClient[$$isSetup]) {
      pgClient[$$isSetup] = true;
      if (!DONT_DISABLE_JIT) {
        // We don't actually disable JIT, it's the optimization that's expensive so we disable that.
        pgClient.query("set jit_optimize_above_cost = -1;").catch((e) => {
          console.error(
            `Error occurred applying @dataplan/pg global Postgres settings: ${e}`,
          );
        });
      }
    }
    try {
      return await makeNodePostgresWithPgClient_inner(
        pgClient,
        pgSettings,
        callback,
        false,
        false,
      );
    } finally {
      // TODO: should we `RESET ALL` here? Probably not; otherwise timezone,jit,etc will reset
      pgClient.release();
    }
  };

  let released = false;
  const releaseOnce = () => {
    if (released) {
      throw new Error("Release called twice on the same withPgClient");
    } else {
      released = true;
      release();
    }
  };

  withPgClient.release = releaseOnce;
  return withPgClient;
}

/**
 * Returns a `withPgClient` for the given `pg.PoolClient` instance. ONLY
 * SUITABLE FOR TESTS!
 *
 */
export function makeWithPgClientViaPgClientAlreadyInTransaction(
  pgClient: pg.PoolClient,
  alreadyInTransaction = false,
): WithPgClient {
  const release = () => {};
  const withPgClient: WithPgClient = async (pgSettings, callback) => {
    return makeNodePostgresWithPgClient_inner(
      pgClient,
      pgSettings,
      callback,
      // Ensure only one withPgClient can run at a time, since we only have on pgClient.
      true,
      alreadyInTransaction,
    );
  };

  let released = false;
  const releaseOnce = () => {
    if (released) {
      throw new Error("Release called twice on the same withPgClient");
    } else {
      released = true;
      release();
    }
  };

  withPgClient.release = releaseOnce;
  return withPgClient;
}

export interface PgAdaptorOptions {
  /** ONLY FOR USE IN TESTS! */
  poolClient?: pg.PoolClient;
  /** ONLY FOR USE IN TESTS! */
  poolClientIsInTransaction?: boolean;
  /** ONLY FOR USE IN TESTS! */
  superuserPoolClient?: pg.PoolClient;
  /** ONLY FOR USE IN TESTS! */
  superuserPoolClientIsInTransaction?: boolean;

  pool?: Pool;
  poolConfig?: Omit<pg.PoolConfig, "connectionString">;
  connectionString?: string;

  /** For installing the watch fixtures */
  superuserPool?: Pool;
  /** For installing the watch fixtures */
  superuserConnectionString?: string;
}

export function createWithPgClient(
  options: PgAdaptorOptions,
  variant?: "SUPERUSER" | string | null,
): WithPgClient {
  if (variant === "SUPERUSER") {
    if (options.superuserPool) {
      return makePgAdaptorWithPgClient(options.superuserPool);
    } else if (options.superuserPoolClient) {
      return makeWithPgClientViaPgClientAlreadyInTransaction(
        options.superuserPoolClient,
        options.superuserPoolClientIsInTransaction,
      );
    } else if (options.superuserConnectionString) {
      const pool = new pg.Pool({
        ...options.poolConfig,
        connectionString: options.superuserConnectionString,
      });
      const release = () => pool.end();
      return makePgAdaptorWithPgClient(pool, release);
    }
    // Otherwise, fall through to default handling
  }
  if (options.pool) {
    return makePgAdaptorWithPgClient(options.pool);
  } else if (options.poolClient) {
    return makeWithPgClientViaPgClientAlreadyInTransaction(
      options.poolClient,
      options.poolClientIsInTransaction,
    );
  } else {
    const pool = new pg.Pool({
      ...options.poolConfig,
      connectionString: options.connectionString,
    });
    const release = () => pool.end();
    return makePgAdaptorWithPgClient(pool, release);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * This class provides helpers for Postgres' LISTEN/NOTIFY pub/sub
 * implementation. We aggregate all LISTEN/NOTIFY events so that we can supply
 * them all via a single pgClient. We grab and release this client from/to the
 * pool automatically. If the Postgres connection is interrupted then we'll
 * automatically reconnect and re-establish the LISTENs, however _events can be
 * lost_ when this happens, so you should be careful that Postgres connections
 * will not be prematurely terminated in general.
 */
export class PgSubscriber<
  TTopics extends { [key: string]: string } = { [key: string]: string },
> implements GrafastSubscriber<TTopics>
{
  private topics: { [topic in keyof TTopics]?: AsyncIterableIterator<any>[] } =
    {};
  private eventEmitter = new EventEmitter();
  private alive = true;

  constructor(private pool: Pool) {}

  private recordNotification = (notification: Notification): void => {
    this.eventEmitter.emit(notification.channel, notification.payload);
  };

  subscribe<TTopic extends keyof TTopics>(
    topic: TTopic,
  ): AsyncIterableIterator<TTopics[TTopic]> {
    if (!this.alive) {
      throw new Error("This PgSubscriber has been released.");
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const { eventEmitter, topics } = this;
    const stack: any[] = [];
    const queue: Deferred<any>[] = [];

    function doFinally() {
      if (queue) {
        const promises = queue.splice(0, queue.length);
        promises.forEach((p) => p.reject(new Error("Terminated")));
      }
      eventEmitter.removeListener(topic as string, recv);
      // Every code path above this has to go through a `yield` and thus
      // `asyncIterableIterator` will definitely be defined.
      const idx = topics[topic]?.indexOf(asyncIterableIterator);
      if (idx != null && idx >= 0) {
        topics[topic]!.splice(idx, 1);
        if (topics[topic]!.length === 0) {
          delete topics[topic];
          that.unlisten(topic);
        }
      }
    }

    const asyncIterableIterator: AsyncIterableIterator<any> = {
      [Symbol.asyncIterator]() {
        return this;
      },
      async next() {
        if (stack.length > 0) {
          const value = await stack.shift();
          return { done: false, value };
        } else {
          // This must be done synchronously - there must be **NO AWAIT BEFORE THIS**
          const waiting = defer();
          queue.push(waiting);

          const value = await waiting;
          return { done: false, value };
        }
      },
      async return(value) {
        doFinally();
        return { done: true, value: value };
      },
      async throw() {
        doFinally();
        return { done: true, value: undefined };
      },
    };

    function recv(payload: any) {
      if (queue.length > 0) {
        const first = queue.shift();
        first!.resolve(payload);
      } else {
        stack.push(payload);
      }
    }
    eventEmitter.addListener(topic as string, recv);

    if (!topics[topic]) {
      topics[topic] = [asyncIterableIterator];
      this.listen(topic);
    } else {
      topics[topic]!.push(asyncIterableIterator);
    }
    return asyncIterableIterator;
  }

  private listen<TTopic extends keyof TTopics>(_topic: TTopic) {
    this.sync();
  }

  private unlisten<TTopic extends keyof TTopics>(_topic: TTopic) {
    this.sync();
  }

  private subscribedTopics = new Set<string>();
  private sync() {
    this.chain(async () => {
      if (!this.alive) {
        return;
      }
      const client = await this.getClient();
      await this.syncWithClient(client);
    }).then(null, () => this.resetClient());
  }

  private async syncWithClient(client: PoolClient) {
    if (!this.alive) {
      throw new Error("PgSubscriber released; aborting syncWithClient");
    }
    const expectedTopics = Object.keys(this.topics);
    const topicsToAdd = expectedTopics.filter(
      (t) => !this.subscribedTopics.has(t),
    );
    const topicsToRemove = [...this.subscribedTopics.values()].filter(
      (t) => !expectedTopics.includes(t),
    );
    for (const topic of topicsToAdd) {
      await client.query(`LISTEN ${client.escapeIdentifier(topic)}`);
      this.subscribedTopics.add(topic);
    }
    for (const topic of topicsToRemove) {
      await client.query(`UNLISTEN ${client.escapeIdentifier(topic)}`);
      this.subscribedTopics.delete(topic);
    }
  }

  private resetClient() {
    this.chain(() => {
      if (!this.alive) {
        return;
      }
      const client = this.listeningClient;
      if (client) {
        client.off("notification", this.recordNotification);
        client.release();
        this.listeningClient = null;
        this.subscribedTopics.clear();
        if (this.listeningClientPromise) {
          throw new Error(
            "This should not occur (found listeningClientPromise in resetClient)",
          );
        }
        if (Object.keys(this.topics).length > 0) {
          // Trigger a new client to be fetched and have it sync.
          this.getClient().then(null, () => {
            // Must be released; ignore
          });
        }
      }
    });
  }

  private listeningClient: PoolClient | null = null;
  private listeningClientPromise: Promise<PoolClient> | null = null;
  private getClient(): Promise<PoolClient> {
    if (!this.alive) {
      return Promise.reject(new Error("Released; aborting getClient"));
    }
    if (this.listeningClient) {
      return Promise.resolve(this.listeningClient);
    } else {
      if (!this.listeningClientPromise) {
        const promise = (async () => {
          for (let attempts = 0; ; attempts++) {
            try {
              if (!this.alive) {
                return Promise.reject(
                  new Error("PgSubscriber released; aborting getClient"),
                );
              }
              const logError = (e: Error) => {
                console.error(`Error on listening client: ${e}`);
              };
              const client = await this.pool.connect();
              try {
                client.on("error", logError);
                client.on("notification", this.recordNotification);
                await this.syncWithClient(client);

                // All good; we can return this client finally!
                this.listeningClientPromise = null;
                this.listeningClient = client;
                client.off("error", logError);
                client.on("error", (e) => {
                  logError(e);
                  this.resetClient();
                });
                return client;
              } catch (e) {
                client.off("error", logError);
                client.off("notification", this.recordNotification);
                client.release();
                throw e;
              }
            } catch (e) {
              console.error(
                `Error with listening client during getClient (attempt ${
                  attempts + 1
                }): ${e}`,
              );
              // Exponential back-off (maximum 30 seconds)
              await sleep(Math.min(100 * Math.exp(attempts), 30000));
            }
          }
        })();
        promise.then(null, () => {
          /* ignore */
        });
        this.listeningClientPromise = promise;
        return promise;
      } else {
        return this.listeningClientPromise;
      }
    }
  }

  public release(): void {
    if (this.alive) {
      this.alive = false;
      for (const topic of Object.keys(this.topics)) {
        for (const asyncIterableIterator of this.topics[topic]!) {
          if (asyncIterableIterator.return) {
            asyncIterableIterator.return();
          } else if (asyncIterableIterator.throw) {
            asyncIterableIterator.throw(new Error("Released"));
          } else {
            // TODO: what happens now?
            console.error(
              `Could not return or throw from iterator for topic '${topic}'`,
            );
          }
        }
        delete this.topics[topic];
      }
      const unlistenAndRelease = async (client: PoolClient) => {
        try {
          for (const topic of this.subscribedTopics) {
            await client.query(`UNLISTEN ${client.escapeIdentifier(topic)}`);
            this.subscribedTopics.delete(topic);
          }
        } catch (e) {
          // ignore
        }
        client.release();
      };
      if (this.listeningClient) {
        unlistenAndRelease(this.listeningClient);
      } else if (this.listeningClientPromise) {
        this.listeningClientPromise.then(unlistenAndRelease, () => {
          /* ignore */
        });
      }
    }
  }

  // Avoid race conditions by chaining everything
  private promise: Promise<void> = Promise.resolve();
  private async chain(callback: () => void | Promise<void>) {
    this.promise = this.promise.then(callback, callback);
    return this.promise;
  }
}

declare global {
  namespace Grafast {
    interface Context {
      pgSettings: {
        [key: string]: string;
      } | null;
      withPgClient: WithPgClient;
      pgSubscriber: PgSubscriber | null;
    }
  }
}

export function makePgConfig(
  options: MakePgConfigOptions & { pool?: pg.Pool },
): GraphileConfig.PgDatabaseConfiguration {
  const {
    name = "main",
    connectionString,
    schemas,
    superuserConnectionString,
    withPgClientKey = name === "main" ? "withPgClient" : `${name}_withPgClient`,
    pgSettingsKey = name === "main" ? "pgSettings" : `${name}_pgSettings`,
    pgSubscriberKey = name === "main" ? "pgSubscriber" : `${name}_pgSubscriber`,
    pubsub = true,
    pgSettings,
    pgSettingsForIntrospection,
  } = options;
  if (pgSettings !== undefined && typeof pgSettingsKey !== "string") {
    throw new Error(
      `makePgConfig called with pgSettings but no pgSettingsKey - please indicate where the settings should be stored, e.g. 'pgSettingsKey: "pgSettings"' (must be unique across sources)`,
    );
  }
  const Pool = pg.Pool ?? (pg as any).default?.Pool;
  const pool =
    options.pool ??
    new Pool({
      connectionString,
    });
  if (!options.pool) {
    // If you pass your own pool, you're responsible for doing this yourself
    pool.on("connect", (client) => {
      client.on("error", (e) => {
        console.error("Client error (active)", e);
      });
    });
    pool.on("error", (e) => {
      console.error("Client error (in pool)", e);
    });
  }
  const pgSubscriber =
    options.pgSubscriber ?? (pubsub ? new PgSubscriber(pool) : null);
  const source: GraphileConfig.PgDatabaseConfiguration = {
    name,
    schemas: Array.isArray(schemas) ? schemas : [schemas ?? "public"],
    withPgClientKey: withPgClientKey as any,
    pgSettingsKey: pgSettingsKey as any,
    pgSubscriberKey: pgSubscriberKey as any,
    pgSettings,
    pgSettingsForIntrospection,
    pgSubscriber,
    adaptor: "@dataplan/pg/adaptors/pg",
    adaptorSettings: {
      pool,
      superuserConnectionString,
    },
  };
  return source;
}
