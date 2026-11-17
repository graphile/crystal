import { createHook } from "node:async_hooks";

import { expect } from "chai";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { it } from "mocha";

import { batchInMeta, defineBatchExecutor } from "../dist/batch.js";
import { isDev } from "../dist/dev.js";
import type { BatchExecutor, ExecutionDetails } from "../dist/index.js";
import { grafast, makeGrafastSchema, Step } from "../dist/index.js";

function makeSchema() {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      fields: { value: { type: GraphQLString } },
    }),
  });
}

const schema = makeSchema();
const executors = new Map<
  typeof echoBatch,
  Map<
    string,
    BatchExecutor<Record<string, unknown> | undefined, unknown, unknown>
  >
>();

// Retain the existing test matrix with stable executors for each equality mode.
function batch(
  meta: Record<PropertyKey, unknown>,
  callback: typeof echoBatch,
  options: Record<string, unknown> | undefined,
  keysets: readonly unknown[],
  keysetEquality: "strict" | "tuple" | "object" = "strict",
) {
  let byMode = executors.get(callback);
  if (byMode === undefined) {
    byMode = new Map();
    executors.set(callback, byMode);
  }
  let executor = byMode.get(keysetEquality);
  if (executor === undefined) {
    executor = defineBatchExecutor({
      name: `${callback.name}/${keysetEquality}`,
      callback,
      keysetEquality,
    });
    byMode.set(keysetEquality, executor);
  }
  return batchInMeta(schema, meta, executor, keysets, options);
}

let callbackCount = 0;

function echoBatch(
  _options: Record<string, unknown> | undefined,
  keysets: readonly unknown[],
) {
  callbackCount++;
  return keysets;
}

function alternateEchoBatch(
  _options: Record<string, unknown> | undefined,
  keysets: readonly unknown[],
) {
  callbackCount++;
  return keysets;
}

it("batches tuple keysets and maps duplicate results to each caller", async () => {
  callbackCount = 0;
  const meta = {};
  const options = { resource: "owners" };
  const [first, second] = await Promise.all([
    batch(
      meta,
      echoBatch,
      options,
      [
        [1, 2],
        [1, 2],
      ],
      "tuple",
    ),
    batch(meta, echoBatch, options, [[1, 2], [3]], "tuple"),
  ]);

  expect(callbackCount).to.equal(1);
  expect(first).to.deep.equal([
    [1, 2],
    [1, 2],
  ]);
  expect(second).to.deep.equal([[1, 2], [3]]);
});

it("compares object keysets without depending on key order", async () => {
  callbackCount = 0;
  const meta = {};
  const options = { resource: "owners" };
  const [first, second] = await Promise.all([
    batch(
      meta,
      echoBatch,
      options,
      [{ personId: 1, organizationId: null }],
      "object",
    ),
    batch(
      meta,
      echoBatch,
      options,
      [{ organizationId: null, personId: 1 }],
      "object",
    ),
  ]);

  expect(callbackCount).to.equal(1);
  expect(first).to.deep.equal([{ personId: 1, organizationId: null }]);
  expect(second).to.deep.equal([{ organizationId: null, personId: 1 }]);
});

it("matches executors by identity and options shallowly", async () => {
  callbackCount = 0;
  const meta = {};
  const firstKeyset = { id: 1 };
  const sameLookingKeyset = { id: 1 };
  const firstDependencies = { context: { name: "one" } };
  const sameLookingDependencies = { context: { name: "one" } };
  const [first, second, third, fourth, fifth] = await Promise.all([
    batch(meta, echoBatch, firstDependencies, [firstKeyset, firstKeyset]),
    batch(meta, echoBatch, firstDependencies, [sameLookingKeyset, firstKeyset]),
    batch(meta, echoBatch, sameLookingDependencies, [firstKeyset]),
    batch(meta, alternateEchoBatch, firstDependencies, [firstKeyset]),
    batch(meta, echoBatch, firstDependencies, [[1]], "tuple"),
  ]);

  expect(callbackCount).to.equal(4);
  expect(first).to.deep.equal([firstKeyset, firstKeyset]);
  expect(second).to.deep.equal([sameLookingKeyset, firstKeyset]);
  expect(third).to.deep.equal([firstKeyset]);
  expect(fourth).to.deep.equal([firstKeyset]);
  expect(fifth).to.deep.equal([[1]]);
});

