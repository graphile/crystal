import type { FieldPlanResolver } from "../../interfaces.js";
import { get } from "../../steps/access.js";

export const defaultPlanResolver: FieldPlanResolver = ($step, _, info) =>
  get($step, info.fieldName);
