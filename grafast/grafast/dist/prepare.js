"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grafastPrepare = grafastPrepare;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const execute_1 = require("graphql/execution/execute");
const iterall_1 = require("iterall");
const assert = tslib_1.__importStar(require("./assert.js"));
const deferred_js_1 = require("./deferred.js");
const dev_js_1 = require("./dev.js");
const executeBucket_js_1 = require("./engine/executeBucket.js");
const executeOutputPlan_js_1 = require("./engine/executeOutputPlan.js");
const OperationPlan_js_1 = require("./engine/OperationPlan.js");
const OutputPlan_js_1 = require("./engine/OutputPlan.js");
const establishOperationPlan_js_1 = require("./establishOperationPlan.js");
const interfaces_js_1 = require("./interfaces.js");
const timeSource_js_1 = require("./timeSource.js");
const utils_js_1 = require("./utils.js");
const { GraphQLError } = graphql;
const $$contextPlanCache = Symbol("contextPlanCache");
const $$bypassGraphQL = Symbol("bypassGraphQL");
const bypassGraphQLObj = Object.assign(Object.create(null), {
    [$$bypassGraphQL]: true,
});
function noop() { }
function processRoot(
// errors should already have been handled, and this ctx isn't suitable to be reused.
ctx, iterator, outputDataAsString) {
    const { streams, queue } = ctx.root;
    if (dev_js_1.isDev) {
        // Cannot add to streams/queue now - we're finished. The streams/queue
        // get their own new roots where addition streams/queue can be added.
        Object.freeze(streams);
        Object.freeze(queue);
    }
    const promises = [];
    for (const stream of streams) {
        promises.push(processStream(ctx.requestContext, iterator, stream, outputDataAsString));
    }
    for (const deferred of queue) {
        promises.push(processDeferred(ctx.requestContext, iterator, deferred, outputDataAsString));
    }
    // Terminate the iterator when we're done
    if (promises.length !== 0) {
        return Promise.all(promises).then(noop);
    }
}
function releaseUnusedIterators(bucket, bucketIndex, streams) {
    const allStreams = bucket.iterators[bucketIndex];
    if (!allStreams) {
        if (streams && streams.length > 0) {
            console.error(`GrafastInternalError<c3f57a2b-159d-49a9-924b-8e753696de06>: Untracked stream detected!`);
        }
        return;
    }
    if (streams) {
        for (const streamSpec of streams) {
            const { stream } = streamSpec;
            if (!allStreams.delete(stream)) {
                console.error(`GrafastInternalError<1e43efdf-f901-43dd-8a82-768246e61478>: Stream was returned from an output plan, but that stream wasn't tracked via the bucket.`);
            }
        }
    }
    if (allStreams.size > 0) {
        for (const stream of allStreams) {
            if (stream.return) {
                stream.return();
            }
            else if (stream.throw) {
                stream.throw(new Error(`Iterator no longer needed (due to OutputPlan branch being skipped)`));
            }
        }
    }
}
const finalize = (data, ctx, extensions, outputDataAsString) => {
    if ((0, iterall_1.isAsyncIterable)(data)) {
        // It's a subscription! Batch execute the child bucket for
        // each entry in the stream, and then the output plan for that.
        assert.strictEqual(ctx.root.queue.length, 0, "Subscription cannot also queue");
        throw new Error("TODO<172acb34-c9d4-48f5-a26f-1b37260ecc14>: subscription");
    }
    else {
        if (ctx.root.streams.length > 0 || ctx.root.queue.length > 0) {
            // Return an async iterator
            let _alive = true;
            const iterator = newIterator(() => {
                // ENHANCE: AbortSignal or similar, feed into `processRoot`?
                _alive = false;
            });
            const payload = Object.create(null);
            if (data !== undefined) {
                payload.data = data;
            }
            const errors = ctx.root.errors;
            if (errors.length > 0) {
                payload.errors = errors;
            }
            if (extensions != null) {
                payload.extensions = extensions;
            }
            payload.hasNext = true;
            iterator.push(payload);
            const promise = processRoot(ctx, iterator, outputDataAsString);
            if ((0, utils_js_1.isPromiseLike)(promise)) {
                promise.then(() => {
                    iterator.push({ hasNext: false });
                    iterator.return(undefined);
                }, (e) => {
                    iterator.throw(e);
                });
            }
            else {
                iterator.push({ hasNext: false });
                iterator.return(undefined);
            }
            return iterator;
        }
        else {
            const result = Object.create(null);
            if (data !== undefined) {
                result.data = data;
            }
            const errors = ctx.root.errors;
            if (errors.length > 0) {
                result.errors = errors;
            }
            if (extensions !== undefined) {
                result.extensions = extensions;
            }
            return result;
        }
    }
};
function outputBucket(outputPlan, rootBucket, rootBucketIndex, requestContext, path, variables, asString) {
    const operationPlan = rootBucket.layerPlan.operationPlan;
    const root = {
        insideGraphQL: false,
        errors: [],
        queue: [],
        streams: [],
        variables,
    };
    const ctx = {
        requestContext,
        root,
        path,
    };
    let childBucket;
    let childBucketIndex;
    if (outputPlan.layerPlan === rootBucket.layerPlan) {
        childBucket = rootBucket;
        childBucketIndex = rootBucketIndex;
    }
    else {
        const c = (0, OutputPlan_js_1.getChildBucketAndIndex)(outputPlan.layerPlan, null, rootBucket, rootBucketIndex, null);
        if (!c) {
            throw new Error(`GrafastInternalError<8bbf56c1-8e2a-4ee9-b5fc-724fd0ee222b>: could not find relevant bucket for output plan`);
        }
        [childBucket, childBucketIndex] = c;
    }
    try {
        const result = (0, executeOutputPlan_js_1.executeOutputPlan)(ctx, outputPlan, childBucket, childBucketIndex, asString);
        return [ctx, result ?? null];
    }
    catch (e) {
        const error = (0, OutputPlan_js_1.coerceError)(e, operationPlan.rootOutputPlan.locationDetails, []);
        ctx.root.errors.push(error);
        return [ctx, null];
    }
    finally {
        releaseUnusedIterators(rootBucket, rootBucketIndex, ctx.root.streams);
    }
}
function executePreemptive(args, operationPlan, variableValues, context, rootValue, outputDataAsString, executionTimeout) {
    const rootBucketIndex = 0;
    const size = 1;
    const polymorphicPathList = [OperationPlan_js_1.POLYMORPHIC_ROOT_PATH];
    const iterators = [new Set()];
    const store = new Map();
    store.set(operationPlan.variableValuesStep.id, (0, executeBucket_js_1.unaryExecutionValue)(variableValues));
    store.set(operationPlan.contextStep.id, (0, executeBucket_js_1.unaryExecutionValue)(context));
    store.set(operationPlan.rootValueStep.id, (0, executeBucket_js_1.unaryExecutionValue)(rootValue));
    const rootBucket = (0, executeBucket_js_1.newBucket)({
        layerPlan: operationPlan.rootLayerPlan,
        size,
        store,
        flagUnion: 0,
        polymorphicPathList,
        iterators,
    }, null);
    const startTime = timeSource_js_1.timeSource.now();
    const stopTime = executionTimeout !== null ? startTime + executionTimeout : null;
    const requestContext = {
        args,
        startTime,
        stopTime,
        // toSerialize: [],
        eventEmitter: rootValue?.[interfaces_js_1.$$eventEmitter],
        insideGraphQL: false,
    };
    const bucketPromise = (0, executeBucket_js_1.executeBucket)(rootBucket, requestContext);
    const subscriptionLayerPlan = rootBucket.layerPlan.children.find((c) => c.reason.type === "subscription");
    function executeStreamPayload(payload, index) {
        const layerPlan = subscriptionLayerPlan;
        const { rootStep } = layerPlan;
        // PERF: we could consider batching this.
        const store = new Map();
        const ZERO = 0;
        for (const depId of layerPlan.copyStepIds) {
            const executionVal = rootBucket.store.get(depId);
            // Normally this would need scaling, but not this time since we know it only represents a single entry
            store.set(depId, executionVal);
        }
        const rootExecutionValue = rootStep._isUnary
            ? (0, executeBucket_js_1.unaryExecutionValue)(payload)
            : (0, executeBucket_js_1.batchExecutionValue)([payload]);
        store.set(rootStep.id, rootExecutionValue);
        const subscriptionBucket = (0, executeBucket_js_1.newBucket)({
            layerPlan,
            store,
            flagUnion: rootBucket.flagUnion,
            polymorphicPathList: [OperationPlan_js_1.POLYMORPHIC_ROOT_PATH],
            iterators: [new Set()],
            size: 1, //store.size
        }, rootBucket.metaByMetaKey);
        const bucketPromise = (0, executeBucket_js_1.executeBucket)(subscriptionBucket, requestContext);
        function outputStreamBucket() {
            const [ctx, result] = outputBucket(operationPlan.rootOutputPlan, subscriptionBucket, ZERO, requestContext, [], rootBucket.store
                .get(operationPlan.variableValuesStep.id)
                .at(rootBucketIndex), outputDataAsString);
            return finalize(result, ctx, index === 0 ? (rootValue[interfaces_js_1.$$extensions] ?? undefined) : undefined, outputDataAsString);
        }
        if ((0, utils_js_1.isPromiseLike)(bucketPromise)) {
            return bucketPromise.then(outputStreamBucket);
        }
        else {
            return outputStreamBucket();
        }
    }
    function output() {
        // Later we'll need to loop
        // If it's a subscription we need to use the stream
        const bucketRootEValue = rootBucket.layerPlan.rootStep != null &&
            rootBucket.layerPlan.rootStep.id != null
            ? rootBucket.store.get(rootBucket.layerPlan.rootStep.id)
            : null;
        const bucketRootValue = bucketRootEValue?.at(rootBucketIndex);
        const bucketRootFlags = bucketRootEValue?._flagsAt(rootBucketIndex) ?? interfaces_js_1.NO_FLAGS;
        if (bucketRootFlags & interfaces_js_1.FLAG_ERROR) {
            releaseUnusedIterators(rootBucket, rootBucketIndex, null);
            // Something major went wrong!
            const errors = [
                new GraphQLError(bucketRootValue.message, operationPlan.rootOutputPlan.locationDetails.node, // node
                undefined, // source
                null, // positions
                null, // path
                bucketRootValue, // originalError
                null),
            ];
            const payload = Object.create(null);
            payload.errors = errors;
            const extensions = bucketRootValue[interfaces_js_1.$$extensions];
            if (extensions != null) {
                payload.extensions = extensions;
            }
            return payload;
        }
        // NOTE: this is where we determine whether to stream or not
        if (bucketRootValue != null &&
            subscriptionLayerPlan != null &&
            Array.isArray(bucketRootValue) &&
            bucketRootValue[interfaces_js_1.$$streamMore]) {
            // We expect exactly one streamable, we should not need to
            // `releaseUnusedIterators(rootBucket, rootBucketIndex, null)` here.
            const arr = bucketRootValue;
            const stream = arr[interfaces_js_1.$$streamMore];
            // Do the async iterable
            let stopped = false;
            const abort = (0, deferred_js_1.defer)();
            const iterator = newIterator((e) => {
                stopped = true;
                abort.resolve(undefined);
                if (e != null) {
                    stream.throw?.(e);
                }
                else {
                    stream.return?.();
                }
            });
            (async () => {
                let i = 0;
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const next = await Promise.race([abort, stream.next()]);
                    if (stopped || !next) {
                        break;
                    }
                    if (!next) {
                        iterator.throw(new Error("Invalid iteration"));
                        break;
                    }
                    const { done, value } = next;
                    if (done) {
                        break;
                    }
                    const payload = await Promise.race([
                        abort,
                        executeStreamPayload(value, i),
                    ]);
                    if (payload === undefined) {
                        break;
                    }
                    if ((0, iterall_1.isAsyncIterable)(payload)) {
                        // FIXME: do we need to avoid 'for await' because it can cause the
                        // stream to exit late if we're waiting on a promise and the stream
                        // exits in the interrim? We're assuming that no promises will be
                        // sufficiently long-lived for this to be an issue right now.
                        // TODO: should probably tie all this into an AbortController/signal too
                        for await (const entry of payload) {
                            iterator.push(entry);
                        }
                    }
                    else {
                        iterator.push(payload);
                    }
                    i++;
                }
            })().then(() => iterator.return(), (e) => {
                iterator.throw(e);
            });
            return iterator;
        }
        const [ctx, result] = outputBucket(operationPlan.rootOutputPlan, rootBucket, rootBucketIndex, requestContext, [], rootBucket.store.get(operationPlan.variableValuesStep.id).at(0), outputDataAsString);
        return finalize(result, ctx, rootValue[interfaces_js_1.$$extensions] ?? undefined, outputDataAsString);
    }
    if ((0, utils_js_1.isPromiseLike)(bucketPromise)) {
        return bucketPromise.then(output);
    }
    else {
        return output();
    }
}
function establishOperationPlanFromEvent(event) {
    return (0, establishOperationPlan_js_1.establishOperationPlan)(event.schema, event.operation, event.fragments, event.variableValues, event.context, event.rootValue, event.planningTimeout);
}
/**
 * @internal
 */