it("accepts a stable executor and isolates registrations by schema", async () => {
  const firstSchema = makeSchema();
  const first = defineBatchExecutor({
    name: "echo",
    keysetEquality: "strict",
    callback: echoBatch,
  });
  const second = defineBatchExecutor({
    keysetEquality: "strict",
    name: "echo",
    callback: alternateEchoBatch,
  });
  expect(await batchInMeta(firstSchema, {}, first, [1], {})).to.deep.equal([1]);
  expect(await batchInMeta(firstSchema, {}, first, [2], {})).to.deep.equal([2]);
  expect(await batchInMeta(makeSchema(), {}, second, [3], {})).to.deep.equal([
    3,
  ]);
});

it("detects duplicate names even for empty batches", async () => {
  const schema = makeSchema();
  const first = defineBatchExecutor({
    name: "duplicate",
    keysetEquality: "strict",
    callback: echoBatch,
  });
  const second = defineBatchExecutor({
    keysetEquality: "strict",
    name: "duplicate",
    callback: echoBatch,
  });
  await batchInMeta(schema, {}, first, [], {});
  if (isDev) {
    expect(() => batchInMeta(schema, {}, second, [], {})).to.throw(
      "multiple definitions",
    );
    expect(() => batchInMeta(schema, {}, second, [], {})).to.throw(
      "multiple definitions",
    );
  } else {
    const warnings: unknown[][] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnings.push(args);
    };
    try {
      await batchInMeta(schema, {}, second, [], {});
      await batchInMeta(schema, {}, second, [], {});
      expect(warnings).to.have.length(1);
      expect(warnings[0][0]).to.contain("multiple definitions");
    } finally {
      console.warn = originalWarn;
    }
  }
});

if (!isDev) {
  it("keeps conflicting executor identities in separate batches in production", async () => {
    const schema = makeSchema();
    const meta = {};
    const first = defineBatchExecutor({
      keysetEquality: "strict",
      name: "conflict",
      callback: echoBatch,
    });
    const second = defineBatchExecutor({
      keysetEquality: "strict",
      name: "conflict",
      callback: (
        _options: Record<string, unknown> | undefined,
        keys: readonly unknown[],
      ) => keys.map(() => "other"),
    });
    const originalWarn = console.warn;
    console.warn = () => {};
    try {
      const results = await Promise.all([
        batchInMeta(schema, meta, first, [1], {}),
        batchInMeta(schema, meta, second, [1], {}),
      ]);
      expect(results).to.deep.equal([[1], ["other"]]);
    } finally {
      console.warn = originalWarn;
    }
  });
}

it("matches POJO options shallowly and ignores property order", async () => {
  let calls = 0;
  const schema = makeSchema();
  const meta = {};
  const nested = { id: 1 };
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "records",
    callback: (
      _options: { prefix: string; nested: object },
      keys: readonly number[],
    ) => {
      calls++;
      return keys;
    },
  });
  const results = await Promise.all([
    batchInMeta(schema, meta, executor, [1], { prefix: "x", nested }),
    batchInMeta(schema, meta, executor, [2], { nested, prefix: "x" }),
    batchInMeta(schema, meta, executor, [3], {
      prefix: "x",
      nested: { id: 1 },
    }),
    batchInMeta(schema, meta, executor, [4], { prefix: "y", nested }),
  ]);
  expect(calls).to.equal(3);
  expect(results).to.deep.equal([[1], [2], [3], [4]]);
});

it("supports omitted options", async () => {
  let calls = 0;
  const schema = makeSchema();
  const meta = {};
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "omitted",
    callback: (
      options: { prefix: string } | undefined,
      keys: readonly number[],
    ) => {
      calls++;
      return keys.map((key) => `${options?.prefix}:${key}`);
    },
  });
  const results = await Promise.all([
    batchInMeta(schema, meta, executor, [1]),
    batchInMeta(schema, meta, executor, [2], undefined),
    batchInMeta(schema, meta, executor, [3], { prefix: "x" }),
    batchInMeta(schema, meta, executor, [4], { prefix: "x" }),
  ]);
  expect(calls).to.equal(2);
  expect(results).to.deep.equal([
    ["undefined:1"],
    ["undefined:2"],
    ["x:3"],
    ["x:4"],
  ]);
});

