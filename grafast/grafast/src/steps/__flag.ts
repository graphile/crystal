import {
  $$deepDepSkip,
  ALL_FLAGS,
  DEFAULT_ACCEPT_FLAGS,
  DEFAULT_FORBIDDEN_FLAGS,
  FLAG_ERROR,
  FLAG_INHIBITED,
  FLAG_NULL,
  NO_FLAGS,
  TRAPPABLE_FLAGS,
} from "../constants.ts";
import type { FlaggedValue } from "../error.ts";
import { $$inhibit, flagError, flaggedValue, SafeError } from "../error.ts";
import { inspect } from "../inspect.ts";
import type {
  AddDependencyOptions,
  DataFromStep,
  ExecutionDetails,
  ExecutionEntryFlags,
  ExecutionValue,
  GrafastResultsList,
  Maybe,
} from "../interfaces.ts";
import { isListCapableStep, Step } from "../step.ts";
import { sudo } from "../utils.ts";
import type { __ItemStep } from "./__item.ts";
import type { StepWithItems } from "./connection.ts";
import { itemsOrStep } from "./connection.ts";

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

const TRAP_VALUES = [
  "NULL",
  "EMPTY_LIST",
  "PASS_THROUGH",
  // "UNDEFINED", // waiting for a need
] as const;
/** @defaultValue `'PASS_THROUGH'` */
export type TrapValue = (typeof TRAP_VALUES)[number];
/** `false` means pass-through; all others are literal */
export type ResolvedTrapValue = false | null | undefined | readonly never[];
export interface FlagStepOptions {
  acceptFlags?: ExecutionEntryFlags;
  onReject?: Error | null;
  dataOnly?: boolean;
  if?: Step<boolean>;
  // Trapping an error might want to result in a null or an empty list.
  valueForInhibited?: TrapValue;
  valueForError?: TrapValue;
}

const EMPTY_LIST = Object.freeze([]);

function trim(string: string, length = 15): string {
  if (string.length > length) {
    return string.substring(0, length - 2) + "…";
  } else {
    return string;
  }
}

function resolveTrapValue(tv: TrapValue): ResolvedTrapValue {
  switch (tv) {
    case "NULL":
      return null;
    case "EMPTY_LIST":
      return EMPTY_LIST;
    case "PASS_THROUGH":
      return false;
    default: {
      const never: never = tv;
      throw new Error(
        `TrapValue '${never}' not understood; please use one of: ${TRAP_VALUES.join(
          ", ",
        )}`,
      );
    }
  }
}