function grafastPrepare(args, options = {}) {
    const { schema, contextValue: context, rootValue = Object.create(null), 
    // operationName,
    // document,
    middleware, } = args;
    const exeContext = (0, execute_1.buildExecutionContext)(args);
    // If a list of errors was returned, abort
    if (Array.isArray(exeContext) || "length" in exeContext) {
        return Object.assign(Object.create(bypassGraphQLObj), {
            errors: exeContext,
            extensions: rootValue[interfaces_js_1.$$extensions],
        });
    }
    const { operation, fragments, variableValues } = exeContext;
    const planningTimeout = options.timeouts?.planning;
    let operationPlan;
    try {
        if (middleware != null) {
            operationPlan = middleware.runSync("establishOperationPlan", {
                schema,
                operation,
                fragments,
                variableValues,
                context: context,
                rootValue,
                planningTimeout,
                args,
            }, establishOperationPlanFromEvent);
        }
        else {
            operationPlan = (0, establishOperationPlan_js_1.establishOperationPlan)(schema, operation, fragments, variableValues, context, rootValue, planningTimeout);
        }
    }
    catch (error) {
        const graphqlError = error instanceof GraphQLError
            ? error
            : new GraphQLError(error.message, undefined, undefined, undefined, undefined, error, error.extensions ?? null);
        return { errors: [graphqlError] };
    }
    if (options.explain === true ||
        (options.explain && options.explain.includes("plan"))) {
        // Only build the plan once
        if (operationPlan[$$contextPlanCache] == null) {
            operationPlan[$$contextPlanCache] = operationPlan.generatePlanJSON();
        }
        rootValue[interfaces_js_1.$$extensions]?.explain?.operations.push({
            type: "plan",
            title: "Plan",
            plan: operationPlan[$$contextPlanCache],
        });
    }
    const executionTimeout = options.timeouts?.execution ?? null;
    return executePreemptive(args, operationPlan, variableValues, context, rootValue, options.outputDataAsString ?? false, executionTimeout);
}
function newIterator(abort) {
    const valueQueue = [];
    const pullQueue = [];
    let done = false;
    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        async [Symbol.asyncDispose]() {
            await this.return();
        },
        push(v) {
            if (done) {
                // LOGGING: should we raise this as a bigger issue?
                console.warn("GrafastWarning<85e02385-d3d2-48a1-b791-b4cf87817899>: value pushed into iterable after done; ignoring");
                return;
            }
            const cbs = pullQueue.shift();
            if (cbs !== undefined) {
                if ((0, utils_js_1.isPromiseLike)(v)) {
                    v.then((v) => cbs[0]({ done: false, value: v }), (e) => {
                        try {
                            const r = cbs[1](e);
                            if ((0, utils_js_1.isPromiseLike)(r)) {
                                r.then(null, noop);
                            }
                        }
                        catch (e) {
                            // ignore
                        }
                        this.throw(e);
                    });
                }
                else {
                    cbs[0]({ done: false, value: v });
                }
            }
            else {
                valueQueue.push(v);
            }
        },
        next() {
            if (valueQueue.length > 0) {
                return Promise.resolve(valueQueue.shift()).then((value) => ({
                    done: false,
                    value,
                }));
            }
            else if (done) {
                return Promise.resolve({
                    done: true,
                    value: undefined,
                });
            }
            else {
                return new Promise((resolve, reject) => {
                    pullQueue.push([resolve, reject]);
                });
            }
        },
        return() {
            if (!done) {
                done = true;
                abort();
                for (const entry of pullQueue) {
                    try {
                        entry[0]({ done: true, value: undefined });
                    }
                    catch (e) {
                        // ignore
                    }
                }
            }
            return Promise.resolve({ done: true, value: undefined });
        },
        throw(e) {
            if (!done) {
                done = true;
                abort(e);
                for (const entry of pullQueue) {
                    try {
                        entry[0]({ done, value: undefined });
                    }
                    catch (e) {
                        // ignore
                    }
                }
            }
            return Promise.reject(e);
        },
    };
}
async function processStream(requestContext, iterator, spec, outputDataAsString) {
    /** Resolve this when finished */
    const whenDone = (0, deferred_js_1.defer)();
    let queue = null;
    let timeout = null;
    timeout;
    const _processQueue = (entries) => {
        const size = entries.length;
        const store = new Map();
        const polymorphicPathList = [];
        const iterators = [];
        let directLayerPlanChild = spec.outputPlan.layerPlan;
        while (directLayerPlanChild.parentLayerPlan !== spec.bucket.layerPlan) {
            const parent = directLayerPlanChild.parentLayerPlan;
            if (!parent) {
                throw new Error(`GrafastInternalError<f6179ee1-ace2-429c-8f30-8fe6cd53ed03>: Invalid heirarchy - could not find direct layerPlan child of ${spec.bucket.layerPlan}`);
            }
            directLayerPlanChild = parent;
        }
        const { id: listItemStepId, _isUnary: isUnary } = directLayerPlanChild.rootStep;
        for (const copyStepId of directLayerPlanChild.copyStepIds) {
            const executionValue = spec.bucket.store.get(copyStepId);
            if (!executionValue) {
                throw new Error(`GrafastInternalError<2db7b749-399f-486b-bd12-7ca337b937e4>: ${spec.bucket.layerPlan} doesn't seem to include ${copyStepId} (required by ${directLayerPlanChild} via ${spec.outputPlan})`);
            }
            if (executionValue.isBatch) {
                const values = (0, utils_js_1.arrayOfLength)(size, executionValue.at(spec.bucketIndex));
                store.set(copyStepId, (0, executeBucket_js_1.batchExecutionValue)(values));
            }
            else {
                store.set(copyStepId, executionValue);
            }
        }
        if (isUnary) {
            assert.ok(entries.length === 0, "Unary step should only have one index");
            store.set(listItemStepId, (0, executeBucket_js_1.unaryExecutionValue)(entries[0][0]));
        }
        else {
            const listItemStepIdList = entries.map((e) => e[0]);
            store.set(listItemStepId, (0, executeBucket_js_1.batchExecutionValue)(listItemStepIdList));
        }
        for (let bucketIndex = 0; bucketIndex < size; bucketIndex++) {
            polymorphicPathList[bucketIndex] =
                spec.bucket.polymorphicPathList[spec.bucketIndex];
            iterators[bucketIndex] = new Set();
        }
        // const childBucket = newBucket(directLayerPlanChild, noDepsList, store);
        // const childBucketIndex = 0;
        const rootBucket = (0, executeBucket_js_1.newBucket)({
            layerPlan: directLayerPlanChild,
            size,
            store,
            flagUnion: 0,
            polymorphicPathList,
            iterators,
        }, spec.bucket.metaByMetaKey);
        const bucketPromise = (0, executeBucket_js_1.executeBucket)(rootBucket, requestContext);
        const output = () => {
            const promises = [];
            for (let bucketIndex = 0; bucketIndex < size; bucketIndex++) {
                const actualIndex = entries[bucketIndex][1];
                const [ctx, result] = outputBucket(spec.outputPlan, rootBucket, bucketIndex, requestContext, [...spec.path, actualIndex], spec.root.variables, outputDataAsString);
                const iteratorPayload = Object.create(null);
                if (result !== undefined) {
                    iteratorPayload.data = result;
                }
                iteratorPayload.hasNext = true;
                if (spec.label != null) {
                    iteratorPayload.label = spec.label;
                }
                if (ctx.root.errors.length > 0) {
                    iteratorPayload.errors = ctx.root.errors;
                }
                iteratorPayload.path = ctx.path;
                // TODO: extensions?
                iterator.push(iteratorPayload);
                const promise = processRoot(ctx, iterator, outputDataAsString);
                if ((0, utils_js_1.isPromiseLike)(promise)) {
                    promises.push(promise);
                }
            }
            if (promises.length !== 0) {
                return Promise.all(promises).then(noop);
            }
        };
        if ((0, utils_js_1.isPromiseLike)(bucketPromise)) {
            return bucketPromise.then(output);
        }
        else {
            return output();
        }
    };
    let pendingQueues = 0;
    const queueComplete = () => {
        pendingQueues--;
        if (loopComplete && pendingQueues <= 0) {
            whenDone.resolve();
        }
    };
    const processQueue = () => {
        timeout = null;
        assert.ok(queue, "GrafastInternalError<bcf5cef8-2c60-419e-b942-14fd34b8caa7>: processQueue called with no queue");
        // This is guaranteed to have at least one entry in it
        const entries = queue;
        queue = null;
        try {
            const result = _processQueue(entries);
            if ((0, utils_js_1.isPromiseLike)(result)) {
                result.then(queueComplete, (e) => {
                    whenDone.reject(e);
                });
            }
            else {
                queueComplete();
            }
        }
        catch (e) {
            whenDone.reject(e);
        }
    };
    const processResult = (result, payloadIndex) => {
        if (queue !== null) {
            queue.push([result, payloadIndex]);
        }
        else {
            pendingQueues++;
            queue = [[result, payloadIndex]];
            // OPTIMIZE: tune this delay
            timeout = setTimeout(processQueue, 1);
        }
    };
    let loopComplete = false;
    try {
        let payloadIndex = spec.startIndex;
        let nextValuePromise;
        while ((nextValuePromise = spec.stream.next())) {
            const iteratorResult = await nextValuePromise;
            if (iteratorResult.done) {
                break;
            }
            const result = iteratorResult.value;
            processResult(result, payloadIndex);
            payloadIndex++;
        }
    }
    finally {
        loopComplete = true;
        if (pendingQueues === 0) {
            whenDone.resolve();
        }
        // TODO: cleanup
    }
    return whenDone;
}
function processSingleDeferred(requestContext, outputPlan, specs, asString) {
    const size = specs.length;
    const store = new Map();
    const polymorphicPathList = [];
    const iterators = [];
    // HACK: when we re-write stream/defer this needs fixing.
    const firstBucket = specs[0][1].bucket;
    if (dev_js_1.isDev) {
        for (const spec of specs) {
            if (spec[1].bucket !== firstBucket) {
                throw new Error(`GrafastInternalError<c277422e-adb7-4b07-861e-acab931fc01a>: sorry, it seems the unary dependencies feature broke our incremental delivery support. This incremental delivery is going to be fully rewritten at some point anyway, so we recommend you avoid using it for now (the spec itself has changed since we implemented it).`);
            }
        }
    }
    for (const copyStepId of outputPlan.layerPlan.copyStepIds) {
        const executionValue = firstBucket.store.get(copyStepId);
        if (executionValue.isBatch) {
            const values = specs.map(([, spec]) => executionValue.at(spec.bucketIndex));
            store.set(copyStepId, (0, executeBucket_js_1.batchExecutionValue)(values));
        }
        else {
            store.set(copyStepId, executionValue);
        }
    }
    for (let bucketIndex = 0; bucketIndex < size; bucketIndex++) {
        const spec = specs[bucketIndex][1];
        polymorphicPathList[bucketIndex] =
            spec.bucket.polymorphicPathList[spec.bucketIndex];
        iterators[bucketIndex] = new Set();
    }
    // const childBucket = newBucket(spec.outputPlan.layerPlan, noDepsList, store);
    // const childBucketIndex = 0;
    const rootBucket = (0, executeBucket_js_1.newBucket)({
        layerPlan: outputPlan.layerPlan,
        size,
        store,
        flagUnion: 0,
        polymorphicPathList,
        iterators,
    }, null);
    const bucketPromise = (0, executeBucket_js_1.executeBucket)(rootBucket, requestContext);
    const output = () => {
        const promises = [];
        for (let bucketIndex = 0; bucketIndex < size; bucketIndex++) {
            const [iterator, spec] = specs[bucketIndex];
            const [ctx, result] = outputBucket(spec.outputPlan, rootBucket, bucketIndex, requestContext, spec.path, spec.root.variables, asString);
            const iteratorPayload = Object.create(null);
            if (result !== undefined) {
                iteratorPayload.data = result;
            }
            iteratorPayload.hasNext = true;
            if (spec.label != null) {
                iteratorPayload.label = spec.label;
            }
            if (ctx.root.errors.length > 0) {
                iteratorPayload.errors = ctx.root.errors;
            }
            // TODO: extensions?
            iteratorPayload.path = ctx.path;
            iterator.push(iteratorPayload);
            const promise = processRoot(ctx, iterator, asString);
            if ((0, utils_js_1.isPromiseLike)(promise)) {
                promises.push(promise);
            }
        }
        if (promises.length !== 0) {
            return Promise.all(promises).then(noop);
        }
    };
    if ((0, utils_js_1.isPromiseLike)(bucketPromise)) {
        return bucketPromise.then(output);
    }
    else {
        return output();
    }
}
function processBatches(batchesByRequestTools, whenDone, asString) {
    // Key is only used for batching
    const promises = [];
    for (const [requestContext, batches] of batchesByRequestTools.entries()) {
        for (const [outputPlan, specs] of batches.entries()) {
            const promise = processSingleDeferred(requestContext, outputPlan, specs, asString);
            if ((0, utils_js_1.isPromiseLike)(promise)) {
                promises.push(promise);
            }
        }
    }
    if (promises.length > 0) {
        Promise.all(promises).then(() => whenDone.resolve(), (e) => whenDone.reject(e));
    }
    else {
        whenDone.resolve();
    }
}
function processBatchAsString() {
    const batchesByRequestContext = deferredBatchesByRequestToolsAsString;
    deferredBatchesByRequestToolsAsString = new Map();
    const whenDone = nextBatchAsString;
    nextBatchAsString = null;
    processBatches(batchesByRequestContext, whenDone, true);
}
function processBatchNotAsString() {
    const batchesByRequestContext = deferredBatchesByRequestToolsNotAsString;
    deferredBatchesByRequestToolsNotAsString = new Map();
    const whenDone = nextBatchNotAsString;
    nextBatchNotAsString = null;
    processBatches(batchesByRequestContext, whenDone, false);
}
let deferredBatchesByRequestToolsAsString = new Map();
let deferredBatchesByRequestToolsNotAsString = new Map();
let nextBatchAsString = null;
let nextBatchNotAsString = null;
function processDeferred(requestContext, iterator, spec, outputDataAsString) {
    const deferredBatchesByRequestTools = outputDataAsString
        ? deferredBatchesByRequestToolsAsString
        : deferredBatchesByRequestToolsNotAsString;
    let deferredBatches = deferredBatchesByRequestTools.get(requestContext);
    if (!deferredBatches) {
        deferredBatches = new Map();
        deferredBatchesByRequestTools.set(requestContext, deferredBatches);
    }
    const list = deferredBatches.get(spec.outputPlan);
    if (list !== undefined) {
        list.push([iterator, spec]);
    }
    else {
        deferredBatches.set(spec.outputPlan, [[iterator, spec]]);
    }
    if (outputDataAsString) {
        if (!nextBatchAsString) {
            nextBatchAsString = (0, deferred_js_1.defer)();
            setTimeout(processBatchAsString, 1);
        }
        return nextBatchAsString;
    }
    else {
        if (!nextBatchNotAsString) {
            nextBatchNotAsString = (0, deferred_js_1.defer)();
            setTimeout(processBatchNotAsString, 1);
        }
        return nextBatchNotAsString;
    }
}
//# sourceMappingURL=prepare.js.map