it("matches records with null prototypes and undefined properties", async () => {
  let calls = 0;
  const schema = makeSchema();
  const meta = {};
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "null-prototype",
    callback: (_options: Record<string, unknown>, keys: readonly number[]) => {
      calls++;
      return keys;
    },
  });
  const options: Record<string, unknown> = Object.create(null);
  options.prefix = "x";
  await Promise.all([
    batchInMeta(schema, meta, executor, [1], options),
    batchInMeta(schema, meta, executor, [2], {
      prefix: "x",
      missing: undefined,
    }),
  ]);
  expect(calls).to.equal(1);
});

if (isDev) {
  it("rejects non-POJO options even with a custom matcher", () => {
    const executor = defineBatchExecutor({
      keysetEquality: "strict",
      name: "invalid-options",
      callback: echoBatch,
      optionsMatch: () => true,
    });
    const schema = makeSchema();
    for (const invalid of [[], null, "x", 1, new Date()]) {
      expect(() =>
        batchInMeta(
          schema,
          {},
          executor,
          [],
          invalid as unknown as Record<string, unknown>,
        ),
      ).to.throw("plain object");
    }
  });
}

it("allows optionsMatch to compare selected fields within POJO options", async () => {
  let calls = 0;
  const schema = makeSchema();
  const meta = {};
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "custom",
    optionsMatch: (left: { date: Date }, right: { date: Date }) =>
      left.date.getTime() === right.date.getTime(),
    callback: (options: { date: Date }, keys: readonly number[]) => {
      calls++;
      return keys.map((key) => options.date.getTime() + key);
    },
  });
  const results = await Promise.all([
    batchInMeta(schema, meta, executor, [1], { date: new Date(100) }),
    batchInMeta(schema, meta, executor, [2], { date: new Date(100) }),
    batchInMeta(schema, meta, executor, [3], { date: new Date(200) }),
  ]);
  expect(calls).to.equal(2);
  expect(results).to.deep.equal([[101], [102], [203]]);
});

class BatchScopeStep extends Step<string> {
  isSyncAndSafe = false;

  private executor: BatchExecutor<{ prefix: string }, string, string>;
  private key: string;

  constructor(
    executor: BatchExecutor<{ prefix: string }, string, string>,
    key: string,
    metaKey?: symbol,
  ) {
    super();
    this.executor = executor;
    this.key = key;
    this.metaKey = metaKey;
  }

  deduplicate() {
    return [];
  }

  execute(details: ExecutionDetails) {
    const originalMeta = details.extra.meta;
    const result = details.batch(
      this.executor,
      details.indexMap(() => this.key),
      { prefix: "value:" },
    );
    // Using batch must not create or replace a step's metadata.
    expect(details.extra.meta).to.equal(originalMeta);
    return result;
  }
}

function makeBatchScopeSchema(
  executor: BatchExecutor<{ prefix: string }, string, string>,
  metaKeys: readonly (symbol | undefined)[],
) {
  return makeGrafastSchema({
    typeDefs: `type Query { first: String, second: String }`,
    objects: {
      Query: {
        plans: {
          first: () => new BatchScopeStep(executor, "first", metaKeys[0]),
          second: () => new BatchScopeStep(executor, "second", metaKeys[1]),
        },
      },
    },
  });
}

for (const withMetaKeys of [false, true]) {
  it(`batches across steps ${withMetaKeys ? "with different meta keys" : "without meta keys"}`, async () => {
    const calls: (readonly string[])[] = [];
    const executor = defineBatchExecutor({
      keysetEquality: "strict",
      name: "cross-step",
      callback: ({ prefix }: { prefix: string }, keys: readonly string[]) => {
        calls.push(keys);
        return keys.map((key) => prefix + key);
      },
    });
    const schema = makeBatchScopeSchema(
      executor,
      withMetaKeys ? [Symbol(), Symbol()] : [],
    );
    const result = await grafast({ schema, source: "{ first second }" });
    expect(result).not.to.have.property("errors");
    expect(result)
      .to.have.property("data")
      .that.deep.equals({ first: "value:first", second: "value:second" });
    expect(calls).to.have.length(1);
    expect(calls[0]).to.have.members(["first", "second"]);
  });
}

