import { expect } from "chai";
import { it } from "mocha";

import { batchInMeta } from "../dist/batch.js";

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
    batchInMeta(
      meta,
      echoBatch,
      unaryDependencies,
      [
        [1, 2],
        [1, 2],
      ],
      "tuple",
    ),
    batchInMeta(meta, echoBatch, unaryDependencies, [[1, 2], [3]], "tuple"),
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
    batchInMeta(
      meta,
      echoBatch,
      unaryDependencies,
      [{ personId: 1, organizationId: null }],
      "object",
    ),
    batchInMeta(
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
    batchInMeta(meta, echoBatch, firstDependencies, [firstKeyset, firstKeyset]),
    batchInMeta(meta, echoBatch, firstDependencies, [
      sameLookingKeyset,
      firstKeyset,
    ]),
    batchInMeta(meta, echoBatch, sameLookingDependencies, [firstKeyset]),
    batchInMeta(meta, alternateEchoBatch, firstDependencies, [firstKeyset]),
    batchInMeta(meta, echoBatch, firstDependencies, [[1]], "tuple"),
  ]);

  expect(callbackCount).to.equal(4);
  expect(first).to.deep.equal([firstKeyset, firstKeyset]);
  expect(second).to.deep.equal([sameLookingKeyset, firstKeyset]);
  expect(third).to.deep.equal([firstKeyset]);
  expect(fourth).to.deep.equal([firstKeyset]);
  expect(fifth).to.deep.equal([[1]]);
});
