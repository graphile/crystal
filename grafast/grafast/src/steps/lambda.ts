import type {
  PromiseOrDirect,
  UnbatchedExecutionExtra,
  UnwrapPlanTuple,
} from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { list } from "./list.js";
import { sideEffect } from "./sideEffect.js";

/**
 * Calls the given lambda function for each tuple
 */
export class LambdaStep<TIn, TOut> extends UnbatchedExecutableStep<TOut> {
  static $$export = {
    moduleName: "grafast",
    exportName: "LambdaStep",
  };
  // Lambda is only sync and safe if the callback is; so default to false
  isSyncAndSafe = false;
  allowMultipleOptimizations = true;

  private planDep: number | null;
  constructor(
    $plan: ExecutableStep<TIn> | null | undefined,
    private fn: (value: TIn) => PromiseOrDirect<TOut>,
  ) {
    super();
    this.planDep = $plan != null ? this.addDependency($plan) : null;
    if ((fn as any).hasSideEffects) {
      this.hasSideEffects = true;
    } else if ((fn as any).isSyncAndSafe) {
      if (fn.constructor.name === "AsyncFunction") {
        throw new Error(
          `${this}'s callback claims to be syncAndSafe, however it is asynchronous`,
        );
      }
      this.isSyncAndSafe = true;
    }
  }

  toStringMeta() {
    return (this.fn as any).displayName || this.fn.name;
  }

  deduplicate(peers: LambdaStep<any, any>[]): LambdaStep<TIn, TOut>[] {
    return peers.filter((peer) => peer.fn === this.fn);
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
function lambda<const TIn extends readonly ExecutableStep[], TOut>(
  plans: TIn,
  fn: (value: UnwrapPlanTuple<TIn>) => PromiseOrDirect<TOut>,
  isSyncAndSafe?: boolean,
): LambdaStep<UnwrapPlanTuple<TIn>, TOut>;
function lambda<const TIn, TOut>(
  $plan: ExecutableStep<TIn> | null | undefined,
  fn: (value: TIn) => PromiseOrDirect<TOut>,
  isSyncAndSafe?: boolean,
): LambdaStep<TIn, TOut>;
function lambda(
  planOrPlans: ExecutableStep | ExecutableStep[] | null | undefined,
  fn: (value: any) => any,
  isSyncAndSafe = false,
): LambdaStep<any, any> {
  if (fn.length > 1) {
    throw new Error(
      "lambda callback should accept one argument, perhaps you forgot to destructure the arguments?",
    );
  }
  const $lambda = Array.isArray(planOrPlans)
    ? new LambdaStep<any, any>(list(planOrPlans), fn)
    : new LambdaStep<any, any>(planOrPlans, fn);
  if ((fn as any).hasSideEffects) {
    console.trace(
      `You passed a function with \`hasSideEffects = true\` to \`lambda()\`, you should use \`sideEffect()\` instead (it has the same signature). We've automatically corrected this, but you should fix it in your code so the types are correct.`,
    );
    return sideEffect(planOrPlans as any, fn) as any;
  }
  if (isSyncAndSafe) {
    if (fn.constructor.name === "AsyncFunction") {
      throw new Error(
        `lambda call claims to be syncAndSafe, however the callback function is asynchronous`,
      );
    }
    $lambda.isSyncAndSafe = true;
  }
  return $lambda;
}

export { lambda };
