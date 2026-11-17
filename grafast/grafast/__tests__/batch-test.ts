import { expect } from "chai";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { it } from "mocha";

import { batchInMeta, defineBatchExecutor } from "../dist/batch.js";
import { isDev } from "../dist/dev.js";

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
  Map<string, ReturnType<typeof defineBatchExecutor>>
>();

// Retain the existing test matrix with stable executors for each equality mode.
function batch(
  meta: Record<PropertyKey, unknown>,
  callback: typeof echoBatch,
  unaryDependencies: readonly unknown[],
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
  return batchInMeta(schema, meta, executor, unaryDependencies, keysets);
}

let callbackCount = 0;

function echoBatch(
  _unaryDependencies: readonly unknown[],
  keysets: readonly unknown[],
) {
  callbackCount++;
  return keysets;
}

function alternateEchoBatch(
  _unaryDependencies: readonly unknown[],
  keysets: readonly unknown[],
) {
  callbackCount++;
  return keysets;
}

it("batches tuple keysets and maps duplicate results to each caller", async () => {
  callbackCount = 0;
  const meta = {};
  const unaryDependencies = ["owners"] as const;
  const [first, second] = await Promise.all([
    batch(
      meta,
      echoBatch,
      unaryDependencies,
      [
        [1, 2],
        [1, 2],
      ],
      "tuple",
    ),
    batch(meta, echoBatch, unaryDependencies, [[1, 2], [3]], "tuple"),
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
  const unaryDependencies = ["owners"] as const;
  const [first, second] = await Promise.all([
    batch(
      meta,
      echoBatch,
      unaryDependencies,
      [{ personId: 1, organizationId: null }],
      "object",
    ),
    batch(
      meta,
      echoBatch,
      unaryDependencies,
      [{ organizationId: null, personId: 1 }],
      "object",
    ),
  ]);

  expect(callbackCount).to.equal(1);
  expect(first).to.deep.equal([{ personId: 1, organizationId: null }]);
  expect(second).to.deep.equal([{ organizationId: null, personId: 1 }]);
});

it("matches callback and unary dependencies by identity", async () => {
  callbackCount = 0;
  const meta = {};
  const firstKeyset = { id: 1 };
  const sameLookingKeyset = { id: 1 };
  const firstDependencies = [{ context: "one" }] as const;
  const sameLookingDependencies = [{ context: "one" }] as const;
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
  expect(await batchInMeta(firstSchema, {}, first, [], [1])).to.deep.equal([1]);
  expect(await batchInMeta(firstSchema, {}, first, [], [2])).to.deep.equal([2]);
  expect(await batchInMeta(makeSchema(), {}, second, [], [3])).to.deep.equal([
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
  await batchInMeta(schema, {}, first, [], []);
  if (isDev) {
    expect(() => batchInMeta(schema, {}, second, [], [])).to.throw(
      "multiple definitions",
    );
    expect(() => batchInMeta(schema, {}, second, [], [])).to.throw(
      "multiple definitions",
    );
  } else {
    const warnings: unknown[][] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnings.push(args);
    };
    try {
      await batchInMeta(schema, {}, second, [], []);
      await batchInMeta(schema, {}, second, [], []);
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
      callback: (_deps: readonly unknown[], keys: readonly unknown[]) =>
        keys.map(() => "other"),
    });
    const originalWarn = console.warn;
    console.warn = () => {};
    try {
      const results = await Promise.all([
        batchInMeta(schema, meta, first, [], [1]),
        batchInMeta(schema, meta, second, [], [1]),
      ]);
      expect(results).to.deep.equal([[1], ["other"]]);
    } finally {
      console.warn = originalWarn;
    }
  });
}
