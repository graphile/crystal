import type { Step } from "../step.js";
import { access } from "./access.js";

type StepGetReturn<TStep, TAttr extends string> = TStep extends {
  get: (attr: TAttr) => infer U;
}
  ? U
  : TStep extends { get: (attr: string) => infer U }
    ? U
    : never;

type StepGetKeys<TStep extends Step> = TStep extends { get(attr: infer U): any }
  ? U
  : TStep extends Step<infer UData>
    ? UData extends Record<string, any>
      ? keyof UData
      : string
    : never;
type StepAccessKey<
  TStep extends Step,
  TAttr extends StepGetKeys<TStep> & string,
> = TStep extends { get(attr: any): any }
  ? StepGetReturn<TStep, TAttr>
  : TStep extends Step<infer UData>
    ? UData extends Record<string, any>
      ? Step<UData[TAttr]>
      : Step<any>
    : never;

/**
 * Call `$step.get(attr)` if possible, falling back to `access($step, attr)`.
 */
export function get<
  TStep extends Step,
  TAttr extends StepGetKeys<TStep> & string,
>($step: TStep, attr: TAttr): StepAccessKey<TStep, TAttr> {
  return "get" in $step && typeof $step.get === "function"
    ? $step.get(attr)
    : (access($step, attr) as any);
}
