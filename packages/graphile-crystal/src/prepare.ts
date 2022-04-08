import type { ExecutionArgs } from "graphql";
import type { ExecutionResult } from "graphql/execution/execute";
import { buildExecutionContext } from "graphql/execution/execute";

import { establishAether } from "./establishAether";
import type { $$data, CrystalObject, PromiseOrDirect } from "./interfaces";
import {
  $$concreteType,
  $$crystalContext,
  $$pathIdentity,
  $$planResults,
} from "./interfaces";
import { PlanResults } from "./planResults";
import { crystalObjectToString } from "./resolvers";

const EMPTY_OBJECT = Object.freeze(Object.create(null));

export interface CrystalPrepareOptions {
  /**
   * If enabled, we'll try and return the data in the same shape as GraphQL
   * would have done, and if possible will set the $$bypassGraphQL key on the
   * result. In this case you can use `bypassGraphQLExecute` instead of
   * GraphQL's execute method to actually execute the GraphQL request.
   */
  experimentalGraphQLBypass?: boolean;
}

/**
 * This method returns an object that you should use as the `rootValue` in your
 * call to GraphQL; it gives Graphile Crystal a chance to find/prepare an
 * Aether and even pre-emptively execute the request if possible. In fact, the
 * result from this might be suitable to return to the user directly if you
 * enable the `experimentalGraphQLBypass` (if this is the case then the
 * `$$bypassGraphQL` key will be set on the result object).
 */
export function crystalPrepare(
  args: ExecutionArgs,
  options: CrystalPrepareOptions = {},
): PromiseOrDirect<CrystalObject | { [$$data]: any }> {
  const {
    schema,
    contextValue: context,
    rootValue,
    operationName,
    document,
  } = args;
  const exeContext = buildExecutionContext(args);
  if (Array.isArray(exeContext) || "length" in exeContext) {
    return EMPTY_OBJECT;
  }
  const { operation, fragments, variableValues } = exeContext;
  const aether = establishAether({
    schema,
    operation,
    fragments,
    variableValues: variableValues,
    context: context as any,
    rootValue,
  });

  const preemptiveResult = aether.executePreemptive(
    variableValues,
    context,
    rootValue,
    options.experimentalGraphQLBypass ?? false,
  );
  if (preemptiveResult) {
    return preemptiveResult;
  }

  const crystalContext = aether.newCrystalContext(
    variableValues,
    context as any,
    rootValue,
  );
  return crystalContext.rootCrystalObject;
}

// TODO: should we assert `$$bypassGraphQL` in here, or not? Presumably the performance impact would be negligible.
/**
 * Use this instead of the `execute` method if `$$bypassGraphQL` is set.
 */
export function bypassGraphQLExecute(args: ExecutionArgs): ExecutionResult {
  return Object.assign(Object.create(null), { data: args.rootValue as any });
}
