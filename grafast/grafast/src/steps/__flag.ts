import type { GrafastError } from "../error.js";
import { newGrafastError } from "../error.js";
import type {
  ExecutionDetails,
  ExecutionEntryFlags,
  GrafastResultsList,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import {
  DEFAULT_ACCEPT_FLAGS,
  FLAG_NULL,
  TRAPPABLE_FLAGS,
} from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { $$deepDepSkip, UnbatchedExecutableStep } from "../step.js";
import { arrayOfLength } from "../utils.js";

export class __FlagStep<TData> extends UnbatchedExecutableStep<TData> {
  isSyncAndSafe = false;
  constructor(
    $step: ExecutableStep,
    acceptFlags: ExecutionEntryFlags,
    onReject?: GrafastError | null,
  ) {
    super();
    this.addDependency($step, { acceptFlags, onReject });
  }
  getParentStep(): ExecutableStep {
    return this.getDep(0);
  }
  [$$deepDepSkip](): ExecutableStep {
    return this.getDep(0);
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
