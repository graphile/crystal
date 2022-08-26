import * as assert from "assert";
import type { ExecutionArgs } from "graphql";
import { GraphQLError } from "graphql";
import type {
  AsyncExecutionResult,
  ExecutionResult,
} from "graphql/execution/execute";
import { buildExecutionContext } from "graphql/execution/execute";
import { isAsyncIterable, isIterable } from "iterall";

import type { Bucket, RequestContext } from "./bucket.js";
import type { Deferred } from "./deferred.js";
import { defer } from "./deferred.js";
import { isDev } from "./dev.js";
import { executeBucket, newBucket } from "./engine/executeBucket.js";
import type {
  OutputPlanContext,
  PayloadRoot,
  SubsequentPayloadSpec,
  SubsequentStreamSpec,
} from "./engine/executeOutputPlan.js";
import { executeOutputPlan, NullHandler } from "./engine/executeOutputPlan.js";
import { POLYMORPHIC_ROOT_PATH } from "./engine/OperationPlan.js";
import type { OutputPlan, OutputPlanTypeObject } from "./engine/OutputPlan.js";
import { isCrystalError } from "./error.js";
import { establishOperationPlan } from "./establishOperationPlan.js";
import type { OperationPlan } from "./index.js";
import type { JSONValue, PromiseOrDirect } from "./interfaces.js";
import { $$eventEmitter, $$extensions } from "./interfaces.js";
import { arrayOfLength, isPromiseLike } from "./utils.js";

const isTest = process.env.NODE_ENV === "test";
const $$contextPlanCache = Symbol("contextPlanCache");
const $$bypassGraphQL = Symbol("bypassGraphQL");

export interface CrystalPrepareOptions {
  /**
   * A list of 'explain' types that should be included in `extensions.explain`.
   *
   * - `mermaid-js` will cause the mermaid plan to be included
   * - other values are dependent on the plugins in play
   */
  explain?: string[] | null;
}

const bypassGraphQLObj = Object.assign(Object.create(null), {
  [$$bypassGraphQL]: true,
});

function noop() {}

function processRoot(
  ctx: OutputPlanContext,
  iterator: ResultIterator,
): PromiseOrDirect<void> {
  const { streams, queue } = ctx.root;

  if (isDev) {
    // Cannot add to streams/queue now - we're finished. The streams/queue
    // get their own new roots where addition streams/queue can be added.
    Object.freeze(streams);
    Object.freeze(queue);
  }

  const promises: PromiseLike<void>[] = [];
  for (const stream of streams) {
    promises.push(processStream(ctx.requestContext, iterator, stream));
  }
  for (const deferred of queue) {
    promises.push(processDeferred(ctx.requestContext, iterator, deferred));
  }

  // Terminate the iterator when we're done
  if (promises.length) {
    return Promise.all(promises).then(noop);
  }
}

const finalize = (
  data: JSONValue | null | undefined | AsyncIterable<any>,
  ctx: OutputPlanContext,
  extensions: any,
): ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void> => {
  if (isAsyncIterable(data)) {
    // It's a subscription! Batch execute the child bucket for
    // each entry in the stream, and then the output plan for that.
    assert.strictEqual(
      ctx.root.queue.length,
      0,
      "Subscription cannot also queue",
    );
    throw new Error("TODO<172acb34-c9d4-48f5-a26f-1b37260ecc14>: subscription");
  } else {
    if (ctx.root.streams.length > 0 || ctx.root.queue.length > 0) {
      // Return an async iterator
      let alive = true;
      const iterator: ResultIterator = newIterator(() => {
        // TODO: ABORT code
        alive = false;
      });
      iterator.push({
        data,
        errors: ctx.root.errors.length > 0 ? ctx.root.errors : undefined,
        extensions,
        hasNext: true,
        label: undefined,
      });

      const promise = processRoot(ctx, iterator);
      if (isPromiseLike(promise)) {
        promise.then(
          () => {
            iterator.push({ hasNext: false });
            iterator.return(undefined);
          },
          (e) => {
            iterator.throw(e);
          },
        );
      } else {
        iterator.push({ hasNext: false });
        iterator.return(undefined);
      }

      return iterator;
    } else {
      return {
        data: data as any,
        errors: ctx.root.errors.length > 0 ? ctx.root.errors : undefined,
        extensions,
        hasNext: undefined,
      };
    }
  }
};

