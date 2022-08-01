import type { ExecutionArgs } from "graphql";
import type { ExecutionResult } from "graphql/execution/execute";
import { buildExecutionContext } from "graphql/execution/execute";

import type { Bucket, RequestContext } from "./bucket.js";
import { BucketSetter } from "./bucket.js";
import type { OutputResult } from "./engine/executeOutputPlan.js";
import { executeOutputPlan } from "./engine/executeOutputPlan.js";
import { establishOperationPlan } from "./establishOperationPlan.js";
import type { OperationPlan } from "./index.js";
import type { $$data, CrystalObject, PromiseOrDirect } from "./interfaces.js";
import { $$eventEmitter, $$extensions } from "./interfaces.js";
import { arrayOfLength, arrayOfLengthCb, isPromiseLike } from "./utils.js";

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

export async function executePreemptive(
  operationPlan: OperationPlan,
  variableValues: any,
  context: any,
  rootValue: any,
) {
  // TODO: batch this method so it can process multiple GraphQL requests in parallel
  const vars = [variableValues];
  const ctxs = [context];
  const rvs = [rootValue];
  const rootBucket: Bucket = {
    layerPlan: operationPlan.rootLayerPlan,
    noDepsList: Object.freeze(arrayOfLength(vars.length)),
    store: Object.assign(Object.create(null), {
      [operationPlan.variableValuesStep.id]: vars,
      [operationPlan.contextStep.id]: ctxs,
      [operationPlan.rootValueStep.id]: rvs,
    }),
  };
  const requestContext: RequestContext = {
    // toSerialize: [],
    eventEmitter: rootValue?.[$$eventEmitter],
    metaByStepId: operationPlan.makeMetaByStepId(),
  };

  // await executeBucket(rootBucket, requestContext);
  const p = executeOutputPlan(
    operationPlan.rootOutputPlan,
    rootBucket,
    requestContext,
  );

  const finalize = (list: OutputResult[]) => {
    const result = list[0];
    result[$$bypassGraphQL] = true;
    return result;
  };
  if (isPromiseLike(p)) {
    return p.then(finalize);
  } else {
    return finalize(p);
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
): PromiseOrDirect<CrystalObject | { [$$data]: any }> {
  const {
    schema,
    contextValue: context,
    rootValue = Object.create(null),
    // operationName,
    // document,
  } = args;
  const exeContext = buildExecutionContext(args);

  // If a list of errors was returned, abort our transform and defer to
  // graphql-js.
  if (Array.isArray(exeContext) || "length" in exeContext) {
    return args.rootValue as any;
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

  const preemptiveResult = executePreemptive(
    operationPlan,
    variableValues,
    context,
    rootValue,
  );
  if (preemptiveResult) {
    if (rootValue[$$extensions]) {
      if (isPromiseLike(preemptiveResult)) {
        return preemptiveResult.then((r) => {
          r[$$extensions] = rootValue[$$extensions];
          return r;
        });
      } else {
        preemptiveResult[$$extensions] = rootValue[$$extensions];
        preemptiveResult[$$eventEmitter] = rootValue[$$eventEmitter];
        return preemptiveResult;
      }
    } else {
      return preemptiveResult;
    }
  }

  const crystalContext = operationPlan.newCrystalContext(
    variableValues,
    context as any,
    rootValue,
  );
  if (rootValue[$$extensions]) {
    crystalContext.rootCrystalObject[$$extensions] = rootValue[$$extensions];
  }
  return crystalContext.rootCrystalObject;
}

// TODO: should we assert `$$bypassGraphQL` in here, or not? Presumably the performance impact would be negligible.
/**
 * Use this instead of the `execute` method if `$$bypassGraphQL` is set.
 *
 * @internal
 */
export function bypassGraphQLExecute(args: ExecutionArgs): ExecutionResult {
  return Object.assign(Object.create(null), { data: args.rootValue as any });
}
