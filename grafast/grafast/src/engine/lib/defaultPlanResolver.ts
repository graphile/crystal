import type { FieldPlanResolver } from "../../interfaces.js";
import type { Step } from "../../step.js";
import { get } from "../../steps/access.js";

export const defaultPlanResolver: FieldPlanResolver<any, Step, any> = (
  $step,
  _,
  { fieldName },
) => {
  return get($step, fieldName);
};
