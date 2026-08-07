import {
  $$deepDepSkip,
  ALL_FLAGS,
  DEFAULT_ACCEPT_FLAGS,
  DEFAULT_FORBIDDEN_FLAGS,
  FLAG_ERROR,
  FLAG_INHIBITED,
  FLAG_NULL,
  TRAPPABLE_FLAGS,
} from "../constants.ts";
import type { FlaggedValue } from "../error.ts";
import { $$inhibit, flagError, SafeError } from "../error.ts";
import { inspect } from "../inspect.ts";
import type {
  AddDependencyOptions,
  DataFromStep,
  ExecutionDetails,
  ExecutionEntryFlags,
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
    this.canBeInlined =
      !$cond &&
      valueForInhibited === "PASS_THROUGH" &&
      valueForError === "PASS_THROUGH" &&
      // Can't PASS_THROUGH errors since they need to be converted into TRAPPED
      // error.
      // TODO: should we be handling this in Grafast core?
      (acceptFlags & FLAG_ERROR) === 0;
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
      "connectionClone" in step &&
      typeof step.connectionClone === "function"
    ) {
      const $connectionStep = step as any;
      Object.assign(this, {
        connectionClone: $connectionStep.connectionClone.bind($connectionStep),
        ...(typeof $connectionStep.parseCursor === "function"
          ? { parseCursor: $connectionStep.parseCursor.bind($connectionStep) }
          : null),
        ...(typeof $connectionStep.nodeForItem === "function"
          ? { nodeForItem: $connectionStep.nodeForItem.bind($connectionStep) }
          : null),
        ...(typeof $connectionStep.edgeForItem === "function"
          ? { edgeForItem: $connectionStep.edgeForItem.bind($connectionStep) }
          : null),
        ...(typeof $connectionStep.cursorForItem === "function"
          ? {
              cursorForItem:
                $connectionStep.cursorForItem.bind($connectionStep),
            }
          : null),
      });
    }
    sudo(this).implicitSideEffectStep = null;
    this.layerPlan.latestSideEffectStep = null; // Can't be `this`, because __FlagStep can be optimized away.
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
    const $if = this.ifDep != null ? this.getDepOptions(0).step : undefined;
    return new __FlagStep($items, { ...this.baseOptions, if: $if });
  }

  listItem?: ($item: __ItemStep<unknown>) => Step;
  /**
   * Copied over `this.listItem` if the dependent step is a list capable step.
   * Does **NOT** copy flagging over to the derived step, since `$item` already
   * handles that.
   */
  private _listItem($item: __ItemStep<unknown>) {
    const $dep = this.dependencies[0];
    return isListCapableStep($dep) ? $dep.listItem($item) : $item;
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

  private fancyExecute(
    details: ExecutionDetails<[data: DataFromStep<TStep>, cond?: boolean]>,
  ): any {
    const dataEv = details.values[0]!;
    const condEv =
      this.ifDep === null ? null : details.values[this.ifDep as 1]!;
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
      const flags = dataEv._flagsAt(i);
      const disallowedFlags = flags & forbiddenFlags;
      if (disallowedFlags) {
        if (disallowedFlags & FLAG_INHIBITED) {
          // We were already rejected, maintain this
          return $$inhibit;
        } else if (disallowedFlags & FLAG_ERROR) {
          // We were already rejected, maintain this
          return flagError(dataEv.at(i) as Error);
        } else {
          // We weren't already inhibited
          return onRejectReturnValue;
        }
      } else {
        if (flags & FLAG_ERROR && this.valueForError !== false) {
          return valueForError;
        }
        if (flags & FLAG_INHIBITED && this.valueForInhibited !== false) {
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
