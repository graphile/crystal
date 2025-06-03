/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import {
  type AsyncExecutionResult,
  type ExecutionResult,
  GraphQLError,
} from "graphql";
import { it } from "mocha";

import type {
  ExecutionDetails,
  ExecutionResults,
  FieldArgs,
  PromiseOrDirect,
} from "../dist/index.js";
import {
  constant,
  context,
  grafast,
  lambda,
  makeGrafastSchema,
  sideEffect,
  Step,
} from "../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

declare global {
  namespace Grafast {
    interface Context {
      mol?: number;
    }
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class SyncListCallbackStep<TIn, TOut extends any[]> extends Step<TOut> {
  isSyncAndSafe = false;
  constructor(
    $dep: Step<TIn>,
    private callback: (val: TIn) => PromiseOrDirect<TOut>,
  ) {
    super();
    this.addDependency($dep);
  }
  execute({
    indexMap,
    values: [values0],
    stream,
  }: ExecutionDetails<[TIn]>): ExecutionResults<TOut> {
    if (!stream) {
      return indexMap((i) => this.callback(values0.at(i)));
    } else {
      return (async () => {
        await sleep(0);
        const { callback } = this;
        return indexMap((i) => {
          const entry = values0.at(i);
          return (async function* () {
            const data = await callback(entry);
            yield* data;
          })();
        });
      })();
    }
  }
}

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type OtherThing {
      id: Int
    }
    type Thing {
      id: Int
      anotherList: [OtherThing!]
      throw: Int
    }
    type Query {
      list: [Thing!]
      listContainingErrors: [Int]
      asyncListContainingErrors: [Int]
      sideEffectListCheck(arr: [String]!): Int
    }
  `,
  objects: {
    Query: {
      plans: {
        list() {
          return constant([1, 2]);
        },
        listContainingErrors() {
          return lambda(null, () => [
            1,
            2,
            Promise.reject(new GraphQLError("Test 3")),
            4,
            5,
            Promise.reject(new GraphQLError("Test 6")),
            7,
          ]);
        },
        asyncListContainingErrors() {
          return lambda(null, () => {
            // If we tried to do this with an async generator function, it
            // would terminate after item 3, so instead we've written our own
            // async iterable.
            let i = 0;
            return {
              [Symbol.asyncIterator]() {
                return this;
              },
              async next() {
                i++;
                if (i >= 8) {
                  return { done: true, value: undefined };
                }
                const value =
                  i === 3 || i === 6
                    ? Promise.reject(new GraphQLError(`Test ${i}`))
                    : i;
                return { done: false, value };
              },
            };
          });
        },
        sideEffectListCheck(_: Step, fieldArgs: FieldArgs) {
          const $mol = context().get("mol");
          sideEffect($mol, () => {});
          const $count = lambda(fieldArgs.getRaw("arr"), (arr) => {
            return arr.length;
          });
          $count.hasSideEffects = true;
          return $count;
        },
      },
    },
    Thing: {
      plans: {
        id($i: Step<number>) {
          return $i;
        },
        anotherList($i: Step<number>) {
          return new SyncListCallbackStep($i, (i) => [i + 0, i + 1, i + 2]);
        },
        throw() {
          return lambda(null, () => Promise.reject(new Error("ERROR")));
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

function throwOnUnhandledRejections(callback: () => Promise<void>) {
  return async () => {
    let failed: Error | undefined;
    function fail(e: Error) {
      console.error(`UNHANDLED PROMISE REJECTION: ${e}`);
      failed = e;
    }
    process.on("unhandledRejection", fail);
    try {
      return await callback();
    } finally {
      process.off("unhandledRejection", fail);
      if (failed) {
        failed = undefined;
        // eslint-disable-next-line no-unsafe-finally
        throw new Error(`Unhandled promise rejection occurred`);
      }
    }
  };
}

it(
  "doesn't die due to unhandled promise rejection",
  throwOnUnhandledRejections(async () => {
    const source = /* GraphQL */ `
      {
        list {
          id
          anotherList @stream(initialCount: 2) {
            id
          }
          throw
        }
      }
    `;
    const stream = (await grafast({
      schema,
      source,
      requestContext: {
        mol: 42,
      },
      resolvedPreset,
    })) as AsyncGenerator<AsyncExecutionResult>;
    let payloads: AsyncExecutionResult[] = [];
    for await (const payload of stream) {
      payloads.push(payload);
    }
    const result = payloads[0];
    expect(result.data).to.deep.equal({
      list: [
        { id: 1, anotherList: [{ id: 1 }, { id: 2 }], throw: null },
        { id: 2, anotherList: [{ id: 2 }, { id: 3 }], throw: null },
      ],
    });
    expect(result.errors).to.have.length(2);
    expect(result.errors![0]).to.deep.include({
      message: "ERROR",
      path: ["list", 0, "throw"],
    });
    expect(result.errors![1]).to.deep.include({
      message: "ERROR",
      path: ["list", 1, "throw"],
    });
  }),
);

it(
  "doesn't confuse ListStep with additional dependencies",
  throwOnUnhandledRejections(async () => {
    const source = /* GraphQL */ `
      query MyQuery($arr: [String]!) {
        sideEffectListCheck(arr: $arr)
      }
    `;
    const result = (await grafast({
      schema,
      source,
      variableValues: {
        arr: ["A", "b"],
      },
      requestContext,
      resolvedPreset,
    })) as ExecutionResult;
    expect(result.errors).to.be.undefined;
    expect(result.data).to.deep.equal({
      sideEffectListCheck: 2,
    });
  }),
);

it(
  "allows for errors inside of lists",
  throwOnUnhandledRejections(async () => {
    const source = /* GraphQL */ `
      query MyQuery {
        listContainingErrors
      }
    `;
    const result = (await grafast({
      schema,
      source,
      requestContext,
      resolvedPreset,
    })) as ExecutionResult;
    expect(result.errors).to.have.length(2);
    expect(result.errors!.map((e) => e.toJSON())).to.deep.equal([
      {
        message: "Test 3",
        path: ["listContainingErrors", 2],
        locations: [
          {
            line: 3,
            column: 9,
          },
        ],
      },
      {
        message: "Test 6",
        path: ["listContainingErrors", 5],
        locations: [
          {
            line: 3,
            column: 9,
          },
        ],
      },
    ]);
    expect(result.data).to.deep.equal({
      listContainingErrors: [1, 2, null, 4, 5, null, 7],
    });
  }),
);

it(
  "allows for errors inside of async iterables",
  throwOnUnhandledRejections(async () => {
    const source = /* GraphQL */ `
      query MyQuery {
        asyncListContainingErrors
      }
    `;
    const result = (await grafast({
      schema,
      source,
      requestContext,
      resolvedPreset,
    })) as ExecutionResult;
    expect(result.errors).to.have.length(2);
    expect(result.errors!.map((e) => e.toJSON())).to.deep.equal([
      {
        message: "Test 3",
        path: ["asyncListContainingErrors", 2],
        locations: [
          {
            line: 3,
            column: 9,
          },
        ],
      },
      {
        message: "Test 6",
        path: ["asyncListContainingErrors", 5],
        locations: [
          {
            line: 3,
            column: 9,
          },
        ],
      },
    ]);
    expect(result.data).to.deep.equal({
      asyncListContainingErrors: [1, 2, null, 4, 5, null, 7],
    });
  }),
);
