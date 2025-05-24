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
  ConstantStep,
  object,
} from "./index.js";
import { inspect } from "./inspect.js";
import type {
  AnyInputStep,
  FieldArg,
  FieldArgs,
  TrackedArguments,
} from "./interfaces.js";
import type { Step } from "./step.js";
import type { __ItemStep } from "./steps/__item.js";
import { assertNotPromise } from "./utils.js";

const { getNullableType, isInputObjectType, isListType } = graphql;

export type ApplyAfterModeArg = "plan" | "subscribePlan";

function assertNotRuntime(operationPlan: OperationPlan, description: string) {
  if (operationPlan.phase === "ready") {
    throw new Error(
      `${description} may only be called at planning time; however you have code that has attempted to call it during execution time. Please revisit your plan resolvers to locate the issue.`,
    );
  }
}

export function withFieldArgsForArguments<T extends Step>(
  operationPlan: OperationPlan,
  trackedArguments: TrackedArguments,
  field: GraphQLField<any, any, any>,
  $parent: Step,
  applyAfterMode: ApplyAfterModeArg,
  coordinate: string,
  callback: (fieldArgs: FieldArgs) => T | null | undefined,
): T | null {
  if (operationPlan.loc !== null)
    operationPlan.loc.push(`withFieldArgsForArguments(${field.name})`);

  const args: {
    [key: string]: GraphQLArgument;
  } = Object.create(null);
  for (const arg of field.args) {
    args[arg.name] = arg;
  }

  const applied = new Map<string, Step>();
  let explicitlyApplied = false;

  const fieldArgs: FieldArgs = {
    typeAt(path) {
      if (typeof path === "string") {
        return args[path].type;
      } else {
        if (path.length === 0) {
          throw new Error(
            `typeAt can only be used with a non-empty path since arguments themselves don't belong to a type but a field.`,
          );
        }
        const argName = path[0];
        let type = args[argName]?.type;
        if (!type) {
          throw new Error(`Argument ${argName} does not exist`);
        }
        for (let i = 1, l = path.length; i < l; i++) {
          const segment = path[i];
          type = graphql.isNonNullType(type) ? type.ofType : type;
          if (typeof segment === "number") {
            if (!isListType(type)) {
              throw new Error(
                `Invalid path ${path.slice(
                  1,
                )} within argument ${argName}; expected a list at path index ${
                  i - 1
                }`,
              );
            }
            type = type.ofType;
          } else {
            if (!isInputObjectType(type)) {
              throw new Error(
                `Invalid path ${path.slice(
                  1,
                )} within argument ${argName}; expected an object at path index ${
                  i - 1
                }`,
              );
            }
            const arg = type.getFields()[segment];
            if (!arg) {
              throw new Error(
                `Invalid path ${path.slice(
                  1,
                )} within argument ${argName}; ${type} does not have a field '${segment}'`,
              );
            }
            type = arg.type;
          }
        }
        return type;
      }
    },
    getRaw(path) {
      assertNotRuntime(operationPlan, `fieldArgs.getRaw()`);
      if (path === undefined) {
        return object(trackedArguments);
      } else if (typeof path === "string") {
        return trackedArguments[path];
      } else if (Array.isArray(path)) {
        const [first, ...rest] = path;
        if (!first) {
          throw new Error(`getRaw() must be called with a non-empty path`);
        }
        let $entry = trackedArguments[first];
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
        throw new Error(
          `Invalid path passed to FieldArgs.getRaw(); please check your code. Path: ${inspect(
            path,
          )}`,
        );
      }
    },
    apply($target, inPathOrGetTargetFromParent, maybeGetTargetFromParent) {
      const inPath =
        typeof inPathOrGetTargetFromParent === "function"
          ? undefined
          : inPathOrGetTargetFromParent;
      const getTargetFromParent =
        typeof inPathOrGetTargetFromParent === "function"
          ? inPathOrGetTargetFromParent
          : maybeGetTargetFromParent;
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
        const $valueAtPath = fieldArgs.getRaw(inPath) as AnyInputStep;
        if (
          $valueAtPath instanceof ConstantStep &&
          $valueAtPath.data === undefined
        ) {
          // Skip applying!
        } else {
          $target.apply(
            applyInput(typeAtPath, $valueAtPath, getTargetFromParent),
          );
        }
      }
    },
  };
  for (const argName of Object.keys(args)) {
    let val: Step;
    Object.defineProperty(fieldArgs, `$${argName}`, {
      get() {
        return (val ??= fieldArgs.getRaw(argName));
      },
    });
  }

  const result = callback(fieldArgs);
  if (result === undefined) {
    throw new Error(
      `Field ${coordinate} returned 'undefined'; perhaps you forgot the 'return' statement?`,
    );
  }
  assertNotPromise(result, callback, operationPlan.loc?.join(">") ?? "???");

  if (!explicitlyApplied && result != null) {
    processAfter($parent, fieldArgs, result, args, applyAfterMode, coordinate);
  }

  if (operationPlan.loc !== null) operationPlan.loc.pop();

  return result;
}

function processAfter(
  $parent: Step,
  rootFieldArgs: FieldArgs,
  $result: Step,
  args: Record<string, GraphQLArgument>,
  applyAfterMode: ApplyAfterModeArg,
  coordinate: string,
) {
  const schema = $parent.operationPlan.schema;
  for (const [argName, arg] of Object.entries(args)) {
    const autoApply =
      applyAfterMode === "plan"
        ? arg.extensions.grafast?.applyPlan
        : applyAfterMode === "subscribePlan"
          ? arg.extensions.grafast?.applySubscribePlan
          : null;
    if (autoApply) {
      if (arg.defaultValue === undefined) {
        const $argVal = rootFieldArgs.getRaw(argName);
        if ($argVal instanceof ConstantStep && $argVal.data === undefined) {
          // no action necessary
          continue;
        }
      }
      // TODO: should this have dollars on it for accessing subkeys?
      const input: FieldArg = {
        typeAt(path) {
          return rootFieldArgs.typeAt(concatPath(argName, path));
        },
        getRaw(path) {
          return rootFieldArgs.getRaw(
            concatPath(argName, path),
          ) as AnyInputStep;
        },
        apply($target, pathOrTargetGetter, maybeTargetGetter) {
          if (typeof pathOrTargetGetter === "function") {
            return rootFieldArgs.apply($target, [argName], pathOrTargetGetter);
          } else {
            return rootFieldArgs.apply(
              $target,
              concatPath(argName, pathOrTargetGetter),
              maybeTargetGetter,
            );
          }
        },
      };
      const result = autoApply($parent, $result, input, {
        schema,
        arg,
        argName,
      });
      if (result !== undefined) {
        const fullCoordinate = `${coordinate}(${argName}:)`;
        throw new Error(
          `Argument ${fullCoordinate}'s applyPlan returned a value. This may indicate a bug in that method, please see https://err.red/gaap#coord=${encodeURIComponent(
            fullCoordinate,
          )}`,
        );
      }
    }
  }
}

export function getNullableInputTypeAtPath(
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

function concatPath(
  argName: string,
  subpath: ReadonlyArray<string | number> | string | undefined,
) {
  if (subpath == null) return [argName];
  const localPath = Array.isArray(subpath) ? subpath : [subpath];
  return [argName, ...localPath];
}
