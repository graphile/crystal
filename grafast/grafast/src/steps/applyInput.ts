import type { GraphQLInputType, GraphQLSchema } from "graphql";
import {
  getNamedType,
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
  isScalarType,
} from "graphql";

import { operationPlan } from "../global.ts";
import type { AnyInputStep, UnbatchedExecutionExtra } from "../interfaces.ts";
import type { Step } from "../step.ts";
import { UnbatchedStep } from "../step.ts";
import { constant, ConstantStep } from "./constant.ts";

/** Modifiers must never be added out-of-bounds */
const FROZEN_MODIFIERS = Object.freeze([]) as never[];
let currentModifiers: Modifier<any>[] = FROZEN_MODIFIERS;
let applyingModifiers = false;

export class ApplyInputStep<
  TParent extends object = any,
  TTarget extends object = TParent,
> extends UnbatchedStep<(arg: TParent) => void> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ApplyInputStep",
  };
  public isSyncAndSafe = true;
  public allowMultipleOptimizations = true;

  valueDepId: 0;
  scopeDepId: 1 | null;
  private inputType: GraphQLInputType;
  private getTargetFromParent:
    | ((
        parent: TParent,
        inputValue: any,
        info: { scope: unknown },
      ) => TTarget | undefined | (() => TTarget))
    | undefined;
  constructor(
    inputType: GraphQLInputType,
    $value: AnyInputStep,
    getTargetFromParent:
      | ((
          parent: TParent,
          inputValue: any,
          info: { scope: unknown },
        ) => TTarget | undefined | (() => TTarget))
      | undefined,
    $scope?: Step | null,
  ) {
    super();
    this.inputType = inputType;
    this.getTargetFromParent = getTargetFromParent;
    this.valueDepId = this.addUnaryDependency($value) as 0;
    this.scopeDepId = $scope ? (this.addUnaryDependency($scope) as 1) : null;
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
    const $scope =
      this.scopeDepId === null ? null : this.getDep(this.scopeDepId);
    if (
      (!$scope || $scope instanceof ConstantStep) &&
      $value instanceof ConstantStep
    ) {
      // Replace myself with a constant!
      const {
        operationPlan: { schema },
        inputType,
        getTargetFromParent,
      } = this;
      const { data } = $value;
      const scope = $scope?.data;
      return constant(function applyInputConstant(parent: TParent) {
        inputArgsApply(
          schema,
          inputType,
          parent,
          data,
          getTargetFromParent,
          scope,
        );
      }, false);
    }
    return this;
  }

  unbatchedExecute(extra: UnbatchedExecutionExtra, value: any, scope: unknown) {
    const { getTargetFromParent } = this;
    return (parentThing: TParent) =>
      inputArgsApply(
        this.operationPlan.schema,
        this.inputType,
        parentThing,
        value,
        getTargetFromParent,
        scope,
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
    | ((
        parent: TArg,
        inputValue: any,
        info: { scope: unknown },
      ) => TTarget | undefined | (() => TTarget))
    | undefined,
  scope: unknown,
): void {
  withModifiers(() => {
    const target = getTargetFromParent
      ? getTargetFromParent(parent, inputValue, { scope })
      : (parent as unknown as TTarget);
    if (target != null) {
      _inputArgsApply<TTarget>(schema, inputType, target, inputValue, scope);
    }
  });
}

export function withModifiers<T>(cb: () => T): T {
  const existingModifiers = currentModifiers;
  currentModifiers = [];
  let result: T;
  try {
    // calling the callback should push into `currentModifiers`
    result = cb();
  } finally {
    const toProcess = currentModifiers;
    currentModifiers = existingModifiers;

    const l = toProcess.length;
    if (l > 0) {
      try {
        applyingModifiers = true;
        for (let i = l - 1; i >= 0; i--) {
          toProcess[i].apply();
        }
      } finally {
        applyingModifiers = false;
      }
    }
  }
  return result;
}

export function applyInput<
  TParent extends object = any,
  TTarget extends object = TParent,
>(
  inputType: GraphQLInputType,
  $value: AnyInputStep,
  getTargetFromParent?: (
    parent: TParent,
    inputValue: any,
    info: { scope: unknown },
  ) => TTarget | undefined,
) {
  const opPlan = operationPlan();
  const { schema } = opPlan;
  const namedType = getNamedType(inputType);
  return opPlan.withRootLayerPlan(() => {
    const $scope = namedType.extensions?.grafast?.applyScope?.() ?? null;
    if (
      (!$scope || $scope instanceof ConstantStep) &&
      $value instanceof ConstantStep
    ) {
      // Replace us with a constant
      const { data } = $value;
      const scope = $scope?.data;
      return constant(function applyInputConstant(parent: TParent) {
        inputArgsApply(
          schema,
          inputType,
          parent,
          data,
          getTargetFromParent,
          scope,
        );
      }, false);
    } else {
      return new ApplyInputStep<TParent, TTarget>(
        inputType,
        $value,
        getTargetFromParent,
        $scope,
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
  scope: unknown,
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
    _inputArgsApply(schema, inputType.ofType, target, inputValue, scope);
  } else if (isListType(inputType)) {
    if (inputValue == null) return;
    if (!Array.isArray(inputValue)) {
      throw new Error(`Expected list in list position`);
    }
    for (const item of inputValue) {
      // Need to ensure the list items are applied in order - apply each one deeply
      withModifiers(() => {
        const itemTarget = typeof target === "function" ? target() : target;
        _inputArgsApply(schema, inputType.ofType, itemTarget, item, scope);
      });
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
          scope,
        });
        if (newTarget != null) {
          _inputArgsApply(schema, field.type, newTarget, val, scope);
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
        value.extensions.grafast.apply(target, { scope, value });
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

  protected readonly parent: TParent;

  constructor(parent: TParent) {
    this.parent = parent;
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

export type ApplyableStep<
  TArg extends object = any,
  TData = any,
> = Step<TData> & {
  apply($apply: Step<(arg: TArg) => void>): void;
};

export function isApplyableStep<TArg extends object = any, TData = any>(
  s: Step<TData>,
): s is ApplyableStep<TArg, TData> {
  return typeof (s as any).apply === "function";
}
