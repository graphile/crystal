/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { AsyncExecutionResult } from "graphql";
import { it } from "mocha";

import { constant, grafast, makeGrafastSchema } from "../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

interface SubscriptionOptions {
  resolve?: (value: number) => any;
  subscribe?: () => AsyncIterable<number>;
}

const makeSchema = ({
  resolve: resolveImpl,
  subscribe: subscribeImpl,
}: SubscriptionOptions = {}) =>
  makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        dummy: Boolean!
      }

      type Subscription {
        counter: Int
      }
    `,
    objects: {
      Query: {
        plans: {
          dummy() {
            return constant(true);
          },
        },
      },
      Subscription: {
        plans: {
          counter: {
            subscribe() {
              if (subscribeImpl) {
                return subscribeImpl();
              }
              async function* ticker() {
                yield 1;
                yield 2;
                yield 3;
              }
              return ticker();
            },
            resolve(value: number) {
              if (resolveImpl) {
                return resolveImpl(value);
              }
              return value + 100;
            },
          },
        },
      },
    },
  });

it("subscriptions apply the field resolver to each payload", async () => {
  const source = /* GraphQL */ `
    subscription {
      counter
    }
  `;

  const stream = (await grafast({
    schema: makeSchema(),
    source,
    resolvedPreset,
    requestContext,
  })) as AsyncGenerator<AsyncExecutionResult>;

  const payloads: AsyncExecutionResult[] = [];
  for await (const payload of stream) {
    payloads.push(payload);
  }

  const counters = payloads
    .map((payload) => (payload.data as any)?.counter)
    .filter((value): value is number => typeof value === "number");

  expect(counters).to.deep.equal([101, 102, 103]);
});

it("subscriptions surface resolver errors", async () => {
  const source = /* GraphQL */ `
    subscription {
      counter
    }
  `;

  const stream = (await grafast({
    schema: makeSchema({
      resolve(value) {
        if (value === 2) {
          throw new Error("resolver exploded");
        }
        return value + 100;
      },
    }),
    source,
    resolvedPreset,
    requestContext,
  })) as AsyncGenerator<AsyncExecutionResult>;

  const payloads: AsyncExecutionResult[] = [];
  for await (const payload of stream) {
    payloads.push(payload);
  }

  expect((payloads[0].data as any)?.counter).to.equal(101);
  expect(payloads[0].errors).not.to.exist;
  expect((payloads[1].data as any)?.counter).to.equal(null);
  expect(payloads[1].errors).to.exist;
  expect(payloads[1].errors![0].message).to.equal("resolver exploded");
  expect(payloads[1].errors![0].path).to.deep.equal(["counter"]);
  expect((payloads[2].data as any)?.counter).to.equal(103);
  expect(payloads[2].errors).not.to.exist;
});

it("subscriptions surface rejected yields as errors", async () => {
  const source = /* GraphQL */ `
    subscription {
      counter
    }
  `;

  let done = false;
  const stream = (await grafast({
    schema: makeSchema({
      subscribe() {
        async function* ticker() {
          try {
            yield 1;
            yield Promise.reject(new Error("async rejection"));
            yield 3;
          } finally {
            done = true;
          }
        }
        return ticker();
      },
    }),
    source,
    resolvedPreset,
    requestContext,
  })) as AsyncGenerator<AsyncExecutionResult>;

  const payloads: AsyncExecutionResult[] = [];
  let error: Error | undefined;
  try {
    for await (const payload of stream) {
      payloads.push(payload);
    }
  } catch (e) {
    error = e;
  }
  expect(payloads).to.have.length(1);
  expect((payloads[0].data as any)?.counter).to.equal(101);
  expect(error).to.exist;
  expect(error!.message).to.equal("async rejection");
  expect((error as any).path).to.not.exist;
  expect(done).to.equal(true);
});
