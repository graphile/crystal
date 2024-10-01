import type {
  PromiseOrDirect,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import type { Multistep, UnwrapMultistep } from "../multistep.js";
import { multistep } from "../multistep.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";

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

  private planDep: number | null;
  constructor(
    $plan: ExecutableStep<TIn> | null | undefined,
    private fn: (value: TIn) => PromiseOrDirect<TOut>,
  ) {
    super();
    this.hasSideEffects = true;
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
function sideEffect<const TInMultistep extends Multistep, TOut>(
  spec: TInMultistep,
  fn: (value: UnwrapMultistep<TInMultistep>) => PromiseOrDirect<TOut>,
): SideEffectStep<UnwrapMultistep<TInMultistep>, TOut> {
  if (fn.length > 1) {
    throw new Error(
      "sideEffect callback should accept one argument, perhaps you forgot to destructure the arguments?",
    );
  }
  const $in = multistep(spec);
  const $result = new SideEffectStep<UnwrapMultistep<TInMultistep>, TOut>(
    $in,
    fn,
  );
  return $result;
}

export { sideEffect };
