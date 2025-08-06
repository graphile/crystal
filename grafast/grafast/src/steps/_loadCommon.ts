import type { ExecutionDetails, Maybe, PromiseOrDirect } from "..";
import { defer, type Deferred } from "../deferred";
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

export interface LoadBatch {
  deferred: Deferred<any>;
  batchSpecs: readonly any[];
}

export async function executeBatches<
  TLoadInfo extends {
    shared: any;
    attributes: readonly any[];
    params: any;
    /** @deprecated */
    unary: any;
  },
  TCallback extends (
    specs: ReadonlyArray<any>,
    info: TLoadInfo,
  ) => PromiseOrDirect<ReadonlyArray<any>>,
>(loadBatches: readonly LoadBatch[], loadInfo: TLoadInfo, load: TCallback) {
  try {
    const numberOfBatches = loadBatches.length;
    if (numberOfBatches === 1) {
      const [loadBatch] = loadBatches;
      loadBatch.deferred.resolve(load(loadBatch.batchSpecs, loadInfo));
      return;
    } else {
      // Do some tick-batching!
      const indexStarts: number[] = [];
      const allBatchSpecs: any[] = [];
      for (let i = 0; i < numberOfBatches; i++) {
        const loadBatch = loadBatches[i];
        indexStarts[i] = allBatchSpecs.length;
        for (const batchSpec of loadBatch.batchSpecs) {
          allBatchSpecs.push(batchSpec);
        }
      }
      const results = await load(allBatchSpecs, loadInfo);
      for (let i = 0; i < numberOfBatches; i++) {
        const loadBatch = loadBatches[i];
        const start = indexStarts[i];
        const stop = indexStarts[i + 1] ?? allBatchSpecs.length;
        const entries = results.slice(start, stop);
        loadBatch.deferred.resolve(entries);
      }
    }
  } catch (e) {
    for (const loadBatch of loadBatches) {
      loadBatch.deferred.reject(e);
    }
  }
}

type LoadCallback = (...args: any[]) => any;

interface LoadMeta {
  cache?: Map<any, any>;
  loadBatchesByLoad?: Map<LoadCallback, LoadBatch[]> | undefined;
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
  const loadInfo: {
    attributes: ReadonlyArray<any>;
    params: Partial<TParams>;
    shared: TLoadContext;
    /** @deprecated */
    unary: TLoadContext;
  } = {
    ...baseLoadInfo,
    params,
    shared,
    unary: shared,
  };

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
    const deferred = defer<ReadonlyArray<TData>>();
    const batchSpecs = [...batch.keys()];
    const loadBatch: LoadBatch = { deferred, batchSpecs };
    if (!meta.loadBatchesByLoad) {
      meta.loadBatchesByLoad = new Map();
    }
    let loadBatches = meta.loadBatchesByLoad.get(load);
    if (loadBatches) {
      // Add to existing batch load
      loadBatches.push(loadBatch);
    } else {
      // Create new batch load
      loadBatches = [loadBatch];
      meta.loadBatchesByLoad.set(load, loadBatches);
      // Guaranteed by the metaKey to be equivalent for all entries sharing the same `meta`. Note equivalent is not identical; key order may change.
      nextTick(() => {
        // Don't allow adding anything else to the batch
        meta.loadBatchesByLoad!.delete(load);
        executeBatches(loadBatches!, loadInfo, load);
      });
    }
    return (async () => {
      const loadResults = await deferred;
      for (let pendingIndex = 0; pendingIndex < pendingCount; pendingIndex++) {
        const spec = batchSpecs[pendingIndex];
        const targetIndexes = batch.get(spec)!;
        const loadResult = loadResults[pendingIndex];
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
