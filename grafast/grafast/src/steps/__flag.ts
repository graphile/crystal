import type { GrafastError } from "../error.js";
import { isGrafastError, newGrafastError, SafeError } from "../error.js";
import { inspect } from "../inspect.js";
import type {
  AddDependencyOptions,
  ExecutionEntryFlags,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import {
  $$deepDepSkip,
  $$inhibit,
  ALL_FLAGS,
  DEFAULT_ACCEPT_FLAGS,
  FLAG_ERROR,
  FLAG_INHIBITED,
  FLAG_NULL,
  NO_FLAGS,
  TRAPPABLE_FLAGS,
} from "../interfaces.js";
import { ExecutableStep, UnbatchedExecutableStep } from "../step.js";

// PUBLIC FLAGS
export const TRAP_ERROR = FLAG_ERROR as ExecutionEntryFlags;
export const TRAP_INHIBITED = FLAG_INHIBITED as ExecutionEntryFlags;
export const TRAP_ERROR_OR_INHIBITED = (FLAG_ERROR |
  FLAG_INHIBITED) as ExecutionEntryFlags;

function digestFlags(flags: ExecutionEntryFlags) {
  const parts: string[] = [];
  if ((flags & FLAG_NULL) === 0) {
    parts.push("REJECT_NULL");
  }
  if ((flags & FLAG_ERROR) !== 0) {
    parts.push("ERROR_OK");
  }
  if ((flags & FLAG_INHIBITED) !== 0) {
    parts.push("INHIBITED_OK");
  }
  return parts.join(" ");
}

export interface FlagStepOptions {
  acceptFlags?: ExecutionEntryFlags;
  onReject?: GrafastError | null;
  if?: ExecutableStep<boolean>;
}

export class __FlagStep<TData> extends UnbatchedExecutableStep<TData> {
  isSyncAndSafe = false;
  private ifDep: number | null = null;
  private acceptFlags: ExecutionEntryFlags;
  private onRejectReturnValue: GrafastError | typeof $$inhibit;
  constructor(step: ExecutableStep, options: FlagStepOptions) {
    super();
    const { acceptFlags = DEFAULT_ACCEPT_FLAGS, onReject, if: $cond } = options;
    this.acceptFlags = acceptFlags;
    this.onRejectReturnValue = onReject == null ? $$inhibit : onReject;
    if ($cond) {
      this.addDependency(step);
      this.ifDep = this.addDependency($cond);
    } else {
      this.addDependency({ step, acceptFlags, onReject });
    }
  }
  public toStringMeta(): string | null {
    const step = this.dependencies[0];
    const forbiddenFlags = this.dependencyForbiddenFlags[0];
    const onReject = this.dependencyOnReject[0];
    const acceptFlags = ALL_FLAGS & ~forbiddenFlags;
    return `${step.id} ${digestFlags(acceptFlags)} ${inspect(onReject)}`;
  }
  getParentStep(): ExecutableStep {
    return this.getDepOptions(0).step;
  }
  [$$deepDepSkip](): ExecutableStep {
    return this.getDepOptions(0).step;
  }
  /** Return inlining instructions if we can be inlined. @internal */
  inline(
    options: Omit<AddDependencyOptions, "step">,
  ): AddDependencyOptions | null {
    if (this.ifDep !== null) {
      return null;
    }
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
  unbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    _value: TData,
    _cond?: boolean,
  ): TData {
    throw new Error(`${this} not finalized?`);
  }
  finalize() {
    if (this.ifDep !== null) {
      this.unbatchedExecute = this.conditionalUnbatchedExecute;
    } else {
      this.unbatchedExecute = this.unconditionalUnbatchedExecute;
    }
    super.finalize();
  }
  private conditionalUnbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    value: any,
    cond?: boolean,
  ): any {
    if (cond) {
      // Perform checks
      const { acceptFlags, onRejectReturnValue } = this;
      if ((acceptFlags & FLAG_NULL) === NO_FLAGS && value == null) {
        return onRejectReturnValue;
      }
      if (
        (acceptFlags & FLAG_ERROR) === NO_FLAGS &&
        (isGrafastError(value) || value instanceof Error)
      ) {
        return onRejectReturnValue;
      }
      // TODO: detect inhibited. Not currently possible?
      return value;
    } else {
      // Conditional failed, do not apply any checks
      return value;
    }
  }

  // Checks already performed via addDependency
  private unconditionalUnbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    value: any,
  ): any {
    return value;
  }
}

/**
 * Example use case: get user by id, but id is null: no need to fetch the user
 * since we know they won't exist.
 */
export function inhibitOnNull($step: ExecutableStep) {
  return new __FlagStep($step, {
    acceptFlags: DEFAULT_ACCEPT_FLAGS & ~FLAG_NULL,
  });
}

/**
 * Example use case: expecting a node ID that represents a User, but get one
 * that represents a Post instead: throw error to tell user they've sent invalid
 * data.
 */
export function assertNotNull(
  $step: ExecutableStep,
  message: string,
  options?: { if?: FlagStepOptions["if"] },
) {
  return new __FlagStep($step, {
    ...options,
    acceptFlags: DEFAULT_ACCEPT_FLAGS & ~FLAG_NULL,
    onReject: newGrafastError(new SafeError(message), $step.id),
  });
}

export function trap($step: ExecutableStep, acceptFlags: ExecutionEntryFlags) {
  return new __FlagStep($step, {
    acceptFlags: (acceptFlags & TRAPPABLE_FLAGS) | FLAG_NULL,
  });
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
    return new __FlagStep(step, { acceptFlags, onReject });
  }
};
