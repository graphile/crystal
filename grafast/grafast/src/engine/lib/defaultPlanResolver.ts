import type { FieldPlanResolver } from "../../interfaces.js";
import type { ExecutableStep } from "../../step.js";
import { access } from "../../steps/access.js";

export const defaultPlanResolver: FieldPlanResolver<
  any,
  ExecutableStep & { get?: (field: string) => ExecutableStep },
  any
> = ($step, _, { fieldName }) => {
  return typeof $step.get === "function"
    ? $step.get(fieldName)
    : access($step, [fieldName]);
};
