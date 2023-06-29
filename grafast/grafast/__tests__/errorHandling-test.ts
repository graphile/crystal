import { expect } from "chai";
import type { AsyncExecutionResult } from "graphql";
import { it } from "mocha";

import { ExecutableStep, PromiseOrDirect } from "../dist/index.js";
import { constant, grafast, lambda, makeGrafastSchema } from "../dist/index.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class SyncListCallbackStep<
  TIn,
  TOut extends any[],
> extends ExecutableStep<TOut> {
  isSyncAndSafe = false;
  constructor(
    $dep: ExecutableStep<TIn>,
    private callback: (val: TIn) => PromiseOrDirect<TOut>,
  ) {
    super();
    this.addDependency($dep);
  }
  execute(_count: number, [val]: [Array<TIn>]): Array<PromiseOrDirect<TOut>> {
    return val.map((entry) => this.callback(entry));
  }
  async stream(_count: number, [val]: [Array<TIn>]) {
    await sleep(0);
    const { callback } = this;
    return val.map((entry) =>
      (async function* () {
        const data = await callback(entry);
        yield* data;
      })(),
    );
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
    }
  `,
  plans: {
    Query: {
      list() {
        return constant([1, 2]);
      },
    },
    Thing: {
      id($i: ExecutableStep<number>) {
        return $i;
      },
      anotherList($i: ExecutableStep<number>) {
        return new SyncListCallbackStep($i, (i) => [i + 0, i + 1, i + 2]);
      },
      throw() {
        return lambda(null, () => Promise.reject(new Error("ERROR")));
      },
    },
    OtherThing: {
      id($i: ExecutableStep<number>) {
        return $i;
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
    const stream = (await grafast(
      {
        schema,
        source,
      },
      {},
      {},
    )) as AsyncGenerator<AsyncExecutionResult>;
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
