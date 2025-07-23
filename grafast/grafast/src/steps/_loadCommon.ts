import type { Multistep, UnwrapMultistep } from "../multistep";
import type { Step } from "../step.js";
import { isListLikeStep, isObjectLikeStep } from "../step.js";
import {
  arraysMatch,
  isTuple,
  recordsMatch,
  stableStringSortFirstTupleEntry,
} from "../utils.js";
import { access } from "./access.js";

export const nextTick: (cb: () => void) => void =
  typeof process !== "undefined" && typeof process.nextTick === "function"
    ? (cb) => process.nextTick(cb)
    : (cb) => setTimeout(cb, 0);

export type IOEquivalence<TLookup extends Multistep> =
  | null
  | string
  | (UnwrapMultistep<TLookup> extends readonly [...(readonly any[])]
      ? {
          [key in Exclude<keyof UnwrapMultistep<TLookup>, keyof any[]>]:
            | string
            | null;
        }
      : UnwrapMultistep<TLookup> extends Record<string, any>
        ? { [key in keyof UnwrapMultistep<TLookup>]?: string | null }
        : never);

export function makeAccessMap<TLookup extends Multistep>(
  $spec: Step,
  ioEquivalence: IOEquivalence<TLookup>,
): Record<string, Step> {
  const map = Object.create(null) as Record<string, Step>;
  if (ioEquivalence == null) {
    return map;
  } else if (typeof ioEquivalence === "string") {
    map[ioEquivalence] = $spec;
    return map;
  } else if (isTuple(ioEquivalence)) {
    for (let i = 0, l = ioEquivalence.length; i < l; i++) {
      const key = ioEquivalence[i];
      map[key] = isListLikeStep($spec) ? $spec.at(i) : access($spec, [i]);
    }
    return map;
  } else if (typeof ioEquivalence === "object") {
    for (const key of Object.keys(ioEquivalence)) {
      const attr = ioEquivalence[key as any];
      if (attr != null) {
        map[attr] = isObjectLikeStep($spec)
          ? $spec.get(key)
          : access($spec, [key]);
      }
    }
    return map;
  } else {
    throw new Error(`ioEquivalence passed to loadOne() call not understood`);
  }
}

export function ioEquivalenceMatches(
  io1: IOEquivalence<Multistep>,
  io2: IOEquivalence<Multistep>,
): boolean {
  if (io1 === io2) return true;

  if (io1 == null) return false;
  if (io2 == null) return false;

  if (typeof io1 === "string") return false;
  if (typeof io2 === "string") return false;
  if (Array.isArray(io1)) {
    if (!Array.isArray(io2)) return false;
    return arraysMatch(io1, io2);
  } else {
    if (Array.isArray(io2)) return false;
    return recordsMatch(io1, io2);
  }
}

export function paramSig(
  paramDepIdByKey: Record<string, number>,
  depIdToStepId: (depId: number) => number,
): string {
  // No more params allowed!
  Object.freeze(paramDepIdByKey);
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(paramDepIdByKey)
        .map(([key, depId]) => [key, depIdToStepId(depId)] as const)
        .sort(stableStringSortFirstTupleEntry),
    ),
  );
}
