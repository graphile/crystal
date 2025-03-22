/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { it } from "mocha";

import {
  ObjectPlans,
  grafast,
  lambda,
  makeGrafastSchema,
} from "../dist/index.js";

it("can create a schema with an input", async () => {
  const schema = makeGrafastSchema({
    plans: {
      Query: {
        a(_, { $a }) {
          return lambda($a, (a) => JSON.stringify(a));
        },
      } as ObjectPlans,
    },
    typeDefs: /* GraphQL */ `
      type Query {
        a(a: A!): String!
      }

      input A {
        str: String
      }
    `,
  });
  const result = await grafast({ schema, source: `{ a(a: {str: "hello!"})}` });
  if ("next" in result) {
    throw new Error("Iterator not expected");
  }
  expect(result.errors).to.be.undefined;
  expect(result.data?.a).to.eq('{"str":"hello!"}');
});
