import type {
  BatchExecutor,
  BatchKeysetEquality,
  ExecutionDetails,
  ExecutionResultValue,
  PromiseOrDirect,
} from "../interfaces.ts";
import type { Multistep, UnwrapMultistep } from "../multistep.ts";
import { isListLikeStep, isObjectLikeStep, Step } from "../step.ts";
import {
  arraysMatch,
  isTuple,
  recordsMatch,
  stableStringSortFirstTupleEntry,
} from "../utils.ts";
import { access } from "./access.ts";

export type IOEquivalence<TSpec> =
  | null
  | string
  | { [key in Exclude<keyof TSpec, keyof any[]>]?: string | null };

export function makeAccessMap<TLookup extends Multistep>(
  $spec: Step,
  ioEquivalence: IOEquivalence<UnwrapMultistep<TLookup>>,
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
      const attr = ioEquivalence[key];
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

type LoadCallback<
  TSpec,
  TItem,
  TData,
  TParams extends Record<string, any>,
  TShared,
> = (
  specs: readonly TSpec[],
  info: {
    attributes: readonly (keyof TItem)[];
    params: Partial<TParams>;
    shared: TShared;
    unary: TShared;
  },
) => PromiseOrDirect<ReadonlyArray<PromiseOrDirect<TData>>>;

type LoadBatchOptions<
  TSpec,
  TItem,
  TData,
  TParams extends Record<string, any>,
  TShared,
> = {
  load: LoadCallback<TSpec, TItem, TData, TParams, TShared>;
  attributes: readonly (keyof TItem)[];
  shared: TShared;
  params: Partial<TParams>;
};

function executeLoadBatch<
  TSpec,
  TItem,
  TData,
  TParams extends Record<string, any>,
  TShared,
>(
  {
    load,
    attributes,
    shared,
    params,
  }: LoadBatchOptions<TSpec, TItem, TData, TParams, TShared>,
  specs: readonly TSpec[],
): PromiseOrDirect<ReadonlyArray<PromiseOrDirect<TData>>> {
  return load(specs, {
    attributes,
    params,
    shared,
    unary: shared,
  });
}

// Preserve the generic callbacks: each use specializes this same executor
// object, without erasing the relationship between its options, keys and data.
const loadBatchExecutor = {
  name: "grafast/load",
  keysetEquality: "strict",
  callback: executeLoadBatch,
  optionsMatch: {
    load: "strict",
    shared: "strict",
    attributes: "tuple",
    params: "record",
  },
} satisfies BatchExecutor<
  LoadBatchOptions<unknown, unknown, unknown, Record<string, unknown>, unknown>,
  unknown,
  unknown
>;

const loadBatchExecutors = {
  strict: loadBatchExecutor,
  tuple: {
    ...loadBatchExecutor,
    name: "grafast/load/tuple",
    keysetEquality: "tuple" as const,
  },
  object: {
    ...loadBatchExecutor,
    name: "grafast/load/object",
    keysetEquality: "object" as const,
  },
};

export function getLoadKeysetEquality(lookup: Multistep): BatchKeysetEquality {
  return lookup == null || lookup instanceof Step
    ? "strict"
    : isTuple(lookup)
      ? "tuple"
      : "object";
}

export function executeLoad<
  TSpec,
  TItem,
  TData,
  TParams extends Record<string, any>,
  TShared,
>(
  details: ExecutionDetails<readonly [TSpec, ...any[]]>,
  sharedDepId: number | null,
  paramDepIdByKey: Record<string, number>,
  baseLoadInfo: {
    attributes: readonly (keyof TItem)[];
  },
  load: LoadCallback<TSpec, TItem, TData, TParams, TShared>,
  keysetEquality: BatchKeysetEquality,
): PromiseOrDirect<
  ReadonlyArray<PromiseOrDirect<ExecutionResultValue<TData>>>
> {
  const { indexMap, values } = details;
  const values0 = values[0];
  const shared = (
    sharedDepId !== null ? values[sharedDepId].unaryValue() : undefined
  ) as TShared;
  const params = Object.fromEntries(
    Object.entries(paramDepIdByKey).map(([key, depId]) => [
      key,
      values[depId].unaryValue(),
    ]),
  ) as Partial<TParams>;

  return details.batch<
    LoadBatchOptions<TSpec, TItem, TData, TParams, TShared>,
    TSpec,
    PromiseOrDirect<TData>
  >(
    loadBatchExecutors[keysetEquality],
    indexMap((i) => values0.at(i)),
    {
      load,
      attributes: baseLoadInfo.attributes,
      shared,
      params,
    },
  );
}
