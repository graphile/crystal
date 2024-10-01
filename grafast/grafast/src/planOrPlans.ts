import { ExecutableStep } from "./step.js";
import { constant } from "./steps/constant.js";
import { list } from "./steps/list.js";
import { object } from "./steps/object.js";

export type PlansList<TList> = TList extends [...any[]]
  ? { [index in keyof TList]: ExecutableStep<TList[index]> }
  : never;

export type PlansObject<TObject> = TObject extends Record<string, any>
  ? TObject extends ExecutableStep<any>
    ? never
    : { [key in keyof TObject]: ExecutableStep<TObject[key]> }
  : never;

export type PlanOrPlans<TData> =
  | PlansList<TData>
  | PlansObject<TData>
  | ExecutableStep<TData>
  | null
  | undefined;

export function planOrPlansToStep<TData>(
  planOrPlans: PlanOrPlans<TData>,
): ExecutableStep<TData> {
  if (planOrPlans == null) {
    return constant(planOrPlans) as ExecutableStep<TData>;
  } else if (planOrPlans instanceof ExecutableStep) {
    return planOrPlans;
  } else if (Array.isArray(planOrPlans)) {
    return list(planOrPlans) as ExecutableStep<TData>;
  } else {
    return object(planOrPlans) as ExecutableStep<TData>;
  }
}
