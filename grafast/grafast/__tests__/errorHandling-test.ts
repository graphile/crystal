/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { AsyncExecutionResult, ExecutionResult } from "graphql";
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
      sideEffectListCheck(arr: [String]!): Int
    }
  `,
  objectPlans: {
    Query: {
      fields: {
        list() {
          return constant([1, 2]);
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
      fields: {
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
      fields: {
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
