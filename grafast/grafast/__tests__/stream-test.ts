/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { AsyncExecutionResult } from "graphql";
import { it } from "mocha";

import type {
  ExecutionDetails,
  ExecutionResults,
  PromiseOrDirect,
} from "../dist/index.js";
import {
  constant,
  grafast,
  lambda,
  makeGrafastSchema,
  Step,
} from "../dist/index.js";
import {
  assertIterable,
  resolveStreamDefer,
  streamToArray,
} from "./incrementalUtils.ts";

const resolvedPreset = resolvePreset({});
const requestContext = {};

class SyncListCallbackStep<TIn, TOut extends any[]> extends Step<TOut> {
  isSyncAndSafe = false;
  private callback: (val: TIn) => PromiseOrDirect<TOut>;
  constructor($dep: Step<TIn>, callback: (val: TIn) => PromiseOrDirect<TOut>) {
    super();
    this.callback = callback;
    this.addDependency($dep);
  }
  execute({
    indexMap,
    values: [values0],
    stream,
  }: ExecutionDetails<[TIn]>): ExecutionResults<TOut> {
    const { callback } = this;
    return indexMap((i) => {
      const entry = values0.at(i);
      if (!stream) {
        return callback(entry);
      } else {
        return (async function* () {
          const data = await callback(entry);
          yield* data;
        })();
      }
    });
  }
}

const makeSchema = (useStreamableStep = false) => {
  return makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type OtherThing {
        id: Int
      }
      type Thing {
        id: Int
        anotherList: [OtherThing!]
      }
      type Query {
        list: [Thing!]
      }
    `,
    objects: {
      Query: {
        plans: {
          list() {
            return constant([1, 2]);
          },
        },
      },
      Thing: {
        plans: {
          id($i: Step<number>) {
            return $i;
          },
          anotherList($i: Step<number>) {
            const cb = (i: number) => [i + 0, i + 1, i + 2];
            if (useStreamableStep) {
              return new SyncListCallbackStep($i, cb);
            } else {
              return lambda($i, cb);
            }
          },
        },
      },
      OtherThing: {
        plans: {
          id($i: Step<number>) {
            return $i;
          },
        },
      },
    },
    enableDeferStream: true,
  });
};

it("streams with streamable step", async () => {
  const source = /* GraphQL */ `
    {
      list {
        id
        anotherList @stream(initialCount: 2) {
          id
        }
      }
    }
  `;
  const schema = makeSchema(true);
  const stream = (await grafast({
    schema,
    source,
    resolvedPreset,
    requestContext,
  })) as AsyncGenerator<AsyncExecutionResult>;
  let payloads: AsyncExecutionResult[] = [];
  for await (const payload of stream) {
    payloads.push(payload);
  }
  expect(payloads).to.have.length(4);
  expect(payloads[0]).to.deep.equal({
    data: {
      list: [
        { id: 1, anotherList: [{ id: 1 }, { id: 2 }] },
        { id: 2, anotherList: [{ id: 2 }, { id: 3 }] },
      ],
    },
    hasNext: true,
  });
  expect(payloads[1]).to.deep.equal({
    path: ["list", 0, "anotherList", 2],
    data: { id: 3 },
    hasNext: true,
  });
  expect(payloads[2]).to.deep.equal({
    path: ["list", 1, "anotherList", 2],
    data: { id: 4 },
    hasNext: true,
  });
  expect(payloads[3]).to.deep.equal({
    hasNext: false,
  });
});

it("streams with non-streamable step", async () => {
  const source = /* GraphQL */ `
    {
      list {
        id
        anotherList @stream(initialCount: 2) {
          id
        }
      }
    }
  `;
  const schema = makeSchema(false);
  const stream = (await grafast({
    schema,
    source,
    resolvedPreset,
    requestContext,
  })) as AsyncGenerator<AsyncExecutionResult>;
  let payloads: AsyncExecutionResult[] = [];
  for await (const payload of stream) {
    payloads.push(payload);
  }
  expect(payloads).to.have.length(4);
  expect(payloads[0]).to.deep.equal({
    data: {
      list: [
        { id: 1, anotherList: [{ id: 1 }, { id: 2 }] },
        { id: 2, anotherList: [{ id: 2 }, { id: 3 }] },
      ],
    },
    hasNext: true,
  });
  expect(payloads[1]).to.deep.equal({
    path: ["list", 0, "anotherList", 2],
    data: { id: 3 },
    hasNext: true,
  });
  expect(payloads[2]).to.deep.equal({
    path: ["list", 1, "anotherList", 2],
    data: { id: 4 },
    hasNext: true,
  });
  expect(payloads[3]).to.deep.equal({
    hasNext: false,
  });
});

it("rejects a string returned for a deferred streamed list", async () => {
  const schema = makeGrafastSchema({
    enableDeferStream: true,
    typeDefs: "type Query { strings: [String] }",
    objects: { Query: { plans: { strings: () => constant("abc") } } },
  });
  const result = await grafast({
    schema,
    source: "{ __typename ... @defer { strings @stream } }",
    requestContext,
  });
  assertIterable(result);
  const payloads = await streamToArray(result);
  expect(Array.isArray(payloads) && payloads[1].data).to.deep.equal({
    strings: null,
  });
  expect(Array.isArray(payloads) && payloads[1].errors?.[0].path).to.deep.equal(
    ["strings"],
  );
});

for (const sourceType of ["array", "async iterator"]) {
  for (const { defer, streamParents } of [
    { defer: true, streamParents: false },
    { defer: false, streamParents: false },
    { defer: false, streamParents: true },
  ]) {
    it(`streams a unary ${sourceType} independently for each parent with defer=${defer}, streamParents=${streamParents}`, async () => {
      const values = [10, 20, 30];
      let pulls = 0;
      const schema = makeGrafastSchema({
        typeDefs: `type Query { parents: [Parent!]! } type Parent { xs: [Int!]! }`,
        objects: {
          Query: {
            plans: {
              parents: () => constant([1, 2]),
            },
          },
          Parent: {
            plans: {
              xs: () =>
                sourceType === "array"
                  ? constant(values)
                  : lambda(null, async function* () {
                      pulls++;
                      yield* values;
                    }),
            },
          },
        },
        enableDeferStream: true,
      });
      const payloads = await streamToArray(
        await grafast({
          schema,
          source: defer
            ? "{ parents { ... @defer { xs @stream(initialCount: 1) } } }"
            : streamParents
              ? "{ parents @stream(initialCount: 1) { xs @stream(initialCount: 1) } }"
              : "{ parents { xs @stream(initialCount: 1) } }",
          resolvedPreset,
          requestContext,
        }),
      );
      if (!Array.isArray(payloads)) {
        throw new Error("Expected incremental delivery");
      }
      if (defer) {
        for (let index = 0; index < 2; index++) {
          expect(payloads).to.deep.include({
            path: ["parents", index],
            data: { xs: [10] },
            hasNext: true,
          });
        }
      } else {
        expect(payloads[0].data).to.deep.equal({
          parents: streamParents
            ? [{ xs: [10] }]
            : [{ xs: [10] }, { xs: [10] }],
        });
      }
      expect(resolveStreamDefer(payloads)).to.deep.equal({
        data: { parents: [{ xs: [10, 20, 30] }, { xs: [10, 20, 30] }] },
        extensions: {},
      });
      expect(pulls).to.equal(
        sourceType === "array" ? 0 : streamParents ? 2 : 1,
      );
    });
  }
}
