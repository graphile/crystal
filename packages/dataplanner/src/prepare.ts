import type { ExecutionArgs } from "graphql";
import type {
  AsyncExecutionResult,
  ExecutionResult,
} from "graphql/execution/execute";
import { buildExecutionContext } from "graphql/execution/execute";

import type { Bucket, RequestContext } from "./bucket.js";
import { executeBucket } from "./engine/executeBucket.js";
import type { OutputPlanContext } from "./engine/executeOutputPlan.js";
import { executeOutputPlan, NullHandler } from "./engine/executeOutputPlan.js";
import { establishOperationPlan } from "./establishOperationPlan.js";
import type { OperationPlan } from "./index.js";
import type { PromiseOrDirect } from "./interfaces.js";
import { $$data, $$eventEmitter, $$extensions } from "./interfaces.js";
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
    data: unknown,
    ctx: OutputPlanContext,
  ): ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void> => {
    if (ctx.root.streams.length > 0 || ctx.root.queue.length > 0) {
      throw new Error("TODO: streams");
    } else {
      return Object.assign(Object.create(bypassGraphQLObj), {
        data,
        errors: ctx.root.errors,
        extensions: rootValue[$$extensions],
      });
    }
  };

  const output = (): PromiseOrDirect<
    ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
  > => {
    const path: (string | number)[] = [];
    const ctx: OutputPlanContext = {
      ...requestContext,
      root: {
        streams: [],
        errors: [],
        queue: [],
        // This is _only_ to pass through to introspection selections, it
        // shouldn't be used for anything else.
        variables:
          rootBucket.store[operationPlan.variableValuesStep.id][bucketIndex],
      },
      path,
      nullRoot: new NullHandler(null, true, path),
    };
    const resultOrPromise = executeOutputPlan(
      ctx,
      operationPlan.rootOutputPlan,
      rootBucket,
      bucketIndex,
    );
    if (isPromiseLike(resultOrPromise)) {
      return resultOrPromise.then((result) => finalize(result, ctx));
    } else {
      return finalize(resultOrPromise, ctx);
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
