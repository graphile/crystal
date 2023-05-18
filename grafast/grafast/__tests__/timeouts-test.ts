import { expect } from "chai";
import { ExecutionResult } from "graphql";
import { it } from "mocha";
import { constant, grafast, lambda, makeGrafastSchema } from "../dist";

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Delayed {
      meaningOfLife: Int
    }
    type Query {
      delayed: Delayed
    }
  `,
  plans: {
    Query: {
      delayed() {
        return lambda(
          null,
          () => new Promise((resolve) => setTimeout(resolve, 20)),
        );
      },
    },
    Delayed: {
      meaningOfLife() {
        return constant(42);
      },
    },
  },
});

it("planning timeout works", async () => {
  const source = /* GraphQL */ `
    {
      delayed {
        meaningOfLife
      }
    }
  `;
  const result = (await grafast(
    {
      schema,
      source,
    },
    {
      grafast: {
        timeouts: {
          planning: Number.MIN_VALUE,
        },
      },
    },
  )) as ExecutionResult;
  expect(JSON.stringify(result.data, null, 2)).to.equal(undefined);
  expect(JSON.stringify(result.errors, null, 2)).to.equal(
    `\
[
  {
    "message": "Operation took too long to plan and was aborted. Please simplify the request and try again."
  }
]`,
  );
});

it("execution timeout works", async () => {
  const source = /* GraphQL */ `
    {
      delayed {
        meaningOfLife
      }
    }
  `;
  const result = (await grafast(
    {
      schema,
      source,
    },
    {
      grafast: {
        timeouts: {
          execution: Number.MIN_VALUE,
        },
      },
    },
  )) as ExecutionResult;
  expect(JSON.stringify(result.data, null, 2)).to.equal(`\
{
  "delayed": null
}`);
  expect(JSON.stringify(result.errors, null, 2)).to.equal(
    `\
[
  {
    "message": "Execution timeout exceeded, please simplify or add limits to your request.",
    "locations": [
      {
        "line": 3,
        "column": 7
      }
    ],
    "path": [
      "delayed"
    ]
  }
]`,
  );
});