it("does not batch across concurrent executions of the same schema without meta keys", async () => {
  const calls: (readonly string[])[] = [];
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "request-isolation",
    callback: ({ prefix }: { prefix: string }, keys: readonly string[]) => {
      calls.push(keys);
      return keys.map((key) => prefix + key);
    },
  });
  const schema = makeBatchScopeSchema(executor, []);
  const results = await Promise.all([
    grafast({ schema, source: "{ first second }" }),
    grafast({ schema, source: "{ first second }" }),
  ]);
  for (const result of results) {
    expect(result).not.to.have.property("errors");
    expect(result)
      .to.have.property("data")
      .that.deep.equals({ first: "value:first", second: "value:second" });
  }
  expect(calls).to.have.length(2);
  for (const call of calls) {
    expect(call).to.have.members(["first", "second"]);
  }
});

for (const mode of ["strict", "tuple", "object"] as const) {
  it(`caches ${mode} keys across calls and isolates options and scopes`, async () => {
    const calls: unknown[][] = [];
    const executor = defineBatchExecutor({
      name: `cache/${mode}`,
      keysetEquality: mode,
      callback: (_options: { prefix: string }, keys: readonly unknown[]) => {
        calls.push([...keys]);
        return keys.map(() => undefined);
      },
    });
    const key = (n: number) =>
      mode === "strict" ? n : mode === "tuple" ? [n] : { n };
    const meta = {};
    const options = { prefix: "a" };
    expect(
      await batchInMeta(schema, meta, executor, [key(1), key(1)], options),
    ).to.deep.equal([undefined, undefined]);
    expect(
      await batchInMeta(schema, meta, executor, [key(1), key(2), key(2)], {
        ...options,
      }),
    ).to.deep.equal([undefined, undefined, undefined]);
    expect(calls.map((keys) => keys.length)).to.deep.equal([1, 1]);
    await batchInMeta(schema, meta, executor, [key(1)], { prefix: "b" });
    await batchInMeta(schema, {}, executor, [key(1)], options);
    expect(calls.map((keys) => keys.length)).to.deep.equal([1, 1, 1, 1]);
  });
}

it("shares in-flight keys with calls arriving after dispatch", async () => {
  const calls: number[][] = [];
  const releases: Array<() => void> = [];
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "in-flight",
    callback: async (_options: undefined, keys: readonly number[]) => {
      calls.push([...keys]);
      await new Promise<void>((resolve) => releases.push(resolve));
      return keys.map((key) => key * 10);
    },
  });
  const meta = {};
  const first = batchInMeta(schema, meta, executor, [1, 1]);
  await Promise.resolve();
  const second = batchInMeta(schema, meta, executor, [1, 2, 2]);
  await Promise.resolve();
  expect(calls).to.deep.equal([[1], [2]]);
  for (const release of releases) {
    release();
  }
  expect(await first).to.deep.equal([10, 10]);
  expect(await second).to.deep.equal([10, 20, 20]);
  expect(await batchInMeta(schema, meta, executor, [2, 1])).to.deep.equal([
    20, 10,
  ]);
  expect(calls).to.have.length(2);
});

it("evicts failed batches so their keys can be retried", async () => {
  let attempts = 0;
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "retry",
    callback: (_options: undefined, keys: readonly number[]) => {
      attempts++;
      if (attempts === 1) {
        throw new Error("fetch failed");
      }
      return keys;
    },
  });
  const meta = {};
  const failed = await Promise.allSettled([
    batchInMeta(schema, meta, executor, [1]),
    batchInMeta(schema, meta, executor, [1, 2]),
  ]);
  expect(failed.map((result) => result.status)).to.deep.equal([
    "rejected",
    "rejected",
  ]);
  expect(await batchInMeta(schema, meta, executor, [2, 1])).to.deep.equal([
    2, 1,
  ]);
  expect(attempts).to.equal(2);
});

it("preserves per-key promises rather than rejecting an entire batch", async () => {
  const error = new Error("one key failed");
  const rejected = Promise.reject(error);
  void rejected.catch(() => {});
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "per-key-promises",
    callback: (_options: undefined, keys: readonly number[]) =>
      keys.map((key) => (key === 1 ? rejected : Promise.resolve(key))),
  });
  const meta = {};
  const results = await batchInMeta(schema, meta, executor, [1, 2]);
  expect(results[0]).to.equal(rejected);
  expect(await results[1]).to.equal(2);
  const cached = await batchInMeta(schema, meta, executor, [1]);
  expect(cached[0]).to.equal(rejected);
});

