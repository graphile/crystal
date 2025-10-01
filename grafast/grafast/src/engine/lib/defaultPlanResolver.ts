import type { FieldPlanResolver } from "../../interfaces.js";
import { get } from "../../steps/get.js";

export const defaultPlanResolver: FieldPlanResolver = ($source, _, info) =>
  get($source, info.fieldName);
