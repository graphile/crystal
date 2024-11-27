import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import type { ExecutableStep } from "../dist/index.js";
import { constant, grafast, lambda, makeGrafastSchema } from "../dist/index.js";

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Delayed {
      meaningOfLife: Int
      delayed: Delayed
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
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ name: "Query.delayed" }), 2),
            ),
        );
      },
    },
    Delayed: {
      meaningOfLife() {
        return constant(42);
      },
      delayed($o: ExecutableStep) {
        return lambda(
          $o,
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ name: "Delayed.delayed" }), 2),
            ),
        );
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
  const result = (await grafast({
    schema,
    source,
    resolvedPreset: resolvePreset({
      grafast: {
        timeouts: {
          planning: Number.MIN_VALUE,
        },
      },
    }),
  })) as ExecutionResult;
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
  const result = (await grafast({
    schema,
    source,
    resolvedPreset: resolvePreset({
      grafast: {
        timeouts: {
          execution: Number.MIN_VALUE,
        },
      },
    }),
  })) as ExecutionResult;
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

it("execution timeout works 2", async () => {
  const source = /* GraphQL */ `
    {
      delayed {
        meaningOfLife
        delayed {
          meaningOfLife
        }
        delayed2: delayed {
          meaningOfLife
        }
      }
    }
  `;
  const result = (await grafast({
    schema,
    source,
    resolvedPreset: resolvePreset({
      grafast: {
        timeouts: {
          execution: 1,
        },
        explain: true,
      },
    }),
  })) as ExecutionResult;
  expect(JSON.stringify(result.data, null, 2)).to.equal(`\
{
  "delayed": {
    "meaningOfLife": 42,
    "delayed": null,
    "delayed2": null
  }
}`);
  expect(JSON.stringify(result.errors, null, 2)).to.equal(
    `\
[
  {
    "message": "Execution timeout exceeded, please simplify or add limits to your request.",
    "locations": [
      {
        "line": 5,
        "column": 9
      }
    ],
    "path": [
      "delayed",
      "delayed"
    ]
  },
  {
    "message": "Execution timeout exceeded, please simplify or add limits to your request.",
    "locations": [
      {
        "line": 8,
        "column": 9
      }
    ],
    "path": [
      "delayed",
      "delayed2"
    ]
  }
]`,
  );
});
