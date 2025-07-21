import type { Step } from "../step.js";
import { access } from "./access.js";

/**
 * If your step class has a `get` method you should implement this so users
 * benefit from type safety.
 *
 * e.g. `implements StepWithGet<{ a: Step<number>, b: Step<string> }>`
 */
export interface StepWithGet<TStepByKey extends Record<string, Step>> {
  /** TypeScript hack so we can infer the type of getting each key */
  __tshackGetLookup?: TStepByKey;
  get<TKey extends keyof TStepByKey>(key: TKey): TStepByKey[TKey];
}

/**
 * Determines the keys that a given step represents
 *
 * 1. If it implements StepWithGet, get the explicit keys
 * 2. Otherwise, if it has a get method, figure out which attributes it accepts
 * 3. Otherwise, determine the type the Step encodes and extract the keys of that
 */
type StepGetKeys<TStep extends Step> =
  TStep extends StepWithGet<infer UStepByKey>
    ? keyof UStepByKey
    : TStep extends { get(attr: infer U): any }
      ? U
      : TStep extends Step<infer UData>
        ? keyof UData
        : never;

/**
 * Determines the type of the step returned from `get(step, attr)`.
 *
 * 1. If it implements StepWithGet, get a step representing that specific attribute
 * 2. Otherwise, if it has a get method, return the ReturnType of that method
 * 3. Otherwise, determine the type the Step encodes and return a Step representing the relevant key of that
 */
type GetResult<TStep extends Step, TAttr extends StepGetKeys<TStep>> =
  TStep extends StepWithGet<infer UStepByKey>
    ? TAttr extends keyof UStepByKey
      ? UStepByKey[TAttr]
      : never
    : TStep extends { get(attr: any): infer UGetStep }
      ? UGetStep
      : TStep extends Step<infer UData>
        ? TAttr extends keyof UData
          ? Step<UData[TAttr]>
          : never
        : never;

/**
 * Call `$step.get(attr)` if possible, falling back to `access($step, attr)`.
 */
export function get<
  TStep extends Step,
  TAttr extends StepGetKeys<TStep> & string,
>($step: TStep, attr: TAttr): GetResult<TStep, TAttr> {
  return "get" in $step && typeof $step.get === "function"
    ? $step.get(attr)
    : (access($step, attr) as any);
}
