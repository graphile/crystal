import type {
  GraphQLArgument,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputType,
} from "graphql";
import {
  getNullableType,
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
  isScalarType,
} from "graphql";

import type {
  __InputObjectPlan,
  __TrackedObjectPlan,
  Aether,
} from "./index.js";
import type { InputPlan } from "./input.js";
import type {
  ArgumentApplyPlanResolver,
  ArgumentInputPlanResolver,
  FieldArgs,
  InputObjectFieldApplyPlanResolver,
  InputObjectFieldInputPlanResolver,
  InputObjectTypeInputPlanResolver,
  TrackedArguments,
} from "./interfaces.js";
import type { ModifierPlan } from "./plan.js";
import { assertExecutablePlan, ExecutablePlan } from "./plan.js";
import type { __ItemPlan } from "./plans/__item.js";
import { constant } from "./plans/constant.js";
import { list } from "./plans/list.js";
import { object } from "./plans/object.js";

export function withFieldArgsForArguments<
  T extends ExecutablePlan,
  TParentPlan extends ExecutablePlan<any> = ExecutablePlan<any>,
>(
  aether: Aether,
  parentPlan: TParentPlan,
  $all: TrackedArguments,
  field: GraphQLField<any, any, any>,
  callback: (fieldArgs: FieldArgs) => T,
): Exclude<T, undefined | null | void> | TParentPlan {
  const fields: {
    [key: string]: GraphQLArgument;
  } = {};
  const args = field.args;
  for (const arg of args) {
    fields[arg.name] = arg;
  }
  return withFieldArgsForArgumentsOrInputObject(
    aether,
    null,
    parentPlan,
    $all,
    fields,
    callback,
  );
}

function withFieldArgsForArgumentsOrInputObject<
  T extends ExecutablePlan | ModifierPlan | null | void,
  TParentPlan extends ExecutablePlan,
