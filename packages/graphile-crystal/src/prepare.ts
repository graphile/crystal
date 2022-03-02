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

export function crystalPrepare(
  args: ExecutionArgs,
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

export function bypassGraphQLExecute(args: ExecutionArgs): ExecutionResult {
  return Object.assign(Object.create(null), { data: args.rootValue as any });
}
