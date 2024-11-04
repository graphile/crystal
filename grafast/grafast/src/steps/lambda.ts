import type {
  PromiseOrDirect,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import type { Multistep, UnwrapMultistep } from "../multistep.js";
import { multistep } from "../multistep.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
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
function lambda<const TInMultistep extends Multistep, TOut>(
  spec: TInMultistep,
  fn: (value: UnwrapMultistep<TInMultistep>) => PromiseOrDirect<TOut>,
  isSyncAndSafe = false,
): LambdaStep<UnwrapMultistep<TInMultistep>, TOut> {
  if (fn.length > 1) {
    throw new Error(
      "lambda callback should accept one argument, perhaps you forgot to destructure the arguments?",
    );
  }
  const $in = multistep(spec);
  const $lambda = new LambdaStep<UnwrapMultistep<TInMultistep>, TOut>($in, fn);
  if ((fn as any).hasSideEffects) {
    console.trace(
      `You passed a function with \`hasSideEffects = true\` to \`lambda()\`, you should use \`sideEffect()\` instead (it has the same signature). We've automatically corrected this, but you should fix it in your code so the types are correct.`,
    );
    return sideEffect(spec as any, fn) as any;
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
