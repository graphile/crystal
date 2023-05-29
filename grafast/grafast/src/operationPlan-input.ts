import type {
  GraphQLArgument,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputType,
} from "graphql";
import * as graphql from "graphql";

import type { OperationPlan } from "./engine/OperationPlan.js";
import type { __InputObjectStep, __TrackedValueStep } from "./index.js";
import { BaseStep } from "./index.js";
import type { InputStep } from "./input.js";
import type {
  FieldArgs,
  InputObjectTypeInputPlanResolver,
  TargetStepOrCallback,
  TrackedArguments,
} from "./interfaces.js";
import type { ModifierStep } from "./step.js";
import { assertExecutableStep, ExecutableStep } from "./step.js";
import type { __ItemStep } from "./steps/__item.js";
import { constant, ConstantStep } from "./steps/constant.js";
import { list } from "./steps/list.js";
import { object } from "./steps/object.js";

const {
  getNullableType,
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
  isScalarType,
} = graphql;

export type ApplyAfterModeArg =
  | "autoApplyAfterParentPlan"
  | "autoApplyAfterParentSubscribePlan";
type ApplyAfterModeInput =
  | "autoApplyAfterParentApplyPlan"
  | "autoApplyAfterParentInputPlan";
type ApplyAfterMode = ApplyAfterModeArg | ApplyAfterModeInput;

export function withFieldArgsForArguments<
  T extends ExecutableStep,
  TParentStep extends ExecutableStep = ExecutableStep,
>(
  operationPlan: OperationPlan,
  parentPlan: TParentStep,
  $all: TrackedArguments,
  field: GraphQLField<any, any, any>,
  applyAfterMode: ApplyAfterModeArg,
  callback: (fieldArgs: FieldArgs) => T | null | undefined,
): Exclude<T, undefined | null | void> | TParentStep {
  if (operationPlan.loc !== null)
    operationPlan.loc.push(`withFieldArgsForArguments(${field.name})`);
  const fields: {
    [key: string]: GraphQLArgument;
  } = Object.create(null);
  const args = field.args;
  for (const arg of args) {
    fields[arg.name] = arg;
  }
  const result = withFieldArgsForArgumentsOrInputObject(
    operationPlan,
    null,
    parentPlan,
    $all,
    fields,
    applyAfterMode,
    callback,
  );
  if (operationPlan.loc !== null) operationPlan.loc.pop();

  return result;
}

function withFieldArgsForArgumentsOrInputObject<
  T extends ExecutableStep | ModifierStep | null | void,
  TParentStep extends ExecutableStep,
