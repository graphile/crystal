import type { GrafastError } from "../error.js";
import { newGrafastError, SafeError } from "../error.js";
import { inspect } from "../inspect.js";
import type {
  AddDependencyOptions,
  ExecutionDetails,
  ExecutionEntryFlags,
  GrafastResultsList,
} from "../interfaces.js";
import {
  $$deepDepSkip,
  $$inhibit,
  ALL_FLAGS,
  DEFAULT_ACCEPT_FLAGS,
  DEFAULT_FORBIDDEN_FLAGS,
  FLAG_ERROR,
  FLAG_INHIBITED,
  FLAG_NULL,
  NO_FLAGS,
  TRAPPABLE_FLAGS,
} from "../interfaces.js";
import { ExecutableStep } from "../step.js";

// PUBLIC FLAGS
export const TRAP_ERROR = FLAG_ERROR as ExecutionEntryFlags;
export const TRAP_INHIBITED = FLAG_INHIBITED as ExecutionEntryFlags;
export const TRAP_ERROR_OR_INHIBITED = (FLAG_ERROR |
  FLAG_INHIBITED) as ExecutionEntryFlags;

function digestAcceptFlags(acceptFlags: ExecutionEntryFlags) {
  const parts: string[] = [];
  if ((acceptFlags & FLAG_NULL) === 0) {
    parts.push("rejectNull");
  }
  if ((acceptFlags & FLAG_ERROR) !== 0) {
    parts.push("trapError");
  }
  if ((acceptFlags & FLAG_INHIBITED) !== 0) {
    parts.push("trapInhibited");
  }
  return parts.join("&");
}

export interface FlagStepOptions {
  acceptFlags?: ExecutionEntryFlags;
  onReject?: GrafastError | null;
  if?: ExecutableStep<boolean>;
}

function trim(string: string, length = 15): string {
  if (string.length > length) {
    return string.substring(0, length - 2) + "…";
  } else {
    return string;
  }
}

export class __FlagStep<TData> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__FlagStep",
  };

  isSyncAndSafe = false;
  private ifDep: number | null = null;
  private forbiddenFlags: ExecutionEntryFlags;
  private onRejectReturnValue: GrafastError | typeof $$inhibit;
  constructor(step: ExecutableStep, options: FlagStepOptions) {
    super();
    const { acceptFlags = DEFAULT_ACCEPT_FLAGS, onReject, if: $cond } = options;
    this.forbiddenFlags = ALL_FLAGS & ~acceptFlags;
    this.onRejectReturnValue = onReject == null ? $$inhibit : onReject;
    if ($cond) {
      this.addDependency({ step, acceptFlags: TRAPPABLE_FLAGS });
      this.ifDep = this.addDependency($cond);
    } else {
      this.addDependency({ step, acceptFlags, onReject });
    }
  }
  public toStringMeta(): string | null {
    const acceptFlags = ALL_FLAGS & ~this.forbiddenFlags;
    const rej =
      this.onRejectReturnValue === $$inhibit
        ? `INHIBIT`
        : this.onRejectReturnValue
        ? trim(String(this.onRejectReturnValue))
        : inspect(this.onRejectReturnValue);
    const $if =
      this.ifDep !== null ? this.getDepOptions(this.ifDep).step : null;
    return `${$if ? `if(${$if.id}): ` : ``}${digestAcceptFlags(
      acceptFlags,
    )}, onReject: ${rej}`;
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
      // TODO: this logic could be improved so that more flag checks were
      // inlined, e.g. `trap(inhibitOnNull($foo), TRAP_INHIBIT)` should just
      // become `$foo`.
      //
      // However, we must be careful that we don't optimize away flags, e.g.
      // `trap(inhibitOnNull($foo), TRAP_INHIBIT, { if: $cond })` needs to see
      // the inhibit flag to know what to do, so in this case we shouldn't be
      // inlined. This may only apply to __FlagStep and might be something we
      // want to optimize later.
      options.onReject === undefined ||
      options.onReject === onReject
    ) {
      if (
        options.acceptFlags === undefined ||
        options.acceptFlags === DEFAULT_ACCEPT_FLAGS ||
        options.acceptFlags === acceptFlags ||
        false
      ) {
        return { step, acceptFlags, onReject };
      }
    }
    return null;
  }
  execute(
    _details: ExecutionDetails<[data: TData, cond?: boolean]>,
  ): GrafastResultsList<TData> {
    throw new Error(`${this} not finalized?`);
  }
  finalize() {
    if (this.ifDep !== null) {
      this.execute = this.conditionalExecute;
    } else {
      this.execute = this.unconditionalExecute;
    }
    super.finalize();
  }
  private conditionalExecute(
    details: ExecutionDetails<[data: TData, cond?: boolean]>,
  ): any {
    const dataEv = details.values[0]!;
    const condEv = details.values[this.ifDep as 1]!;
    const { forbiddenFlags: thisForbiddenFlags, onRejectReturnValue } = this;
    return details.indexMap((i) => {
      const cond = condEv.at(i);
      const forbiddenFlags = cond
        ? thisForbiddenFlags
        : DEFAULT_FORBIDDEN_FLAGS;
      const flags = dataEv._flagsAt(i);
      if ((forbiddenFlags & flags) === NO_FLAGS) {
        return dataEv.at(i);
      } else {
        return onRejectReturnValue;
      }
    });
  }

  // Checks already performed via addDependency, just pass everything through.
  private unconditionalExecute(
    details: ExecutionDetails<[data: TData, cond?: boolean]>,
  ): any {
    const ev = details.values[0];
    if (ev.isBatch) {
      return ev.entries;
    } else {
      const val = ev.value;
      return details.indexMap(() => val);
    }
  }
}

/**
 * Example use case: get user by id, but id is null: no need to fetch the user
 * since we know they won't exist.
 */
export function inhibitOnNull<T>($step: ExecutableStep<T>) {
  return new __FlagStep<T>($step, {
    acceptFlags: DEFAULT_ACCEPT_FLAGS & ~FLAG_NULL,
  });
}

/**
 * Example use case: expecting a node ID that represents a User, but get one
 * that represents a Post instead: throw error to tell user they've sent invalid
 * data.
 */
export function assertNotNull<T>(
  $step: ExecutableStep<T>,
  message: string,
  options?: { if?: FlagStepOptions["if"] },
) {
  return new __FlagStep<T>($step, {
    ...options,
    acceptFlags: DEFAULT_ACCEPT_FLAGS & ~FLAG_NULL,
    onReject: newGrafastError(new SafeError(message), $step.id),
  });
}

export function trap<T>(
  $step: ExecutableStep<T>,
  acceptFlags: ExecutionEntryFlags,
) {
  return new __FlagStep<T>($step, {
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
