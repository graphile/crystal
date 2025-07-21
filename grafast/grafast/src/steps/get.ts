import type { Step } from "../step.js";
import { access } from "./access.js";

/**
 * If your step class has a `get` method you should implement this so users
 * benefit from type safety.
 */
export interface StepWithGet<TObj> {
  /** TypeScript hack so we can infer the type of getting each key */
  $inferGet?: TObj;
  get<TKey extends keyof TObj>(key: TKey): Step<TObj[TKey]>;
}

/**
 * Determines the keys that a given step represents
 *
 * 1. If it implements StepWithGet, get the explicit keys
 * 2. Otherwise, if it has a get method, figure out which attributes it accepts
 * 3. Otherwise, determine the type the Step encodes and extract the keys of that
 */
type StepGetKeys<TStep extends Step> =
  TStep extends StepWithGet<infer UObj>
    ? keyof UObj
    : TStep extends { get(attr: infer U): any }
      ? U
      : TStep extends Step<infer UData>
        ? UData extends Record<string, any>
          ? keyof UData
          : string
        : never;

/**
 * Determines the type of the step returned from `get(step, attr)`.
 *
 * 1. If it implements StepWithGet, get a step representing that specific attribute
 * 2. Otherwise, if it has a get method, return the ReturnType of that method
 * 3. Otherwise, determine the type the Step encodes and return a Step representing the relevant key of that
 */
type GetResult<TStep extends Step, TAttr extends StepGetKeys<TStep>> =
  TStep extends StepWithGet<infer TObj>
    ? TAttr extends keyof TObj
      ? Step<TObj[TAttr]>
      : never
    : TStep extends { get(attr: any): infer UStep }
      ? UStep
      : TStep extends Step<infer UData>
        ? UData extends Record<string, any>
          ? Step<UData[keyof UData]>
          : Step<unknown>
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
