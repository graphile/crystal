"use strict";
/**
 * This is an adaptor for the `pg` module.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgSubscriber = void 0;
exports.makePgAdaptorWithPgClient = makePgAdaptorWithPgClient;
exports.makeWithPgClientViaPgClientAlreadyInTransaction = makeWithPgClientViaPgClientAlreadyInTransaction;
exports.createWithPgClient = createWithPgClient;
exports.makePgService = makePgService;
const tslib_1 = require("tslib");
// IMPORTANT: This file should only be available via direct (path) import, it should not be included in the main package exports.
require("../interfaces.js");
const lru_1 = tslib_1.__importDefault(require("@graphile/lru"));
const eventemitter3_1 = tslib_1.__importDefault(require("eventemitter3"));
const grafast_1 = require("grafast");
const pg = tslib_1.__importStar(require("pg"));
const PgPool = pg.Pool ?? pg.default?.Pool;
// Set `DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE=0` to disable prepared statements
const cacheSizeFromEnv = process.env.DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE
    ? parseInt(process.env.DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE, 10)
    : null;
/**
 * If 0, prepared statements are disabled. Otherwise how many prepared
 * statements should we keep around at any one time?
 */
const PREPARED_STATEMENT_CACHE_SIZE = !!cacheSizeFromEnv || cacheSizeFromEnv === 0 ? cacheSizeFromEnv : 100;
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
function newNodePostgresPgClient(pgClient, txLevel, alwaysQueue, alreadyInTransaction) {
    let queue = null;
    const addToQueue = (callback) => {
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
        rawClient: pgClient,
        withTransaction(callback) {
            // Transactions always queue; creating queue if need be
            return addToQueue(async () => {
                if (txLevel === 0 && !alreadyInTransaction) {
                    await pgClient.query({ text: "begin" });
                }
                else {
                    await pgClient.query({
                        text: `savepoint tx${txLevel === 0 ? "" : txLevel}`,
                    });
                }
                try {
                    const newClient = newNodePostgresPgClient(pgClient, txLevel + 1, alwaysQueue, alreadyInTransaction);
                    const innerResult = await callback(newClient);
                    if (txLevel === 0 && !alreadyInTransaction) {
                        await pgClient.query({ text: "commit" });
                    }
                    else {
                        await pgClient.query({
                            text: `release savepoint tx${txLevel === 0 ? "" : txLevel}`,
                        });
                    }
                    return innerResult;
                }
                catch (e) {
                    try {
                        if (txLevel === 0 && !alreadyInTransaction) {
                            await pgClient.query({ text: "rollback" });
                        }
                        else {
                            await pgClient.query({
                                text: `rollback to savepoint tx${txLevel === 0 ? "" : txLevel}`,
                            });
                        }
                    }
                    catch (e2) {
                        console.error(`Error occurred whilst rolling back: ${e}`);
                    }
                    throw e;
                }
            });
        },
        query(opts) {
            // Queries only need to queue if there's a queue already
            if (queue || alwaysQueue) {
                return addToQueue(doIt);
            }
            else {
                return doIt();
            }
            function doIt() {
                const { text, name, values, arrayMode } = opts;
                const queryObj = arrayMode
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
                    const connection = pgClient.connection;
                    if (connection && connection.parsedStatements) {
                        if (!connection._graphilePreparedStatementCache) {
                            connection._graphilePreparedStatementCache = new lru_1.default({
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
                return pgClient.query(queryObj);
            }
        },
    };
}
const $$queue = Symbol("tag");
async function makeNodePostgresWithPgClient_inner(pgClient, pgSettings, callback, alwaysQueue, alreadyInTransaction) {
    /** Transaction level; 0 = no transaction; 1 = begin; 2,... = savepoint */
    const pgSettingsEntries = [];
    if (pgSettings != null) {
        for (const [key, value] of Object.entries(pgSettings)) {
            if (value == null)
                continue;
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
                    const client = newNodePostgresPgClient(pgClient, 1, alwaysQueue, alreadyInTransaction);
                    const result = await callback(client);
                    await pgClient.query({
                        text: alreadyInTransaction ? "release savepoint tx" : "commit",
                    });
                    return result;
                }
                catch (e) {
                    await pgClient.query({
                        text: alreadyInTransaction
                            ? "rollback to savepoint tx"
                            : "rollback",
                    });
                    throw e;
                }
            }
            else {
                const client = newNodePostgresPgClient(pgClient, 0, alwaysQueue, alreadyInTransaction);
                return await callback(client);
            }
        }
        finally {
            pgClient[$$queue] = null;
        }
    })());
}
/**
 * Returns a `withPgClient` for the given `Pool` instance.
 */
