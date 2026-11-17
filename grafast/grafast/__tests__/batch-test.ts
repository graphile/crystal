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
    ReturnType<
      typeof defineBatchExecutor<
        Record<string, unknown> | undefined,
        unknown,
        unknown
      >
    >
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
  if (byMode == null) {
    byMode = new Map();
    executors.set(callback, byMode);
  }
  let executor = byMode.get(keysetEquality);
  if (executor == null) {
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
  const first = defineBatchExecutor({ name: "echo", callback: echoBatch });
  const second = defineBatchExecutor({
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
  const first = defineBatchExecutor({ name: "duplicate", callback: echoBatch });
  const second = defineBatchExecutor({
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
      name: "conflict",
      callback: echoBatch,
    });
    const second = defineBatchExecutor({
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
