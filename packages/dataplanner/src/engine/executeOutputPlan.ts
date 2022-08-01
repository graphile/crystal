import type { RequestContext } from "../bucket";
import type { CrystalError } from "../error";
import type { PromiseOrDirect } from "../interfaces";
import type { OutputPlan } from "./OutputPlan";

export type OutputPath = Array<string | number>;
export interface OutputStream {
  asyncIterable: AsyncIterableIterator<any>;
}

export interface OutputError {
  path: OutputPath;
  error: CrystalError;
}

/** @internal */
export interface OutputResult {
  data?: any;
  streams: OutputStream[];
  errors: OutputError[];
}

// TODO: to start with we're going to do looping here; but later we can compile
// the output plans (even nested ones) into simple functions that just generate
// the resulting objects directly without looping.
/**
 * @internal
 */
export function executeOutputPlan(
  outputPlan: OutputPlan,
  bucket: Bucket,
  requestContext: RequestContext,
): PromiseOrDirect<OutputResult[]> {
  return null as any;
}
