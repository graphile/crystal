/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
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
  ExecutableStep,
  grafast,
  isAsyncIterable,
  lambda,
  makeGrafastSchema,
} from "../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class SyncListCallbackStep<
  TIn,
  TOut extends any[],
> extends ExecutableStep<TOut> {
  isSyncAndSafe = false;
  constructor(
    $dep: ExecutableStep<TIn>,
    private callback: (val: TIn) => PromiseOrDirect<TOut>,
    private setStreaming: (isStreaming: boolean) => void,
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
        const { callback, setStreaming } = this;
        return indexMap((i) => {
          const entry = values0.at(i);
          setStreaming(true);

          return (async function* () {
            try {
              const data = await callback(entry);
              for (const item of data) {
                yield item;
              }
            } finally {
              setStreaming(false);
            }
          })();
        });
      })();
    }
  }
}

const makeSchema = (setStreaming: (isStreaming: boolean) => void) =>
  makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type OtherThing {
        id: Int
      }
      type Thing {
        id: Int
        anotherList: [OtherThing!]!
        throw: Int!
      }
      type Query {
        list: [Thing]
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
          return new SyncListCallbackStep(
            $i,
            (i) => [i + 0, i + 1, i + 2],
            setStreaming,
          );
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
        // eslint-disable-next-line no-unsafe-finally
        throw new Error(`Unhandled promise rejection occurred`);
      }
    }
  };
}

(["before", "after"] as const).forEach((beforeAfter) => {
  it(
    `handles errors alongside streaming fields correctly (throw ${beforeAfter})`,
    throwOnUnhandledRejections(async () => {
      const source =
        beforeAfter === "before"
          ? /* GraphQL */ `
              {
                list {
                  id
                  throw
                  anotherList @stream(initialCount: 2) {
                    id
                  }
                }
              }
            `
          : /* GraphQL */ `
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
      let streams = 0;
      const schema = makeSchema((isStreaming) => {
        if (isStreaming) {
          streams++;
        } else {
          streams--;
        }
      });
      const stream = await grafast({
        schema,
        source,
        resolvedPreset,
        requestContext,
      });

      let payloads: AsyncExecutionResult[] = [];
      const wasAStream = isAsyncIterable(stream);
      if (wasAStream) {
        expect(streams).to.be.greaterThan(0);
        for await (const payload of stream) {
          payloads.push(payload);
        }
      } else {
        payloads = [stream];
      }
      const result = payloads[0];
      expect(result.data).to.deep.equal({
        list: [null, null],
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
      expect(streams).to.equal(0);
      expect(wasAStream).to.be.false;
      expect(result.hasNext).to.be.undefined;
      //expect(payloads).to.have.length(1);
    }),
  );
});
