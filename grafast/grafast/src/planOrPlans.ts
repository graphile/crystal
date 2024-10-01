import { ExecutableStep } from "./step.js";
import { constant } from "./steps/constant.js";
import { list } from "./steps/list.js";
import { object } from "./steps/object.js";

/**
 * When using this, always use `const`! Otherwise tuples will show up as arrays
 * and break things.
 */
export type PlanOrPlans =
  | null
  | undefined
  | ExecutableStep
  | readonly [...(readonly ExecutableStep[])]
  | Record<string, ExecutableStep>;

export type UnwrapPlanOrPlans<TPlanOrPlans extends PlanOrPlans> =
  TPlanOrPlans extends null
    ? null
    : TPlanOrPlans extends undefined
    ? undefined
    : TPlanOrPlans extends ExecutableStep<infer U>
    ? U
    : TPlanOrPlans extends readonly [...(readonly any[])]
    ? {
        [index in keyof TPlanOrPlans]: TPlanOrPlans[index] extends ExecutableStep<
          infer V
        >
          ? V
          : never;
      }
    : {
        [key in keyof TPlanOrPlans]: TPlanOrPlans[key] extends ExecutableStep<
          infer V
        >
          ? V
          : never;
      };

export function planOrPlansToStep<const TPlanOrPlans extends PlanOrPlans>(
  planOrPlans: TPlanOrPlans,
): ExecutableStep<UnwrapPlanOrPlans<TPlanOrPlans>> {
  if (planOrPlans == null) {
    return constant(planOrPlans) as any;
  } else if (planOrPlans instanceof ExecutableStep) {
    return planOrPlans;
  } else if (isTuple(planOrPlans)) {
    return list(planOrPlans) as any;
  } else {
    return object(planOrPlans) as any;
  }
}

function isTuple<T extends readonly [...(readonly any[])]>(t: any | T): t is T {
  return Array.isArray(t);
}