it("allocates promises per batch rather than per key and returns cache hits synchronously", async () => {
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "promise-allocation",
    callback: (_options: undefined, keys: readonly number[]) => keys,
  });
  function measure(keys: number[]) {
    const meta = {};
    let promises = 0;
    const hook = createHook({
      init(_id, type) {
        if (type === "PROMISE") {
          promises++;
        }
      },
    });
    hook.enable();
    let result;
    try {
      result = batchInMeta(schema, meta, executor, keys);
    } finally {
      hook.disable();
    }
    return { result, promises, meta };
  }
  const small = measure([1]);
  const keys = Array.from({ length: 1000 }, (_, i) => i);
  const large = measure(keys);
  expect(large.promises).to.equal(small.promises);
  await small.result;
  expect(await large.result).to.deep.equal(keys);
  const cached = batchInMeta(schema, large.meta, executor, keys);
  expect(Array.isArray(cached)).to.equal(true);
  expect(cached).to.deep.equal(keys);
});

it("validates all composite keys before queuing work", async () => {
  let calls = 0;
  const executor = defineBatchExecutor({
    name: "invalid-key",
    keysetEquality: "tuple",
    callback: (_options: undefined, keys: readonly unknown[]) => {
      calls++;
      return keys;
    },
  });
  const meta = {};
  expect(() => batchInMeta(schema, meta, executor, [[1], null])).to.throw(
    "requires array keysets",
  );
  await Promise.resolve();
  expect(calls).to.equal(0);
  expect(await batchInMeta(schema, meta, executor, [[1]])).to.deep.equal([[1]]);
  expect(calls).to.equal(1);
});

it("retries a rejected asynchronous batch and an invalid result count", async () => {
  let attempts = 0;
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "async-retry",
    callback: async (_options: undefined, keys: readonly number[]) => {
      attempts++;
      if (attempts === 1) {
        throw new Error("fetch failed");
      } else if (attempts === 2) {
        return [];
      } else {
        return keys;
      }
    },
  });
  const meta = {};
  for (let i = 0; i < 2; i++) {
    const results = await Promise.allSettled([
      batchInMeta(schema, meta, executor, [1]),
      batchInMeta(schema, meta, executor, [1, 2]),
    ]);
    expect(results.map((result) => result.status)).to.deep.equal([
      "rejected",
      "rejected",
    ]);
  }
  expect(await batchInMeta(schema, meta, executor, [2, 1])).to.deep.equal([
    2, 1,
  ]);
  expect(attempts).to.equal(3);
});

it("observes a failed newer batch while an older batch is still in flight", async () => {
  let release!: () => void;
  const error = new Error("newer batch failed");
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "overlapping-failure",
    callback: async (_options: undefined, keys: readonly number[]) => {
      if (keys[0] === 1) {
        await new Promise<void>((resolve) => {
          release = resolve;
        });
        return keys;
      } else {
        throw error;
      }
    },
  });
  const meta = {};
  const older = batchInMeta(schema, meta, executor, [1]);
  await Promise.resolve();
  try {
    const overlapping = await Promise.allSettled([
      batchInMeta(schema, meta, executor, [1, 2]),
    ]);
    expect(overlapping).to.deep.equal([{ status: "rejected", reason: error }]);
  } finally {
    release();
    await older;
  }
  expect(batchInMeta(schema, meta, executor, [1])).to.deep.equal([1]);
});

it("defineBatchExecutor returns the supplied executor unchanged", () => {
  const executor = {
    name: "identity",
    keysetEquality: "strict" as const,
    callback: echoBatch,
    getInfo: () => "info",
  };
  expect(defineBatchExecutor(executor)).to.equal(executor);
});

it("looks up options by identity before comparing and retains canonical options", async () => {
  let comparisons = 0;
  const received: Array<{ group: string }> = [];
  const executor = defineBatchExecutor({
    name: "indexed-options",
    keysetEquality: "strict",
    optionsMatch: (left, right) => {
      comparisons++;
      return left.group === right.group;
    },
    callback: (options: { group: string }, keys: readonly number[]) => {
      received.push(options);
      return keys;
    },
  });
  const meta = {};
  const first = { group: "first" };
  const second = { group: "second" };
  await batchInMeta(schema, meta, executor, [1], first);
  await batchInMeta(schema, meta, executor, [1], second);
  comparisons = 0;
  expect(batchInMeta(schema, meta, executor, [1], second)).to.deep.equal([1]);
  expect(comparisons).to.equal(0);
  await batchInMeta(schema, meta, executor, [2], { group: "first" });
  expect(comparisons).to.equal(1);
  expect(received).to.have.length(3);
  expect(received[2]).to.equal(first);
  // An equivalent options object must not add an alias to the map.
  comparisons = 0;
  await batchInMeta(schema, meta, executor, [2], { group: "new" });
  expect(comparisons).to.equal(2);
});

