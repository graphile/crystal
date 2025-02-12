import type { GraphQLInputType } from "graphql";
import {
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
  isScalarType,
} from "graphql";

import type { AnyInputStep, UnbatchedExecutionExtra } from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";

let currentModifiers: Modifier<any>[] = [];
let applyingModifiers = false;

export class ApplyInputStep<
  TArg extends object = any,
> extends UnbatchedExecutableStep<(arg: TArg) => void> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ApplyInputStep",
  };

  valueDepId: 0;
  constructor(
    private inputType: GraphQLInputType,
    $value: AnyInputStep,
  ) {
    super();
    this.valueDepId = this.addUnaryDependency($value) as 0;
  }

  unbatchedExecute(extra: UnbatchedExecutionExtra, value: unknown) {
    return (parentThing: TArg) =>
      inputArgsApply(this.inputType, parentThing, value);
  }
}

export function inputArgsApply<TArg extends object>(
  inputType: GraphQLInputType,
  target: TArg | (() => TArg),
  inputValue: unknown,
): void {
  if (currentModifiers.length !== 0 || applyingModifiers) {
    throw new Error("Previous modifiers weren't cleaned up!");
  }
  applyingModifiers = true;
  try {
    _inputArgsApply<TArg>(inputType, target, inputValue);
    const l = currentModifiers.length;
    for (let i = l - 1; i >= 0; i--) {
      currentModifiers[i].apply();
    }
  } finally {
    currentModifiers = [];
    applyingModifiers = false;
  }
}

export function applyInput<TArg extends object = any>(
  inputType: GraphQLInputType,
  $value: AnyInputStep,
) {
  return new ApplyInputStep<TArg>(inputType, $value);
}

/*
const defaultInputObjectTypeInputPlanResolver: InputObjectTypeInputPlanResolver =
  (input, info) => {
    const fields = info.type.getFields();
    const obj: { [key: string]: ExecutableStep } = Object.create(null);
    for (const fieldName in fields) {
      obj[fieldName] = input.get(fieldName);
    }
    return object(obj);
  };
*/

function _inputArgsApply<TArg extends object>(
  inputType: GraphQLInputType,
  target: TArg | (() => TArg),
  inputValue: unknown,
): void {
  // PERF: we should have the plan generate a digest of `inputType` so that we
  // can jump right to the relevant parts without too much traversal cost.
  if (inputValue === undefined) {
    return;
  }
  if (isNonNullType(inputType)) {
    if (inputValue === null) {
      throw new Error(`null value found in non-null position`);
    }
    _inputArgsApply(inputType.ofType, target, inputValue);
  } else if (isListType(inputType)) {
    if (inputValue == null) return;
    if (!Array.isArray(inputValue)) {
      throw new Error(`Expected list in list position`);
    }
    for (const item of inputValue) {
      const itemTarget = typeof target === "function" ? target() : target;
      _inputArgsApply(inputType.ofType, itemTarget, item);
    }
  } else if (typeof target === "function") {
    throw new Error(
      "Functions may only be used as the target for list types (the function is called once per list item)",
    );
  } else if (isInputObjectType(inputType)) {
    if (inputValue === null) {
      return;
    }
    const fields = inputType.getFields();
    for (const [fieldName, spec] of Object.entries(fields)) {
      const val = (inputValue as any)[fieldName];
      if (val === undefined) continue;
      if (spec.extensions.grafast?.apply) {
        const newTarget = spec.extensions.grafast.apply(target, val);
        if (newTarget != null) {
          _inputArgsApply(spec.type, newTarget, val);
        }
      }
    }
  } else if (isScalarType(inputType)) {
    // if (inputType.extensions.grafast?.apply) {
    // }
  } else if (isEnumType(inputType)) {
    if (inputValue === null) {
      return;
    }
    const values = inputType.getValues();
    const value = values.find((v) => v.value === inputValue);
    if (value) {
      if (value.extensions.grafast?.apply) {
        value.extensions.grafast.apply(target);
      }
    } else {
      throw new Error(`Couldn't find value in ${inputType} for ${inputValue}`);
    }
  } else {
    const never: never = inputType;
    throw new Error(`Input type expected, but found ${never}`);
  }
}

/**
 * Modifiers modify their parent (which may be another modifier or anything
 * else). First they gather all the requirements from their children (if any)
 * being applied to them, then they apply themselves to their parent. This
 * application is done through the `apply()` method.
 */
export abstract class Modifier<TParent> {
  // Explicitly we do not add $$export here because we want children to set it
  static $$export: any;

  constructor(protected readonly parent: TParent) {
    if (applyingModifiers) {
      throw new Error(
        `Must not create new modifier whilst modifiers are being applied!`,
      );
    }
    currentModifiers.push(this);
  }

  /**
   * In this method, you should apply the changes to your `this.parent` plan
   */
  abstract apply(): void;
}

export function isModifier<TParent>(plan: any): plan is Modifier<TParent> {
  return plan instanceof Modifier;
}

export function assertModifier<TParent>(
  plan: any,
  pathDescription: string,
): asserts plan is Modifier<TParent> {
  if (!isModifier(plan)) {
    throw new Error(
      `The plan returned from '${pathDescription}' should be a modifier plan, but it does not implement the 'apply' method.`,
    );
  }
}

/*
type ApplyAfterMode = "autoApplyAfterParentApply" | "autoApplyAfterParentInput";

function processAfter(
  rootFieldArgs: InputValue,
  path: ReadonlyArray<string | number>,
  result: Modifier | null | undefined | void,
  fields: Record<string, GraphQLInputField>,
  applyAfterMode: ApplyAfterMode,
) {
  if (result != null) {
    if (applyAfterMode === "autoApplyAfterParentApplyPlan" && result != null) {
      // `applyPlan` returned a step, so auto-apply every subfield to it
      for (const name of Object.keys(fields)) {
        rootFieldArgs.apply(result, [...path, name]);
      }
    } else {
      for (const [name, spec] of Object.entries(fields)) {
        const autoApply =
          applyAfterMode === "autoApplyAfterParentInputPlan"
            ? (spec as GraphQLInputField).extensions.grafast
                ?.autoApplyAfterParentInputPlan
            : applyAfterMode === "autoApplyAfterParentApplyPlan"
            ? (spec as GraphQLInputField).extensions.grafast
                ?.autoApplyAfterParentApplyPlan
            : null;
        if (autoApply) {
          rootFieldArgs.apply(result, [...path, name]);
        }
      }
    }
  }
}
*/

export type InputObjectFieldBakedResolver<TParent = any> = (
  parent: TParent,
  val: unknown,
) => any;
export type InputObjectFieldApplyResolver<TParent = any> = (
  parent: TParent,
  val: unknown,
) => any;
export type InputObjectTypeInputResolver = (val: unknown) => any;

export type ApplyableExecutableStep<
  TArg = any,
  TData = any,
> = ExecutableStep<TData> & {
  apply($apply: ExecutableStep<(arg: TArg) => void>): void;
};

export function isApplyableStep<TArg = any, TData = any>(
  s: ExecutableStep<TData>,
): s is ApplyableExecutableStep<TArg, TData> {
  return typeof (s as any).apply === "function";
}
