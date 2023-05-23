import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import { constant, grafast, makeGrafastSchema } from "../dist/index.js";

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    interface ZeroImplementations {
      nobody: Int
      implements: String
    }
    type Query {
      interface: ZeroImplementations
    }
  `,
  plans: {
    Query: {
      interface() {
        return constant(null);
      },
    },
  },
});

it("can run a query that queries an interface with no implementations", async () => {
  const source = /* GraphQL */ `
    {
      interface {
        nobody
        implements
      }
    }
  `;
  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;
  expect(result.errors).to.equal(undefined);
  expect(JSON.stringify(result.data, null, 2)).to.equal(`\
{
  "interface": null
}`);
});