function outputBucket(
  outputPlan: OutputPlan,
  rootBucket: Bucket,
  bucketIndex: number,
  requestContext: RequestContext,
  path: readonly (string | number)[],
  variables: { [key: string]: any },
): [ctx: OutputPlanContext, result: JSONValue | null] /*PromiseOrDirect<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
>*/ {
  const operationPlan = rootBucket.layerPlan.operationPlan;
  const root: PayloadRoot = {
    errors: [],
    queue: [],
    streams: [],
    variables,
  };
  const nullRoot = new NullHandler(null, true, path, {
    parentTypeName: null,
    fieldName: null,
    node: operationPlan.operation.selectionSet.selections,
  });
  nullRoot.root = root;
  let setRootNull = false;
  nullRoot.onAbort(() => {
    setRootNull = true;
  });
  const ctx: OutputPlanContext = {
    requestContext,
    root,
    path,
    nullRoot,
  };
  const result = executeOutputPlan(ctx, outputPlan, rootBucket, bucketIndex);
  if (setRootNull) {
    return [ctx, null];
  } else {
    return [ctx, result];
  }
}

export function executePreemptive(
  operationPlan: OperationPlan,
  variableValues: any,
  context: any,
  rootValue: any,
): PromiseOrDirect<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  // TODO: batch this method so it can process multiple GraphQL requests in parallel

  // TODO: when we batch, we need to change `bucketIndex` and `size`!
  const bucketIndex = 0;
  const size = 1;

  const requestIndex = [0];
  const vars = [variableValues];
  const ctxs = [context];
  const rvs = [rootValue];
  const polymorphicPathList = [POLYMORPHIC_ROOT_PATH];
  const rootBucket = newBucket({
    layerPlan: operationPlan.rootLayerPlan,
    size,
    store: Object.assign(Object.create(null), {
      "-1": requestIndex,
      [operationPlan.rootLayerPlan.rootStepId!]: requestIndex,
      [operationPlan.variableValuesStep.id]: vars,
      [operationPlan.contextStep.id]: ctxs,
      [operationPlan.rootValueStep.id]: rvs,
    }),
    hasErrors: false,
    polymorphicPathList,
  });
  const requestContext: RequestContext = {
    // toSerialize: [],
    eventEmitter: rootValue?.[$$eventEmitter],
    metaByStepId: operationPlan.makeMetaByStepId(),
    insideGraphQL: false,
  };

  const bucketPromise = executeBucket(rootBucket, requestContext);

  const subscriptionLayerPlan = rootBucket.layerPlan.children.find(
    (c) => c.reason.type === "subscription",
  );

  const executeStreamPayload = (
    payload: any,
    index: number,
  ): PromiseOrDirect<
    ExecutionResult | AsyncGenerator<AsyncExecutionResult>
  > => {
    const layerPlan = subscriptionLayerPlan!;
    // TODO: we could consider batching this.
    const store: Bucket["store"] = Object.create(null);
    const newBucketIndex = 0;

    for (const depId of layerPlan.copyPlanIds) {
      store[depId] = [];
    }

    store[layerPlan.rootStepId!] = [payload];
    for (const depId of layerPlan.copyPlanIds) {
      store[depId][newBucketIndex] = rootBucket.store[depId][bucketIndex];
    }

    const subscriptionBucket = newBucket({
      layerPlan,
      store,
      hasErrors: rootBucket.hasErrors,
      polymorphicPathList: [POLYMORPHIC_ROOT_PATH],
      size: 1,
    });
    const bucketPromise = executeBucket(subscriptionBucket, requestContext);
    const output = () => {
      const [ctx, result] = outputBucket(
        operationPlan.rootOutputPlan,
        subscriptionBucket,
        newBucketIndex,
        requestContext,
        [],
        rootBucket.store[operationPlan.variableValuesStep.id][bucketIndex],
      );
      return finalize(
        result,
        ctx,
        index === 0 ? rootValue[$$extensions] ?? undefined : undefined,
      );
    };
    if (isPromiseLike(bucketPromise)) {
      return bucketPromise.then(output);
    } else {
      return output();
    }
  };

  const output = () => {
    // Later we'll need to loop

    // If it's a subscription we need to use the stream
    const rootValueList = rootBucket.layerPlan.rootStepId
      ? rootBucket.store[rootBucket.layerPlan.rootStepId]
      : null;
    const bucketRootValue = rootValueList?.[0];
    if (isCrystalError(bucketRootValue)) {
      // Something major went wrong!
      const errors = [
        new GraphQLError(
          bucketRootValue.originalError.message,
          operationPlan.rootOutputPlan.locationDetails.node, // node
          undefined, // source
          null, // positions
          null, // path
          bucketRootValue.originalError, // originalError
          null, // extensions
        ),
      ];
      return Object.assign(Object.create(null), {
        errors,
        extensions: bucketRootValue[$$extensions] ?? undefined,
        hasNext: undefined,
        label: undefined,
      });
    }

    if (
      bucketRootValue &&
      isAsyncIterable(bucketRootValue) &&
      !isIterable(bucketRootValue) &&
      subscriptionLayerPlan
    ) {
      const stream = bucketRootValue[Symbol.asyncIterator]();
      // Do the async iterable
      let stopped = false;
      const abort = defer<undefined>();
      const iterator = newIterator((e) => {
        stopped = true;
        abort.resolve(undefined);
        if (e) {
          stream.throw?.(e);
        } else {
          stream.return?.();
        }
      });
      (async () => {
        // eslint-disable-next-line no-constant-condition
        let i = 0;
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
          if (isAsyncIterable(payload)) {
            // TODO: avoid 'for await'
            for await (const entry of payload) {
              iterator.push(entry);
            }
          } else {
            iterator.push(payload);
          }
          i++;
        }
      })().catch((e) => {
        iterator.throw(e);
      });
      return iterator;
    }

    const [ctx, result] = outputBucket(
      operationPlan.rootOutputPlan,
      rootBucket,
      bucketIndex,
      requestContext,
      [],
      rootBucket.store[operationPlan.variableValuesStep.id][bucketIndex],
    );
    return finalize(result, ctx, rootValue[$$extensions] ?? undefined);
  };

  if (isPromiseLike(bucketPromise)) {
    return bucketPromise.then(output);
  } else {
    return output();
  }
}

