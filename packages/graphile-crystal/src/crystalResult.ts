import { CrystalResult, $$batch } from "./interfaces";

export function isCrystalResult(parent: unknown): parent is CrystalResult {
  return (typeof parent === "object" && parent && $$batch in parent) || false;
}
