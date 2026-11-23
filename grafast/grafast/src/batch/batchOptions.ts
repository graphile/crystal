import { noop } from "../dev.ts";
import type { BatchExecutor } from "../interfaces.ts";
import { arraysMatch, isPojo } from "../utils.ts";
import type { BatchFamily, BatchOptions } from "./batchInterfaces.ts";
import type { BatchTupleIndex } from "./batchTupleIndex.ts";
import { internBatchTuple } from "./batchTupleIndex.ts";

interface KeyOrder {
  symbolOrder: Map<symbol, number> | null;
}

/** @internal */
interface OptionsMatcher {
  matches(left: unknown, right: unknown): boolean;
  /**
   * Appends this value's components to the flat key used to find candidate
   * batches. Nested matchers append to the same array. The index shares
   * `order` across lookups so symbol keys sort consistently.
   *
   * Values that match must produce the same components under Map equality.
   * Several distinct values can share an index key. `matches` checks the
   * candidates before reusing a batch.
   */
  appendKeys(value: unknown, keys: unknown[], order: KeyOrder): void;
}

const strictMatcher: OptionsMatcher = {
  matches: (left, right) => left === right,
  appendKeys(value, keys) {
    keys.push(value);
  },
};

const ignoreMatcher: OptionsMatcher = {
  matches: () => true,
  appendKeys: noop,
};

const $$scalar = Symbol("non-structural batch option");

const tupleMatcher: OptionsMatcher = {
  matches: (left, right) =>
    left === right ||
    (Array.isArray(left) && Array.isArray(right) && arraysMatch(left, right)),
  appendKeys(value, keys) {
    if (Array.isArray(value)) {
      keys.push(value.length);
      for (let i = 0; i < value.length; i++) {
        keys.push(value[i]);
      }
    } else {
      keys.push($$scalar, value);
    }
  },
};

function assertDeepScalar(value: unknown): void {
  if (
    value != null &&
    (typeof value === "object" || typeof value === "function")
  ) {
    throw new Error(
      'The "deep" batch option rule requires arrays, plain objects, or primitive values.',
    );
  }
}

const deepMatcher: OptionsMatcher = {
  matches(left, right) {
    if (left === right) {
      return true;
    } else if (left == null || right == null || typeof left !== "object") {
      return false;
    } else if (Array.isArray(left)) {
      if (!Array.isArray(right)) {
        return false;
      }
      const l = left.length;
      if (l !== right.length) {
        return false;
      }
      for (let i = 0; i < l; i++) {
        if (!deepMatcher.matches(left[i], right[i])) {
          return false;
        }
      }
      return true;
    } else {
      return deepRecordMatcher.matches(left, right);
    }
  },
  appendKeys(value, keys, order) {
    if (Array.isArray(value)) {
      const l = value.length;
      keys.push(l);
      for (let i = 0; i < l; i++) {
        deepMatcher.appendKeys(value[i], keys, order);
      }
    } else if (isPojo(value)) {
      deepRecordMatcher.appendKeys(value, keys, order);
    } else {
      assertDeepScalar(value);
      keys.push($$scalar, value);
    }
  },
};

function symbolRank(order: Map<symbol, number>, key: symbol): number {
  let rank = order.get(key);
  if (rank === undefined) {
    rank = order.size;
    order.set(key, rank);
  }
  return rank;
}

function compareOptionKeys(
  a: string | symbol,
  z: string | symbol,
  order: KeyOrder,
): number {
  if (typeof a === "string") {
    return typeof z === "string" ? (a < z ? -1 : a === z ? 0 : 1) : -1;
  } else if (typeof z === "string") {
    return 1;
  } else {
    const ranks = (order.symbolOrder ??= new Map());
    return symbolRank(ranks, a) - symbolRank(ranks, z);
  }
}

function isOptionsObject(
  value: unknown,
): value is Record<PropertyKey, unknown> {
  return Array.isArray(value) || isPojo(value);
}

function makeObjectMatcher(
  rules?: Map<PropertyKey, OptionsMatcher>,
  defaultRule = strictMatcher,
): OptionsMatcher {
  return {
    matches(left, right) {
      if (left === right) {
        return true;
      } else if (
        !isOptionsObject(left) ||
        Object.getPrototypeOf(left) !== Object.getPrototypeOf(right)
      ) {
        return false;
      }
      const keys = Reflect.ownKeys(left);
      if (keys.length !== Reflect.ownKeys(right).length) {
        return false;
      }
      for (const key of keys) {
        if (!Object.hasOwn(right, key)) {
          return false;
        }
        const rule = rules?.get(key) ?? defaultRule;
        if (!rule.matches(left[key], right[key])) {
          return false;
        }
      }
      return true;
    },
    appendKeys(value, keys, order) {
      if (!isOptionsObject(value)) {
        keys.push($$scalar, value);
        return;
      }
      const ownKeys = Reflect.ownKeys(value);
      keys.push(Object.getPrototypeOf(value), ownKeys.length);
      if (rules !== undefined) {
        // Explicit rules put the most useful discriminators nearest the root.
        for (const [key, rule] of rules) {
          if (Object.hasOwn(value, key)) {
            keys.push(key);
            rule.appendKeys(value[key], keys, order);
          }
        }
        let remaining = 0;
        for (const key of ownKeys) {
          if (!rules.has(key)) {
            ownKeys[remaining++] = key;
          }
        }
        ownKeys.length = remaining;
      }
      if (ownKeys.length > 1) {
        ownKeys.sort((a, z) => compareOptionKeys(a, z, order));
      }
      if (defaultRule === strictMatcher) {
        for (const key of ownKeys) {
          keys.push(key, value[key]);
        }
      } else {
        for (const key of ownKeys) {
          keys.push(key);
          defaultRule.appendKeys(value[key], keys, order);
        }
      }
    },
  };
}

