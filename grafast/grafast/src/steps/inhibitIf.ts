import { FLAG_ERROR, FLAG_INHIBITED, TRAPPABLE_FLAGS } from "../constants.ts";
import { $$inhibit, flagError } from "../error.ts";
import type {
  DataFromStep,
  ExecutionDetails,
  GrafastResultsList,
} from "../interfaces.ts";
import { isListCapableStep, Step } from "../step.ts";
import { sudo } from "../utils.ts";
import type { __ItemStep } from "./__item.ts";
import { lambda } from "./lambda.ts";

function isEmpty(value: unknown): boolean {
  if (value == null || value === "") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  return false;
}

export class InhibitIfStep<TStep extends Step> extends Step<
  DataFromStep<TStep>
> {
  static $$export = {
    moduleName: "grafast",
    exportName: "InhibitIfStep",
  };

  isSyncAndSafe = false;

  constructor(step: TStep, condition: Step<boolean>) {
    super();
    this.addDependency({ step, acceptFlags: TRAPPABLE_FLAGS });
    this.addDependency(condition);
    if (isListCapableStep(step)) {
      this.listItem = this._listItem;
    }
    sudo(this).implicitSideEffectStep = null;
    this.layerPlan.latestSideEffectStep = null;
  }

  public toStringMeta(): string | null {
    const $data = this.getDepOptions(0).step;
    const $condition = this.getDepOptions(1).step;
    return `${$data.id}, if(${$condition.id})`;
  }

  listItem?: ($item: __ItemStep<unknown>) => Step;

  _listItem($item: __ItemStep<unknown>) {
    const $dep = this.dependencies[0];
    return isListCapableStep($dep) ? $dep.listItem($item) : $item;
  }

  public execute(
    details: ExecutionDetails<[data: DataFromStep<TStep>, condition: boolean]>,
  ): GrafastResultsList<DataFromStep<TStep>> {
    const dataEv = details.values[0]!;
    const conditionEv = details.values[1]!;
    return details.indexMap((i) => {
      const flags = dataEv._flagsAt(i);
      if (flags & FLAG_ERROR) {
        return flagError(dataEv.at(i) as Error);
      }
      if (flags & FLAG_INHIBITED) {
        return $$inhibit;
      }
      if (conditionEv.at(i)) {
        return $$inhibit;
      }
      return dataEv.at(i);
    });
  }
}

export function inhibitIf<TStep extends Step>(
  $step: TStep,
  $condition: Step<boolean>,
) {
  return new InhibitIfStep($step, $condition) as Step<
    TStep extends Step<infer U> ? U : any
  >;
}

export function inhibitIfEmpty<TStep extends Step>($step: TStep) {
  const $isEmpty = lambda($step, isEmpty, true);
  return inhibitIf($step, $isEmpty);
}
