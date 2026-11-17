import type { GraphQLSchema } from "graphql";

import { isDev } from "./dev.ts";
import type {
  BatchCallback,
  BatchExecutor,
  BatchKeysetEquality,
} from "./interfaces.ts";
import { arraysMatch, recordsMatch } from "./utils.ts";

/** Define once at module scope, or during schema construction. */
export function defineBatchExecutor<TOptions, TKeyset, TResult>(options: {
  name: string;
  callback: BatchCallback<TOptions, TKeyset, TResult>;
  keysetEquality?: BatchKeysetEquality;
  optionsMatch?: (left: TOptions, right: TOptions) => boolean;
}): BatchExecutor<TOptions, TKeyset, TResult> {
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
  options: unknown;
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function defaultOptionsMatch(left: unknown, right: unknown): boolean {
  if (left === right) {
    return true;
  } else if (Array.isArray(left) && Array.isArray(right)) {
    return arraysMatch(left, right);
  } else if (isPlainObject(left) && isPlainObject(right)) {
    return recordsMatch(left, right);
  } else {
    return false;
  }
}

function familyMatches(
  family: BatchFamily,
  executor: BatchExecutor<any, any, any>,
  options: unknown,
): boolean {
  return (
    family.executor === executor &&
    (executor.optionsMatch ?? defaultOptionsMatch)(family.options, options)
  );
}

/** @internal Used to implement `ExecutionDetails.batch`. */
export function batchInMeta<TOptions, TKeyset, TResult>(
  schema: GraphQLSchema,
  meta: Record<PropertyKey, unknown>,
  executor: BatchExecutor<TOptions, TKeyset, TResult>,
  keysets: readonly TKeyset[],
  options?: TOptions,
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
      familyMatches(candidate, executor, options),
    );
    if (family != null) {
      family.calls.push(call);
    } else {
      const newFamily: BatchFamily = {
        executor,
        options,
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
      family.options,
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
