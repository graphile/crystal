import type {
  GraphQLArgument,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputType,
} from "graphql";
import * as graphql from "graphql";

import type { OperationPlan } from "./engine/OperationPlan.js";
import { __InputObjectStep, __TrackedValueStep } from "./index.js";
import type {
  FieldArgs,
  InputObjectTypeInputPlanResolver,
  InputStep,
  TrackedArguments,
} from "./interfaces.js";
import type { ExecutableStep, ModifierStep } from "./step.js";
import type { __ItemStep } from "./steps/__item.js";
import { constant, ConstantStep } from "./steps/constant.js";
import { list } from "./steps/list.js";
import { object } from "./steps/object.js";
import { assertNotAsync, assertNotPromise } from "./utils.js";

const {
  getNullableType,
  isEnumType,
  isInputObjectType,
  isListType,
  isScalarType,
} = graphql;

export type ApplyAfterModeArg =
  | "autoApplyAfterParentPlan"
  | "autoApplyAfterParentSubscribePlan";
type ApplyAfterModeInput =
  | "autoApplyAfterParentApplyPlan"
  | "autoApplyAfterParentInputPlan";
type ApplyAfterMode = ApplyAfterModeArg | ApplyAfterModeInput;

function assertNotRuntime(operationPlan: OperationPlan, description: string) {
  if (operationPlan.phase === "ready") {
    throw new Error(
      `${description} may only be called at planning time; however you have code that has attempted to call it during execution time. Please revisit your plan resolvers to locate the issue.`,
    );
  }
}

export function withFieldArgsForArguments<
  T extends ExecutableStep,
  TParentStep extends ExecutableStep = ExecutableStep,
