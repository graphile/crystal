/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import assert from "assert";
import { resolvePreset } from "graphile-config";
import { it } from "mocha";

import {
  context,
  grafast,
  makeGrafastSchema,
  sideEffect,
} from "../dist/index.js";

const resolvedPreset = resolvePreset({});

declare global {
  namespace Grafast {
    interface Context {
      number?: number;
    }
  }
}

const testResolver = function () {
  const $context = context();
  sideEffect($context, (context) => (context.number = 3));
  sideEffect($context, (context) => context.number!++);
  sideEffect($context, (_context) => {
    throw new Error("Side effect 3 failed");
  });
  // The following two effects should not take place; so context.number should end up being at 3 + 1 = 4.
  sideEffect($context, (context) => context.number!++);
  sideEffect($context, (context) => context.number!++);
  return $context.get("number");
};

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      test: Int
    }
    type Mutation {
      test: Int
    }
  `,
  plans: {
    Mutation: {
      test: testResolver,
    },
    Query: {
      test: testResolver,
    },
  },
  enableDeferStream: true,
});

it("cancels future steps on error", async () => {
  const source = /* GraphQL */ `
    mutation M {
      test
    }
  `;
  const contextValue: Grafast.Context = {} as any;
  const result = await grafast({
    schema,
    source,
    requestContext: {},
    resolvedPreset,
    contextValue,
  });
  if (!("data" in result)) {
    console.dir(result);
    throw new Error("Unexpected response shape");
  }
  assert.deepEqual(result.data, {
    test: null,
  });
  assert.deepEqual(result.errors?.map((e) => e.toJSON()), [
    {
      message: "Side effect 3 failed",
      path: ["test"],
      locations: [{ line: 3, column: 7 }],
    },
  ]);
  assert.equal(contextValue.number, 4);
});
