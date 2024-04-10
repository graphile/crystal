import type { GrafastError } from "../error.js";
import { newGrafastError } from "../error.js";
import type {
  AddDependencyOptions,
  ExecutionDetails,
  ExecutionEntryFlags,
  GrafastResultsList,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import {
  $$deepDepSkip,
  ALL_FLAGS,
  DEFAULT_ACCEPT_FLAGS,
  FLAG_NULL,
  TRAPPABLE_FLAGS,
} from "../interfaces.js";
import { ExecutableStep, UnbatchedExecutableStep } from "../step.js";
import { arrayOfLength } from "../utils.js";

export class __FlagStep<TData> extends UnbatchedExecutableStep<TData> {
  isSyncAndSafe = false;
  constructor(
    step: ExecutableStep,
    acceptFlags: ExecutionEntryFlags,
    onReject?: GrafastError | null,
  ) {
    super();
    this.addDependency({ step, acceptFlags, onReject });
  }
  getParentStep(): ExecutableStep {
    return this.getDep(0);
  }
  [$$deepDepSkip](): ExecutableStep {
    return this.getDep(0);
  }
  /** Return inlining instructions if we can be inlined. @internal */
  inline(
    options: Omit<AddDependencyOptions, "step">,
  ): AddDependencyOptions | null {
    const step = this.dependencies[0];
    const forbiddenFlags = this.dependencyForbiddenFlags[0];
    const onReject = this.dependencyOnReject[0];
    const acceptFlags = ALL_FLAGS & ~forbiddenFlags;
    if (
      (options.onReject === undefined || options.onReject === onReject) &&
      (options.acceptFlags === undefined ||
        options.acceptFlags === DEFAULT_ACCEPT_FLAGS ||
        options.acceptFlags === acceptFlags)
    ) {
      return { step, acceptFlags, onReject };
    }
    return null;
  }
  execute({
    values: [input],
    count,
  }: ExecutionDetails<[TData]>): GrafastResultsList<TData> {
    if (input.isBatch) {
      return input.entries;
    } else {
      return arrayOfLength(count, input.value);
    }
  }
  unbatchedExecute(_extra: UnbatchedExecutionExtra, value: TData): TData {
    return value;
  }
}

/**
 * Example use case: get user by id, but id is null: no need to fetch the user
 * since we know they won't exist.
 */
export function inhibitOnNull($step: ExecutableStep) {
  return new __FlagStep($step, DEFAULT_ACCEPT_FLAGS & ~FLAG_NULL);
}

/**
 * Example use case: expecting a node ID that represents a User, but get one
 * that represents a Post instead: throw error to tell user they've sent invalid
 * data.
 */
export function assertNotNull($step: ExecutableStep, message: string) {
  return new __FlagStep(
    $step,
    DEFAULT_ACCEPT_FLAGS & ~FLAG_NULL,
    newGrafastError(new Error(message), $step.id),
  );
}

export function trap($step: ExecutableStep, acceptFlags: ExecutionEntryFlags) {
  return new __FlagStep($step, acceptFlags & TRAPPABLE_FLAGS);
}

// Have to overwrite the getDep method due to circular dependency
(ExecutableStep.prototype as any).getDep = function (
  this: ExecutableStep,
  depId: number,
) {
  const { step, acceptFlags, onReject } = this.getDepOptions(depId);
  if (acceptFlags === DEFAULT_ACCEPT_FLAGS && onReject == null) {
    return step;
  } else {
    // Return a __FlagStep around options.step so that all the options are preserved.
    return new __FlagStep(step, acceptFlags ?? DEFAULT_ACCEPT_FLAGS, onReject);
  }
};
