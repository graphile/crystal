import type { CrystalObject } from "../interfaces";
import { $$planResults } from "../interfaces";
import type { ExecutableStep } from "../step";
import { ROOT_VALUE_OBJECT } from "../utils";

/**
 * Implements `PopulateValueStep`
 */
export function populateValuePlan(
  valuePlan: ExecutableStep,
  crystalObject: CrystalObject,
  object: unknown,
  label: string,
): void {
  crystalObject[$$planResults].set(
    valuePlan.layerPlan.id,
    valuePlan.id,
    object ?? ROOT_VALUE_OBJECT,
  );
}
