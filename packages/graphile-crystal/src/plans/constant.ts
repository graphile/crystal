import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

/**
 * Converts a constant value (e.g. a string/number/etc) into a plan
 */
export class ConstantPlan<TData> extends ExecutablePlan<TData> {
  constructor(private data: TData) {
    super();
  }

  execute(values: CrystalValuesList<[]>): CrystalResultsList<TData> {
    return values.map(() => this.data);
  }
}

export function constant<TData>(data: TData): ConstantPlan<TData> {
  return new ConstantPlan<TData>(data);
}