>(
  aether: Aether,
  typeContainingFields: GraphQLInputType | null,
  parentPlan: TParentPlan,
  $current: TrackedArguments | InputPlan, //__TrackedObjectPlan | __InputObjectPlan,
  fields: {
    [key: string]: GraphQLArgument | GraphQLInputField;
  } | null,
  callback: (fieldArgs: FieldArgs) => T,
): Exclude<T, undefined | null | void> | TParentPlan {
  const schema = aether.schema;
  const analyzedCoordinates: string[] = [];

  const getArgOnceOnly = (inPath: string | string[]) => {
    const path = Array.isArray(inPath) ? [...inPath] : [inPath];
    if (path.length < 1) {
      throw new Error("Invalid");
    }

    if (!fields) {
      throw new Error("path is invalid when dealing with a leaf field or list");
    }

    const id = path.join(".");
    if (!analyzedCoordinates.includes(id)) {
      analyzedCoordinates.push(id);
    }

    const $currentObject = $current as
      | TrackedArguments
      | __TrackedObjectPlan
      | __InputObjectPlan;

    const argName = path.shift()!;
    let $value = ($currentObject.get as (argName: string) => InputPlan)(
      argName,
    );
    let argOrField: GraphQLArgument | GraphQLInputField = fields[argName];

    /*
    if ($value.evalIs(undefined)) {
      return undefined;
    }
    */

    let type = getNullableType(argOrField.type);

    while (path.length > 0) {
      const name = path.shift()!;
      if (!isInputObjectType(type)) {
        throw new Error(
          `Cannot process '${type}' through args; expected input object`,
        );
      }
      $value = (
        ($value as __TrackedObjectPlan | __InputObjectPlan).get as (
          name: string,
        ) => InputPlan
      )(name);
      /*
      if ($value.evalIs(undefined)) {
        return undefined;
      }
      */
      argOrField = type.getFields()[name];
      type = getNullableType(argOrField.type);
    }

    return { $value, argOrField, type };
  };

  function planArgumentOrInputField(
    details: ReturnType<typeof getArgOnceOnly>,
    $toPlan: ExecutablePlan | ModifierPlan | null,
  ) {
    const plan = aether.withModifiers(() => {
      const { argOrField, $value } = details;

      return withFieldArgsForArgOrField(
        aether,
        parentPlan,
        argOrField,
        $value,
        (fieldArgs) => {
          if (!typeContainingFields) {
            const arg = argOrField as GraphQLArgument;
            if ($toPlan) {
              const argResolver = arg.extensions.graphile?.applyPlan;
              if (argResolver) {
                return argResolver(parentPlan, $toPlan, fieldArgs, {
                  schema,
                  entity: argOrField as GraphQLArgument,
                });
              } else {
                return $toPlan;
              }
            } else {
              const argResolver = arg.extensions.graphile?.inputPlan;
              if (argResolver) {
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
            if ($toPlan) {
              const fieldResolver = field.extensions.graphile?.applyPlan;
              if (fieldResolver) {
                return fieldResolver($toPlan, fieldArgs, {
                  schema,
                  entity: argOrField as GraphQLInputField,
                });
              } else {
                return $toPlan;
              }
            } else {
              const fieldResolver = field.extensions.graphile?.inputPlan;
              if (fieldResolver) {
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
    return plan;
  }

  function getPlannedValue(
    $value: InputPlan,
    currentType: GraphQLInputType,
  ): ExecutablePlan {
    if (isNonNullType(currentType)) {
      return getPlannedValue($value, currentType.ofType);
    } else if (isListType(currentType)) {
      if (!("evalLength" in $value)) {
        throw new Error(
          `GraphileInternalError<6ef74af7-7be0-4117-870f-2ebabcf5161c>: Expected ${$value} to be a __InputListPlan or __TrackedObjectPlan (i.e. to have 'evalLength')`,
        );
      }
      const l = $value.evalLength();
      if (l == null) {
        return constant(null);
      }
      const entries: ExecutablePlan[] = [];
      for (let i = 0; i < l; i++) {
        const entry = getPlannedValue($value.at(i), currentType.ofType);
        entries.push(entry);
      }
      return list(entries);
    } else if (isInputObjectType(currentType)) {
      const typeResolver =
        currentType.extensions.graphile?.inputPlan ||
        defaultInputObjectTypeInputPlanResolver;
      return withFieldArgsForArgumentsOrInputObject(
        aether,
        currentType,
        parentPlan,
        $value as any,
        currentType.getFields(),
        (fieldArgs) =>
          typeResolver(fieldArgs, {
            schema,
            type: currentType,
          }),
      );
    } else if (isScalarType(currentType)) {
      const scalarResolver = currentType.extensions.graphile?.inputPlan;
      if (scalarResolver) {
        return scalarResolver($value, { schema, type: currentType });
      } else {
        return $value;
      }
    } else if (isEnumType(currentType)) {
      /*
      const enumResolver = currentType.extensions.graphile?.inputPlan;
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
    $value: InputPlan,
    currentType: GraphQLInputType,
    $toPlan: ExecutablePlan | ModifierPlan,
  ): void {
    if (isNonNullType(currentType)) {
      applyPlannedValue($value, currentType.ofType, $toPlan);
      return;
    } else if (isListType(currentType)) {
      if (!("evalLength" in $value)) {
        throw new Error(
          `GraphileInternalError<6ef74af7-7be0-4117-870f-2ebabcf5161c>: Expected ${$value} to be a __InputListPlan or __TrackedObjectPlan (i.e. to have 'evalLength')`,
        );
      }
      const l = $value.evalLength();
      if (l == null) {
        return;
      }
      for (let i = 0; i < l; i++) {
        applyPlannedValue($value.at(i), currentType.ofType, $toPlan);
      }
      return;
    } else if (isInputObjectType(currentType)) {
      const fields = currentType.getFields();
      for (const fieldName in fields) {
        const field = fields[fieldName];
        const resolver = field.extensions.graphile?.applyPlan;
        if (resolver) {
          withFieldArgsForArgumentsOrInputObject(
            aether,
            currentType,
            parentPlan,
            $value as any,
            currentType.getFields(),
            (fieldArgs) =>
              resolver($toPlan, fieldArgs, {
                schema,
                entity: field,
              }),
          );
        }
      }
      return;
    } else if (isScalarType(currentType)) {
      return;
    } else if (isEnumType(currentType)) {
      // TODO: only do this if this enum type has values that have side effects
      const value = $value.eval();
      const enumValue = currentType.getValues().find((v) => v.value === value);
      const enumResolver = enumValue?.extensions.graphile?.applyPlan;
      if (enumResolver) {
        enumResolver($toPlan);
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
        analyzedCoordinates.push("");
        if (!typeContainingFields) {
          throw new Error(
            "You cannot call `get()` without a path in this situation",
          );
        } else {
          return getPlannedValue($current as InputPlan, typeContainingFields);
        }
      }
      const details = getArgOnceOnly(path);
      const plan = planArgumentOrInputField(details, null);

      assertExecutablePlan(plan, `UNKNOWN` /* TODO: pathIdentity */);
      return plan;
    },
    getRaw(path) {
      if (!path || (Array.isArray(path) && path.length === 0)) {
        analyzedCoordinates.push("");
        if ($current instanceof ExecutablePlan) {
          return $current;
        } else {
          throw new Error("You must getRaw a specific argument by name");
        }
      }
      const details = getArgOnceOnly(path);
      return details.$value; // details ? details.$value : undefined;
    },
    apply($target, path) {
      if (!path || (Array.isArray(path) && path.length === 0)) {
        analyzedCoordinates.push("");
        if (typeContainingFields && ($current as InputPlan).evalIs(undefined)) {
          return;
        }
        if (fields) {
          for (const fieldName of Object.keys(fields)) {
            fieldArgs.apply($target, fieldName);
          }
          return;
        } else {
          if (!typeContainingFields) {
            throw new Error(
              "You cannot call `apply()` without a path in this situation",
            );
          } else {
            return applyPlannedValue(
              $current as InputPlan,
              typeContainingFields,
              $target,
            );
          }
        }
      }
      const details = getArgOnceOnly(path);
      if (details.$value.evalIs(undefined)) {
        return;
      }
      const plan = planArgumentOrInputField(details, $target);
      /*
      if (plan && plan !== $target) {
        assertModifierPlan(
          plan,
          `UNKNOWN` /* TODO : `${objectType.name}.${field.name}(${argName}:)` * /,
        );
      }
    */
      return plan;
    },
  };
  const plan = (callback(fieldArgs) ?? parentPlan) as
    | ExecutablePlan
    | ModifierPlan;

  // Now handled all the remaining coordinates
  if (!analyzedCoordinates.includes("")) {
    if (!fields) {
      fieldArgs.apply(plan);
    } else {
      const process = (
        layerFields: typeof fields,
        parentPath: readonly string[] = [],
      ) => {
        for (const fieldName in layerFields) {
          const field = layerFields[fieldName];
          const newPath = [...parentPath, fieldName];
          const pathStr = newPath.join(".");
          const prefix = `${pathStr}.`;
          if (analyzedCoordinates.includes(pathStr)) {
            continue;
          } else if (analyzedCoordinates.some((c) => c.startsWith(prefix))) {
            const inputObjectType = getNullableType(field.type);
            if (!isInputObjectType(inputObjectType)) {
              throw new Error(
                `GraphileInternalError<1ac45a76-a21e-4f25-841c-59c73ddcf70c>: How could this not be an object type given we have a path that uses it?!`,
              );
            }
            process(inputObjectType.getFields(), newPath);
            // recurse
          } else {
            fieldArgs.apply(plan, newPath);
          }
        }
      };
      process(fields);
    }
  }

  return plan as any;
}

function withFieldArgsForArgOrField<
  T extends ExecutablePlan | ModifierPlan | null | void,
  TParentPlan extends ExecutablePlan,
>(
  aether: Aether,
  parentPlan: TParentPlan,
  argOrField: GraphQLArgument | GraphQLInputField,
  $value: InputPlan,
  callback: (fieldArgs: FieldArgs) => T,
): Exclude<T, undefined | null | void> | TParentPlan {
  const type = argOrField.type;
  const nullableType = getNullableType(type);
  const fields = isInputObjectType(nullableType)
    ? nullableType.getFields()
    : null;
  return withFieldArgsForArgumentsOrInputObject(
    aether,
    type,
    parentPlan,
    $value,
    fields,
    callback,
  );
}

const defaultInputObjectTypeInputPlanResolver: InputObjectTypeInputPlanResolver =
  (input, info) => {
    const fields = info.type.getFields();
    const obj: { [key: string]: ExecutablePlan } = {};
    for (const fieldName in fields) {
      obj[fieldName] = input.get(fieldName);
    }
    return object(obj);
  };
