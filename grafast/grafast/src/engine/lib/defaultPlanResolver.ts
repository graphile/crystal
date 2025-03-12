import type { FieldPlanResolver } from "../../interfaces.js";
import type { Step } from "../../step.js";
import { access } from "../../steps/access.js";

export const defaultPlanResolver: FieldPlanResolver<
  any,
  Step & { get?: (field: string) => Step },
  any
> = ($step, _, { fieldName }) => {
  return typeof $step.get === "function"
    ? $step.get(fieldName)
    : access($step, [fieldName]);
};