const recordMatcher = makeObjectMatcher();
const deepRecordMatcher = makeObjectMatcher(undefined, deepMatcher);

interface OptionsMatchDescriptor {
  readonly [key: PropertyKey]:
    | "strict"
    | "ignore"
    | "tuple"
    | "deep"
    | "record"
    | OptionsMatchDescriptor
    | undefined;
}

function compileOptionsMatch(
  descriptor: OptionsMatchDescriptor,
): OptionsMatcher {
  const rules = new Map<PropertyKey, OptionsMatcher>();
  for (const key of Reflect.ownKeys(descriptor)) {
    const rule = descriptor[key];
    if (rule === "tuple") {
      rules.set(key, tupleMatcher);
    } else if (rule === "deep") {
      rules.set(key, deepMatcher);
    } else if (rule === "record") {
      rules.set(key, recordMatcher);
    } else if (rule === "strict") {
      rules.set(key, strictMatcher);
    } else if (rule === "ignore") {
      rules.set(key, ignoreMatcher);
    } else if (isPojo(rule)) {
      rules.set(key, compileOptionsMatch(rule));
    } else if (rule !== undefined) {
      throw new Error(`Invalid batch optionsMatch rule for '${String(key)}'`);
    }
  }
  return rules.size === 0 ? recordMatcher : makeObjectMatcher(rules);
}

const compiled = new WeakMap<OptionsMatchDescriptor, OptionsMatcher>();

/** @internal */
export function getOptionsMatcher(
  descriptor: OptionsMatchDescriptor | undefined,
): OptionsMatcher {
  if (descriptor === undefined) {
    return recordMatcher;
  }
  let matcher = compiled.get(descriptor);
  if (matcher === undefined) {
    matcher = compileOptionsMatch(descriptor);
    compiled.set(descriptor, matcher);
  }
  return matcher;
}

interface OptionsIndex<TOptions, TEntry> extends KeyOrder {
  byIdentity: Map<TOptions, TEntry>;
  keys: BatchTupleIndex<readonly unknown[]>;
  byKeys: Map<readonly unknown[], TEntry | TEntry[]>;
}

/**
 * The index only narrows the search: the matcher decides whether to merge.
 *
 * @internal
 */
export class BatchOptionsIndex<
  TOptions extends BatchOptions,
  TKeyset,
  TResult,
> {
  private first: BatchFamily<TOptions, TKeyset, TResult> | null = null;
  private index: OptionsIndex<
    TOptions,
    BatchFamily<TOptions, TKeyset, TResult>
  > | null = null;
  private readonly executor: BatchExecutor<TOptions, TKeyset, TResult>;
  private readonly matcher: OptionsMatcher;

  constructor(executor: BatchExecutor<TOptions, TKeyset, TResult>) {
    this.executor = executor;
    this.matcher = getOptionsMatcher(executor.optionsMatch);
  }

  private createFamily(
    options: TOptions,
  ): BatchFamily<TOptions, TKeyset, TResult> {
    return {
      executor: this.executor,
      options,
      queued: null,

      cache: new Map(),
      pending: new Map(),
      tupleKeyIndex: null,
      objectKeyIndexes: null,
    };
  }

  getOrCreate(options: TOptions): BatchFamily<TOptions, TKeyset, TResult> {
    const first = this.first;
    if (first === null) {
      return (this.first = this.createFamily(options));
    }

    let index = this.index;
    if (index === null) {
      if (this.matcher.matches(first.options, options)) {
        return first;
      }
      // Most executors have just one family. Build the index on the first miss.
      index = {
        symbolOrder: null,
        byIdentity: new Map(),
        keys: new Map(),
        byKeys: new Map(),
      };
      const firstKey = this.getKey(index, first.options);
      index.byIdentity.set(first.options, first);
      index.byKeys.set(firstKey, first);
      this.index = index;
    }

    const identical = index.byIdentity.get(options);
    if (identical !== undefined) {
      return identical;
    }
    const key = this.getKey(index, options);
    const bucket = index.byKeys.get(key);
    if (Array.isArray(bucket)) {
      for (const entry of bucket) {
        if (this.matcher.matches(entry.options, options)) {
          return entry;
        }
      }
    } else if (
      bucket !== undefined &&
      this.matcher.matches(bucket.options, options)
    ) {
      return bucket;
    }
    const entry = this.createFamily(options);
    index.byIdentity.set(options, entry);
    if (Array.isArray(bucket)) {
      bucket.push(entry);
    } else {
      index.byKeys.set(key, bucket === undefined ? entry : [bucket, entry]);
    }
    return entry;
  }

  private getKey(
    index: OptionsIndex<TOptions, BatchFamily<TOptions, TKeyset, TResult>>,
    options: TOptions,
  ) {
    const keys: unknown[] = [];
    this.matcher.appendKeys(options, keys, index);
    return internBatchTuple(index.keys, keys);
  }
}
