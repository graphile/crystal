import type { FieldPlanResolver } from "../../interfaces.ts";
import { get } from "../../steps/get.ts";

export const defaultPlanResolver: FieldPlanResolver = ($source, _, info) =>
  get($source, info.fieldName);
