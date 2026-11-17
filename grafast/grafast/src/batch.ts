import type { GraphQLSchema } from "graphql";

import { isDev } from "./dev.ts";
import type {
  BatchCallback,
  BatchExecutor,
  BatchKeysetEquality,
} from "./interfaces.ts";

/** Define once at module scope, or during schema construction. */
export function defineBatchExecutor<
  TUnaryDependencies extends readonly unknown[],
  TKeyset,
  TResult,
>(options: {
  name: string;
  callback: BatchCallback<TUnaryDependencies, TKeyset, TResult>;
  keysetEquality?: BatchKeysetEquality;
}): BatchExecutor<TUnaryDependencies, TKeyset, TResult> {
  return Object.freeze({
    ...options,
    keysetEquality: options.keysetEquality ?? "strict",
  });
}

type ExecutorRegistration = {
  executor: BatchExecutor<any, any, any>;
  warned: boolean;
};
const executorsBySchema = new WeakMap<
  GraphQLSchema,
  Map<string, ExecutorRegistration>
>();

function checkExecutor(
  schema: GraphQLSchema,
  executor: BatchExecutor<any, any, any>,
): void {
  let registry = executorsBySchema.get(schema);
  if (registry == null) {
    registry = new Map();
    executorsBySchema.set(schema, registry);
  }
  const registration = registry.get(executor.name);
  if (registration == null) {
    registry.set(executor.name, { executor, warned: false });
  } else if (registration.executor !== executor) {
    const message = `Batch executor '${executor.name}' has multiple definitions in the same schema. Define it once outside step execution and reuse the same executor object.`;
    if (isDev) {
      throw new Error(message);
    } else if (!registration.warned) {
      registration.warned = true;
      console.warn(message);
    }
  }
}

type PendingCall = {
  keysets: readonly unknown[];
  resolve: (values: readonly unknown[]) => void;
  reject: (error: unknown) => void;
};

type BatchFamily = {
  executor: BatchExecutor<any, any, any>;
  unaryDependencies: readonly unknown[];
  keysetEquality: BatchKeysetEquality;
  calls: PendingCall[];
};

type BatchMeta = Record<PropertyKey, unknown> & {
  [batchesSymbol]?: BatchFamily[];
};

const batchesSymbol = Symbol("Grafast tick batches");

type KeyIndex = { children: Map<unknown, KeyIndex>; index?: number };

function keyParts(
  keyset: unknown,
  mode: BatchKeysetEquality,
): readonly unknown[] {
  if (mode === "strict") {
    return [keyset];
  }
  if (mode === "tuple") {
    if (!Array.isArray(keyset)) {
      throw new Error("batch(..., 'tuple') requires array keysets");
    }
    return keyset;
  }
  if (typeof keyset !== "object" || keyset === null || Array.isArray(keyset)) {
    throw new Error("batch(..., 'object') requires object keysets");
  }
  return Object.keys(keyset)
    .sort()
    .flatMap((key) => [key, (keyset as Record<string, unknown>)[key]]);
}

function familyMatches(
  family: BatchFamily,
  executor: BatchExecutor<any, any, any>,
  unaryDependencies: readonly unknown[],
  keysetEquality: BatchKeysetEquality,
): boolean {
  return (
    family.executor === executor &&
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
  schema: GraphQLSchema,
  meta: Record<PropertyKey, unknown>,
  executor: BatchExecutor<TUnaryDependencies, TKeyset, TResult>,
  unaryDependencies: TUnaryDependencies,
  keysets: readonly TKeyset[],
): Promise<ReadonlyArray<TResult>> {
  checkExecutor(schema, executor);
  const { keysetEquality } = executor;
  if (keysets.length === 0) {
    return Promise.resolve([]);
  }

  const typedMeta = meta as BatchMeta;
  let families = typedMeta[batchesSymbol];
  if (families == null) {
    typedMeta[batchesSymbol] = families = [];
  }

  return new Promise<ReadonlyArray<TResult>>((resolve, reject) => {
    const call: PendingCall = {
      keysets,
      resolve: resolve as (values: readonly unknown[]) => void,
      reject,
    };
    const family = families.find((candidate) =>
      familyMatches(candidate, executor, unaryDependencies, keysetEquality),
    );
    if (family != null) {
      family.calls.push(call);
    } else {
      const newFamily: BatchFamily = {
        executor,
        unaryDependencies,
        keysetEquality,
        calls: [call],
      };
      families.push(newFamily);
      queueMicrotask(() => {
        families.splice(families.indexOf(newFamily), 1);
        void executeFamily(newFamily);
      });
    }
  });
}

async function executeFamily(family: BatchFamily): Promise<void> {
  try {
    const uniqueKeysets: unknown[] = [];
    const resultIndexes: number[][] = [];
    const root: KeyIndex = { children: new Map() };
    for (const call of family.calls) {
      const indexes: number[] = [];
      for (const keyset of call.keysets) {
        let node = root;
        for (const part of keyParts(keyset, family.keysetEquality)) {
          // Map treats NaN as equal to itself, unlike the strict equality used here.
          const key =
            typeof part === "number" && Number.isNaN(part) ? Symbol() : part;
          let child = node.children.get(key);
          if (child == null) {
            child = { children: new Map() };
            node.children.set(key, child);
          }
          node = child;
        }
        let index = node.index;
        if (index === undefined) {
          index = uniqueKeysets.push(keyset) - 1;
          node.index = index;
        }
        indexes.push(index);
      }
      resultIndexes.push(indexes);
    }

    const results = await family.executor.callback(
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
    for (const call of family.calls) {
      call.reject(error);
    }
  }
}