it("only compares options within the requested executor", async () => {
  let comparisons = 0;
  const unrelated = defineBatchExecutor({
    name: "unrelated-options",
    keysetEquality: "strict",
    callback: (_options: { unrelated: string }, keys: readonly number[]) =>
      keys,
    optionsMatch: () => {
      throw new Error("Must not compare another executor's options");
    },
  });
  const executor = defineBatchExecutor({
    name: "executor-options-index",
    keysetEquality: "strict",
    callback: (_options: { group: string }, keys: readonly number[]) => keys,
    optionsMatch: (left, right) => {
      comparisons++;
      return left.group === right.group;
    },
  });
  const meta = {};
  await batchInMeta(schema, meta, unrelated, [1], { unrelated: "x" });
  await batchInMeta(schema, meta, executor, [1], { group: "x" });
  expect(comparisons).to.equal(0);
  expect(
    batchInMeta(schema, meta, executor, [1], { group: "x" }),
  ).to.deep.equal([1]);
  expect(comparisons).to.equal(1);
});

for (const mode of ["tuple", "object"] as const) {
  it(`retains canonical ${mode} specifiers at empty and prefix trie paths`, async () => {
    const makeKeys = () =>
      mode === "tuple"
        ? [[], [1], [1, 2], [1, 2, 3]]
        : [{}, { a: 1 }, { a: 1, b: 2 }, { a: 1, b: 2, c: 3 }];
    type Keyset = ReturnType<typeof makeKeys>[number];
    const received: Array<readonly Keyset[]> = [];
    let attempts = 0;
    const executor = defineBatchExecutor({
      name: `canonical-keysets/${mode}`,
      keysetEquality: mode,
      callback: (_options: undefined, keys: readonly Keyset[]) => {
        received.push(keys);
        attempts++;
        if (attempts === 1) {
          throw new Error("retry with equivalent keys");
        }
        return keys;
      },
    });
    const meta = {};
    const original = makeKeys();
    const failed = await Promise.allSettled([
      batchInMeta(schema, meta, executor, original),
    ]);
    expect(failed[0].status).to.equal("rejected");
    const equivalent = makeKeys();
    const results = await batchInMeta(schema, meta, executor, [
      ...equivalent,
      ...equivalent,
    ]);
    expect(received[1]).to.have.length(original.length);
    for (let i = 0; i < original.length; i++) {
      expect(received[1][i]).to.equal(original[i]);
      expect(results[i]).to.equal(original[i]);
      expect(results[i + original.length]).to.equal(original[i]);
    }
    const cached = batchInMeta(schema, meta, executor, makeKeys());
    expect(Array.isArray(cached)).to.equal(true);
    expect(cached).to.deep.equal(original);
    expect(attempts).to.equal(2);
  });
}

it("keeps record shapes separate even when their value paths match", async () => {
  const received: Array<readonly Record<string, unknown>[]> = [];
  const executor = defineBatchExecutor({
    name: "record-shapes",
    keysetEquality: "object",
    callback: (
      _options: undefined,
      keys: readonly Record<string, unknown>[],
    ) => {
      received.push(keys);
      return keys;
    },
  });
  const meta = {};
  const first = { a: 1, b: 2 };
  const reordered = { b: 2, a: 1 };
  const otherNames = { c: 1, d: 2 };
  const specialName = { 'a","b': 1 };
  const empty = {};
  const undefinedValue = { a: undefined };
  const originals = [first, otherNames, specialName, empty, undefinedValue];
  const results = await batchInMeta(schema, meta, executor, [
    first,
    reordered,
    otherNames,
    specialName,
    empty,
    undefinedValue,
  ]);
  expect(received).to.deep.equal([originals]);
  expect(results[0]).to.equal(first);
  expect(results[1]).to.equal(first);
  const cached = batchInMeta(schema, meta, executor, [
    reordered,
    { c: 1, d: 2 },
    { 'a","b': 1 },
    {},
    { a: undefined },
  ]);
  expect(Array.isArray(cached)).to.equal(true);
  expect(cached).to.deep.equal(originals);
  expect(received).to.have.length(1);
});