/**
 * This method returns an object that you should use as the `rootValue` in your
 * call to GraphQL; it gives Graphile Crystal a chance to find/prepare an
 * OpPlan and even pre-emptively execute the request if possible. In fact, the
 * result from this might be suitable to return to the user directly (if this
 * is the case then the `$$bypassGraphQL` key will be set on the result
 * object).
 *
 * @internal
 */
export function dataplannerPrepare(
  args: ExecutionArgs,
  options: CrystalPrepareOptions = {},
): PromiseOrDirect<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  const {
    schema,
    contextValue: context,
    rootValue = Object.create(null),
    // operationName,
    // document,
  } = args;
  const exeContext = buildExecutionContext(args);

  // If a list of errors was returned, abort
  if (Array.isArray(exeContext) || "length" in exeContext) {
    return Object.assign(Object.create(bypassGraphQLObj), {
      errors: exeContext,
      extensions: rootValue[$$extensions],
    });
  }

  const { operation, fragments, variableValues } = exeContext;
  const operationPlan = establishOperationPlan({
    schema,
    operation,
    fragments,
    variableValues: variableValues,
    context: context as any,
    rootValue,
  });

  if (options.explain?.includes("mermaid-js")) {
    // Only build the plan once
    if (operationPlan[$$contextPlanCache] == null) {
      operationPlan[$$contextPlanCache] = operationPlan.printPlanGraph({
        includePaths: isTest,
        printPathRelations: false,
        concise: !isTest,
      });
    }
    rootValue[$$extensions]?.explain?.operations.push({
      type: "mermaid-js",
      title: "Step",
      diagram: operationPlan[$$contextPlanCache],
    });
  }

  return executePreemptive(operationPlan, variableValues, context, rootValue);
}

interface PushableAsyncGenerator<T> extends AsyncGenerator<T, void, undefined> {
  push(v: T): void;
}

type ResultIterator = PushableAsyncGenerator<AsyncExecutionResult>;

function newIterator<T = any>(
  abort: (e?: any) => void,
): PushableAsyncGenerator<T> {
  const valueQueue: any[] = [];
  const pullQueue: Array<
    [
      (
        value: IteratorResult<T, any> | PromiseLike<IteratorResult<T, any>>,
      ) => void,
      (reason?: any) => void,
    ]
  > = [];
  let done = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    push(v: T) {
      if (done) {
        // TODO: should
        console.warn(
          "GraphileWarning<85e02385-d3d2-48a1-b791-b4cf87817899>: value pushed into iterable after done; ignoring",
        );
        return;
      }
      const cbs = pullQueue.shift();
      if (cbs) {
        if (isPromiseLike(v)) {
          v.then(
            (v) => cbs[0]({ done, value: v }),
            (e) => {
              try {
                const r = cbs[1](e);
                if (isPromiseLike(r)) {
                  r.then(null, noop);
                }
              } catch (e) {
                // ignore
              }
              // TODO: does an error here imply we should cancel the iterator?
              this.throw(e);
            },
          );
        } else {
          cbs[0]({ done, value: v });
        }
      } else {
        valueQueue.push(v);
      }
    },
    next() {
      if (valueQueue.length > 0) {
        return Promise.resolve(valueQueue.shift()).then((value) => ({
          done: false,
          value,
        }));
      } else if (done) {
        return Promise.resolve({
          done: true,
          value: undefined,
        });
      } else {
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
            entry[0]({ done, value: undefined });
          } catch (e) {
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
          } catch (e) {
            // ignore
          }
        }
      }
      return Promise.reject(e);
    },
  };
}

