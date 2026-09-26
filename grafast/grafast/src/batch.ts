import type { BatchCallback, BatchKeysetEquality } from "./interfaces.ts";

type PendingCall = {
  keysets: readonly unknown[];
  resolve: (values: readonly unknown[]) => void;
  reject: (error: unknown) => void;
};

type BatchFamily = {
  callback: BatchCallback<any, any, any>;
  unaryDependencies: readonly unknown[];
  keysetEquality: BatchKeysetEquality;
  calls: PendingCall[];
};

type BatchMeta = Record<PropertyKey, unknown> & {
  [batchesSymbol]?: BatchFamily[];
};

const batchesSymbol = Symbol("Grafast tick batches");

function keysetsMatch(
  left: unknown,
  right: unknown,
  mode: BatchKeysetEquality,
): boolean {
  if (mode === "strict") return left === right;

  if (mode === "tuple") {
    if (!Array.isArray(left) || !Array.isArray(right)) {
      throw new Error("batch(..., 'tuple') requires array keysets");
    }
    return (
      left.length === right.length &&
      left.every((value, index) => value === right[index])
    );
  }

  if (
    typeof left !== "object" ||
    left === null ||
    Array.isArray(left) ||
    typeof right !== "object" ||
    right === null ||
    Array.isArray(right)
  ) {
    throw new Error("batch(..., 'object') requires object keysets");
  }
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(right, key) &&
        (left as Record<string, unknown>)[key] ===
          (right as Record<string, unknown>)[key],
    )
  );
}

function familyMatches(
  family: BatchFamily,
  callback: BatchCallback<any, any, any>,
  unaryDependencies: readonly unknown[],
  keysetEquality: BatchKeysetEquality,
): boolean {
  return (
    family.callback === callback &&
    family.keysetEquality === keysetEquality &&
    family.unaryDependencies.length === unaryDependencies.length &&
    family.unaryDependencies.every(
      (dependency, index) => dependency === unaryDependencies[index],
    )
  );
}

/** @internal Used to implement `ExecutionDetails.batch`. */
export function batchInMeta<
  TUnaryDependencies extends readonly unknown[],
  TKeyset,
  TResult,
>(
  meta: Record<PropertyKey, unknown>,
  callback: BatchCallback<TUnaryDependencies, TKeyset, TResult>,
  unaryDependencies: TUnaryDependencies,
  keysets: readonly TKeyset[],
  keysetEquality: BatchKeysetEquality = "strict",
): Promise<ReadonlyArray<TResult>> {
  if (keysets.length === 0) return Promise.resolve([]);

  const typedMeta = meta as BatchMeta;
  let families = typedMeta[batchesSymbol];
  if (!families) typedMeta[batchesSymbol] = families = [];

  return new Promise<ReadonlyArray<TResult>>((resolve, reject) => {
    const call: PendingCall = {
      keysets,
      resolve: resolve as (values: readonly unknown[]) => void,
      reject,
    };
    let family = families!.find((candidate) =>
      familyMatches(candidate, callback, unaryDependencies, keysetEquality),
    );
    if (family) {
      family.calls.push(call);
    } else {
      family = {
        callback,
        unaryDependencies,
        keysetEquality,
        calls: [call],
      };
      families!.push(family);
      queueMicrotask(() => {
        const currentFamilies = typedMeta[batchesSymbol];
        const index = currentFamilies?.indexOf(family!);
        if (index !== undefined && index !== -1) {
          currentFamilies!.splice(index, 1);
        }
        void executeFamily(family!);
      });
    }
  });
}

async function executeFamily(family: BatchFamily): Promise<void> {
  try {
    const uniqueKeysets: unknown[] = [];
    const resultIndexes: number[][] = [];
    for (const call of family.calls) {
      const indexes: number[] = [];
      for (const keyset of call.keysets) {
        let index = uniqueKeysets.findIndex((existing) =>
          keysetsMatch(existing, keyset, family.keysetEquality),
        );
        if (index === -1) {
          index = uniqueKeysets.push(keyset) - 1;
        }
        indexes.push(index);
      }
      resultIndexes.push(indexes);
    }

    const results = await family.callback(
      family.unaryDependencies,
      uniqueKeysets,
    );
    if (results.length !== uniqueKeysets.length) {
      throw new Error(
        `batch callback returned ${results.length} results for ${uniqueKeysets.length} keysets`,
      );
    }
    for (let callIndex = 0; callIndex < family.calls.length; callIndex++) {
      family.calls[callIndex].resolve(
        resultIndexes[callIndex].map((index) => results[index]),
      );
    }
  } catch (error) {
    for (const call of family.calls) call.reject(error);
  }
}
