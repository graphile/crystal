import type {
  ExecutionDetails,
  Maybe,
  PromiseOrDirect,
} from "../interfaces.ts";
import type { Multistep, UnwrapMultistep } from "../multistep.ts";
import type { Step } from "../step.ts";
import { isListLikeStep, isObjectLikeStep } from "../step.ts";
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

interface LoadMeta {
  cache?: Map<any, any>;
}

type LoadCallback = (...args: any[]) => any;

function executeLoadBatch(
  unaryDependencies: readonly unknown[],
  specs: readonly unknown[],
): PromiseOrDirect<ReadonlyArray<any>> {
  const [load, signature, shared, ...parameterValues] = unaryDependencies;
  const [attributes, parameterNames] = JSON.parse(signature as string) as [
    readonly string[],
    readonly string[],
  ];
  const params = Object.fromEntries(
    parameterNames.map((name, index) => [name, parameterValues[index]]),
  );
  return (load as LoadCallback)(specs, {
    attributes,
    params,
    shared,
    unary: shared,
  });
}

export function executeLoad<
  const TLookup extends Multistep,
  TItem,
  TData extends Maybe<TItem> | Maybe<ReadonlyArray<Maybe<TItem>>>,
  TParams extends Record<string, any>,
  const TLoadContext extends Multistep = never,
>(
  details: ExecutionDetails,
  sharedDepId: number | null,
  paramDepIdByKey: Record<string, number>,
  baseLoadInfo: {
    attributes: readonly any[];
  },
  load: LoadCallback,
) {
  const { count, extra, values } = details;
  const values0 = values[0] as UnwrapMultistep<TLookup>;
  const shared =
    sharedDepId != null
      ? (values[sharedDepId].unaryValue() as UnwrapMultistep<TLoadContext>)
      : (undefined as never);
  const meta = extra.meta as LoadMeta;
  let cache = meta.cache;
  if (!cache) {
    cache = new Map();
    meta.cache = cache;
  }
  const batch = new Map<UnwrapMultistep<TLookup>, number[]>();
  const params = Object.fromEntries(
    Object.entries(paramDepIdByKey).map(([key, depId]) => [
      key,
      values[depId].unaryValue(),
    ]),
  ) as Partial<TParams>;

  const results: Array<PromiseOrDirect<TData>> = [];
  for (let i = 0; i < count; i++) {
    const spec = values0.at(i);
    if (cache.has(spec)) {
      results.push(cache.get(spec)!);
    } else {
      // We'll fill this in in a minute
      const index = results.push(null as any) - 1;
      const existingIdx = batch.get(spec);
      if (existingIdx !== undefined) {
        existingIdx.push(index);
      } else {
        batch.set(spec, [index]);
      }
    }
  }
  const pendingCount = batch.size;
  if (pendingCount > 0) {
    const batchSpecs = [...batch.keys()];
    const parameterNames = Object.keys(params).sort();
    const loadInfoSignature = JSON.stringify([
      baseLoadInfo.attributes,
      parameterNames,
    ]);
    const unaryDependencies = [
      load,
      loadInfoSignature,
      shared,
      ...parameterNames.map((key) => params[key]),
    ];
    const loadResults = details.batch(
      executeLoadBatch,
      unaryDependencies,
      batchSpecs,
      "strict",
    );
    return (async () => {
      const loaded = await loadResults;
      for (let pendingIndex = 0; pendingIndex < pendingCount; pendingIndex++) {
        const spec = batchSpecs[pendingIndex];
        const targetIndexes = batch.get(spec)!;
        const loadResult = loaded[pendingIndex];
        cache.set(spec, loadResult);
        for (const targetIndex of targetIndexes) {
          results[targetIndex] = loadResult;
        }
      }
      return results;
    })();
  }
  return results;
}