>(
  operationPlan: OperationPlan,
  $parent: TParentStep,
  $all: TrackedArguments,
  field: GraphQLField<any, any, any>,
  applyAfterMode: ApplyAfterModeArg,
  callback: (fieldArgs: FieldArgs) => T | null | undefined,
): Exclude<T, undefined | null> | null {
  if (operationPlan.loc !== null)
    operationPlan.loc.push(`withFieldArgsForArguments(${field.name})`);

  const schema = operationPlan.schema;

  const args: {
    [key: string]: GraphQLArgument;
  } = Object.create(null);
  for (const arg of field.args) {
    args[arg.name] = arg;
  }

  const got = new Map<string, ExecutableStep>();
  const applied = new Map<string, ExecutableStep>();
  let explicitlyApplied = false;

  const fieldArgs: FieldArgs = {
    getRaw(path) {
      assertNotRuntime(operationPlan, `fieldArgs.getRaw()`);
      if (typeof path === "string") {
        return $all.get(path);
      } else if (Array.isArray(path)) {
        const [first, ...rest] = path;
        if (!first) {
          throw new Error(`getRaw() must be called with a non-empty path`);
        }
        let $entry = $all.get(first);
        for (const pathSegment of rest) {
          if (typeof pathSegment === "number" && "at" in $entry) {
            $entry = $entry.at(pathSegment);
          } else if ("get" in $entry) {
            $entry = $entry.get(pathSegment);
          } else {
            throw new Error(
              `'getRaw' path must only relate to input objects right now; path was: '${path}' (failed at '${pathSegment}')`,
            );
          }
        }
        return $entry;
      } else {
        throw new Error(`Invalid path`);
      }
    },
    get(inPath) {
      assertNotRuntime(operationPlan, `fieldArgs.get()`);
      const path = Array.isArray(inPath)
        ? (inPath as ReadonlyArray<string | number>)
        : inPath
        ? [inPath as string]
        : [];
      const pathString = path.join(".");
      const $existing = got.get(pathString);
      if ($existing) {
        return $existing;
      }
      if (path.length === 0) {
        const values = Object.create(null);
        for (const argName of Object.keys(args)) {
          values[argName] = fieldArgs.get([argName]);
        }
        return object(values);
      } else {
        const [argName, ...rest] = path;
        if (typeof argName !== "string") {
          throw new Error(
            `Invalid path; argument '${argName}' is an invalid argument name`,
          );
        }
        let entity: GraphQLArgument | GraphQLInputField | null = args[argName];
        if (!entity) {
          throw new Error(`Invalid path; argument '${argName}' does not exist`);
        }
        let entityType: GraphQLInputType = entity.type;
        let $val = $all.get(argName);
        for (const pathSegment of rest) {
          const nullableType: graphql.GraphQLNullableType & GraphQLInputType =
            getNullableType(entityType);
          if (
            typeof pathSegment === "string" &&
            isInputObjectType(nullableType)
          ) {
            entity = nullableType.getFields()[pathSegment];
            entityType = entity.type;
            if ("get" in $val) {
              $val = $val.get(pathSegment);
            } else if ($val instanceof ConstantStep && $val.isUndefined()) {
              $val = constant(undefined);
            } else {
              throw new Error(
                `GrafastInternalError<b9e9a57a-bbdd-486c-bdcf-25cf99bf0243>: Processing input object type, but '${$val}' has no .get() method.`,
              );
            }
          } else if (
            typeof pathSegment === "number" &&
            isListType(nullableType)
          ) {
            entity = null;
            entityType = nullableType.ofType;
            if ("at" in $val) {
              $val = $val.at(pathSegment);
            } else {
              throw new Error(
                `GrafastInternalError<0abe76fa-c87a-4477-aebd-feffef848c2b>: Processing input object type, but '${$val}' has no .get() method.`,
              );
            }
          } else {
            throw new Error(
              `Asked to navigate ('get' mode) to position '${pathSegment}' (${typeof pathSegment}) (in path '${path.join(
                ".",
              )}') for incompatible type '${nullableType}' (${
                nullableType.constructor.name
              })`,
            );
          }
        }
        let result;
        const childFieldArgs = getFieldArgsForPath(
          path,
          entityType,
          $val,
          "input",
        );
        if (rest.length === 0) {
          // Argument
          const arg = entity as GraphQLArgument;
          const argInputPlan = arg.extensions.grafast?.inputPlan;
          const fnDescription = `???.${field.name}(${arg.name}:).inputPlan`;
          assertNotAsync(argInputPlan, fnDescription);
          result = argInputPlan
            ? assertNotPromise(
                argInputPlan($parent, childFieldArgs, {
                  schema,
                  entity: arg,
                }),
                argInputPlan,
                fnDescription,
              )
            : childFieldArgs.get();
        } else {
          // Input field
          const inputField = entity as GraphQLInputField | undefined;
          const inputFieldInputPlan = inputField?.extensions.grafast?.inputPlan;
          const fnDescription = `???.${inputField?.name}.inputPlan`;
          assertNotAsync(inputFieldInputPlan, fnDescription);
          result = inputFieldInputPlan
            ? assertNotPromise(
                inputFieldInputPlan(childFieldArgs, {
                  schema,
                  entity: inputField,
                }),
                inputFieldInputPlan,
                fnDescription,
              )
            : childFieldArgs.get();
        }
        const nullableType = getNullableType(entityType);
        if (isInputObjectType(nullableType)) {
          processAfter(
            fieldArgs,
            path,
            result,
            nullableType.getFields(),
            "autoApplyAfterParentInputPlan",
          );
        }
        return result;
      }
    },
    apply(targetStepOrCallback, inPath) {
      assertNotRuntime(operationPlan, `fieldArgs.apply()`);
      const path = Array.isArray(inPath) ? inPath : inPath ? [inPath] : [];
      const pathString = path.join(".");
      const $existing = applied.get(pathString);
      if ($existing) {
        throw new Error(
          `Attempted to apply 'applyPlan' at input path ${pathString} more than once - first time to ${$existing}, second time to ${targetStepOrCallback}. Multiple applications are not currently supported.`,
        );
      }
      if (path.length === 0) {
        explicitlyApplied = true;
        // Auto-apply all the arguments
        for (const argName of Object.keys(args)) {
          const $target =
            typeof targetStepOrCallback === "function"
              ? targetStepOrCallback()
              : targetStepOrCallback;
          fieldArgs.apply($target, [argName]);
        }
      } else {
        const [argName, ...rest] = path;
        let entity: GraphQLArgument | GraphQLInputField | null = args[argName];
        if (!entity) {
          throw new Error(`Invalid path; argument '${argName}' does not exist`);
        }
        let entityType: GraphQLInputType = entity.type;
        let $val = $all.get(argName);
        for (const pathSegment of rest) {
          const nullableType: graphql.GraphQLNullableType & GraphQLInputType =
            getNullableType(entityType);
          if (isInputObjectType(nullableType)) {
            entity = nullableType.getFields()[pathSegment];
            entityType = entity.type;
            if ("get" in $val) {
              $val = $val.get(pathSegment);
            } else {
              throw new Error(
                `GrafastInternalError<91e1e80d-cf24-4828-a749-3f24156c7b9c>: Processing input object type, but '${$val}' has no .get() method.`,
              );
            }
          } else if (
            typeof pathSegment === "number" &&
            isListType(nullableType)
          ) {
            entity = null;
            entityType = nullableType.ofType;
            if ("at" in $val) {
              $val = $val.at(pathSegment);
            } else {
              throw new Error(
                `GrafastInternalError<a097a130-f68f-4a5c-bd0c-24fcd26127a9>: Processing list type, but '${$val}' has no .at() method.`,
              );
            }
          } else {
            throw new Error(
              `Asked to navigate ('apply' mode) to position '${pathSegment}' (${typeof pathSegment}) (in path '${path.join(
                ".",
              )}') for incompatible type '${nullableType}' (${
                nullableType.constructor.name
              })`,
            );
          }
        }
        if (notUndefined($val)) {
          const childFieldArgs = getFieldArgsForPath(
            path,
            entityType,
            $val,
            "apply",
          );
          operationPlan.withModifiers(() => {
            let result;
            const $target =
              typeof targetStepOrCallback === "function"
                ? targetStepOrCallback()
                : targetStepOrCallback;
            if (rest.length === 0) {
              // Argument
              const arg = entity as GraphQLArgument;
              const argApplyPlan = arg.extensions.grafast?.applyPlan;
              const fnDescription = `???.${field.name}(${arg.name}:).applyPlan`;
              assertNotAsync(argApplyPlan, fnDescription);
              result = argApplyPlan
                ? assertNotPromise(
                    argApplyPlan($parent, $target, childFieldArgs, {
                      schema,
                      entity: arg,
                    }),
                    argApplyPlan,
                    fnDescription,
                  )
                : undefined;
            } else if (entity) {
              // input field
              const inputField = entity as GraphQLInputField;
              const inputFieldApplyPlan =
                inputField.extensions.grafast?.applyPlan;
              const fnDescription = `???.${inputField.name}.applyPlan`;
              assertNotAsync(inputFieldApplyPlan, fnDescription);
              result = inputFieldApplyPlan
                ? assertNotPromise(
                    inputFieldApplyPlan($target, childFieldArgs, {
                      schema,
                      entity: inputField,
                    }),
                    inputFieldApplyPlan,
                    fnDescription,
                  )
                : undefined;
            } else {
              childFieldArgs.apply($target);
              // Shortcut 'processAfter'
              return;
            }
            const nullableType = getNullableType(entityType);
            if (isInputObjectType(nullableType)) {
              processAfter(
                fieldArgs,
                path,
                result,
                nullableType.getFields(),
                "autoApplyAfterParentApplyPlan",
              );
            }
          });
        }
      }
    },
  };
  for (const argName of Object.keys(args)) {
    let val: ExecutableStep;
    Object.defineProperty(fieldArgs, `$${argName}`, {
      get() {
        if (!val) {
          val = fieldArgs.getRaw(argName);
        }
        return val;
      },
    });
  }

  function getFieldArgsForPath(
    path: ReadonlyArray<string | number>,
    entityType: GraphQLInputType,
    $input: InputStep,
    mode: "input" | "apply",
  ): FieldArgs {
    const nullableEntityType = getNullableType(entityType);
    const localFieldArgs: FieldArgs = {
      getRaw(subpath) {
        assertNotRuntime(operationPlan, `fieldArgs.getRaw()`);
        return fieldArgs.getRaw(concatPath(path, subpath));
      },
      get(subpath) {
        assertNotRuntime(operationPlan, `fieldArgs.get()`);
        if (!subpath || (Array.isArray(subpath) && subpath.length === 0)) {
          if (isListType(nullableEntityType)) {
            if (!("evalLength" in $input)) {
              throw new Error(
                `GrafastInternalError<6ef74af7-7be0-4117-870f-2ebabcf5161c>: Expected ${$input} to be a __InputListStep or __TrackedValueStep (i.e. to have 'evalLength')`,
              );
            }
            const l = $input.evalLength();
            if (l == null) {
              return constant(null);
            }
            const entries: ExecutableStep[] = [];
            for (let i = 0; i < l; i++) {
              const entry = fieldArgs.get([...path, i]);
              entries.push(entry);
            }
            return list(entries);
          } else if (isInputObjectType(nullableEntityType)) {
            const typeResolver =
              nullableEntityType.extensions.grafast?.inputPlan ||
              defaultInputObjectTypeInputPlanResolver;
            const fnDescription = `${nullableEntityType}.inputPlan`;
            assertNotAsync(typeResolver, fnDescription);
            const resolvedResult = assertNotPromise(
              typeResolver(
                getFieldArgsForPath(path, nullableEntityType, $input, "input"),
                {
                  schema,
                  type: nullableEntityType,
                },
              ),
              typeResolver,
              fnDescription,
            );
            if (mode === "apply") {
              // NOTE: if mode === 'input' then `.get()` won't need a
              // `processAfter` since that will already have been handled in
              // the parent fieldArgs.
              processAfter(
                fieldArgs,
                path,
                resolvedResult,
                nullableEntityType.getFields(),
                "autoApplyAfterParentInputPlan",
              );
            }
            return resolvedResult;
          } else if (isScalarType(nullableEntityType)) {
            const scalarResolver =
              nullableEntityType.extensions.grafast?.inputPlan;
            const fnDescription = `${nullableEntityType}.inputPlan`;
            assertNotAsync(scalarResolver, fnDescription);
            if (scalarResolver !== undefined) {
              return assertNotPromise(
                scalarResolver($input, {
                  schema,
                  type: nullableEntityType,
                }),
                scalarResolver,
                fnDescription,
              );
            } else {
              return $input;
            }
          } else if (isEnumType(nullableEntityType)) {
            /*
            const enumResolver = nullableEntityType.extensions.grafast?.inputPlan;
            if (enumResolver) {
              return enumResolver($input, { schema, type: nullableEntityType });
            } else {
              return $input;
            }
            */
            return $input;
          } else {
            throw new Error(
              `Call to fieldArgs.get() at input path '${path.join(
                ".",
              )}' must pass a non-empty subpath`,
            );
          }
        }
        return fieldArgs.get(concatPath(path, subpath));
      },
      apply(targetStepOrCallback, subpath) {
        assertNotRuntime(operationPlan, `fieldArgs.apply()`);
        if (
          mode === "apply" &&
          (!subpath || (Array.isArray(subpath) && subpath.length === 0))
        ) {
          if (isInputObjectType(nullableEntityType)) {
            if (!("evalKeys" in $input)) {
              throw new Error(
                `GrafastInternalError<d782160e-7a99-4a12-b690-435c1ab7b676>: Expected ${$input} to be a __InputObjectStep or __TrackedValueStep (i.e. to have 'evalKeys')`,
              );
            }
            const keys = $input.evalKeys();
            if (keys == null) {
              return;
            }
            for (const fieldName of keys) {
              const $target =
                typeof targetStepOrCallback === "function"
                  ? targetStepOrCallback()
                  : targetStepOrCallback;
              fieldArgs.apply($target, [...path, fieldName]);
            }
          } else if (isListType(nullableEntityType)) {
            if (!("evalLength" in $input)) {
              throw new Error(
                `GrafastInternalError<6ef74af7-7be0-4117-870f-2ebabcf5161c>: Expected ${$input} to be a __InputListStep or __TrackedValueStep (i.e. to have 'evalLength')`,
              );
            }
            const l = $input.evalLength();
            if (l == null) {
              return;
            }
            // const innerType = nullableEntityType.ofType;
            for (let i = 0; i < l; i++) {
              const $target =
                typeof targetStepOrCallback === "function"
                  ? targetStepOrCallback()
                  : targetStepOrCallback;
              fieldArgs.apply($target, [...path, i]);
            }
          } else if (isScalarType(nullableEntityType)) {
            // noop
          } else if (isEnumType(nullableEntityType)) {
            // PERF: only do this if this enum type has values that have side effects
            const value = $input.eval();
            const enumValue = nullableEntityType
              .getValues()
              .find((v) => v.value === value);
            if (enumValue) {
              const enumResolver = enumValue.extensions.grafast?.applyPlan;
              const fnDescription = `${nullableEntityType.name}.${enumValue.name}.applyPlan`;
              assertNotAsync(enumResolver, fnDescription);
              if (enumResolver !== undefined) {
                const $target =
                  typeof targetStepOrCallback === "function"
                    ? targetStepOrCallback()
                    : targetStepOrCallback;
                assertNotPromise(
                  enumResolver($target),
                  enumResolver,
                  fnDescription,
                );
              }
            }
          } else {
            const never: never = nullableEntityType;
            throw new Error(`Unhandled input type ${never}`);
          }
        } else {
          const $target =
            typeof targetStepOrCallback === "function"
              ? targetStepOrCallback()
              : targetStepOrCallback;
          fieldArgs.apply($target, concatPath(path, subpath));
        }
      },
    };

    if (isInputObjectType(nullableEntityType)) {
      const inputFields = nullableEntityType.getFields();
      for (const fieldName of Object.keys(inputFields)) {
        let val: ExecutableStep;
        Object.defineProperty(localFieldArgs, `$${fieldName}`, {
          enumerable: true,
          get() {
            if (!val) {
              if ("get" in $input) {
                val = $input.get(fieldName);
              } else if (
                $input instanceof ConstantStep &&
                $input.isUndefined()
              ) {
                val = constant(undefined);
              } else {
                throw new Error(
                  `GrafastInternalError<9b70d5c0-c45f-4acd-8b94-eaa02f87ad41>: expected '${$input}' to have a .get() method`,
                );
              }
            }
            return val;
          },
        });
      }
    }

    return localFieldArgs;
  }

  const result = callback(fieldArgs);
  assertNotPromise(result, callback, operationPlan.loc?.join(">") ?? "???");

  if (!explicitlyApplied) {
    processAfter(fieldArgs, [], result, args, applyAfterMode);
  }

  if (operationPlan.loc !== null) operationPlan.loc.pop();

  return (result ?? null) as Exclude<T, null | undefined> | null;
}

