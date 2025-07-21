import type { FieldPlanResolver } from "../../interfaces.js";
import { get } from "../../steps/get.js";

export const defaultPlanResolver: FieldPlanResolver = ($step, _, info) =>
  get($step, info.fieldName);
