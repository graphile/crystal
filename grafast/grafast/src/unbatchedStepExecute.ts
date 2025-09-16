import { flagError } from "./error";
import type { ExecutionDetails, UnbatchedExecutionExtra } from "./interfaces";
import type { UnbatchedStep } from "./step";
import { arrayOfLength } from "./utils";

/**
 * Calls `callback` with an execute function that's optimized for handling
 * `depCount` dependencies (where the step `isSyncAndSafe` or not).
 */
export function buildOptimizedExecute(
  depCount: number,
  isSyncAndSafe: boolean,
  callback: (fn: any) => void,
): void {
  if (depCount === 0) {
    callback(isSyncAndSafe ? execute0nocatch : execute0withcatch);
  } else if (depCount === 1) {
    callback(isSyncAndSafe ? execute1nocatch : execute1withcatch);
  } else if (depCount === 2) {
    callback(isSyncAndSafe ? execute2nocatch : execute2withcatch);
  } else {
    callback(executeN);
  }
}

function execute0nocatch(
  this: UnbatchedStep,
  { count, extra }: ExecutionDetails,
) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results[i] = this.unbatchedExecute(extra);
  }
  return results;
}

function execute0withcatch(
  this: UnbatchedStep,
  { count, extra }: ExecutionDetails,
) {
  const results = [];
  for (let i = 0; i < count; i++) {
    try {
      results[i] = this.unbatchedExecute(extra);
    } catch (e) {
      results[i] = flagError(e);
    }
  }
  return results;
}

function execute1nocatch(
  this: UnbatchedStep,
  { count, values: [value0], extra }: ExecutionDetails,
) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results[i] = this.unbatchedExecute(extra, value0.at(i));
  }
  return results;
}

function execute1withcatch(
  this: UnbatchedStep,
  { count, values: [value0], extra }: ExecutionDetails,
) {
  const results = [];
  for (let i = 0; i < count; i++) {
    try {
      results[i] = this.unbatchedExecute(extra, value0.at(i));
    } catch (e) {
      results[i] = flagError(e);
    }
  }
  return results;
}

function execute2nocatch(
  this: UnbatchedStep,
  { count, values: [value0, value1], extra }: ExecutionDetails,
) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results[i] = this.unbatchedExecute(extra, value0.at(i), value1.at(i));
  }
  return results;
}

function execute2withcatch(
  this: UnbatchedStep,
  { count, values: [value0, value1], extra }: ExecutionDetails,
) {
  const results = [];
  for (let i = 0; i < count; i++) {
    try {
      results[i] = this.unbatchedExecute(extra, value0.at(i), value1.at(i));
    } catch (e) {
      results[i] = flagError(e);
    }
  }
  return results;
}

function executeN(
  this: UnbatchedStep,
  { count, values, extra }: ExecutionDetails,
) {
  const results = [];
  // Warning: this `args` array gets reused over and over again to avoid memory
  // allocation.
  const args: [UnbatchedExecutionExtra, ...any[]] = arrayOfLength(
    values.length + 1,
  ) as any;
  args[0] = extra;
  for (let dataIndex = 0; dataIndex < count; dataIndex++) {
    for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
      args[valueIndex + 1] = values[valueIndex].at(dataIndex);
    }
    try {
      results[dataIndex] = this.unbatchedExecute.apply(this, args);
    } catch (e) {
      results[dataIndex] = flagError(e);
    }
  }
  return results;
}