function processAfter(
  rootFieldArgs: FieldArgs,
  path: ReadonlyArray<string | number>,
  result: ExecutableStep | ModifierStep | null | undefined | void,
  fields: Record<string, GraphQLArgument | GraphQLInputField>,
  applyAfterMode: ApplyAfterMode,
) {
  if (result != null && !(result instanceof ConstantStep && result.isNull())) {
    if (applyAfterMode === "autoApplyAfterParentApplyPlan" && result != null) {
      // `applyPlan` returned a step, so auto-apply every subfield to it
      for (const name of Object.keys(fields)) {
        rootFieldArgs.apply(result, [...path, name]);
      }
    } else {
      for (const [name, spec] of Object.entries(fields)) {
        const autoApply =
          applyAfterMode === "autoApplyAfterParentPlan"
            ? (spec as GraphQLArgument).extensions.grafast
                ?.autoApplyAfterParentPlan
            : applyAfterMode === "autoApplyAfterParentSubscribePlan"
            ? (spec as GraphQLArgument).extensions.grafast
                ?.autoApplyAfterParentSubscribePlan
            : applyAfterMode === "autoApplyAfterParentInputPlan"
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

function concatPath(
  path: ReadonlyArray<string | number>,
  subpath: ReadonlyArray<string | number> | string | undefined,
) {
  const localPath = Array.isArray(subpath) ? subpath : subpath ? [subpath] : [];
  return [...path, ...localPath];
}

function notUndefined($value: InputStep) {
  // OPTIMIZE: having a lot of 'is undefined' checks is expensive; instead we
  // should optimize this so that it tracks the set of keys that are set and
  // matches against those as a single operation.
  return !("evalIs" in $value && $value.evalIs(undefined));
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
