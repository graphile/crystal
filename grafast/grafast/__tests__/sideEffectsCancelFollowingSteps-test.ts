/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import assert from "assert";
import { resolvePreset } from "graphile-config";
import { it } from "mocha";

import {
  context,
  grafast,
  inhibitOnNull,
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
  objects: {
    Mutation: {
      plans: {
        test: testResolver,
      },
    },
    Query: {
      plans: {
        test: testResolver,
      },
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
  assert.deepEqual(
    result.errors?.map((e) => e.toJSON()),
    [
      {
        message: "Side effect 3 failed",
        path: ["test"],
        locations: [{ line: 3, column: 7 }],
      },
    ],
  );
  assert.equal(contextValue.number, 4);
});

it("does not discard an earlier side effect when the returned side effect is inhibited", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        noop: Int
      }
      type Mutation {
        test(a: Int): Int
      }
    `,
    objects: {
      Mutation: {
        plans: {
          test(_, fieldArgs) {
            sideEffect(null, () => {
              throw new Error("Moo");
            });
            const $a = inhibitOnNull(fieldArgs.getRaw("a"));
            return sideEffect($a, (a) => a + 2);
          },
        },
      },
    },
    enableDeferStream: false,
  });

  const result = await grafast({
    schema,
    source: /* GraphQL */ `
      mutation {
        test(a: null)
      }
    `,
    resolvedPreset,
  });
  if (!("data" in result)) {
    throw new Error("Unexpected response shape");
  }
  assert.deepEqual(result.data, { test: null });
  assert.deepEqual(
    result.errors?.map((e) => e.message),
    ["Moo"],
  );
});

// TODO: rename this test file to just 'sideEffects' maybe...
it("does not reuse a context access step across mutation fields", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        noop: Int
      }
      type Mutation {
        mutationOne: Int
        mutationTwo: Int
        mutationThree: Int
      }
    `,
    objects: {
      Mutation: {
        plans: {
          mutationOne() {
            const $context = context();
            sideEffect($context, (context) => {
              context.number = 1;
            });
            const $foo = $context.get("number");
            return $foo;
          },
          mutationTwo() {
            const $context = context();
            sideEffect($context, (context) => {
              context.number = 2;
            });
            const $foo = $context.get("number");
            return $foo;
          },
          mutationThree() {
            const $context = context();
            sideEffect($context, (context) => {
              context.number = 3;
            });
            const $foo = $context.get("number");
            return $foo;
          },
        },
      },
    },
    enableDeferStream: false,
  });

  const contextValue = { number: 0 };
  const result = await grafast({
    schema,
    source: /* GraphQL */ `
      mutation {
        mutationOne
        mutationTwo
        mutationThree
      }
    `,
    resolvedPreset,
    contextValue,
  });
  if (!("data" in result)) {
    throw new Error("Unexpected response shape");
  }
  assert.deepEqual(result, {
    data: {
      mutationOne: 1,
      mutationTwo: 2,
      mutationThree: 3,
    },
  });
  assert.deepEqual(contextValue, { number: 3 });
});
