import { ExecutionArgs } from "graphql";
import { buildExecutionContext } from "graphql/execution/execute";
import { populateValuePlan } from "./aether";
import { ROOT_PATH } from "./constants";
import { establishAether } from "./establishAether";
import {
  $$concreteType,
  $$crystalContext,
  $$data,
  $$pathIdentity,
  $$planResults,
  CrystalObject,
  PromiseOrDirect,
} from "./interfaces";
import { PlanResults } from "./planResults";
import { crystalObjectToString } from "./resolvers";

const EMPTY_OBJECT = Object.freeze(Object.create(null));

export function crystalPrepare(
  args: ExecutionArgs,
): PromiseOrDirect<CrystalObject> {
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
  const crystalContext = aether.newCrystalContext(
    variableValues,
    context as any,
    rootValue,
  );
  return crystalContext.rootCrystalObject;
}
