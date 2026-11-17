import type { GraphQLSchema } from "graphql";

import { isDev } from "./dev.ts";
import type {
  BatchCallback,
  BatchExecutor,
  BatchKeysetEquality,
} from "./interfaces.ts";
import { recordsMatch } from "./utils.ts";

/** Define once at module scope, or during schema construction. */
export function defineBatchExecutor<
  TOptions extends Record<string, unknown> | undefined,
  TKeyset,
  TResult,
>(options: {
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

type PendingKey = {
  keyset: unknown;
  node: KeyIndex;
  resolve: (result: CachedResult) => void;
  reject: (error: unknown) => void;
};

type BatchFamily = {
  executor: BatchExecutor<any, any, any>;
  options: Record<string, unknown> | undefined;
  cache: KeyIndex;
  pending: PendingKey[];
};

type BatchMeta = Record<PropertyKey, unknown> & {
  [batchesSymbol]?: BatchFamily[];
};

const batchesSymbol = Symbol("Grafast batch caches");

type CachedResult = { value: unknown };

type KeyIndex = {
  children: Map<unknown, KeyIndex>;
  value?: Promise<CachedResult>;
};

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

function defaultOptionsMatch(
  left: Record<string, unknown> | undefined,
  right: Record<string, unknown> | undefined,
): boolean {
  return (
    left === right ||
    (left !== undefined && right !== undefined && recordsMatch(left, right))
  );
}

function familyMatches(
  family: BatchFamily,
  executor: BatchExecutor<any, any, any>,
  options: Record<string, unknown> | undefined,
): boolean {
  return (
    family.executor === executor &&
    (executor.optionsMatch ?? defaultOptionsMatch)(family.options, options)
  );
}

/** @internal Used to implement `ExecutionDetails.batch`. */
export function batchInMeta<
  TOptions extends Record<string, unknown> | undefined,
  TKeyset,
  TResult,
>(
  schema: GraphQLSchema,
  metaByMetaKey: Record<PropertyKey, unknown>,
  executor: BatchExecutor<TOptions, TKeyset, TResult>,
  keysets: readonly TKeyset[],
  options?: TOptions,
): Promise<ReadonlyArray<TResult>> {
  if (isDev && options !== undefined && !isPlainObject(options)) {
    throw new Error(
      "Batch executor options must be a plain object, or omitted.",
    );
  }
  checkExecutor(schema, executor);
  const { keysetEquality } = executor;
  if (keysets.length === 0) {
    return Promise.resolve([]);
  }

  const typedMeta = metaByMetaKey as BatchMeta;
  let families = typedMeta[batchesSymbol];
  if (families == null) {
    typedMeta[batchesSymbol] = families = [];
  }

  let family = families.find((candidate) =>
    familyMatches(candidate, executor, options),
  );
  if (family == null) {
    family = {
      executor,
      options,
      cache: { children: new Map() },
      pending: [],
    };
    families.push(family);
  }

  // As in loadOne/loadMany, look up cached keys and collect only uncached work.
  // Cache promises immediately so calls arriving during a fetch share its work.
  const results: Promise<CachedResult>[] = [];
  for (const keyset of keysets) {
    let node = family.cache;
    for (const part of keyParts(keyset, keysetEquality)) {
      // Map treats NaN as equal to itself, unlike strict equality.
      const key =
        typeof part === "number" && Number.isNaN(part) ? Symbol() : part;
      let child = node.children.get(key);
      if (child == null) {
        child = { children: new Map() };
        node.children.set(key, child);
      }
      node = child;
    }
    let result = node.value;
    if (result == null) {
      const pending = family.pending;
      result = new Promise((resolve, reject) => {
        pending.push({ keyset, node, resolve, reject });
      });
      node.value = result;
      if (pending.length === 1) {
        const currentFamily = family;
        queueMicrotask(() => {
          currentFamily.pending = [];
          void executeFamily(currentFamily, pending);
        });
      }
    }
    results.push(result);
  }
  return Promise.all(results).then(
    (entries) => entries.map(({ value }) => value) as TResult[],
  );
}

async function executeFamily(
  family: BatchFamily,
  pending: PendingKey[],
): Promise<void> {
  try {
    const keysets = pending.map(({ keyset }) => keyset);
    const results = await family.executor.callback(family.options, keysets);
    if (results.length !== keysets.length) {
      throw new Error(
        `batch callback returned ${results.length} results for ${keysets.length} keysets`,
      );
    }
    for (let i = 0; i < pending.length; i++) {
      pending[i].resolve({ value: results[i] });
    }
  } catch (error) {
    for (const { node, reject } of pending) {
      // A failed batch must be retryable rather than poisoning this scope.
      node.value = undefined;
      reject(error);
    }
  }
}
