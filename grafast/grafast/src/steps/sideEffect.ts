import type {
  PromiseOrDirect,
  UnbatchedExecutionExtra,
  UnwrapPlanTuple,
} from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { list } from "./list.js";

/**
 * Calls the given callback function for each tuple
 */
export class SideEffectStep<TIn, TOut> extends UnbatchedExecutableStep<TOut> {
  static $$export = {
    moduleName: "grafast",
    exportName: "SideEffectStep",
  };
  isSyncAndSafe = false;
  allowMultipleOptimizations = false;
  hasSideEffects = true;

  private planDep: number | null;
  constructor(
    $plan: ExecutableStep<TIn> | null | undefined,
    private fn: (value: TIn) => PromiseOrDirect<TOut>,
  ) {
    super();
    this.planDep = $plan != null ? this.addDependency($plan) : null;
  }

  toStringMeta() {
    return (this.fn as any).displayName || this.fn.name;
  }

  unbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    value: TIn,
  ): PromiseOrDirect<TOut> {
    return this.fn(value);
  }
}
/**
 * A plan that takes the input `$plan` and feeds each value through the `fn`
 * callback. Note: if you need to pass more than one value, pass a `ListStep`
 * as the `$plan` argument.
 */
function sideEffect<const TIn extends readonly ExecutableStep[], TOut>(
  plans: TIn,
  fn: (value: UnwrapPlanTuple<TIn>) => PromiseOrDirect<TOut>,
): SideEffectStep<UnwrapPlanTuple<TIn>, TOut>;
function sideEffect<const TIn, TOut>(
  $plan: ExecutableStep<TIn> | null | undefined,
  fn: (value: TIn) => PromiseOrDirect<TOut>,
): SideEffectStep<TIn, TOut>;
function sideEffect(
  planOrPlans: ExecutableStep | ExecutableStep[] | null | undefined,
  fn: (value: any) => any,
): SideEffectStep<any, any> {
  if (fn.length > 1) {
    throw new Error(
      "sideEffect callback should accept one argument, perhaps you forgot to destructure the arguments?",
    );
  }
  const $result = Array.isArray(planOrPlans)
    ? new SideEffectStep<any, any>(list(planOrPlans), fn)
    : new SideEffectStep<any, any>(planOrPlans, fn);
  return $result;
}

export { sideEffect };