>(
  operationPlan: OperationPlan,
  typeContainingFields: GraphQLInputType | null,
  parentPlan: TParentStep,
  $current: TrackedArguments | InputStep, //__TrackedValueStep | __InputObjectStep,
  fields: {
    [key: string]: GraphQLArgument | GraphQLInputField;
  } | null,
  applyAfterMode: ApplyAfterMode,
  callback: (fieldArgs: FieldArgs) => T,
): Exclude<T, undefined | null | void> | TParentStep {
  const schema = operationPlan.schema;

  const getArgOnceOnly = (inPath: string | readonly string[]) => {
    if (operationPlan.loc !== null)
      operationPlan.loc.push(`getArgOnceOnly('${inPath}')`);
    const path = Array.isArray(inPath) ? [...inPath] : [inPath];
    if (path.length < 1) {
      throw new Error("Invalid");
    }

    if (!fields) {
      throw new Error("path is invalid when dealing with a leaf field or list");
    }

    const id = path.join(".");

    const $currentObject = $current as
      | TrackedArguments
      | __TrackedValueStep
      | __InputObjectStep
      | ConstantStep<undefined>;

    const argName = path.shift()!;
    let $value =
      "get" in $currentObject
        ? ($currentObject.get as (argName: string) => InputStep)(argName)
        : constant(undefined); /* by elimination */

    /*
    if ($value.evalIs(undefined)) {
      return undefined;
    }
    */

    let parentType = typeContainingFields;
    let argOrField: GraphQLArgument | GraphQLInputField = fields[argName];
    if (!argOrField) {
      if (operationPlan.loc !== null) {
        throw new Error(
          `Attempted to access non-existant arg '${argName}' (known args: ${Object.keys(
            fields,
          ).join(", ")}) at ${operationPlan.loc.join(" > ")}`,
        );
      } else {
        throw new Error(
          `Attempted to access non-existant arg '${argName}' (known args: ${Object.keys(
            fields,
          ).join(", ")})`,
        );
      }
    }
    let type = getNullableType(argOrField.type);

    while (path.length > 0) {
      const name = path.shift()!;
      if (!isInputObjectType(type)) {
        throw new Error(
          `Cannot process '${type}' through args; expected input object`,
        );
      }
      $value = (
        ($value as __TrackedValueStep | __InputObjectStep).get as (
          name: string,
        ) => InputStep
      )(name);
      /*
      if ($value.evalIs(undefined)) {
        return undefined;
      }
      */
      parentType = type;
      argOrField = type.getFields()[name];
      type = getNullableType(argOrField.type);
    }

    if (operationPlan.loc !== null) operationPlan.loc.pop();
    return { $value, argOrField, type, parentType };
  };

  function notUndefined($value: InputStep) {
    // OPTIMIZE: having a lot of 'is undefined' checks is expensive; instead we
    // should optimize this so that it tracks the set of keys that are set and
    // matches against those as a single operation.
    return !("evalIs" in $value && $value.evalIs(undefined));
  }

  function planArgumentOrInputField(
    details: ReturnType<typeof getArgOnceOnly>,
    $toStep: ExecutableStep | ModifierStep | null,
  ) {
    if (operationPlan.loc !== null)
      operationPlan.loc.push(
        `planArgumentOrInputField(${details.argOrField.name})`,
      );
    const plan = operationPlan.withModifiers(() => {
      const { argOrField, $value, parentType } = details;

      const applyAfterMode: ApplyAfterMode = $toStep
        ? "autoApplyAfterParentApplyPlan"
        : "autoApplyAfterParentInputPlan";
      return withFieldArgsForArgOrField(
        operationPlan,
        parentPlan,
        argOrField,
        $value,
        applyAfterMode,
        (fieldArgs) => {
          if (!parentType) {
            const arg = argOrField as GraphQLArgument;
            if ($toStep) {
              const argResolver = arg.extensions.grafast?.applyPlan;
              if (argResolver && notUndefined($value)) {
                return argResolver(parentPlan, $toStep, fieldArgs, {
                  schema,
                  entity: argOrField as GraphQLArgument,
                });
              } else {
                return $toStep;
              }
            } else {
              const argResolver = arg.extensions.grafast?.inputPlan;
              if (argResolver !== undefined) {
                return argResolver(parentPlan, fieldArgs, {
                  schema,
                  entity: argOrField as GraphQLArgument,
                });
              } else {
                return fieldArgs.get();
              }
            }
          } else {
            const field = argOrField as GraphQLInputField;
            if ($toStep) {
              const fieldResolver = field.extensions.grafast?.applyPlan;
              if (fieldResolver && notUndefined($value)) {
                return fieldResolver($toStep, fieldArgs, {
                  schema,
                  entity: argOrField as GraphQLInputField,
                });
              } else {
                return $toStep;
              }
            } else {
              const fieldResolver = field.extensions.grafast?.inputPlan;
              if (fieldResolver !== undefined) {
                return fieldResolver(fieldArgs, {
                  schema,
                  entity: argOrField as GraphQLInputField,
                });
              } else {
                return fieldArgs.get();
              }
            }
          }
        },
      );
    });
    if (operationPlan.loc !== null) operationPlan.loc.pop();
    return plan;
  }

  function getPlannedValue(
    $value: InputStep,
    currentType: GraphQLInputType,
  ): ExecutableStep {
    if (operationPlan.loc !== null)
      operationPlan.loc.push(
        `getPlannedValue(${$value.id},${
          "name" in currentType ? currentType.name : "?"
        })`,
      );
    const result = getPlannedValue_($value, currentType);
    if (operationPlan.loc !== null) operationPlan.loc.pop();
    return result;
  }

  function getPlannedValue_(
    $value: InputStep,
    currentType: GraphQLInputType,
  ): ExecutableStep {
    if (isNonNullType(currentType)) {
      return getPlannedValue($value, currentType.ofType);
    } else if (isListType(currentType)) {
      if (!("evalLength" in $value)) {
        throw new Error(
          `GrafastInternalError<6ef74af7-7be0-4117-870f-2ebabcf5161c>: Expected ${$value} to be a __InputListStep or __TrackedValueStep (i.e. to have 'evalLength')`,
        );
      }
      const l = $value.evalLength();
      if (l == null) {
        return constant(null);
      }
      const entries: ExecutableStep[] = [];
      for (let i = 0; i < l; i++) {
        const entry = getPlannedValue($value.at(i), currentType.ofType);
        entries.push(entry);
      }
      return list(entries);
    } else if (isInputObjectType(currentType)) {
      const typeResolver =
        currentType.extensions.grafast?.inputPlan ||
        defaultInputObjectTypeInputPlanResolver;
      return withFieldArgsForArgumentsOrInputObject(
        operationPlan,
        currentType,
        parentPlan,
        $value as any,
        currentType.getFields(),
        applyAfterMode,
        (fieldArgs) =>
          typeResolver(fieldArgs, {
            schema,
            type: currentType,
          }),
      );
    } else if (isScalarType(currentType)) {
      const scalarResolver = currentType.extensions.grafast?.inputPlan;
      if (scalarResolver !== undefined) {
        return scalarResolver($value, { schema, type: currentType });
      } else {
        return $value;
      }
    } else if (isEnumType(currentType)) {
      /*
      const enumResolver = currentType.extensions.grafast?.inputPlan;
      if (enumResolver) {
        return enumResolver($value, { schema, type: currentType });
      } else {
        return $value;
      }
      */
      return $value;
    } else {
      const never: never = currentType;
      throw new Error(`Unhandled input type ${never}`);
    }
  }

  function applyPlannedValue(
    $value: InputStep,
    currentType: GraphQLInputType,
    toStepOrCallback: TargetStepOrCallback,
  ): void {
    if (isNonNullType(currentType)) {
      applyPlannedValue($value, currentType.ofType, toStepOrCallback);
      return;
    } else if (isListType(currentType)) {
      if (!("evalLength" in $value)) {
        throw new Error(
          `GrafastInternalError<6ef74af7-7be0-4117-870f-2ebabcf5161c>: Expected ${$value} to be a __InputListStep or __TrackedValueStep (i.e. to have 'evalLength')`,
        );
      }
      const l = $value.evalLength();
      if (l == null) {
        return;
      }
      const innerType = currentType.ofType;
      for (let i = 0; i < l; i++) {
        const $toStep =
          typeof toStepOrCallback === "function"
            ? toStepOrCallback(i)
            : toStepOrCallback;
        applyPlannedValue($value.at(i), innerType, $toStep);
      }
      return;
    } else if (isInputObjectType(currentType)) {
      const fields = currentType.getFields();
      for (const fieldName in fields) {
        const field = fields[fieldName];
        const resolver = field.extensions.grafast?.applyPlan;
        if (typeof resolver === "function") {
          const fieldType = field.type;
          if (!("get" in $value)) {
            throw new Error(
              `GrafastInternalError<b68a1d2a-9315-40cc-a91b-2eca1724b752>: unexpected '${$value}'`,
            );
          }
          const $field = $value.get(fieldName);
          const $toStep =
            typeof toStepOrCallback === "function"
              ? toStepOrCallback(fieldName)
              : toStepOrCallback;
          if (!($toStep instanceof BaseStep)) {
            throw new Error(
              `Invalid 'toStepOrCallback' passed to 'apply()', should resolve to an ExecutableStep or ModifierStep`,
            );
          }
          if (notUndefined($field)) {
            withFieldArgsForArgumentsOrInputObject(
              operationPlan,
              fieldType,
              parentPlan,
              $field,
              isInputObjectType(fieldType) ? fieldType.getFields() : null,
              "autoApplyAfterParentApplyPlan",
              (fieldArgs) =>
                resolver($toStep, fieldArgs, {
                  schema,
                  entity: field,
                }),
            );
          }
        }
      }
      return;
    } else if (isScalarType(currentType)) {
      return;
    } else if (isEnumType(currentType)) {
      // PERF: only do this if this enum type has values that have side effects
      const value = $value.eval();
      const enumValue = currentType.getValues().find((v) => v.value === value);
      const enumResolver = enumValue?.extensions.grafast?.applyPlan;
      if (enumResolver !== undefined) {
        const $toStep = toStepOrCallback;
        if (!($toStep instanceof BaseStep)) {
          throw new Error(
            `Invalid 'toStepOrCallback' passed to 'apply()', should resolve to an ExecutableStep or ModifierStep`,
          );
        }
        enumResolver($toStep);
      }
      return;
    } else {
      const never: never = currentType;
      throw new Error(`Unhandled input type ${never}`);
    }
  }

  const fieldArgs: FieldArgs = {
    get(path) {
      if (!path || (Array.isArray(path) && path.length === 0)) {
        if (!typeContainingFields) {
          if (fields !== null) {
            return object(
              Object.values(fields).reduce((memo, arg) => {
                memo[arg.name] = fieldArgs.get(arg.name);
                return memo;
              }, Object.create(null)) ?? Object.create(null),
            );
          } else {
            throw new Error(
              "You cannot call `get()` without a path in this situation",
            );
          }
        } else {
          return getPlannedValue($current as InputStep, typeContainingFields);
        }
      }
      const details = getArgOnceOnly(path);
      const plan = planArgumentOrInputField(details, null);

      assertExecutableStep(plan);
      return plan;
    },
    getRaw(path) {
      if (!path || (Array.isArray(path) && path.length === 0)) {
        if ($current instanceof ExecutableStep) {
          return $current;
        } else {
          throw new Error("You must getRaw a specific argument by name");
        }
      }
      const details = getArgOnceOnly(path);
      return details.$value; // details ? details.$value : undefined;
    },
    apply(targetStepOrCallback, path) {
      if (!path || (Array.isArray(path) && path.length === 0)) {
        if (typeContainingFields && ($current as InputStep).evalIs(undefined)) {
          return;
        }
        if (fields !== null) {
          for (const fieldName of Object.keys(fields)) {
            const target =
              typeof targetStepOrCallback === "function"
                ? targetStepOrCallback(fieldName)
                : targetStepOrCallback;
            fieldArgs.apply(target, fieldName);
          }
          return;
        } else {
          if (!typeContainingFields) {
            throw new Error(
              "You cannot call `apply()` without a path in this situation",
            );
          } else {
            return applyPlannedValue(
              $current as InputStep,
              typeContainingFields,
              targetStepOrCallback,
            );
          }
        }
      }
      const details = getArgOnceOnly(path);
      if (details.$value.evalIs(undefined)) {
        return;
      }
      const $target = targetStepOrCallback;
      if (!($target instanceof BaseStep)) {
        throw new Error(
          "Callback not supported here, please revisit your apply() call.",
        );
      }
      const step = planArgumentOrInputField(details, $target);
      /*
      if (step && step !== targetStepOrCallback) {
        assertModifierStep(
          step,
          `UNKNOWN` /* TODO : `${objectType.name}.${field.name}(${argName}:)` * /,
        );
      }
    */
      return step;
    },
  };
  const callbackResult = callback(fieldArgs);
  const step = (callbackResult ?? parentPlan) as ExecutableStep | ModifierStep;

  // Now process 'applyAfterMode'
  if (
    fields &&
    step != null &&
    !(step instanceof ConstantStep && step.isNull())
  ) {
    if (operationPlan.loc !== null) operationPlan.loc.push("handle_after");
    if (applyAfterMode === "autoApplyAfterParentApplyPlan" && callbackResult) {
      fieldArgs.apply(callbackResult);
    } else {
      for (const fieldName in fields) {
        const field = fields[fieldName];
        switch (applyAfterMode) {
          case "autoApplyAfterParentPlan":
          case "autoApplyAfterParentSubscribePlan": {
            const arg = field as GraphQLArgument;
            const t = arg.extensions.grafast?.[applyAfterMode];
            if (t) {
              fieldArgs.apply(step, fieldName);
            }
            break;
          }
          case "autoApplyAfterParentApplyPlan":
          case "autoApplyAfterParentInputPlan": {
            const fld = field as GraphQLInputField;
            const t = fld.extensions.grafast?.[applyAfterMode];
            if (t) {
              fieldArgs.apply(step, fieldName);
            }
            break;
          }
        }
      }
    }
    /*
    if (applyAfter === true) {
      // Apply all fields to the result of the callback
      if (callbackResult) {
        fieldArgs.apply(callbackResult);
      }
      // TODO: else: warn user?
    } else if (applyAfter) {
      for (const path of applyAfter) {
        fieldArgs.apply(step, path);
      }
    }
    */
    if (operationPlan.loc !== null) operationPlan.loc.pop();
  }

  return step as any;
}

function withFieldArgsForArgOrField<
  T extends ExecutableStep | ModifierStep | null | void,
  TParentStep extends ExecutableStep,
>(
  operationPlan: OperationPlan,
  parentPlan: TParentStep,
  argOrField: GraphQLArgument | GraphQLInputField,
  $value: InputStep,
  applyAfterMode: ApplyAfterMode,
  callback: (fieldArgs: FieldArgs) => T,
): Exclude<T, undefined | null | void> | TParentStep {
  const type = argOrField.type;
  const nullableType = getNullableType(type);
  const fields = isInputObjectType(nullableType)
    ? nullableType.getFields()
    : null;
  return withFieldArgsForArgumentsOrInputObject(
    operationPlan,
    type,
    parentPlan,
    $value,
    fields,
    applyAfterMode,
    callback,
  );
}

const defaultInputObjectTypeInputPlanResolver: InputObjectTypeInputPlanResolver =
  (input, info) => {
    const fields = info.type.getFields();
    const obj: { [key: string]: ExecutableStep } = Object.create(null);
    for (const fieldName in fields) {
      obj[fieldName] = input.get(fieldName);
    }
    return object(obj);
  };
