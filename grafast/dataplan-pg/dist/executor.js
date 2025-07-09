"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgExecutor = void 0;
const tslib_1 = require("tslib");
const lru_1 = tslib_1.__importDefault(require("@graphile/lru"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const grafast_1 = require("grafast");
const formatSQLForDebugging_js_1 = require("./formatSQLForDebugging.js");
const inspect_js_1 = require("./inspect.js");
const LOOK_DOWN = "👇".repeat(30);
const LOOK_UP = "👆".repeat(30);
const $$FINISHED = Symbol("finished");
class Wrapped {
    constructor(originalValue) {
        this.originalValue = originalValue;
    }
}
let cursorCount = 0;
const debug = (0, debug_1.default)("@dataplan/pg:PgExecutor");
const debugVerbose = debug.extend("verbose");
const debugExplain = debug.extend("explain");
/**
 * Represents a PostgreSQL database connection, can be used for issuing queries
 * to the database. Used by PgResource but also directly by things like
 * PgSimpleFunctionCallStep. Was once PgDataSource itself. Multiple PgExecutors
 * can exist in the same schema. PgExecutor is also responsible for things like
 * caching.
 */
class PgExecutor {
    constructor(options) {
        const { name, context } = options;
        this.name = name;
        this.$$cache = Symbol(this.name + "_cache");
        this.contextCallback = context;
    }
    toString() {
        return chalk_1.default.bold.blue(`PgExecutor(${this.name})`);
    }
    // public context(): ExecutableStep
    context() {
        return this.contextCallback();
    }
    async _executeWithClient(client, text, values, name, publish) {
        let queryResult = null, error = null;
        const start = process.hrtime.bigint();
        try {
            queryResult = await client.query({
                text,
                values: values,
                arrayMode: true,
                name,
            });
        }
        catch (e) {
            error = e;
        }
        const end = process.hrtime.bigint();
        // TODO: this should be based on the headers of the incoming request
        const shouldExplain = debugExplain.enabled;
        const explainAnalyzeSafe = shouldExplain && /^\s*select/i.test(text);
        let explain = undefined;
        if (shouldExplain && !error) {
            const explainResult = await client.query({
                text: `EXPLAIN (${explainAnalyzeSafe ? "ANALYZE, " : ""}COSTS, VERBOSE, BUFFERS, SETTINGS) ${text}`,
                values: values,
                arrayMode: true,
            });
            const firstResult = explainResult.rows[0];
            const key = firstResult ? Object.keys(firstResult)[0] : "0";
            explain =
                explainResult.rows.length === 1 &&
                    typeof firstResult[key] === "object" &&
                    firstResult[key] !== null
                    ? // Support for 'FORMAT JSON'
                        JSON.stringify(firstResult[key], null, 2)
                    : explainResult.rows.map((r) => r[key]).join("\n");
        }
        if (debugVerbose.enabled || debugExplain.enabled) {
            const duration = (Number((end - start) / 10000n) / 100).toFixed(2) + "ms";
            const rows = queryResult?.rows;
            const rowResults = rows && rows.length > 10
                ? "[\n  " +
                    rows
                        .slice(0, 3)
                        .map((row) => (0, inspect_js_1.inspect)(row, { colors: true, depth: 5 }).replace(/\n/g, "\n  "))
                        .join(",\n  ") +
                    ",\n\n  ...\n\n  " +
                    rows
                        .slice(rows.length - 3)
                        .map((row) => (0, inspect_js_1.inspect)(row, { colors: true, depth: 5 }).replace(/\n/g, "\n  "))
                        .join("\n  ") +
                    "\n]"
                : (0, inspect_js_1.inspect)(queryResult?.rows, { colors: true, depth: 6 });
            (debugExplain.enabled ? debugExplain : debugVerbose)(`\


%s
# SQL QUERY:
%s

# PLACEHOLDERS:
%o

${error
                ? `\
# ERROR:
%o`
                : `\
# RESULT:
%s`}

# DURATION
${duration}
%s


# EXPLAIN
%s


`, LOOK_DOWN, (0, formatSQLForDebugging_js_1.formatSQLForDebugging)(text, error), values, error ? error : rowResults, LOOK_UP, explain ??
                (shouldExplain
                    ? `(Explain disabled ${error ? "due to error" : "due to unknown reason"})`
                    : `(Use 'DEBUG="@dataplan/pg:PgExecutor:explain"' to enable explain)`));
        }
        if (publish !== undefined) {
            publish(text, name, explain);
        }
        if (error) {
            throw error;
        }
        if (!queryResult) {
            // Appease TypeScript
            throw new Error("No query result and no error? Impossible.");
        }
        return queryResult;
    }
    async _execute(context, text, values, name, publish) {
        // PERF: we could probably make this more efficient by grouping the
        // deferreds further, DataLoader-style, and running one SQL query for
        // everything.
        return await context.withPgClient(context.pgSettings, (client) => this._executeWithClient(client, text, values, name, publish));
    }
    withTransaction(context, callback) {
        return context.withPgClient(context.pgSettings, (baseClient) => baseClient.withTransaction((transactionClient) => {
            const execute = (text, values) => this._executeWithClient(transactionClient, text, values);
            return callback(execute);
        }));
    }
    async executeWithCache(values, common) {
        return this._executeWithOrWithoutCache(values, common, true);
    }
    async executeWithoutCache(values, common) {
        return this._executeWithOrWithoutCache(values, common, false);
    }
    async _executeWithOrWithoutCache(values, common, useCache) {
        const { rawSqlValues, identifierIndex, eventEmitter } = common;
        const publishExecute = eventEmitter
            ? (text, name, explain) => {
                eventEmitter.emit("explainOperation", {
                    operation: {
                        type: "sql",
                        title: `SQL query${name ? ` '${name.slice(0, 7)}...'` : ""}`,
                        query: text,
                        explain,
                    },
                });
            }
            : undefined;
        const valuesCount = values.length;
        const results = [];
        const batches = (() => {
            if (common.useTransaction) {
                // If we're using a transaction, use a separate batch for each query.
                return values.map(({ context, queryValues }, resultIndex) => [context, [{ queryValues, resultIndex }]]);
            }
            else {
                // Group by context
                const groupMap = new Map();
                for (let resultIndex = 0, l = valuesCount; resultIndex < l; resultIndex++) {
                    results[resultIndex] = undefined;
                    const { context, queryValues } = values[resultIndex];
                    let entry = groupMap.get(context);
                    if (!entry) {
                        entry = [];
                        groupMap.set(context, entry);
                    }
                    entry.push({ queryValues, resultIndex });
                }
                return groupMap.entries();
            }
        })();
        // For each context, run the relevant fetches
        const promises = [];
        for (const [context, batch] of batches) {
            promises.push((async () => {
                let cacheForContext = useCache
                    ? context[this.$$cache]
                    : null;
                if (!cacheForContext) {
                    cacheForContext = new lru_1.default({ maxLength: 500 /* SQL queries */ });
                    if (useCache) {
                        context[this.$$cache] = cacheForContext;
                    }
                }
                const textAndValues = `${common.text}\n${JSON.stringify(rawSqlValues)}`;
                let cacheForQuery = cacheForContext.get(textAndValues);
                if (!cacheForQuery) {
                    cacheForQuery = new Map();
                    cacheForContext.set(textAndValues, cacheForQuery);
                }
                const scopedCache = cacheForQuery;
                /**
                 * The `identifiersJSON` (`JSON.stringify(queryValues)`) that don't exist in the cache currently.
                 */
                const remaining = [];
                const remainingDeferreds = [];
                try {
                    // Concurrent requests to the same queryValues should result in the same value/execution.
                    const batchSize = batch.length;
                    for (let batchIndex = 0; batchIndex < batchSize; batchIndex++) {
                        const { queryValues, resultIndex } = batch[batchIndex];
                        const identifiersJSON = JSON.stringify(queryValues); // PERF: Canonical? Manual for perf?
                        const existingResult = scopedCache.get(identifiersJSON);
                        if (existingResult) {
                            if (debugVerbose.enabled) {
                                debugVerbose("%s served %o from cache: %c", this, identifiersJSON, existingResult);
                            }
                            results[resultIndex] = existingResult;
                        }
                        else {
                            if (debugVerbose.enabled) {
                                debugVerbose("%s no entry for %o in cache %c", this, identifiersJSON, scopedCache);
                            }
                            if (grafast_1.isDev && remaining.includes(identifiersJSON)) {
                                throw new Error("Should only fetch each identifiersJSON once, future entries in the loop should receive previous deferred");
                            }
                            const pendingResult = (0, grafast_1.defer)(); // CRITICAL: this MUST resolve later
                            results[resultIndex] = pendingResult;
                            scopedCache.set(identifiersJSON, pendingResult);
                            remaining.push(identifiersJSON) - 1;
                            remainingDeferreds.push(pendingResult);
                        }
                    }
                    if (remaining.length) {
                        const { text, name } = common;
                        const sqlValues = identifierIndex == null
                            ? rawSqlValues
                            : [
                                ...rawSqlValues,
                                // Manual JSON-ing
                                "[" + remaining.join(",") + "]",
                            ];
                        // PERF: we could probably make this more efficient by grouping the
                        // deferreds further, DataLoader-style, and running one SQL query for
                        // everything.
                        const queryResult = common.useTransaction
                            ? await this.executeMutation({
                                context,
                                text,
                                values: sqlValues,
                            })
                            : await this._execute(context, text, sqlValues, name, publishExecute);
                        const { rows } = queryResult;
                        const groups = Object.create(null);
                        for (let i = 0, l = rows.length; i < l; i++) {
                            const result = rows[i];
                            const valueIndex = identifierIndex != null
                                ? result[identifierIndex]
                                : 0;
                            if (!groups[valueIndex]) {
                                groups[valueIndex] = [result];
                            }
                            else {
                                groups[valueIndex].push(result);
                            }
                        }
                        for (let i = 0, l = remainingDeferreds.length; i < l; i++) {
                            const remainingDeferred = remainingDeferreds[i];
                            const value = groups[i] ?? [];
                            remainingDeferred.resolve(value);
                        }
                    }
                }
                catch (e) {
                    // This block guarantees that all remainingDeferreds will be
                    // rejected - we don't want defers hanging around!
                    remainingDeferreds.forEach((d) => {
                        try {
                            d.reject(e);
                        }
                        catch (e2) {
                            // Ignore error when rejecting
                            console.error(`Encountered second error when rejecting deferred due to a different error; ignoring error: ${e2}`);
                        }
                    });
                    return Promise.reject(e);
                }
            })());
        }
        // Avoids UnhandledPromiseRejection error.
        await Promise.allSettled(promises);
        const finalResults = await Promise.all(results);
        return { values: finalResults };
    }
    /**
     * Returns a list of streams (async iterables), one for each entry in
     * `values`, for the results from the cursor defined by running the query
     * `common.text` with the given variables.
     */
    async executeStream(values, common) {
        const { text, rawSqlValues, identifierIndex } = common;
        const valuesCount = values.length;
        const streams = [];
        // Group by context
        const groupMap = new Map();
        for (let resultIndex = 0, l = valuesCount; resultIndex < l; resultIndex++) {
            streams[resultIndex] = null;
            const { context, queryValues } = values[resultIndex];
            let entry = groupMap.get(context);
            if (!entry) {
                entry = [];
                groupMap.set(context, entry);
            }
            entry.push({ queryValues, resultIndex });
        }
        // For each context, run the relevant fetches
        const promises = [];
        for (const [context, batch] of groupMap.entries()) {
            // ENHANCE: this is a mess, we should refactor and simplify it significantly
            const tx = (0, grafast_1.defer)();
            let txResolved = false;
            let cursorOpen = false;
            const promise = (async () => {
                const batchIndexesByIdentifiersJSON = new Map();
                // Concurrent requests to the same queryValues should result in the same value/execution.
                const batchSize = batch.length;
                for (let batchIndex = 0; batchIndex < batchSize; batchIndex++) {
                    const { queryValues } = batch[batchIndex];
                    const identifiersJSON = JSON.stringify(queryValues); // Perf: Canonical? Manual for perf?
                    const existing = batchIndexesByIdentifiersJSON.get(identifiersJSON);
                    if (existing !== undefined) {
                        existing.push(batchIndex);
                        if (debugVerbose.enabled) {
                            debugVerbose("%s served %o again (%o)", this, identifiersJSON, existing);
                        }
                        //results[resultIndex] = existingResult;
                    }
                    else {
                        if (debugVerbose.enabled) {
                            debugVerbose("%s no entry for %o, allocating", this, identifiersJSON);
                        }
                        batchIndexesByIdentifiersJSON.set(identifiersJSON, [batchIndex]);
                    }
                }
                if (batchIndexesByIdentifiersJSON.size <= 0) {
                    throw new Error("GrafastInternalError<98699a62-cd44-4372-8e92-d730b116a51d>: empty batch doesn't make sense in this context.");
                }
                const remaining = [...batchIndexesByIdentifiersJSON.keys()];
                const batchIndexesByValueIndex = [
                    ...batchIndexesByIdentifiersJSON.values(),
                ];
                // PERF: batchIndexesByIdentifiersJSON = null;
                const sqlValues = identifierIndex == null
                    ? rawSqlValues
                    : [
                        ...rawSqlValues,
                        // Manual JSON-ing
                        "[" + remaining.join(",") + "]",
                    ];
                // Maximum PostgreSQL identifier length is typically 63 bytes.
                // Minus the `__cursor___` text, this leaves 52 characters for this
                // counter. JS's largest safe integer is 2^53-1 which is 16 digits
                // long - well under the 52 character limit. Assuming we used 1000
                // cursors per second every second, it would take us 285k years to
                // exhaust this. Because this is a cursor we control and know is
                // PostgreSQL safe we don't need to escape it.
                const cursorIdentifier = `__cursor_${cursorCount++}__`;
                const batchFetchSize = 100;
                const declareCursorSQL = `declare ${cursorIdentifier} insensitive no scroll cursor without hold for\n${text}`;
                const pullViaCursorSQL = `fetch forward ${batchFetchSize} from ${cursorIdentifier}`;
                const releaseCursorSQL = `close ${cursorIdentifier}`;
                let _deferredStreams = 0;
                let valuesPending = 0;
                const pending = batch.map(() => []);
                const waiting = batch.map(() => null);
                let finished = false;
                // eslint-disable-next-line no-inner-declarations
                function getNext(batchIndex) {
                    if (pending[batchIndex].length > 0) {
                        const value = pending[batchIndex].shift();
                        valuesPending--;
                        if (valuesPending < batchFetchSize && !fetching) {
                            fetchNextBatch().then(null, handleFetchError);
                        }
                        if (value instanceof Wrapped) {
                            return Promise.reject(value.originalValue);
                        }
                        else {
                            return value;
                        }
                    }
                    else {
                        if (finished) {
                            throw $$FINISHED;
                        }
                        _deferredStreams++;
                        if (grafast_1.isDev && waiting[batchIndex]) {
                            throw new Error(`Waiting on more than one record! Forbidden!`);
                        }
                        const deferred = (0, grafast_1.defer)();
                        waiting[batchIndex] = deferred;
                        return deferred;
                    }
                }
                // eslint-disable-next-line no-inner-declarations
                function supplyValue(batchIndex, value) {
                    const deferred = waiting[batchIndex];
                    if (deferred !== null) {
                        waiting[batchIndex] = null;
                        _deferredStreams--;
                        if (value instanceof Wrapped) {
                            deferred.reject(value.originalValue);
                        }
                        else {
                            deferred.resolve(value);
                        }
                    }
                    else {
                        valuesPending++;
                        pending[batchIndex].push(value);
                    }
                }
                const executePromise = (0, grafast_1.defer)();
                const handleFetchError = (error) => {
                    if (finished) {
                        console.error(`GraphileInternalError<2a6a34e4-a172-4c9a-b74e-b87ccf1b6d47>: Received an error when stream was already finished: ${error}`);
                        return;
                    }
                    finished = true;
                    tx.resolve();
                    txResolved = true;
                    cursorOpen = false;
                    executePromise.reject(error);
                    console.error("Error occurred:");
                    console.error(error);
                    for (let i = 0, l = batch.length; i < l; i++) {
                        supplyValue(i, new Wrapped(error));
                    }
                };
                this.withTransaction(context, async (_execute) => {
                    executePromise.resolve(_execute);
                    return tx;
                }).then(null, handleFetchError);
                const execute = await executePromise;
                // eslint-disable-next-line no-inner-declarations
                let fetching = false;
                const fetchNextBatch = async () => {
                    if (fetching) {
                        return;
                    }
                    if (finished) {
                        return;
                    }
                    fetching = true;
                    const queryResult = await execute(pullViaCursorSQL, []);
                    const { rows } = queryResult;
                    if (rows.length < batchFetchSize) {
                        releaseCursor();
                    }
                    for (let i = 0, l = rows.length; i < l; i++) {
                        const result = rows[i];
                        const valueIndex = identifierIndex != null
                            ? result[identifierIndex]
                            : 0;
                        const batchIndexes = batchIndexesByValueIndex[valueIndex];
                        if (!batchIndexes) {
                            throw new Error(`GrafastInternalError<8f513ceb-a3dc-4ec7-9ca1-0f0d4576a22d>: could not determine the identifier JSON for value index '${valueIndex}'`);
                        }
                        for (let i = 0, l = batchIndexes.length; i < l; i++) {
                            supplyValue(batchIndexes[i], result);
                        }
                    }
                    fetching = false;
                    if (finished) {
                        // We've hit the end of the road
                        for (let i = 0, l = batch.length; i < l; i++) {
                            supplyValue(i, new Wrapped($$FINISHED));
                        }
                    }
                    else {
                        if (valuesPending < batchFetchSize) {
                            fetchNextBatch().then(null, handleFetchError);
                        }
                    }
                };
                // Registers the cursor
                cursorOpen = true;
                await execute(declareCursorSQL, sqlValues);
                // Ensure we release the cursor now we've registered it.
                fetchNextBatch().then(null, handleFetchError);
                function releaseCursor() {
                    finished = true;
                    if (cursorOpen) {
                        cursorOpen = false;
                        // Release the cursor
                        (async () => {
                            // This also closes the cursor
                            try {
                                await execute(releaseCursorSQL, []);
                            }
                            finally {
                                if (!txResolved) {
                                    tx.resolve();
                                    txResolved = true;
                                    cursorOpen = false;
                                }
                            }
                        })().catch((e) => {
                            console.error(`Error occurred whilst closing cursor: ${e}`);
                        });
                    }
                }
                // IMPORTANT: must *NOT* throw between here and the try block in the callback below
                let remainingBatches = batch.length;
                batch.forEach(({ resultIndex }, batchIndex) => {
                    streams[resultIndex] = (async function* () {
                        try {
                            for (;;) {
                                yield await getNext(batchIndex);
                            }
                        }
                        catch (e) {
                            if (e === $$FINISHED) {
                                return;
                            }
                            else {
                                throw e;
                            }
                        }
                        finally {
                            remainingBatches--;
                            if (remainingBatches === 0) {
                                releaseCursor();
                            }
                        }
                    })();
                });
            })();
            promise.then(null, (e) => {
                console.error("UNEXPECTED ERROR!");
                console.error(e);
                tx.resolve();
                txResolved = true;
                cursorOpen = false;
                batch.forEach(({ resultIndex }) => {
                    const stream = streams[resultIndex];
                    if ((0, grafast_1.isAsyncIterable)(stream)) {
                        stream[Symbol.asyncIterator]().throw?.(e);
                    }
                    streams[resultIndex] = Promise.reject(e);
                });
            });
            promises.push(promise);
        }
        // Avoids UnhandledPromiseRejection error.
        await Promise.allSettled(promises);
        return {
            streams: streams,
        };
    }
    async executeMutation(options) {
        const { context, text, values } = options;
        const { withPgClient, pgSettings } = context;
        // We don't explicitly need a transaction for mutations
        const queryResult = await withPgClient(pgSettings, (client) => this._executeWithClient(client, text, values));
        // PERF: we could probably make this more efficient rather than blowing away the entire cache!
        // Wipe the cache since a mutation succeeded.
        context[this.$$cache]?.reset();
        return queryResult;
    }
}
exports.PgExecutor = PgExecutor;
(0, grafast_1.exportAs)("@dataplan/pg", PgExecutor, "PgExecutor");
//# sourceMappingURL=executor.js.map