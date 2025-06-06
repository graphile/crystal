/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { it } from "mocha";

import { grafast, lambda, makeGrafastSchema } from "../dist/index.js";

it("can create a schema with an input", async () => {
  const schema = makeGrafastSchema({
    objects: {
      Query: {
        plans: {
          a(_, { $a }) {
            return lambda($a, (a) => JSON.stringify(a));
          },
        },
      },
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

it("can inform you that you put a type in the wrong place (interfaces -> inputObjects)", async () => {
  expect(() =>
    makeGrafastSchema({
      interfaces: {
        A: {},
      },
      typeDefs: /* GraphQL */ `
        type Query {
          a: Int
        }
        input A {
          str: String
        }
      `,
    }),
  ).to.throw(
    "You defined 'A' under 'interfaces', but it is an input object type so it should be defined under 'inputObjects'.",
  );
});

it("can inform you that you defined a type that isn't in the schema", async () => {
  expect(() =>
    makeGrafastSchema({
      interfaces: {
        A: {},
      },
      typeDefs: /* GraphQL */ `
        type Query {
          a: Int
        }
      `,
    }),
  ).to.throw(
    "You detailed 'interfaces.A', but the 'A' type does not exist in the schema.",
  );
});