function makePgAdaptorWithPgClient(pool, release = () => { }) {
    const withPgClient = async (pgSettings, callback) => {
        const pgClient = await pool.connect();
        if (!pgClient[$$isSetup]) {
            pgClient[$$isSetup] = true;
            if (!DONT_DISABLE_JIT) {
                // We don't actually disable JIT, it's the optimization that's expensive so we disable that.
                pgClient.query("set jit_optimize_above_cost = -1;").catch((e) => {
                    console.error(`Error occurred applying @dataplan/pg global Postgres settings: ${e}`);
                });
            }
        }
        try {
            return await makeNodePostgresWithPgClient_inner(pgClient, pgSettings, callback, false, false);
        }
        finally {
            // NOTE: have decided not to `RESET ALL` here; otherwise timezone,jit,etc will reset
            pgClient.release();
        }
    };
    let released = false;
    const releaseOnce = () => {
        if (released) {
            throw new Error("Release called twice on the same withPgClient");
        }
        else {
            released = true;
            release();
        }
    };
    withPgClient.release = releaseOnce;
    return withPgClient;
}
/**
 * Returns a `withPgClient` for the given `PoolClient` instance. ONLY
 * SUITABLE FOR TESTS!
 *
 */
function makeWithPgClientViaPgClientAlreadyInTransaction(pgClient, alreadyInTransaction = false) {
    const release = () => { };
    const withPgClient = async (pgSettings, callback) => {
        return makeNodePostgresWithPgClient_inner(pgClient, pgSettings, callback, 
        // Ensure only one withPgClient can run at a time, since we only have on pgClient.
        true, alreadyInTransaction);
    };
    let released = false;
    const releaseOnce = () => {
        if (released) {
            throw new Error("Release called twice on the same withPgClient");
        }
        else {
            released = true;
            release();
        }
    };
    withPgClient.release = releaseOnce;
    return withPgClient;
}
function createWithPgClient(options = Object.create(null), variant) {
    if (variant === "SUPERUSER") {
        if (options.superuserPool) {
            return makePgAdaptorWithPgClient(options.superuserPool);
        }
        else if (options.superuserPoolClient) {
            return makeWithPgClientViaPgClientAlreadyInTransaction(options.superuserPoolClient, options.superuserPoolClientIsInTransaction);
        }
        else if (options.superuserConnectionString) {
            const pool = new PgPool({
                ...options.superuserPoolConfig,
                connectionString: options.superuserConnectionString,
            });
            const release = () => pool.end();
            return makePgAdaptorWithPgClient(pool, release);
        }
        // Otherwise, fall through to default handling
    }
    if (options.pool != null) {
        return makePgAdaptorWithPgClient(options.pool);
    }
    else if (options.poolClient) {
        return makeWithPgClientViaPgClientAlreadyInTransaction(options.poolClient, options.poolClientIsInTransaction);
    }
    else {
        const pool = new PgPool({
            ...options.poolConfig,
            connectionString: options.connectionString,
        });
        const release = () => pool.end();
        return makePgAdaptorWithPgClient(pool, release);
    }
}
// This is here as a TypeScript assertion, to ensure we conform to PgAdaptor
const adaptor = {
    createWithPgClient,
    makePgService,
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * This class provides helpers for Postgres' LISTEN/NOTIFY pub/sub
 * implementation. We aggregate all LISTEN/NOTIFY events so that we can supply
 * them all via a single pgClient. We grab and release this client from/to the
 * pool automatically. If the Postgres connection is interrupted then we'll
 * automatically reconnect and re-establish the LISTENs, however _events can be
 * lost_ when this happens, so you should be careful that Postgres connections
 * will not be prematurely terminated in general.
 */
class PgSubscriber {
    constructor(pool) {
        this.pool = pool;
        this.topics = {};
        this.eventEmitter = new eventemitter3_1.default();
        this.alive = true;
        this.recordNotification = (notification) => {
            this.eventEmitter.emit(notification.channel, notification.payload);
        };
        this.subscribedTopics = new Set();
        this.listeningClient = null;
        this.listeningClientPromise = null;
        // Avoid race conditions by chaining everything
        this.promise = Promise.resolve();
    }
    subscribe(topic) {
        if (!this.alive) {
            throw new Error("This PgSubscriber has been released.");
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        const { eventEmitter, topics } = this;
        const stack = [];
        const queue = [];
        let finished = false;
        function doFinally(value) {
            if (!finished) {
                finished = { done: true, value };
                if (queue) {
                    const promises = queue.splice(0, queue.length);
                    promises.forEach((p) => p.resolve(finished));
                }
                eventEmitter.removeListener(topic, recv);
                // Every code path above this has to go through a `yield` and thus
                // `asyncIterableIterator` will definitely be defined.
                const idx = topics[topic]?.indexOf(asyncIterableIterator);
                if (idx != null && idx >= 0) {
                    topics[topic].splice(idx, 1);
                    if (topics[topic].length === 0) {
                        delete topics[topic];
                        that.unlisten(topic);
                    }
                }
            }
            return finished;
        }
        const asyncIterableIterator = {
            [Symbol.asyncIterator]() {
                return this;
            },
            async next() {
                if (stack.length > 0) {
                    const value = await stack.shift();
                    return { done: false, value };
                }
                else if (finished) {
                    return finished;
                }
                else {
                    // This must be done synchronously - there must be **NO AWAIT BEFORE THIS**
                    const waiting = (0, grafast_1.defer)();
                    queue.push(waiting);
                    const value = await waiting;
                    return { done: false, value };
                }
            },
            async return(value) {
                return doFinally(value);
            },
            async throw() {
                return doFinally();
            },
        };
        function recv(payload) {
            if (queue.length > 0) {
                const first = queue.shift();
                first.resolve(payload);
            }
            else {
                stack.push(payload);
            }
        }
        eventEmitter.addListener(topic, recv);
        if (!topics[topic]) {
            topics[topic] = [asyncIterableIterator];
            this.listen(topic);
        }
        else {
            topics[topic].push(asyncIterableIterator);
        }
        return asyncIterableIterator;
    }
    listen(_topic) {
        this.sync();
    }
    unlisten(_topic) {
        this.sync();
    }
    sync() {
        this.chain(async () => {
            if (!this.alive) {
                return;
            }
            const client = await this.getClient();
            await this.syncWithClient(client);
        }).then(null, () => this.resetClient());
    }
    async syncWithClient(client) {
        if (!this.alive) {
            throw new Error("PgSubscriber released; aborting syncWithClient");
        }
        const expectedTopics = Object.keys(this.topics);
        const topicsToAdd = expectedTopics.filter((t) => !this.subscribedTopics.has(t));
        const topicsToRemove = [...this.subscribedTopics.values()].filter((t) => !expectedTopics.includes(t));
        for (const topic of topicsToAdd) {
            await client.query(`LISTEN ${client.escapeIdentifier(topic)}`);
            this.subscribedTopics.add(topic);
        }
        for (const topic of topicsToRemove) {
            await client.query(`UNLISTEN ${client.escapeIdentifier(topic)}`);
            this.subscribedTopics.delete(topic);
        }
    }
    resetClient() {
        this.chain(() => {
            if (!this.alive) {
                return;
            }
            const client = this.listeningClient;
            if (client !== null) {
                client.off("notification", this.recordNotification);
                client.release();
                this.listeningClient = null;
                this.subscribedTopics.clear();
                if (this.listeningClientPromise) {
                    throw new Error("This should not occur (found listeningClientPromise in resetClient)");
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
    getClient() {
        if (!this.alive) {
            return Promise.reject(new Error("Released; aborting getClient"));
        }
        if (this.listeningClient) {
            return Promise.resolve(this.listeningClient);
        }
        else {
            if (!this.listeningClientPromise) {
                const promise = (async () => {
                    for (let attempts = 0;; attempts++) {
                        try {
                            if (!this.alive) {
                                return Promise.reject(new Error("PgSubscriber released; aborting getClient"));
                            }
                            const logError = (e) => {
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
                            }
                            catch (e) {
                                client.off("error", logError);
                                client.off("notification", this.recordNotification);
                                client.release();
                                throw e;
                            }
                        }
                        catch (e) {
                            console.error(`Error with listening client during getClient (attempt ${attempts + 1}): ${e}`);
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
            }
            else {
                return this.listeningClientPromise;
            }
        }
    }
    release() {
        if (this.alive) {
            this.alive = false;
            for (const topic of Object.keys(this.topics)) {
                for (const asyncIterableIterator of this.topics[topic]) {
                    if (asyncIterableIterator.return) {
                        asyncIterableIterator.return();
                    }
                    else if (asyncIterableIterator.throw) {
                        asyncIterableIterator.throw(new Error("Released"));
                    }
                    else {
                        // What do we do now?!
                        // TYPES: if instead of using an AsyncIterableIterator we required it was an AsyncGenerator then this problem would go away.
                        console.error(`Could not return or throw from iterator for topic '${topic}'`);
                    }
                }
                delete this.topics[topic];
            }
            const unlistenAndRelease = async (client) => {
                try {
                    for (const topic of this.subscribedTopics) {
                        await client.query(`UNLISTEN ${client.escapeIdentifier(topic)}`);
                        this.subscribedTopics.delete(topic);
                    }
                }
                catch (e) {
                    // ignore
                }
                client.release();
            };
            if (this.listeningClient) {
                unlistenAndRelease(this.listeningClient);
            }
            else if (this.listeningClientPromise) {
                this.listeningClientPromise.then(unlistenAndRelease, () => {
                    /* ignore */
                });
            }
        }
    }
    async chain(callback) {
        this.promise = this.promise.then(callback, callback);
        return this.promise;
    }
}
exports.PgSubscriber = PgSubscriber;
function mkpool(name, releasers, poolConfig, connectionString) {
    const pool = new PgPool({ ...poolConfig, connectionString });
    releasers.push(() => pool.end());
    // If you pass your own pool, you're responsible for doing this yourself
    pool.on("connect", (client) => {
        client.on("error", (e) => {
            console.error(`Client error (active, ${name})`, e);
        });
    });
    pool.on("error", (e) => {
        console.error(`Client error (in pool, ${name})`, e);
    });
    return pool;
}
function makePgService(options) {
    const { name = "main", 
    // Begin: CommonPgAdaptorAndServiceSettings
    pool: rawPool, poolConfig, connectionString, superuserPool: rawSuperuserPool, superuserPoolConfig, superuserConnectionString, 
    // End: CommonPgAdaptorAndServiceSettings
    schemas, withPgClientKey = name === "main" ? "withPgClient" : `${name}_withPgClient`, pgSettingsKey = name === "main" ? "pgSettings" : `${name}_pgSettings`, pgSubscriberKey = name === "main" ? "pgSubscriber" : `${name}_pgSubscriber`, pubsub = true, pgSettings, pgSettingsForIntrospection, } = options;
    if (pgSettings !== undefined && typeof pgSettingsKey !== "string") {
        throw new Error(`makePgService called with pgSettings but no pgSettingsKey - please indicate where the settings should be stored, e.g. 'pgSettingsKey: "pgSettings"' (must be unique across sources)`);
    }
    const releasers = [];
    const pool = rawPool ?? mkpool("pool", releasers, poolConfig, connectionString);
    const superuserPool = rawSuperuserPool ??
        (superuserConnectionString
            ? mkpool("superuserPool", releasers, superuserPoolConfig, superuserConnectionString)
            : undefined);
    let pgSubscriber = options.pgSubscriber ?? null;
    if (!pgSubscriber && pubsub) {
        pgSubscriber = new PgSubscriber(pool);
        releasers.push(() => pgSubscriber.release?.());
    }
    const service = {
        name,
        schemas: Array.isArray(schemas) ? schemas : [schemas ?? "public"],
        withPgClientKey: withPgClientKey,
        pgSettingsKey: pgSettingsKey,
        pgSubscriberKey: pgSubscriberKey,
        pgSettings,
        pgSettingsForIntrospection,
        pgSubscriber,
        adaptor,
        adaptorSettings: {
            pool,
            superuserPool,
        },
        async release() {
            // Release in reverse order
            for (const releaser of [...releasers].reverse()) {
                await releaser();
            }
        },
    };
    return service;
}
//# sourceMappingURL=pg.js.map