export class __FlagStep<TStep extends Step>
  extends Step<DataFromStep<TStep>>
  implements StepWithItems<unknown>
{
  static $$export = {
    moduleName: "grafast",
    exportName: "__FlagStep",
  };

  isSyncAndSafe = false;
  private ifDep: number | null = null;
  private implicitErrorDep: number | null = null;
  private forbiddenFlags: ExecutionEntryFlags;
  private onRejectReturnValue: FlaggedValue<Error> | FlaggedValue<null>;
  private valueForInhibited: ResolvedTrapValue;
  private valueForError: ResolvedTrapValue;
  private canBeInlined: boolean;
  private baseOptions: Omit<FlagStepOptions, "if">;
  constructor(step: TStep, options: FlagStepOptions) {
    super();
    const {
      acceptFlags = DEFAULT_ACCEPT_FLAGS,
      onReject,
      dataOnly,
      valueForInhibited = "PASS_THROUGH",
      valueForError = "PASS_THROUGH",
      if: $cond,
    } = options;
    this.baseOptions = {
      acceptFlags,
      onReject,
      dataOnly,
      valueForInhibited,
      valueForError,
    };
    this.forbiddenFlags = ALL_FLAGS & ~acceptFlags;
    this.onRejectReturnValue =
      onReject == null ? $$inhibit : flagError(onReject, step.id);
    this.valueForInhibited = resolveTrapValue(valueForInhibited);
    this.valueForError = resolveTrapValue(valueForError);
    const trapsErrors = (acceptFlags & FLAG_ERROR) === FLAG_ERROR;
    const trapsInhibition = (acceptFlags & FLAG_INHIBITED) === FLAG_INHIBITED;
    const trapsSideEffectFlags = trapsErrors || trapsInhibition;
    this.canBeInlined =
      !trapsSideEffectFlags &&
      !$cond &&
      valueForInhibited === "PASS_THROUGH" &&
      valueForError === "PASS_THROUGH";
    if (!this.canBeInlined) {
      this.addDependency({ step, acceptFlags: TRAPPABLE_FLAGS });
      if ($cond) {
        this.ifDep = this.addDependency($cond);
      }
    } else {
      this.addDependency({ step, acceptFlags, onReject, dataOnly });
    }
    if (isListCapableStep(step)) {
      this.listItem = this._listItem;
    }
    if (
      trapsSideEffectFlags &&
      (this.implicitSideEffectStep || this.layerPlan.latestSideEffectStep)
    ) {
      if (this.implicitSideEffectStep !== this.layerPlan.latestSideEffectStep) {
        throw new Error(
          `GrafastInternalError<0f9e5c52-20dc-41a5-9a47-6f8275764c1a>: ${this} expected latest side effect and implicit side effect to be equal`,
        );
      }

      // We've been instructed to capture flags from the side effect.
      // Need to make this have the side effect, to prevent us being inlined.
      this.hasSideEffects = true;
      this.layerPlan.latestSideEffectStep = this;

      // We'll also make our implicit side effect explicit
      this.implicitErrorDep = this.addDependency({
        step: this.implicitSideEffectStep!,
        acceptFlags: TRAPPABLE_FLAGS,
      });
      sudo(this).implicitSideEffectStep = null;
    }
  }
  public toStringMeta(): string | null {
    const acceptFlags = ALL_FLAGS & ~this.forbiddenFlags;
    const rej = this.onRejectReturnValue
      ? trim(String(this.onRejectReturnValue))
      : inspect(this.onRejectReturnValue);
    const $if =
      this.ifDep !== null ? this.getDepOptions(this.ifDep).step : null;
    return `${this.dependencies[0].id}, ${
      $if ? `if(${$if.id}), ` : ``
    }${digestAcceptFlags(acceptFlags)}, onReject: ${rej}`;
  }
  [$$deepDepSkip](): Step {
    return this.getDepOptions(0).step;
  }

  listItem?: ($item: __ItemStep<unknown>) => Step;
  // Copied over listItem if the dependent step is a list capable step
  _listItem($item: __ItemStep<unknown>) {
    const $dep = this.dependencies[0];
    return isListCapableStep($dep) ? $dep.listItem($item) : $item;
  }

  /**
   * Makes `__FlagStep` compatible with `ConnectionStep`; importantly, this
   * copies our flagging over to the derived step.
   */
  public items(): Step<Maybe<readonly any[]>> {
    const $dep = this.getDepOptions(0).step;
    const $items = itemsOrStep($dep);
    if ($dep === $items) {
      // If the underlying step didn't use `.items()` then we don't need to
      // re-wrap, avoid creating more steps and just return ourself.
      return this;
    }
    const $if =
      this.ifDep != null ? this.getDepOptions(this.ifDep).step : undefined;
    return new __FlagStep($items, { ...this.baseOptions, if: $if });
  }

  /** Return inlining instructions if we can be inlined. @internal */
  inline(
    options: Omit<AddDependencyOptions, "step">,
  ): AddDependencyOptions | null {
    if (!this.canBeInlined) {
      return null;
    }
    const step = this.dependencies[0];
    const forbiddenFlags = this.dependencyForbiddenFlags[0];
    const onReject = this.dependencyOnReject[0];
    const dataOnly = this.dependencyDataOnly[0];
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
        return { step, acceptFlags, onReject, dataOnly };
      }
    }
    return null;
  }

  public deduplicate(_peers: readonly Step<any>[]): readonly Step<any>[] {
    return (_peers as __FlagStep<any>[]).filter((p) => {
      // ifDep has already been tested by Grafast (it's a dependency)
      if (p.forbiddenFlags !== this.forbiddenFlags) return false;
      if (p.onRejectReturnValue !== this.onRejectReturnValue) return false;
      if (p.valueForInhibited !== this.valueForInhibited) return false;
      if (p.valueForError !== this.valueForError) return false;
      if (p.canBeInlined !== this.canBeInlined) return false;
      return true;
    });
  }

  public execute(
    _details: ExecutionDetails<[data: DataFromStep<TStep>, cond?: boolean]>,
  ): GrafastResultsList<DataFromStep<TStep>> {
    throw new Error(`${this} not finalized?`);
  }

  public finalize() {
    if (this.canBeInlined) {
      this.execute = this.passThroughExecute;
    } else {
      this.execute = this.fancyExecute;
    }
    super.finalize();
  }

  private fancyExecute(details: ExecutionDetails): any {
    const dataEv = details.values[0] as ExecutionValue<DataFromStep<TStep>>;
    const condEv =
      this.ifDep === null
        ? null
        : (details.values[this.ifDep] as ExecutionValue<boolean>);
    const implicitErrorEv =
      this.implicitErrorDep === null
        ? null
        : (details.values[this.implicitErrorDep] as ExecutionValue<unknown>);
    const {
      forbiddenFlags: thisForbiddenFlags,
      onRejectReturnValue,
      valueForError,
      valueForInhibited,
    } = this;
    return details.indexMap((i) => {
      const cond = condEv ? condEv.at(i) : true;
      const forbiddenFlags = cond
        ? thisForbiddenFlags
        : DEFAULT_FORBIDDEN_FLAGS;

      // Search for "f2b3b1b3" for similar block
      const dataFlags = dataEv._flagsAt(i);
      const implictErrorFlags = implicitErrorEv?._flagsAt(i) ?? NO_FLAGS;
      const flags = dataFlags | implictErrorFlags;
      const disallowedFlags = flags & forbiddenFlags;
      if (disallowedFlags !== NO_FLAGS) {
        let resultFlags = NO_FLAGS;
        let resultValue = undefined;
        if ((disallowedFlags & FLAG_INHIBITED) === FLAG_INHIBITED) {
          // We were already rejected, maintain this
          resultFlags |= FLAG_INHIBITED | FLAG_NULL;
          resultValue = null;
        }
        if ((disallowedFlags & FLAG_ERROR) === FLAG_ERROR) {
          // We were already rejected, maintain this
          resultFlags |= FLAG_ERROR;
          if ((dataFlags & FLAG_ERROR) === FLAG_ERROR) {
            resultValue = dataEv.at(i);
          } else if (implicitErrorEv != null) {
            resultValue = implicitErrorEv.at(i);
          } else {
            // TODO: what if $if errors!
            throw new Error(
              `GrafastInternalError<41f5fe7c-2691-497a-b140-0ce24c7638a7>: error flag must come from data or implicit error`,
            );
          }
        }
        if (resultFlags === NO_FLAGS) {
          // We weren't already inhibited (e.g. value was simple `null` but our
          // flags don't allow `FLAG_NULL`)
          return onRejectReturnValue;
        } else if (resultValue === null && resultFlags === $$inhibit.flags) {
          // This branch is just an optimization to avoid an additional allocation
          return $$inhibit;
        } else {
          return flaggedValue(resultFlags, resultValue, null);
        }
      } else {
        if (
          (flags & FLAG_ERROR) === FLAG_ERROR &&
          this.valueForError !== false
        ) {
          return valueForError;
        }
        if (
          (flags & FLAG_INHIBITED) === FLAG_INHIBITED &&
          this.valueForInhibited !== false
        ) {
          return valueForInhibited;
        }
        // Assume pass-through
        return dataEv.at(i);
      }
    });
  }

  // Checks already performed via addDependency, just pass everything through. Should have been inlined!
  private passThroughExecute(
    details: ExecutionDetails<[data: DataFromStep<TStep>, cond?: boolean]>,
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
export function inhibitOnNull<TStep extends Step>(
  $step: TStep,
  options?: { if?: FlagStepOptions["if"] },
) {
  return new __FlagStep<TStep>($step, {
    ...options,
    acceptFlags: DEFAULT_ACCEPT_FLAGS & ~FLAG_NULL,
  }) as Step<TStep extends Step<infer U> ? Exclude<U, null | undefined> : any>;
}

/**
 * Example use case: expecting a node ID that represents a User, but get one
 * that represents a Post instead: throw error to tell user they've sent invalid
 * data.
 */
export function assertNotNull<TStep extends Step>(
  $step: TStep,
  message: string,
  options?: { if?: FlagStepOptions["if"] },
) {
  return new __FlagStep<TStep>($step, {
    ...options,
    acceptFlags: DEFAULT_ACCEPT_FLAGS & ~FLAG_NULL,
    onReject: new SafeError(message),
  });
}

export function trap<TStep extends Step>(
  $step: TStep,
  acceptFlags: ExecutionEntryFlags,
  options?: {
    valueForInhibited?: FlagStepOptions["valueForInhibited"];
    valueForError?: FlagStepOptions["valueForError"];
    if?: FlagStepOptions["if"];
  },
) {
  return new __FlagStep<TStep>($step, {
    ...options,
    acceptFlags: (acceptFlags & TRAPPABLE_FLAGS) | FLAG_NULL,
  });
}

// Have to overwrite the getDep method due to circular dependency
(Step.prototype as any).getDep = function (
  this: Step,
  depId: number,
  throwOnFlagged = false,
) {
  this._assertAccessAllowed(depId);
  const { step, acceptFlags, onReject, dataOnly } = this.getDepOptions(depId);
  if (acceptFlags === DEFAULT_ACCEPT_FLAGS && onReject == null) {
    return step;
  } else {
    if (throwOnFlagged) {
      throw new Error(
        `When retrieving dependency ${step} of ${this}, the dependency is flagged as ${digestAcceptFlags(
          acceptFlags,
        )}/onReject=${String(
          onReject,
        )}. Please use \`this.getDepOptions(depId)\` instead, and handle the flags`,
      );
    }
    // Return a __FlagStep around options.step so that all the options are preserved.
    return new __FlagStep(step, { acceptFlags, onReject, dataOnly });
  }
};
