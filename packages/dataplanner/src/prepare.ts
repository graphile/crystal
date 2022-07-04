import type { ExecutionArgs } from "graphql";
import type { ExecutionResult } from "graphql/execution/execute";
import { buildExecutionContext } from "graphql/execution/execute";

import { establishOpPlan } from "./establishOpPlan.js";
import type { $$data, CrystalObject, PromiseOrDirect } from "./interfaces.js";
import { $$eventEmitter, $$extensions } from "./interfaces.js";
import { $$contextPlanCache } from "./opPlan.js";
import { isPromiseLike } from "./utils.js";

const isTest = process.env.NODE_ENV === "test";

export interface CrystalPrepareOptions {
  /**
   * If enabled, we'll try and return the data in the same shape as GraphQL
   * would have done, and if possible will set the $$bypassGraphQL key on the
   * result. In this case you can use `bypassGraphQLExecute` instead of
   * GraphQL's execute method to actually execute the GraphQL request.
   */
  experimentalGraphQLBypass?: boolean;

  /**
   * A list of 'explain' types that should be included in `extensions.explain`.
   *
   * - `mermaid-js` will cause the mermaid plan to be included
   * - other values are dependent on the plugins in play
   */
  explain?: string[] | null;
}

/**
 * This method returns an object that you should use as the `rootValue` in your
 * call to GraphQL; it gives Graphile Crystal a chance to find/prepare an
 * OpPlan and even pre-emptively execute the request if possible. In fact, the
 * result from this might be suitable to return to the user directly if you
 * enable the `experimentalGraphQLBypass` (if this is the case then the
 * `$$bypassGraphQL` key will be set on the result object).
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
  const opPlan = establishOpPlan({
    schema,
    operation,
    fragments,
    variableValues: variableValues,
    context: context as any,
    rootValue,
  });

  if (options.explain?.includes("mermaid-js")) {
    // Only build the plan once
    if (opPlan[$$contextPlanCache] == null) {
      opPlan[$$contextPlanCache] = opPlan.printPlanGraph({
        includePaths: isTest,
        printPathRelations: false,
        concise: !isTest,
      });
    }
    rootValue[$$extensions]?.explain?.operations.push({
      type: "mermaid-js",
      title: "Step",
      diagram: opPlan[$$contextPlanCache],
    });
  }

  const preemptiveResult = opPlan.executePreemptive(
    variableValues,
    context,
    rootValue,
    options.experimentalGraphQLBypass ?? false,
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

  const crystalContext = opPlan.newCrystalContext(
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
