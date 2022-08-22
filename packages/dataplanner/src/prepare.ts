import * as assert from "assert";
import type { ExecutionArgs } from "graphql";
import type {
  AsyncExecutionResult,
  ExecutionResult,
} from "graphql/execution/execute";
import { buildExecutionContext } from "graphql/execution/execute";
import type { ObjMap } from "graphql/jsutils/ObjMap";
import { isAsyncIterable } from "iterall";
import { inspect } from "util";

import type { Bucket, RequestContext } from "./bucket.js";
import { isDev } from "./dev.js";
import { executeBucket } from "./engine/executeBucket.js";
import type {
  OutputPlanContext,
  PayloadRoot,
  SubsequentPayloadSpec,
  SubsequentStreamSpec,
} from "./engine/executeOutputPlan.js";
import { executeOutputPlan, NullHandler } from "./engine/executeOutputPlan.js";
import { establishOperationPlan } from "./establishOperationPlan.js";
import type { OperationPlan } from "./index.js";
import type { JSONObject, JSONValue, PromiseOrDirect } from "./interfaces.js";
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
  const rootBucket: Bucket = {
    isComplete: false,
    layerPlan: operationPlan.rootLayerPlan,
    size,
    noDepsList: Object.freeze(arrayOfLength(size)),
    store: Object.assign(Object.create(null), {
      "-1": requestIndex,
      [operationPlan.variableValuesStep.id]: vars,
      [operationPlan.contextStep.id]: ctxs,
      [operationPlan.rootValueStep.id]: rvs,
    }),
    hasErrors: false,
    children: {},
  };
  const requestContext: RequestContext = {
    // toSerialize: [],
    eventEmitter: rootValue?.[$$eventEmitter],
    metaByStepId: operationPlan.makeMetaByStepId(),
    insideGraphQL: false,
  };

  const bucketPromise = executeBucket(rootBucket, requestContext);

  const finalize = (
    data: JSONObject | null | undefined,
    ctx: OutputPlanContext,
  ): ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void> => {
    if (isAsyncIterable(data)) {
      // It's a subscription! Batch execute the child bucket for
      // each entry in the stream, and then the output plan for that.
      assert.strictEqual(
        ctx.root.queue.length,
        0,
        "Subscription cannot also queue",
      );
      throw new Error(
        "TODO<172acb34-c9d4-48f5-a26f-1b37260ecc14>: subscription",
      );
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
          extensions: rootValue[$$extensions] ?? undefined,
          hasNext: true,
          label: undefined,
        });

        const { streams, queue } = ctx.root;

        if (isDev) {
          // Cannot add to streams/queue now - we're finished. The streams/queue
          // get their own new roots where addition streams/queue can be added.
          Object.freeze(streams);
          Object.freeze(queue);
        }

        const promises: PromiseLike<void>[] = [];
        for (const stream of streams) {
          promises.push(processStream(iterator, stream));
        }
        for (const deferred of queue) {
          promises.push(processDeferred(iterator, deferred));
        }

        // Terminate the iterator when we're done
        Promise.allSettled(promises).then(() => {
          iterator.push({ hasNext: false });
          iterator.return(undefined);
        });

        return iterator;
      } else {
        return {
          data,
          errors: ctx.root.errors.length > 0 ? ctx.root.errors : undefined,
          extensions: rootValue[$$extensions] ?? undefined,
          hasNext: undefined,
        };
      }
    }
  };

  const output = (): PromiseOrDirect<
    ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
  > => {
    const path: (string | number)[] = [];
    const root: PayloadRoot = {
      errors: [],
      queue: [],
      streams: [],
      variables:
        rootBucket.store[operationPlan.variableValuesStep.id][bucketIndex],
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
      ...requestContext,
      root,
      path,
      nullRoot,
    };
    const resultOrPromise = executeOutputPlan(
      ctx,
      operationPlan.rootOutputPlan,
      rootBucket,
      bucketIndex,
    );
    if (isPromiseLike(resultOrPromise)) {
      return resultOrPromise.then((result) =>
        finalize(setRootNull ? null : (result as JSONObject), ctx),
      );
    } else {
      return finalize(
        setRootNull ? null : (resultOrPromise as JSONObject),
        ctx,
      );
    }
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
        cbs[0]({ done, value: v });
      } else {
        valueQueue.push(v);
      }
    },
    next() {
      if (valueQueue.length > 0) {
        return Promise.resolve({
          done: false,
          value: valueQueue.shift(),
        });
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

function processStream(
  iterator: ResultIterator,
  stream: SubsequentStreamSpec,
): Promise<void> {
  return Promise.resolve();
}

function processDeferred(
  iterator: ResultIterator,
  deferred: SubsequentPayloadSpec,
): Promise<void> {
  return Promise.resolve();
}
