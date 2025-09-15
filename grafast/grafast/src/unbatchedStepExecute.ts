import { flagError } from "./error";
import type { ExecutionDetails, UnbatchedExecutionExtra } from "./interfaces";
import type { UnbatchedStep } from "./step";

function execute0(this: UnbatchedStep, { count, extra }: ExecutionDetails) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results[i] = this.unbatchedExecute(extra);
  }
  return results;
}

function execute1safe(
  this: UnbatchedStep,
  { count, values: [value0], extra }: ExecutionDetails,
) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results[i] = this.unbatchedExecute(extra, value0.at(i));
  }
  return results;
}

function execute1unsafe(
  this: UnbatchedStep,
  { count, values: [value0], extra }: ExecutionDetails,
) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results[i] = this.unbatchedExecute(extra, value0.at(i));
  }
  return results;
}

function execute2safe(
  this: UnbatchedStep,
  { count, values: [value0, value1], extra }: ExecutionDetails,
) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results[i] = this.unbatchedExecute(extra, value0.at(i), value1.at(i));
  }
  return results;
}

function execute2unsafe(
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
  for (let i = 0; i < count; i++) {
    const args: [UnbatchedExecutionExtra, ...any[]] = [extra];
    for (let j = 0; j < values.length; j++) {
      args.push(values[j].at(i));
    }
    try {
      results[i] = this.unbatchedExecute.apply(this, args);
    } catch (e) {
      results[i] = flagError(e);
    }
  }
  return results;
}

export function buildOptimizedExecute(
  depCount: number,
  isSyncAndSafe: boolean,
  callback: (fn: any) => void,
): void {
  if (depCount === 0) {
    callback(execute0);
  } else if (depCount === 1) {
    callback(isSyncAndSafe ? execute1safe : execute1unsafe);
  } else if (depCount === 2) {
    callback(isSyncAndSafe ? execute2safe : execute2unsafe);
  } else {
    callback(executeN);
  }
}
