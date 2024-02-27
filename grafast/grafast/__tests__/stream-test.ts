/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import type { AsyncExecutionResult } from "graphql";
import { it } from "mocha";

import type {
  ExecutionDetails,
  ExecutionExtra,
  PromiseOrDirect,
} from "../dist/index.js";
import {
  constant,
  ExecutableStep,
  grafast,
  lambda,
  makeGrafastSchema,
} from "../dist/index.js";

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
  executeV2({
    count,
    values: [values0],
    unaries: [unary0],
  }: ExecutionDetails<[TIn]>): Array<PromiseOrDirect<TOut>> {
    let result: PromiseOrDirect<TOut>[] = [];
    for (let i = 0; i < count; i++) {
      const entry = values0 !== null ? values0[i] : unary0!;
      result.push(this.callback(entry));
    }
    return result;
  }
  stream(_count: number, [val]: [Array<TIn>]) {
    const { callback } = this;
    return val.map((entry) =>
      (async function* () {
        const data = await callback(entry);
        yield* data;
      })(),
    );
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
          const cb = (i: number) => [i + 0, i + 1, i + 2];
          if (useStreamableStep) {
            return new SyncListCallbackStep($i, cb);
          } else {
            return lambda($i, cb);
          }
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