async function processStream(
  requestContext: RequestContext,
  iterator: ResultIterator,
  spec: SubsequentStreamSpec,
): Promise<void> {
  /** Resolve this when finished */
  const whenDone = defer();

  type ResultTuple = [any, number];

  let queue: null | ResultTuple[] = null;
  let timeout: NodeJS.Timer | null = null;
  timeout;

  const _processQueue = (entries: ResultTuple[]) => {
    const size = entries.length;
    const store = Object.create(null);
    const polymorphicPathList: string[] = [];
    store[spec.listItemStepId] = [];

    for (const copyPlanId of spec.outputPlan.layerPlan.copyPlanIds) {
      store[copyPlanId] = [];
    }

    let bucketIndex = 0;
    for (const entry of entries) {
      const [result] = entry;
      store[spec.listItemStepId][bucketIndex] = result;

      polymorphicPathList[bucketIndex] =
        spec.bucket.polymorphicPathList[spec.bucketIndex];
      for (const copyPlanId of spec.outputPlan.layerPlan.copyPlanIds) {
        store[copyPlanId][bucketIndex] =
          spec.bucket.store[copyPlanId][spec.bucketIndex];
      }
      // TODO: we should be able to optimize this
      bucketIndex++;
    }

    assert.strictEqual(bucketIndex, size);

    // const childBucket = newBucket(spec.outputPlan.layerPlan, noDepsList, store);
    // const childBucketIndex = 0;
    const rootBucket: Bucket = newBucket({
      layerPlan: spec.outputPlan.layerPlan,
      size,
      store,
      hasErrors: false,
      polymorphicPathList,
    });

    const bucketPromise = executeBucket(rootBucket, requestContext);

    const output = () => {
      const promises: PromiseLike<any>[] = [];
      for (let bucketIndex = 0; bucketIndex < size; bucketIndex++) {
        const actualIndex = entries[bucketIndex][1];
        const [ctx, result] = outputBucket(
          spec.outputPlan,
          rootBucket,
          bucketIndex,
          requestContext,
          [...spec.ctx.path, actualIndex],
          spec.ctx.root.variables,
        );
        iterator.push({
          data: result,
          hasNext: true,
          label: spec.label,
          errors: ctx.root.errors.length > 0 ? ctx.root.errors : undefined,
          extensions: undefined,
          path: ctx.path,
        });
        const promise = processRoot(ctx, iterator);
        if (isPromiseLike(promise)) {
          promises.push(promise);
        }
      }
      if (promises.length) {
        return Promise.all(promises).then(noop);
      }
    };

    if (isPromiseLike(bucketPromise)) {
      return bucketPromise.then(output);
    } else {
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
    assert.ok(
      queue,
      "GraphileInternalError<bcf5cef8-2c60-419e-b942-14fd34b8caa7>: processQueue called with no queue",
    );

    // This is guaranteed to have at least one entry in it
    const entries = queue;
    queue = null;

    try {
      const result = _processQueue(entries);
      if (isPromiseLike(result)) {
        result.then(queueComplete, (e) => {
          whenDone.reject(e);
        });
      } else {
        queueComplete();
      }
    } catch (e) {
      whenDone.reject(e);
    }
  };

  const processResult = (result: any, payloadIndex: number) => {
    if (queue) {
      queue.push([result, payloadIndex]);
    } else {
      pendingQueues++;
      queue = [[result, payloadIndex]];
      // TODO: tune this delay
      timeout = setTimeout(processQueue, 1);
    }
  };

  let loopComplete = false;
  try {
    // TODO: need to unwrap this and loop manually so it's abortable
    let payloadIndex = spec.startIndex;
    let nextValuePromise: Promise<IteratorResult<any, any>>;
    while ((nextValuePromise = spec.stream.next())) {
      const iteratorResult = await nextValuePromise;
      if (iteratorResult.done) {
        break;
      }
      const result = iteratorResult.value;
      processResult(result, payloadIndex);
      payloadIndex++;
    }
  } finally {
    loopComplete = true;
    if (pendingQueues === 0) {
      whenDone.resolve();
    }
    // TODO: cleanup
  }
  return whenDone;
}

function processSingleDeferred(
  requestContext: RequestContext,
  outputPlan: OutputPlan,
  specs: Array<[ResultIterator, SubsequentPayloadSpec]>,
) {
  const size = specs.length;
  const store = Object.create(null);
  const polymorphicPathList: string[] = [];

  for (const copyPlanId of outputPlan.layerPlan.copyPlanIds) {
    store[copyPlanId] = [];
  }

  let bucketIndex = 0;
  for (const [iterator, spec] of specs) {
    polymorphicPathList[bucketIndex] =
      spec.bucket.polymorphicPathList[spec.bucketIndex];
    for (const copyPlanId of outputPlan.layerPlan.copyPlanIds) {
      store[copyPlanId][bucketIndex] =
        spec.bucket.store[copyPlanId][spec.bucketIndex];
    }
    // TODO: we should be able to optimize this
    bucketIndex++;
  }

  assert.strictEqual(bucketIndex, size);

  // const childBucket = newBucket(spec.outputPlan.layerPlan, noDepsList, store);
  // const childBucketIndex = 0;
  const rootBucket = newBucket({
    layerPlan: outputPlan.layerPlan,
    size,
    store,
    hasErrors: false,
    polymorphicPathList,
  });

  const bucketPromise = executeBucket(rootBucket, requestContext);

  const output = (): void | Promise<void> => {
    const promises: PromiseLike<any>[] = [];
    for (let bucketIndex = 0; bucketIndex < size; bucketIndex++) {
      const [iterator, spec] = specs[bucketIndex];
      const [ctx, result] = outputBucket(
        spec.outputPlan,
        rootBucket,
        bucketIndex,
        requestContext,
        spec.ctx.path,
        spec.ctx.root.variables,
      );
      iterator.push({
        data: result,
        hasNext: true,
        label: spec.label,
        errors: ctx.root.errors.length > 0 ? ctx.root.errors : undefined,
        extensions: undefined,
        path: ctx.path,
      });
      const promise = processRoot(ctx, iterator);
      if (isPromiseLike(promise)) {
        promises.push(promise);
      }
    }
    if (promises.length) {
      return Promise.all(promises).then(noop);
    }
  };

  if (isPromiseLike(bucketPromise)) {
    return bucketPromise.then(output);
  } else {
    return output();
  }
}

function processBatches(
  batchesByRequestContext: Map<
    RequestContext,
    Map<OutputPlan, Array<[ResultIterator, SubsequentPayloadSpec]>>
  >,
  whenDone: Deferred<void>,
) {
  // Key is only used for batching
  const promises: PromiseLike<void>[] = [];
  for (const [requestContext, batches] of batchesByRequestContext.entries()) {
    for (const [outputPlan, specs] of batches.entries()) {
      const promise = processSingleDeferred(requestContext, outputPlan, specs);
      if (isPromiseLike(promise)) {
        promises.push(promise);
      }
    }
  }
  if (promises.length > 0) {
    Promise.all(promises).then(
      () => whenDone.resolve(),
      (e) => whenDone.reject(e),
    );
  } else {
    whenDone.resolve();
  }
}

function processBatch() {
  const batchesByRequestContext = deferredBatchesByRequestContext;
  deferredBatchesByRequestContext = new Map();
  const whenDone = nextBatch!;
  nextBatch = null;

  processBatches(batchesByRequestContext, whenDone);
}

let deferredBatchesByRequestContext: Map<
  RequestContext,
  Map<OutputPlan, Array<[ResultIterator, SubsequentPayloadSpec]>>
> = new Map();
let nextBatch: Deferred<void> | null = null;

function processDeferred(
  requestContext: RequestContext,
  iterator: ResultIterator,
  spec: SubsequentPayloadSpec,
): PromiseLike<void> {
  let deferredBatches = deferredBatchesByRequestContext.get(requestContext);
  if (!deferredBatches) {
    deferredBatches = new Map();
    deferredBatchesByRequestContext.set(requestContext, deferredBatches);
  }
  const list = deferredBatches.get(spec.outputPlan);
  if (list) {
    list.push([iterator, spec]);
  } else {
    deferredBatches.set(spec.outputPlan, [[iterator, spec]]);
  }
  if (!nextBatch) {
    nextBatch = defer();
    setTimeout(processBatch, 1);
  }

  return nextBatch;
}
