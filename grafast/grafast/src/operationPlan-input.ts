import type { GraphQLArgument, GraphQLField } from "graphql";

import type { OperationPlan } from "./engine/OperationPlan.js";
import { __InputObjectStep, __TrackedValueStep } from "./index.js";
import type { FieldArgs, TrackedArguments } from "./interfaces.js";
import type { ExecutableStep } from "./step.js";
import type { __ItemStep } from "./steps/__item.js";
import { assertNotPromise } from "./utils.js";

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

    // TODO: remove these
    get() {
      throw new Error(
        "fieldArgs.get() is no longer supported; a vaguely similar approach would be to get the baked input value with `bakedInput()`",
      );
    },
    apply() {
      throw new Error(
        "fieldArgs.apply() is no longer supported; a vaguely similar approach would be to use `applyInput()`",
      );
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

  const result = callback(fieldArgs);
  assertNotPromise(result, callback, operationPlan.loc?.join(">") ?? "???");

  if (operationPlan.loc !== null) operationPlan.loc.pop();

  return (result ?? null) as Exclude<T, null | undefined> | null;
}
