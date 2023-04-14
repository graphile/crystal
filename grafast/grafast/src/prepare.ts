import type { ExecutionArgs } from "graphql";
import { GraphQLError } from "graphql";
import type {
  AsyncExecutionResult,
  ExecutionResult,
} from "graphql/execution/execute";
import { buildExecutionContext } from "graphql/execution/execute";
import { isAsyncIterable } from "iterall";

import * as assert from "./assert.js";
import type { Bucket, RequestTools } from "./bucket.js";
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
import { executeOutputPlan } from "./engine/executeOutputPlan.js";
import { POLYMORPHIC_ROOT_PATH } from "./engine/OperationPlan.js";
import type { OutputPlan } from "./engine/OutputPlan.js";
import { coerceError, getChildBucketAndIndex } from "./engine/OutputPlan.js";
import { isGrafastError } from "./error.js";
import { establishOperationPlan } from "./establishOperationPlan.js";
import type { OperationPlan } from "./index.js";
import type { JSONValue, PromiseOrDirect } from "./interfaces.js";
import { $$eventEmitter, $$extensions, $$streamMore } from "./interfaces.js";
import { isPromiseLike } from "./utils.js";

const isTest =
  typeof process !== "undefined" && process.env.NODE_ENV === "test";
const $$contextPlanCache = Symbol("contextPlanCache");
const $$bypassGraphQL = Symbol("bypassGraphQL");

export interface GrafastPrepareOptions {
  /**
   * A list of 'explain' types that should be included in `extensions.explain`.
   *
   * - `mermaid-js` will cause the mermaid plan to be included
   * - other values are dependent on the plugins in play
   *
   * If set to `true` then all possible explain types will be exposed.
   */
  explain?: boolean | string[];

  /**
   * If true, the result will be returned as a string rather than an object -
   * this is an optimization for returning the data over a network socket or
   * similar.
   */
  outputDataAsString?: boolean;
}

const bypassGraphQLObj = Object.assign(Object.create(null), {
  [$$bypassGraphQL]: true,
});

function noop() {}

