import { createHook } from "node:async_hooks";
import { setImmediate } from "node:timers/promises";

import { expect } from "chai";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { it } from "mocha";

import { batchInMeta } from "../dist/batch/batchInMeta.js";
import { getOptionsMatcher } from "../dist/batch/batchOptions.js";
import { isDev } from "../dist/dev.js";
import type { BatchExecutor, ExecutionDetails } from "../dist/index.js";
import {
  constant,
  defineBatchExecutor,
  each,
  flagError,
  grafast,
  invalidateBatchCache,
  lambda,
  makeGrafastSchema,
  Step,
} from "../dist/index.js";

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
      keysetEquality,
      callback,
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
  expect(second[0]).to.equal(sameLookingKeyset);
  expect(second[1]).to.equal(firstKeyset);
  expect(second).to.have.lengthOf(2);
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
    name: "echo",
    keysetEquality: "strict",
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
    name: "duplicate",
    keysetEquality: "strict",
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
      name: "conflict",
      keysetEquality: "strict",
      callback: echoBatch,
    });
    const second = defineBatchExecutor({
      name: "conflict",
      keysetEquality: "strict",
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
  const batches: Array<readonly number[]> = [];
  const schema = makeSchema();
  const meta = {};
  const nested = { id: 1 };
  const executor = defineBatchExecutor({
    name: "records",
    keysetEquality: "strict",
    callback: (
      _options: { prefix: string; nested: object },
      keys: readonly number[],
    ) => {
      batches.push([...keys]);
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
  expect(batches).to.deep.equal([[1, 2], [3], [4]]);
  expect(results).to.deep.equal([[1], [2], [3], [4]]);
});

it("supports omitted options", async () => {
  let calls = 0;
  const schema = makeSchema();
  const meta = {};
  const executor = defineBatchExecutor({
    name: "omitted",
    keysetEquality: "strict",
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

it("distinguishes different prototypes and missing own options", async () => {
  let calls = 0;
  const schema = makeSchema();
  const meta = {};
  const executor = defineBatchExecutor({
    name: "null-prototype",
    keysetEquality: "strict",
    callback: (_options: Record<string, unknown>, keys: readonly number[]) => {
      calls++;
      return keys;
    },
  });
  const options: Record<string, unknown> = Object.create(null);
  options.prefix = "x";
  await Promise.all([
    batchInMeta(schema, meta, executor, [1], options),
    batchInMeta(
      schema,
      meta,
      executor,
      [2],
      Object.assign(Object.create(null), options),
    ),
    batchInMeta(schema, meta, executor, [3], { prefix: "x" }),
    batchInMeta(schema, meta, executor, [4], {
      prefix: "x",
      missing: undefined,
    }),
  ]);
  expect(calls).to.equal(3);
});

if (isDev) {
  it("rejects non-POJO options even with a descriptor", () => {
    const executor = defineBatchExecutor({
      name: "invalid-options",
      keysetEquality: "strict",
      callback: echoBatch,
      optionsMatch: {},
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

it("matches nested option rules and compares unspecified properties strictly", async () => {
  const calls: Array<readonly number[]> = [];
  const schema = makeSchema();
  const meta = {};
  const withClient = () => {};
  const makeOptions = (limit: number, params: number[], tag = "same") => ({
    context: { settings: { limit }, withClient },
    params,
    values: [1, 2],
    tag,
  });
  const executor = defineBatchExecutor({
    name: "nested-rules",
    keysetEquality: "strict",
    callback: (
      _options: ReturnType<typeof makeOptions>,
      keys: readonly number[],
    ) => {
      calls.push(keys);
      return keys;
    },
    optionsMatch: {
      context: { settings: "record", withClient: "strict" },
      params: "tuple",
      values: { length: "strict" },
    },
  });
  await Promise.all([
    batchInMeta(schema, meta, executor, [1], makeOptions(10, [1])),
    batchInMeta(schema, meta, executor, [2], makeOptions(20, [1])),
    batchInMeta(schema, meta, executor, [3], makeOptions(10, [1])),
    batchInMeta(schema, meta, executor, [4], makeOptions(10, [2])),
    batchInMeta(schema, meta, executor, [5], makeOptions(10, [1], "different")),
    batchInMeta(schema, meta, executor, [6], {
      ...makeOptions(10, [1]),
      values: [2, 1],
    }),
  ]);
  expect(calls).to.deep.equal([[1, 3], [2], [4], [5], [6]]);
});

it("matches arrays structurally and class instances by identity", () => {
  const matcher = getOptionsMatcher({
    record: "record",
    nested: { length: "strict" },
  });
  const date = new Date(0);
  const array = [1, 2];
  const options = { record: date, nested: array };
  expect(matcher.matches(options, { record: date, nested: array })).to.equal(
    true,
  );
  expect(
    matcher.matches(options, { record: new Date(1), nested: array }),
  ).to.equal(false);
  expect(matcher.matches(options, { record: date, nested: [1, 2] })).to.equal(
    true,
  );

  const keys: unknown[] = [];
  matcher.appendKeys(options, keys, { symbolOrder: null });
  expect(keys).to.include(date);
  expect(keys).to.include(Array.prototype);
});

it("indexes explicit option rules in declaration order before unspecified keys", () => {
  const matcher = getOptionsMatcher({
    priority: "strict",
    group: { later: "strict", early: "strict" },
    absent: "strict",
  });
  const $$priority = Symbol();
  const $$later = Symbol();
  const $$early = Symbol();
  const $$other = Symbol();
  const $$alpha = Symbol();
  const $$zeta = Symbol();
  const first = {
    zeta: $$zeta,
    group: { early: $$early, other: $$other, later: $$later },
    priority: $$priority,
    alpha: $$alpha,
  };
  const second = {
    alpha: $$alpha,
    priority: $$priority,
    group: { later: $$later, early: $$early, other: $$other },
    zeta: $$zeta,
  };
  const firstKeys: unknown[] = [];
  const secondKeys: unknown[] = [];
  matcher.appendKeys(first, firstKeys, { symbolOrder: null });
  matcher.appendKeys(second, secondKeys, { symbolOrder: null });
  expect(firstKeys.filter((value) => typeof value === "symbol")).to.deep.equal([
    $$priority,
    $$later,
    $$early,
    $$other,
    $$alpha,
    $$zeta,
  ]);
  expect(secondKeys).to.deep.equal(firstKeys);
});

it("indexes option symbols irrespective of order and checks non-enumerable values", async () => {
  const $$a = Symbol("option");
  const $$b = Symbol("option");
  const $$different = Symbol("option");
  const calls: Array<readonly number[]> = [];
  const executor = defineBatchExecutor({
    name: "own-options",
    keysetEquality: "strict",
    callback: (
      _options: Record<PropertyKey, unknown>,
      keys: readonly number[],
    ) => {
      calls.push(keys);
      return keys;
    },
  });
  const meta = {};
  const first = Object.defineProperty({ [$$a]: 1, [$$b]: 2 }, "hidden", {
    value: 1,
  });
  const other = Object.defineProperty({ [$$a]: 1, [$$b]: 2 }, "hidden", {
    value: 2,
  });
  const reordered = Object.defineProperty({ [$$b]: 2, [$$a]: 1 }, "hidden", {
    value: 1,
  });
  const differentSymbol = Object.defineProperty(
    { [$$a]: 1, [$$different]: 2 },
    "hidden",
    { value: 1 },
  );
  await Promise.all([
    batchInMeta(schema, meta, executor, [1], first),
    batchInMeta(schema, meta, executor, [2], other),
    batchInMeta(schema, meta, executor, [3], reordered),
    batchInMeta(schema, meta, executor, [4], differentSymbol),
  ]);
  expect(calls).to.deep.equal([[1, 3], [2], [4]]);
});

it("checks matching rules after finding an options index bucket", async () => {
  const calls: Array<readonly number[]> = [];
  const executor = defineBatchExecutor({
    name: "options-key-collision",
    keysetEquality: "strict",
    callback: (_options: { value: number }, keys: readonly number[]) => {
      calls.push(keys);
      return keys;
    },
  });
  const meta = {};
  const first = { value: NaN };
  const second = { value: NaN };
  await Promise.all([
    batchInMeta(schema, meta, executor, [1], first),
    batchInMeta(schema, meta, executor, [2], second),
    batchInMeta(schema, meta, executor, [3], first),
  ]);
  expect(calls).to.deep.equal([[1, 3], [2]]);
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
      name: "cross-step",
      keysetEquality: "strict",
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
    name: "request-isolation",
    keysetEquality: "strict",
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
    name: "in-flight",
    keysetEquality: "strict",
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
    name: "retry",
    keysetEquality: "strict",
    callback: (_options: undefined, keys: readonly number[]) => {
      attempts++;
      if (attempts === 1) {
        throw new Error("fetch failed");
      }
      return keys;
    },
  });
  const meta = {};
  const failed = await Promise.all([
    batchInMeta(schema, meta, executor, [1]),
    batchInMeta(schema, meta, executor, [1, 2]),
  ]);
  const error = flagError(new Error("fetch failed"));
  expect(failed).to.deep.equal([[error], [error, error]]);
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
    name: "per-key-promises",
    keysetEquality: "strict",
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
    name: "promise-allocation",
    keysetEquality: "strict",
    callback: (_options: undefined, keys: readonly number[]) => keys,
  });
  async function measure(keys: number[]) {
    // Let the caller attach its await before counting promises.
    await Promise.resolve();
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
    try {
      const result = await batchInMeta(schema, meta, executor, keys);
      return { result, promises, meta };
    } finally {
      hook.disable();
    }
  }
  const small = await measure([1]);
  const keys = Array.from({ length: 1000 }, (_, i) => i);
  const large = await measure(keys);
  expect(large.promises).to.equal(small.promises);
  expect(large.result).to.deep.equal(keys);
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

for (const mode of ["tuple", "object"] as const) {
  it(`rejects sparse ${mode} key batches before queuing work`, async () => {
    let calls = 0;
    const executor = defineBatchExecutor({
      name: `sparse-${mode}-key-batch`,
      keysetEquality: mode,
      callback: (_options: undefined, keys: readonly unknown[]) => {
        calls++;
        return keys;
      },
    });
    const key = mode === "tuple" ? [1] : { id: 1 };
    const keys = new Array<unknown>(2);
    keys[1] = key;
    const meta = {};
    const expectedType = mode === "tuple" ? "array" : "object";
    expect(() => batchInMeta(schema, meta, executor, keys)).to.throw(
      `requires ${expectedType} keysets`,
    );
    await Promise.resolve();
    expect(calls).to.equal(0);
    expect(await batchInMeta(schema, meta, executor, [key])).to.deep.equal([
      key,
    ]);
    expect(calls).to.equal(1);
  });
}

it("retries a rejected asynchronous batch and an invalid result count", async () => {
  let attempts = 0;
  const executor = defineBatchExecutor({
    name: "async-retry",
    keysetEquality: "strict",
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
    const results = await Promise.all([
      batchInMeta(schema, meta, executor, [1]),
      batchInMeta(schema, meta, executor, [1, 2]),
    ]);
    const message =
      i === 0
        ? "fetch failed"
        : "batch callback returned 0 results for 2 keysets";
    const error = flagError(new Error(message));
    expect(results).to.deep.equal([[error], [error, error]]);
  }
  expect(await batchInMeta(schema, meta, executor, [2, 1])).to.deep.equal([
    2, 1,
  ]);
  expect(attempts).to.equal(3);
});

it("preserves successful entries when an overlapping batch fails", async () => {
  let release!: () => void;
  const error = new Error("newer batch failed");
  const executor = defineBatchExecutor({
    name: "overlapping-failure",
    keysetEquality: "strict",
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
  const overlapping = batchInMeta(schema, meta, executor, [1, 2]);
  await Promise.resolve();
  release();
  expect(await overlapping).to.deep.equal([1, flagError(error)]);
  expect(await older).to.deep.equal([1]);
  expect(batchInMeta(schema, meta, executor, [1])).to.deep.equal([1]);
});

it("handles a per-key rejection while waiting for an older overlapping batch", async () => {
  const olderStarted = Promise.withResolvers<void>();
  const newerStarted = Promise.withResolvers<void>();
  const olderResult = Promise.withResolvers<readonly number[]>();
  const failedKey = Promise.withResolvers<number>();
  const error = new Error("key in the newer batch failed");
  const calls: (readonly number[])[] = [];
  const executor = defineBatchExecutor<
    undefined,
    number,
    number | Promise<number>
  >({
    name: "overlapping-per-key-rejection",
    keysetEquality: "strict",
    callback: (_options: undefined, keys: readonly number[]) => {
      calls.push(keys);
      if (keys[0] === 1) {
        olderStarted.resolve();
        return olderResult.promise;
      } else {
        newerStarted.resolve();
        failedKey.reject(error);
        return [failedKey.promise];
      }
    },
  });
  class OverlappingBatchStep extends Step<number> {
    isSyncAndSafe = false;

    constructor($key: Step<number>) {
      super();
      this.addDependency($key);
    }

    execute({ values: [key], batch }: ExecutionDetails<readonly [number]>) {
      const values = key.isBatch ? key.entries : [key.value];
      return batch(executor, values);
    }
  }
  const schema = makeGrafastSchema({
    typeDefs: `type Query { older: [Int], overlapping: [Int] }`,
    objects: {
      Query: {
        plans: {
          older: () =>
            each(constant([1]), ($key) => new OverlappingBatchStep($key)),
          overlapping: () =>
            each(constant([1, 2]), ($key) => {
              const $delayedKey = lambda($key, async (key) => {
                await olderStarted.promise;
                return key;
              });
              return new OverlappingBatchStep($delayedKey);
            }),
        },
      },
    },
  });
  let unhandled = false;
  const onUnhandledRejection = (
    _reason: unknown,
    promise: Promise<unknown>,
  ) => {
    if (promise === failedKey.promise) {
      unhandled = true;
    } else {
      throw new Error("Unexpected unhandled promise!");
    }
  };
  process.once("unhandledRejection", onUnhandledRejection);
  try {
    const [result] = await Promise.all([
      grafast({ schema, source: "{ older overlapping }" }),
      (async () => {
        await newerStarted.promise;
        // Give Node a turn to report the rejection before the older batch finishes.
        await setImmediate();
        olderResult.resolve([1]);
      })(),
    ]);
    expect(calls).to.deep.equal([[1], [2]]);
    expect(result)
      .to.have.property("data")
      .that.deep.equals({
        older: [1],
        overlapping: [1, null],
      });
    expect(result).to.have.property("errors").with.lengthOf(1);
    expect(result)
      .to.have.nested.property("errors[0].path")
      .that.deep.equals(["overlapping", 1]);
    expect(unhandled, "the newer key's rejection was unhandled").to.equal(
      false,
    );
  } finally {
    process.off("unhandledRejection", onUnhandledRejection);
  }
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

it("looks up options by identity before comparing and uses each batch's first options", async () => {
  let reads = 0;
  const received: Array<{ group: string }> = [];
  const executor = defineBatchExecutor({
    name: "indexed-options",
    keysetEquality: "strict",
    callback: (options: { group: string }, keys: readonly number[]) => {
      received.push(options);
      return keys;
    },
  });
  const meta = {};
  const first = {
    get group() {
      reads++;
      return "first";
    },
  };
  const second = {
    get group() {
      reads++;
      return "second";
    },
  };
  await batchInMeta(schema, meta, executor, [1], first);
  await batchInMeta(schema, meta, executor, [1], second);
  reads = 0;
  expect(batchInMeta(schema, meta, executor, [1], second)).to.deep.equal([1]);
  expect(reads).to.equal(0);
  const nextBatchOptions = { group: "first" };
  await batchInMeta(schema, meta, executor, [2], nextBatchOptions);
  expect(reads).to.equal(1);
  expect(received).to.have.length(3);
  expect(received[2]).to.equal(nextBatchOptions);
  reads = 0;
  for (let i = 0; i < 100; i++) {
    await batchInMeta(schema, meta, executor, [2], { group: String(i) });
  }
  expect(reads).to.equal(0);
});

it("uses the new batch's ignored options without a merge hook", async () => {
  const hints: string[] = [];
  const executor = defineBatchExecutor({
    name: "ignored-hints",
    keysetEquality: "strict",
    optionsMatch: { hint: "ignore" },
    callback: (options: { hint: string }, keys: readonly number[]) => {
      hints.push(options.hint);
      return keys;
    },
  });
  const scope = {};
  await batchInMeta(schema, scope, executor, [1], { hint: "first" });
  await batchInMeta(schema, scope, executor, [2], { hint: "second" });
  expect(hints).to.deep.equal(["first", "second"]);
});

it("keeps hints from in-flight keys out of the queued batch", async () => {
  const release = Promise.withResolvers<void>();
  let merges = 0;
  const executor = defineBatchExecutor({
    name: "merge-hints",
    keysetEquality: "strict",
    optionsMatch: { hint: "ignore" },
    mergeOptions: (current, incoming) => {
      merges++;
      return current.hint != null ? current : incoming;
    },
    callback: async (
      options: { hint: symbol | undefined },
      keys: readonly number[],
    ) => {
      if (keys.includes(1)) {
        await release.promise;
      }
      return keys.map(() => options.hint);
    },
  });
  const scope = {};
  const hint = Symbol();
  const first = batchInMeta(schema, scope, executor, [1], { hint });
  await Promise.resolve();
  const second = batchInMeta(schema, scope, executor, [2], { hint: undefined });
  const joined = batchInMeta(schema, scope, executor, [1], { hint: Symbol() });
  try {
    expect(await second).to.deep.equal([undefined]);
  } finally {
    release.resolve();
  }
  expect(await first).to.deep.equal([hint]);
  expect(await joined).to.deep.equal([hint]);
  expect(merges).to.equal(0);
});

it("only compares options within the requested executor", async () => {
  const unrelated = defineBatchExecutor({
    name: "unrelated-options",
    keysetEquality: "strict",
    callback: (_options: { unrelated: string }, keys: readonly number[]) =>
      keys,
  });
  const executor = defineBatchExecutor({
    name: "executor-options-index",
    keysetEquality: "strict",
    callback: (_options: { group: string }, keys: readonly number[]) => keys,
  });
  const meta = {};
  await batchInMeta(schema, meta, unrelated, [1], {
    get unrelated(): string {
      throw new Error("Must not compare another executor's options");
    },
  });
  await batchInMeta(schema, meta, executor, [1], { group: "x" });
  expect(
    batchInMeta(schema, meta, executor, [1], { group: "x" }),
  ).to.deep.equal([1]);
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
    const failed = await batchInMeta(schema, meta, executor, original);
    const error = flagError(new Error("retry with equivalent keys"));
    expect(failed).to.deep.equal(original.map(() => error));
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

it("splits tuple prefixes without conflating undefined or losing NaN keys", async () => {
  const calls: Array<readonly (readonly unknown[])[]> = [];
  const executor = defineBatchExecutor({
    name: "tuple-split",
    keysetEquality: "tuple",
    callback: (_options: undefined, keys: readonly (readonly unknown[])[]) => {
      calls.push(keys);
      return keys;
    },
  });
  const meta = {};
  const longer = [NaN, undefined];
  const shorter = [NaN];
  const results = await batchInMeta(schema, meta, executor, [
    longer,
    shorter,
    [...longer],
    [...shorter],
  ]);
  expect(calls).to.deep.equal([[longer, shorter]]);
  expect(results[2]).to.equal(longer);
  expect(results[3]).to.equal(shorter);
});

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

it("invalidates a scope without letting old in-flight results populate its new cache", async () => {
  let release!: () => void;
  let version = 1;
  const executor = defineBatchExecutor({
    name: "generation-invalidation",
    keysetEquality: "strict",
    callback: async (_options: undefined, keys: readonly number[]) => {
      const value = version;
      if (value === 1) {
        await new Promise<void>((resolve) => {
          release = resolve;
        });
      }
      return keys.map(() => value);
    },
  });
  const scope = {};
  const old = batchInMeta(schema, scope, executor, [1]);
  await Promise.resolve();
  invalidateBatchCache(scope);
  version = 2;
  try {
    expect(await batchInMeta(schema, scope, executor, [1])).to.deep.equal([2]);
  } finally {
    release();
  }
  expect(await old).to.deep.equal([1]);
  expect(batchInMeta(schema, scope, executor, [1])).to.deep.equal([2]);
});
