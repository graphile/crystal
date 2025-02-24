import type { GraphQLInputType, GraphQLSchema } from "graphql";
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
import { constant, ConstantStep, operationPlan } from "./index.js";

let currentModifiers: Modifier<any>[] = [];
let applyingModifiers = false;
let inputArgsApplyDepth = 0;

export class ApplyInputStep<
  TParent extends object = any,
  TTarget extends object = TParent,
> extends UnbatchedExecutableStep<(arg: TParent) => void> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ApplyInputStep",
  };
  public isSyncAndSafe = true;
  public allowMultipleOptimizations = true;

  valueDepId: 0;
  constructor(
    private inputType: GraphQLInputType,
    $value: AnyInputStep,
    private getTargetFromParent:
      | ((parent: TParent) => TTarget | (() => TTarget))
      | undefined,
  ) {
    super();
    this.valueDepId = this.addUnaryDependency($value) as 0;
    if (!this._isUnary) {
      throw new Error(`applyInput() must be unary`);
    }
    this._isUnaryLocked = true;
  }

  public deduplicate(peers: readonly ApplyInputStep[]) {
    return peers.filter(
      (p) =>
        p.inputType === this.inputType &&
        p.getTargetFromParent === this.getTargetFromParent,
    );
  }

  public optimize() {
    const $value = this.getDep(this.valueDepId);
    if ($value instanceof ConstantStep) {
      // Replace myself with a constant!
      const {
        operationPlan: { schema },
        inputType,
        getTargetFromParent,
      } = this;
      const { data } = $value;
      return constant(function applyInputConstant(parent: TParent) {
        inputArgsApply(schema, inputType, parent, data, getTargetFromParent);
      }, false);
    }
    return this;
  }

  unbatchedExecute(extra: UnbatchedExecutionExtra, value: unknown) {
    const { getTargetFromParent } = this;
    return (parentThing: TParent) =>
      inputArgsApply(
        this.operationPlan.schema,
        this.inputType,
        parentThing,
        value,
        getTargetFromParent,
      );
  }
}

export function inputArgsApply<
  TArg extends object,
  TTarget extends object = TArg,
>(
  schema: GraphQLSchema,
  inputType: GraphQLInputType,
  parent: TArg,
  inputValue: unknown,
  getTargetFromParent:
    | ((parent: TArg) => TTarget | (() => TTarget))
    | undefined,
): void {
  try {
    inputArgsApplyDepth++;
    const target = getTargetFromParent
      ? getTargetFromParent(parent)
      : (parent as unknown as TTarget);

    _inputArgsApply<TTarget>(schema, inputType, target, inputValue);
  } finally {
    inputArgsApplyDepth--;
  }
  let l: number;
  if (inputArgsApplyDepth === 0 && (l = currentModifiers.length) > 0) {
    applyingModifiers = true;
    try {
      for (let i = l - 1; i >= 0; i--) {
        currentModifiers[i].apply();
      }
    } finally {
      applyingModifiers = false;
      currentModifiers = [];
    }
  }
}

export function applyInput<
  TParent extends object = any,
  TTarget extends object = TParent,
>(
  inputType: GraphQLInputType,
  $value: AnyInputStep,
  getTargetFromParent?: (parent: TParent) => TTarget,
) {
  const opPlan = operationPlan();
  const { schema } = opPlan;
  return opPlan.withRootLayerPlan(() => {
    if ($value instanceof ConstantStep) {
      // Replace us with a constant
      const { data } = $value;
      return constant(function applyInputConstant(parent: TParent) {
        inputArgsApply(schema, inputType, parent, data, getTargetFromParent);
      }, false);
    } else {
      return new ApplyInputStep<TParent, TTarget>(
        inputType,
        $value,
        getTargetFromParent,
      );
    }
  });
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
  schema: GraphQLSchema,
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
    _inputArgsApply(schema, inputType.ofType, target, inputValue);
  } else if (isListType(inputType)) {
    if (inputValue == null) return;
    if (!Array.isArray(inputValue)) {
      throw new Error(`Expected list in list position`);
    }
    for (const item of inputValue) {
      const itemTarget = typeof target === "function" ? target() : target;
      _inputArgsApply(schema, inputType.ofType, itemTarget, item);
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
    for (const [fieldName, field] of Object.entries(fields)) {
      const val = (inputValue as any)[fieldName];
      if (val === undefined) continue;
      if (field.extensions.grafast?.apply) {
        const newTarget = field.extensions.grafast.apply(target, val, {
          schema,
          field,
          fieldName,
        });
        if (newTarget != null) {
          _inputArgsApply(schema, field.type, newTarget, val);
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

export type ApplyableExecutableStep<
  TArg extends object = any,
  TData = any,
> = ExecutableStep<TData> & {
  apply($apply: ExecutableStep<(arg: TArg) => void>): void;
};

export function isApplyableStep<TArg extends object = any, TData = any>(
  s: ExecutableStep<TData>,
): s is ApplyableExecutableStep<TArg, TData> {
  return typeof (s as any).apply === "function";
}