function processRoot(
  ctx: OutputPlanContext,
  iterator: ResultIterator,
  outputDataAsString: boolean,
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
    promises.push(
      processStream(ctx.requestContext, iterator, stream, outputDataAsString),
    );
  }
  for (const deferred of queue) {
    promises.push(
      processDeferred(
        ctx.requestContext,
        iterator,
        deferred,
        outputDataAsString,
      ),
    );
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
  outputDataAsString: boolean,
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
      let _alive = true;
      const iterator: ResultIterator = newIterator(() => {
        // TODO: ABORT code
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
      if (extensions) {
        payload.extensions = extensions;
      }
      payload.hasNext = true;
      // TODO: payload.label
      iterator.push(payload);

      const promise = processRoot(ctx, iterator, outputDataAsString);
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
        iterator.push(
          outputDataAsString
            ? ('{"hasNext":false}' as any)
            : { hasNext: false },
        );
        iterator.return(undefined);
      }

      return iterator;
    } else {
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

function outputBucket(
  outputPlan: OutputPlan,
  rootBucket: Bucket,
  rootBucketIndex: number,
  requestContext: RequestTools,
  path: readonly (string | number)[],
  variables: { [key: string]: any },
  asString: boolean,
): [ctx: OutputPlanContext, result: JSONValue | null] /*PromiseOrDirect<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
>*/ {
  const operationPlan = rootBucket.layerPlan.operationPlan;
  const root: PayloadRoot = {
    insideGraphQL: false,
    errors: [],
    queue: [],
    streams: [],
    variables,
  };
  const ctx: OutputPlanContext = {
    requestContext,
    root,
    path,
  };
  let childBucket;
  let childBucketIndex;
  if (outputPlan.layerPlan === rootBucket.layerPlan) {
    childBucket = rootBucket;
    childBucketIndex = rootBucketIndex;
  } else {
    const c = getChildBucketAndIndex(
      outputPlan,
      null,
      rootBucket,
      rootBucketIndex,
      null,
    );
    if (!c) {
      throw new Error(
        `GrafastInternalError<8bbf56c1-8e2a-4ee9-b5fc-724fd0ee222b>: could not find relevant bucket for output plan`,
      );
    }
    [childBucket, childBucketIndex] = c;
  }
  try {
    const result = executeOutputPlan(
      ctx,
      outputPlan,
      childBucket,
      childBucketIndex,
      asString,
    );
    return [ctx, result ?? null];
  } catch (e) {
    const error = coerceError(
      e,
      operationPlan.rootOutputPlan.locationDetails,
      [],
    );
    ctx.root.errors.push(error);
    return [ctx, null];
  }
}

export function executePreemptive(
  operationPlan: OperationPlan,
  variableValues: any,
  context: any,
  rootValue: any,
  outputDataAsString: boolean,
): PromiseOrDirect<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  // PERF: batch this method so it can process multiple GraphQL requests in parallel

  // TODO: when we batch, we need to change `bucketIndex` and `size`!
  const bucketIndex = 0;
  const size = 1;

  const requestIndex = [0];
  const vars = [variableValues];
  const ctxs = [context];
  const rvs = [rootValue];
  const polymorphicPathList = [POLYMORPHIC_ROOT_PATH];

  const store: Bucket["store"] = new Map();
  store.set(-1, requestIndex);
  store.set(operationPlan.rootLayerPlan.rootStep!.id, requestIndex);
  store.set(operationPlan.variableValuesStep.id, vars);
  store.set(operationPlan.contextStep.id, ctxs);
  store.set(operationPlan.rootValueStep.id, rvs);

  const rootBucket = newBucket({
    layerPlan: operationPlan.rootLayerPlan,
    size,
    store,
    hasErrors: false,
    polymorphicPathList,
  });
  const requestContext: RequestTools = {
    // toSerialize: [],
    eventEmitter: rootValue?.[$$eventEmitter],
    metaByMetaKey: operationPlan.makeMetaByMetaKey(),
    insideGraphQL: false,
  };

  const bucketPromise = executeBucket(rootBucket, requestContext);

  const subscriptionLayerPlan = rootBucket.layerPlan.children.find(
    (c) => c.reason.type === "subscription",
  );

  function executeStreamPayload(
    payload: any,
    index: number,
  ): PromiseOrDirect<ExecutionResult | AsyncGenerator<AsyncExecutionResult>> {
    const layerPlan = subscriptionLayerPlan!;
    // PERF: we could consider batching this.
    const store: Bucket["store"] = new Map();
    const newBucketIndex = 0;

    for (const depId of layerPlan.copyStepIds) {
      store.set(depId, []);
    }

    store.set(layerPlan.rootStep!.id, [payload]);
    for (const depId of layerPlan.copyStepIds) {
      store.get(depId)![newBucketIndex] =
        rootBucket.store.get(depId)![bucketIndex];
    }

    const subscriptionBucket = newBucket({
      layerPlan,
      store,
      hasErrors: rootBucket.hasErrors,
      polymorphicPathList: [POLYMORPHIC_ROOT_PATH],
      size: 1,
    });
    const bucketPromise = executeBucket(subscriptionBucket, requestContext);
    function outputStreamBucket() {
      const [ctx, result] = outputBucket(
        operationPlan.rootOutputPlan,
        subscriptionBucket,
        newBucketIndex,
        requestContext,
        [],
        rootBucket.store.get(operationPlan.variableValuesStep.id)![bucketIndex],
        outputDataAsString,
      );
      return finalize(
        result,
        ctx,
        index === 0 ? rootValue[$$extensions] ?? undefined : undefined,
        outputDataAsString,
      );
    }
    if (isPromiseLike(bucketPromise)) {
      return bucketPromise.then(outputStreamBucket);
    } else {
      return outputStreamBucket();
    }
  }

  function output() {
    // Later we'll need to loop

    // If it's a subscription we need to use the stream
    const rootValueList =
      rootBucket.layerPlan.rootStep!.id != null
        ? rootBucket.store.get(rootBucket.layerPlan.rootStep!.id)
        : null;
    const bucketRootValue = rootValueList?.[0];
    if (isGrafastError(bucketRootValue)) {
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
      const payload = Object.create(null) as ExecutionResult;
      payload.errors = errors;
      const extensions = bucketRootValue[$$extensions];
      if (extensions) {
        payload.extensions = extensions;
      }
      return payload;
    }

    if (
      bucketRootValue != null &&
      subscriptionLayerPlan != null &&
      Array.isArray(bucketRootValue) &&
      $$streamMore in bucketRootValue
    ) {
      const stream = (bucketRootValue[$$streamMore] as AsyncIterable<any>)[
        Symbol.asyncIterator
      ]();
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
          if (isAsyncIterable(payload)) {
            // TODO: do we need to avoid 'for await' because it can cause the
            // stream to exit late if we're waiting on a promise and the stream
            // exits in the interrim? We're assuming that no promises will be
            // sufficiently long-lived for this to be an issue right now.
            for await (const entry of payload) {
              iterator.push(entry);
            }
          } else {
            iterator.push(payload);
          }
          i++;
        }
      })().then(
        () => iterator.return(),
        (e) => {
          iterator.throw(e);
        },
      );
      return iterator;
    }

    const [ctx, result] = outputBucket(
      operationPlan.rootOutputPlan,
      rootBucket,
      bucketIndex,
      requestContext,
      [],
      rootBucket.store.get(operationPlan.variableValuesStep.id)![bucketIndex],
      outputDataAsString,
    );
    return finalize(
      result,
      ctx,
      rootValue[$$extensions] ?? undefined,
      outputDataAsString,
    );
  }

  if (isPromiseLike(bucketPromise)) {
    return bucketPromise.then(output);
  } else {
    return output();
  }
}

