/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import { type AsyncExecutionResult } from "graphql";
import { it } from "mocha";

import {
  connection,
  get,
  grafast,
  loadMany,
  loadManyCallback,
  makeGrafastSchema,
  sideEffect,
  Step,
} from "../dist/index.js";
import { planToMermaid } from "../dist/mermaid.js";
import {
  assertIterable,
  assertNotIterable,
  resolveStreamDefer,
  streamToArray,
} from "./incrementalUtils.js";

const resolvedPreset = resolvePreset({
  grafast: {
    explain: true,
  },
});
const requestContext = {};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      connection(max: Int! = 100): FibConnection
    }
    type FibConnection {
      edges(throw: Boolean! = false): [FibEdge]
      nodes(throw: Boolean! = false): [Fib]
      pageInfo(throw: Boolean! = false): PageInfo
    }
    type FibEdge {
      cursor: String!
      node: Fib
    }
    type PageInfo {
      hasNextPage: Boolean
      hasPreviousPage: Boolean
      startCursor: String
      endCursor: String
    }
    type Fib {
      index: Int
      value: Int
    }
  `,
  objects: {
    Query: {
      plans: {
        connection(_, { $max }) {
          const $fib = fib($max);
          return connection($fib);
        },
      },
    },
    FibConnection: {
      plans: {
        pageInfo($connection, { $throw }) {
          sideEffect($throw, (t) => {
            if (t) {
              throw new Error(`Throw in pageInfo requested!`);
            }
          });
          return get($connection, "pageInfo");
        },
        edges($connection, { $throw }) {
          sideEffect($throw, (t) => {
            if (t) {
              throw new Error(`Throw in edges requested!`);
            }
          });
          return get($connection, "edges");
        },
        nodes($connection, { $throw }) {
          sideEffect($throw, (t) => {
            if (t) {
              throw new Error(`Throw in nodes requested!`);
            }
          });
          return get($connection, "nodes");
        },
      },
    },
  },
  enableDeferStream: true,
});

function fib($max: Step<number>) {
  return loadMany($max, fibonacciLoader);
}

const fibonacciLoader = loadManyCallback((maxes: readonly number[]) => {
  return maxes.map((max) => fibonacci(max));
});

async function* fibonacciReal(max: number) {
  let index = 0;
  let a = 0;
  let b = 1;
  while (b < max) {
    await sleep(1);
    yield { index: index++, value: b };
    const c = a + b;
    a = b;
    b = c;
  }
}

let getIteratorCount = 0;
let startCount = 0;
let endCount = 0;
let nextCount = 0;

beforeEach(() => {
  getIteratorCount = 0;
  startCount = 0;
  endCount = 0;
  nextCount = 0;
});

/**
 * We want to ensure that the iterator is released even if `.next()` is never
 * called; so we monkey patch the iterator.
 */
function fibonacci(max: number): ReturnType<typeof fibonacciReal> {
  const iterator = fibonacciReal(max);
  let first = true;
  let done = false;

  return {
    [Symbol.asyncIterator]() {
      getIteratorCount++;
      const it2 = iterator[Symbol.asyncIterator]();
      expect(it2).to.equal(iterator);
      return this;
    },
    [Symbol.asyncDispose]() {
      if (!done) {
        endCount++;
        done = true;
      }
      return iterator[Symbol.asyncDispose]();
    },
    return(...args) {
      if (!done) {
        endCount++;
        done = true;
      }
      return iterator.return(...args);
    },
    throw(...args) {
      if (!done) {
        endCount++;
        done = true;
      }
      return iterator.throw(...args);
    },
    next(...args) {
      if (first) {
        startCount++;
        first = false;
      }
      nextCount++;
      const result = iterator.next(...args);
      Promise.resolve(result).then(
        () => {
          if (!done) {
            endCount++;
            done = true;
          }
        },
        (_e) => {
          if (!done) {
            endCount++;
            done = true;
          }
        },
      );
      return result;
    },
  };
}

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
  "happy path",
  throwOnUnhandledRejections(async () => {
    const source = /* GraphQL */ `
      {
        connection {
          edges @stream(initialCount: 1) {
            cursor
            node {
              index
              value
            }
          }
          nodes @stream(initialCount: 2) {
            index
            value
          }
          pageInfo {
            ... @defer {
              hasNextPage
            }
            ... @defer {
              hasPreviousPage
            }
            ... @defer {
              startCursor
            }
            ... @defer {
              endCursor
            }
          }
        }
      }
    `;
    const stream = await grafast({
      schema,
      requestContext,
      resolvedPreset,

      source,
    });
    if ("errors" in stream) {
      console.dir(stream.errors);
      throw stream.errors![0];
    }
    assertIterable(stream);
    const payloads = (await streamToArray(stream)) as AsyncExecutionResult[];
    expect(payloads[0].errors).not.to.exist;
    expect(payloads[0].data).to.deep.equal({
      connection: {
        edges: [
          {
            cursor: Buffer.from("0").toString("base64"),
            node: {
              index: 0,
              value: 1,
            },
          },
        ],
        nodes: [
          {
            index: 0,
            value: 1,
          },
          {
            index: 1,
            value: 1,
          },
        ],
        pageInfo: {},
      },
    });
    const finalData = resolveStreamDefer(payloads);
    const expectedNodes = [
      { index: 0, value: 1 },
      { index: 1, value: 1 },
      { index: 2, value: 2 },
      { index: 3, value: 3 },
      { index: 4, value: 5 },
      { index: 5, value: 8 },
      { index: 6, value: 13 },
      { index: 7, value: 21 },
      { index: 8, value: 34 },
      { index: 9, value: 55 },
      { index: 10, value: 89 },
    ];
    expect(finalData.errors).not.to.exist;
    expect(finalData.data).to.deep.equal({
      connection: {
        edges: expectedNodes.map((node) => ({
          cursor: Buffer.from(String(node.index)).toString("base64"),
          node,
        })),
        nodes: expectedNodes,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: Buffer.from("0").toString("base64"),
          endCursor: Buffer.from("10").toString("base64"),
        },
      },
    });
    expect(startCount).to.equal(1);
    expect(endCount).to.equal(1);
  }),
);

it(
  "handles pageInfo throwing",
  throwOnUnhandledRejections(async () => {
    const source = /* GraphQL */ `
      {
        connection {
          edges @stream(initialCount: 1) {
            cursor
            node {
              index
              value
            }
          }
          pageInfo(throw: true) {
            ... @defer {
              hasNextPage
            }
            ... @defer {
              hasPreviousPage
            }
            ... @defer {
              startCursor
            }
            ... @defer {
              endCursor
            }
          }
          nodes @stream(initialCount: 2) {
            index
            value
          }
        }
      }
    `;
    const stream = await grafast({
      schema,
      requestContext,
      resolvedPreset: resolvePreset({
        extends: [
          resolvedPreset,
          {
            grafast: {
              // We want to cache at most 3 records; this will hang waiting for new
              // records if the skipped steps are not handled
              distributorTargetBufferSize: 3,
              // Must be less than the test timeout
              distributorPauseDuration: 10,
            },
          },
        ],
      }),
      source,
    });
    if ("errors" in stream) {
      const plan = (stream.extensions?.explain as any)?.operations?.find(
        (op: any) => op.type === "plan",
      );
      if (plan) {
        console.log(planToMermaid(plan.plan));
      }
      console.dir(stream.errors);
      expect(stream.errors).not.to.exist;
    }
    assertIterable(stream);
    const payloads = (await streamToArray(stream)) as AsyncExecutionResult[];
    const finalData = resolveStreamDefer(payloads);
    const expectedNodes = [
      { index: 0, value: 1 },
      { index: 1, value: 1 },
      { index: 2, value: 2 },
      { index: 3, value: 3 },
      { index: 4, value: 5 },
      { index: 5, value: 8 },
      { index: 6, value: 13 },
      { index: 7, value: 21 },
      { index: 8, value: 34 },
      { index: 9, value: 55 },
      { index: 10, value: 89 },
    ];
    expect(finalData.data).to.deep.equal({
      connection: {
        edges: expectedNodes.map((node) => ({
          cursor: Buffer.from(String(node.index)).toString("base64"),
          node,
        })),
        nodes: expectedNodes,
        pageInfo: null, // Because: error
      },
    });
    expect(finalData.errors).to.have.length(1);
    expect(finalData.errors![0].toJSON()).to.deep.include({
      message: "Throw in pageInfo requested!",
      path: ["connection", "pageInfo"],
    });
    expect(startCount).to.equal(1);
    expect(endCount).to.equal(1);
  }),
);

it(
  "handles everything throwing",
  throwOnUnhandledRejections(async () => {
    const source = /* GraphQL */ `
      {
        connection {
          edges(throw: true) @stream(initialCount: 1) {
            cursor
            node {
              index
              value
            }
          }
          pageInfo(throw: true) {
            ... @defer {
              hasNextPage
            }
            ... @defer {
              hasPreviousPage
            }
            ... @defer {
              startCursor
            }
            ... @defer {
              endCursor
            }
          }
          nodes(throw: true) @stream(initialCount: 2) {
            index
            value
          }
        }
      }
    `;
    const result = await grafast({
      schema,
      requestContext,
      resolvedPreset: resolvePreset({
        extends: [
          resolvedPreset,
          {
            grafast: {
              // We want to cache at most 3 records; this will hang waiting for new
              // records if the skipped steps are not handled
              distributorTargetBufferSize: 3,
              // Must be less than the test timeout
              distributorPauseDuration: 10,
            },
          },
        ],
      }),
      source,
    });

    // No incremental!
    assertNotIterable(result);

    expect(result.data).to.deep.equal({
      connection: {
        edges: null,
        nodes: null,
        pageInfo: null, // Because: error
      },
    });
    expect(result.errors).to.have.length(3);
    expect(result.errors![0].toJSON()).to.deep.include({
      message: "Throw in edges requested!",
      path: ["connection", "edges"],
    });
    expect(result.errors![1].toJSON()).to.deep.include({
      message: "Throw in pageInfo requested!",
      path: ["connection", "pageInfo"],
    });
    expect(result.errors![2].toJSON()).to.deep.include({
      message: "Throw in nodes requested!",
      path: ["connection", "nodes"],
    });
    // The iterator should never be started, since nothing ever consumes it,
    // but we should still call `.return()` or `.error()` on it to terminate it
    // (even though this wouldn't be the case for generator functions, for
    // iterables the user might do anything).
    expect(getIteratorCount).to.equal(0);
    expect(startCount).to.equal(0);
    expect(nextCount).to.equal(0);
    expect(endCount).to.equal(1);
  }),
);

it(
  "when initialCount > limit",
  throwOnUnhandledRejections(async () => {
    const source = /* GraphQL */ `
      {
        connection {
          edges @stream(initialCount: 9) {
            cursor
            node {
              index
              value
            }
          }
          pageInfo {
            ... @defer {
              hasNextPage
            }
            ... @defer {
              hasPreviousPage
            }
            ... @defer {
              startCursor
            }
            ... @defer {
              endCursor
            }
          }
          nodes @stream(initialCount: 2) {
            index
            value
          }
        }
      }
    `;
    const stream = await grafast({
      schema,
      requestContext,
      resolvedPreset: resolvePreset({
        extends: [
          resolvedPreset,
          {
            grafast: {
              // For this test to be meaningful, this must be < 11
              distributorTargetBufferSize: 8,
              // Must be less than the test timeout
              distributorPauseDuration: 10,
            },
          },
        ],
      }),
      source,
    });
    if ("errors" in stream) {
      const plan = (stream.extensions?.explain as any)?.operations?.find(
        (op: any) => op.type === "plan",
      );
      if (plan) {
        console.log(planToMermaid(plan.plan));
      }
      console.dir(stream.errors);
      expect(stream.errors).not.to.exist;
    }
    assertIterable(stream);
    const payloads = (await streamToArray(stream)) as AsyncExecutionResult[];
    const expectedNodes = [
      { index: 0, value: 1 },
      { index: 1, value: 1 },
      { index: 2, value: 2 },
      { index: 3, value: 3 },
      { index: 4, value: 5 },
      { index: 5, value: 8 },
      { index: 6, value: 13 },
      { index: 7, value: 21 },
      { index: 8, value: 34 },
      { index: 9, value: 55 },
      { index: 10, value: 89 },
    ];
    const expectedEdges = expectedNodes.map((node) => ({
      cursor: Buffer.from(String(node.index)).toString("base64"),
      node,
    }));
    expect(payloads[0].data).to.deep.equal({
      connection: {
        // Stream ignored - fetched in initial payload
        edges: expectedEdges,
        pageInfo: {},
        nodes: expectedNodes.slice(0, 2),
      },
    });
    const finalData = resolveStreamDefer(payloads);
    expect(finalData.data).to.deep.equal({
      connection: {
        edges: expectedEdges,
        nodes: expectedNodes,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: Buffer.from("0").toString("base64"),
          endCursor: Buffer.from("10").toString("base64"),
        },
      },
    });
    expect(finalData.errors).not.to.exist;
    expect(startCount).to.equal(1);
    expect(endCount).to.equal(1);
  }),
);

it(
  "when initialCount > limit (simplified)",
  throwOnUnhandledRejections(async () => {
    const source = /* GraphQL */ `
      {
        connection {
          edges @stream(initialCount: 9) {
            cursor
            node {
              index
              value
            }
          }
          pageInfo {
            ... @defer {
              hasNextPage
            }
          }
        }
      }
    `;
    const stream = await grafast({
      schema,
      requestContext,
      resolvedPreset: resolvePreset({
        extends: [
          resolvedPreset,
          {
            grafast: {
              // For this test to be meaningful, this must be < 11
              distributorTargetBufferSize: 8,
              // Must be longer than the test timeout
              distributorPauseDuration: 5001,
            },
          },
        ],
      }),
      source,
    });
    if ("errors" in stream) {
      const plan = (stream.extensions?.explain as any)?.operations?.find(
        (op: any) => op.type === "plan",
      );
      if (plan) {
        console.log(planToMermaid(plan.plan));
      }
      console.dir(stream.errors);
      expect(stream.errors).not.to.exist;
    }
    assertIterable(stream);
    const payloads = (await streamToArray(stream)) as AsyncExecutionResult[];
    const expectedNodes = [
      { index: 0, value: 1 },
      { index: 1, value: 1 },
      { index: 2, value: 2 },
      { index: 3, value: 3 },
      { index: 4, value: 5 },
      { index: 5, value: 8 },
      { index: 6, value: 13 },
      { index: 7, value: 21 },
      { index: 8, value: 34 },
      { index: 9, value: 55 },
      { index: 10, value: 89 },
    ];
    const expectedEdges = expectedNodes.map((node) => ({
      cursor: Buffer.from(String(node.index)).toString("base64"),
      node,
    }));
    expect(payloads[0].data).to.deep.equal({
      connection: {
        // Stream ignored - fetched in initial payload
        edges: expectedEdges,
        pageInfo: {},
      },
    });
    const finalData = resolveStreamDefer(payloads);
    expect(finalData.data).to.deep.equal({
      connection: {
        edges: expectedEdges,
        pageInfo: {
          hasNextPage: false,
        },
      },
    });
    expect(finalData.errors).not.to.exist;
    expect(startCount).to.equal(1);
    expect(endCount).to.equal(1);
  }),
);
