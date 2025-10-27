/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { AsyncExecutionResult } from "graphql";
import { it } from "mocha";

import { constant, grafast, makeGrafastSchema } from "../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      dummy: Boolean!
    }

    type Subscription {
      counter: Int!
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
            async function* ticker() {
              yield 1;
              yield 2;
            }
            return ticker();
          },
          resolve(value: number) {
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
    schema,
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

  expect(counters).to.deep.equal([101, 102]);
});