declare module "./engine/OperationPlan.js" {
  interface OperationPlan {
    [$$contextPlanCache]?: string;
  }
}

/**
 * @internal
 */
export function grafastPrepare(
  args: ExecutionArgs,
  options: GrafastPrepareOptions = {},
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
  const operationPlan = establishOperationPlan(
    schema,
    operation,
    fragments,
    variableValues,
    context as any,
    rootValue,
  );

  if (
    options.explain === true ||
    (options.explain && options.explain.includes("mermaid-js"))
  ) {
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

  return executePreemptive(
    operationPlan,
    variableValues,
    context,
    rootValue,
    options.outputDataAsString ?? false,
  );
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
          "GrafastWarning<85e02385-d3d2-48a1-b791-b4cf87817899>: value pushed into iterable after done; ignoring",
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
  requestContext: RequestTools,
  iterator: ResultIterator,
  spec: SubsequentStreamSpec,
  outputDataAsString: boolean,
): Promise<void> {
  /** Resolve this when finished */
  const whenDone = defer();

  type ResultTuple = [any, number];

  let queue: null | ResultTuple[] = null;
  let timeout: NodeJS.Timer | null = null;
  timeout;

  const _processQueue = (entries: ResultTuple[]) => {
    const size = entries.length;
    const store: Bucket["store"] = new Map();
    const polymorphicPathList: string[] = [];

    let directLayerPlanChild = spec.outputPlan.layerPlan;
    while (directLayerPlanChild.parentLayerPlan !== spec.bucket.layerPlan) {
      const parent = directLayerPlanChild.parentLayerPlan;
      if (!parent) {
        throw new Error(
          `GrafastInternalError<f6179ee1-ace2-429c-8f30-8fe6cd53ed03>: Invalid heirarchy - could not find direct layerPlan child of ${spec.bucket.layerPlan}`,
        );
      }
      directLayerPlanChild = parent;
    }

    const listItemStepId = directLayerPlanChild.rootStep!.id;
    const listItemStepIdList: any[] = [];
    store.set(listItemStepId, listItemStepIdList);

    for (const copyPlanId of directLayerPlanChild.copyStepIds) {
      store.set(copyPlanId, []);
    }

    let bucketIndex = 0;
    for (const entry of entries) {
      const [result] = entry;
      listItemStepIdList[bucketIndex] = result;

      polymorphicPathList[bucketIndex] =
        spec.bucket.polymorphicPathList[spec.bucketIndex];
      for (const copyPlanId of directLayerPlanChild.copyStepIds) {
        const list = spec.bucket.store.get(copyPlanId);
        if (!list) {
          throw new Error(
            `GrafastInternalError<2db7b749-399f-486b-bd12-7ca337b937e4>: ${spec.bucket.layerPlan} doesn't seem to include ${copyPlanId} (required by ${directLayerPlanChild} via ${spec.outputPlan})`,
          );
        }
        // PERF: optimize away these .get calls
        store.get(copyPlanId)![bucketIndex] = list[spec.bucketIndex];
      }
      // PERF: we should be able to optimize this
      bucketIndex++;
    }

    assert.strictEqual(
      bucketIndex,
      size,
      "GrafastInternalError<7c8deab0-8dfa-40f2-b625-97026f8fedcc>: expected bucket size does not match",
    );

    // const childBucket = newBucket(directLayerPlanChild, noDepsList, store);
    // const childBucketIndex = 0;
    const rootBucket: Bucket = newBucket({
      layerPlan: directLayerPlanChild,
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
          [...spec.path, actualIndex],
          spec.root.variables,
          outputDataAsString,
        );
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
      "GrafastInternalError<bcf5cef8-2c60-419e-b942-14fd34b8caa7>: processQueue called with no queue",
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
  requestContext: RequestTools,
  outputPlan: OutputPlan,
  specs: Array<[ResultIterator, SubsequentPayloadSpec]>,
  asString: boolean,
) {
  const size = specs.length;
  const store: Bucket["store"] = new Map();
  const polymorphicPathList: string[] = [];

  for (const copyPlanId of outputPlan.layerPlan.copyStepIds) {
    store.set(copyPlanId, []);
  }

  let bucketIndex = 0;
  for (const [, spec] of specs) {
    polymorphicPathList[bucketIndex] =
      spec.bucket.polymorphicPathList[spec.bucketIndex];
    for (const copyPlanId of outputPlan.layerPlan.copyStepIds) {
      store.get(copyPlanId)![bucketIndex] =
        spec.bucket.store.get(copyPlanId)![spec.bucketIndex];
    }
    // PERF: we should be able to optimize this
    bucketIndex++;
  }

  assert.strictEqual(
    bucketIndex,
    size,
    "GrafastInternalError<4e88c671-f65b-42a6-8756-61247b188093>: expected bucket size does not match",
  );

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
        spec.path,
        spec.root.variables,
        asString,
      );
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
  batchesByRequestTools: Map<
    RequestTools,
    Map<OutputPlan, Array<[ResultIterator, SubsequentPayloadSpec]>>
  >,
  whenDone: Deferred<void>,
  asString: boolean,
) {
  // Key is only used for batching
  const promises: PromiseLike<void>[] = [];
  for (const [requestContext, batches] of batchesByRequestTools.entries()) {
    for (const [outputPlan, specs] of batches.entries()) {
      const promise = processSingleDeferred(
        requestContext,
        outputPlan,
        specs,
        asString,
      );
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

function processBatchAsString() {
  const batchesByRequestContext = deferredBatchesByRequestToolsAsString;
  deferredBatchesByRequestToolsAsString = new Map();
  const whenDone = nextBatchAsString!;
  nextBatchAsString = null;

  processBatches(batchesByRequestContext, whenDone, true);
}

function processBatchNotAsString() {
  const batchesByRequestContext = deferredBatchesByRequestToolsNotAsString;
  deferredBatchesByRequestToolsNotAsString = new Map();
  const whenDone = nextBatchNotAsString!;
  nextBatchNotAsString = null;

  processBatches(batchesByRequestContext, whenDone, false);
}

type DBBRC = Map<
  RequestTools,
  Map<OutputPlan, Array<[ResultIterator, SubsequentPayloadSpec]>>
>;
let deferredBatchesByRequestToolsAsString: DBBRC = new Map();
let deferredBatchesByRequestToolsNotAsString: DBBRC = new Map();
let nextBatchAsString: Deferred<void> | null = null;
let nextBatchNotAsString: Deferred<void> | null = null;

function processDeferred(
  requestContext: RequestTools,
  iterator: ResultIterator,
  spec: SubsequentPayloadSpec,
  outputDataAsString: boolean,
): PromiseLike<void> {
  const deferredBatchesByRequestTools = outputDataAsString
    ? deferredBatchesByRequestToolsAsString
    : deferredBatchesByRequestToolsNotAsString;
  let deferredBatches = deferredBatchesByRequestTools.get(requestContext);
  if (!deferredBatches) {
    deferredBatches = new Map();
    deferredBatchesByRequestTools.set(requestContext, deferredBatches);
  }
  const list = deferredBatches.get(spec.outputPlan);
  if (list) {
    list.push([iterator, spec]);
  } else {
    deferredBatches.set(spec.outputPlan, [[iterator, spec]]);
  }
  if (outputDataAsString) {
    if (!nextBatchAsString) {
      nextBatchAsString = defer();
      setTimeout(processBatchAsString, 1);
    }
    return nextBatchAsString;
  } else {
    if (!nextBatchNotAsString) {
      nextBatchNotAsString = defer();
      setTimeout(processBatchNotAsString, 1);
    }
    return nextBatchNotAsString;
  }
}
