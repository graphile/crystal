import type {
  GraphQLArgument,
  GraphQLField,
  GraphQLInputType,
  GraphQLNullableType,
} from "graphql";
import * as graphql from "graphql";

import type { OperationPlan } from "./engine/OperationPlan.js";
import {
  __InputObjectStep,
  __TrackedValueStep,
  applyInput,
  bakedInput,
} from "./index.js";
import type { FieldArgs, TrackedArguments } from "./interfaces.js";
import type { ExecutableStep } from "./step.js";
import type { __ItemStep } from "./steps/__item.js";
import { isApplyableStep } from "./steps/applyInput.js";
import { object } from "./steps/object.js";
import { assertNotPromise } from "./utils.js";

const { getNullableType, isInputObjectType, isListType } = graphql;

export type ApplyAfterModeArg =
  | "autoApplyAfterParentPlan"
  | "autoApplyAfterParentSubscribePlan";

function assertNotRuntime(operationPlan: OperationPlan, description: string) {
  if (operationPlan.phase === "ready") {
    throw new Error(
      `${description} may only be called at planning time; however you have code that has attempted to call it during execution time. Please revisit your plan resolvers to locate the issue.`,
    );
  }
}

export function withFieldArgsForArguments<T extends ExecutableStep>(
  operationPlan: OperationPlan,
  $all: TrackedArguments,
  field: GraphQLField<any, any, any>,
  applyAfterMode: ApplyAfterModeArg,
  callback: (fieldArgs: FieldArgs) => T | null | undefined,
): Exclude<T, undefined | null> | null {
  if (operationPlan.loc !== null)
    operationPlan.loc.push(`withFieldArgsForArguments(${field.name})`);

  const args: {
    [key: string]: GraphQLArgument;
  } = Object.create(null);
  for (const arg of field.args) {
    args[arg.name] = arg;
  }

  // TODO: replace `got` with `cacheStep()`?
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
        // Turn all of the args into a single object
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
        const arg = args[argName];
        if (!arg) {
          throw new Error(`Invalid path; argument '${argName}' does not exist`);
        }
        const typeAtPath = getNullableInputTypeAtPath(arg.type, rest);
        const $valueAtPath = fieldArgs.getRaw(inPath);
        return bakedInput(typeAtPath, $valueAtPath);
      }
    },
    apply($target, inPath) {
      assertNotRuntime(operationPlan, `fieldArgs.apply()`);
      const path = Array.isArray(inPath) ? inPath : inPath ? [inPath] : [];
      const pathString = path.join(".");
      const $existing = applied.get(pathString);
      if ($existing) {
        throw new Error(
          `Attempted to apply 'applyPlan' at input path ${pathString} more than once - first time to ${$existing}, second time to ${$target}. Multiple applications are not currently supported.`,
        );
      }
      if (path.length === 0) {
        explicitlyApplied = true;
        // Auto-apply all the arguments
        for (const argName of Object.keys(args)) {
          fieldArgs.apply($target, [argName]);
        }
      } else {
        const [argName, ...rest] = path;
        if (typeof argName !== "string") {
          throw new Error(
            `Invalid path; argument '${argName}' is an invalid argument name`,
          );
        }
        const arg = args[argName];
        if (!arg) {
          throw new Error(`Invalid path; argument '${argName}' does not exist`);
        }
        const typeAtPath = getNullableInputTypeAtPath(arg.type, rest);
        const $valueAtPath = fieldArgs.getRaw(inPath);
        $target.apply(applyInput(typeAtPath, $valueAtPath));
      }
    },
  };
  for (const argName of Object.keys(args)) {
    let val: ExecutableStep;
    Object.defineProperty(fieldArgs, `$${argName}`, {
      get() {
        return (val ??= fieldArgs.getRaw(argName));
      },
    });
  }

  const result = callback(fieldArgs);
  assertNotPromise(result, callback, operationPlan.loc?.join(">") ?? "???");

  if (!explicitlyApplied && result != null) {
    processAfter(fieldArgs, result, args, applyAfterMode);
  }

  if (operationPlan.loc !== null) operationPlan.loc.pop();

  return (result ?? null) as Exclude<T, null | undefined> | null;
}

function processAfter(
  rootFieldArgs: FieldArgs,
  $result: ExecutableStep,
  args: Record<string, GraphQLArgument>,
  applyAfterMode: ApplyAfterModeArg,
) {
  if (!isApplyableStep($result)) return;
  for (const [argName, arg] of Object.entries(args)) {
    const autoApply =
      applyAfterMode === "autoApplyAfterParentPlan"
        ? arg.extensions.grafast?.autoApplyAfterParentPlan
        : applyAfterMode === "autoApplyAfterParentSubscribePlan"
        ? arg.extensions.grafast?.autoApplyAfterParentSubscribePlan
        : null;
    if (autoApply) {
      rootFieldArgs.apply($result, [argName]);
    }
  }
}

function getNullableInputTypeAtPath(
  startType: GraphQLInputType,
  path: ReadonlyArray<string | number>,
): GraphQLInputType & GraphQLNullableType {
  let type: GraphQLInputType & GraphQLNullableType = getNullableType(startType);
  for (let i = 0, l = path.length; i < l; i++) {
    const segment = path[i];
    if (typeof segment === "number") {
      // Expect list
      if (!isListType(type)) {
        throw new Error(
          `Invalid path passed to fieldArgs.get(); expected list type, but found ${type}`,
        );
      }
      type = getNullableType(type.ofType);
    } else {
      // Must be a string
      if (!isInputObjectType(type)) {
        throw new Error(
          `Invalid path passed to fieldArgs.get(); expected object type, but found ${type}`,
        );
      }
      const field = type.getFields()[segment];
      if (!field) {
        throw new Error(
          `Invalid path passed to fieldArgs.get(); ${type} has no field named ${segment}`,
        );
      }
      type = getNullableType(field.type) as GraphQLInputType &
        GraphQLNullableType;
    }
  }
  return type;
}
