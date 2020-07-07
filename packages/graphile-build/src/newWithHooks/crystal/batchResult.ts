import { BatchResult, $$root } from "./interfaces";

export function isBatchResult(parent: unknown): parent is BatchResult {
  return (typeof parent === "object" && parent && $$root in parent) || false;
}
