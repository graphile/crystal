/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";
import { GraphQLError } from "graphql";
import { it } from "mocha";

import {
  constant,
  each,
  grafast,
  lambda,
  makeGrafastSchema,
} from "../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

interface Poly {
  id: number;
}

const THING = {
  id: 1,
};
const OTHER_THING = {
  id: -1,
};

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Thing implements Poly {
      id: Int
      safe: [[Int]]
      error: [[Int]]
      errorAtDepth1: [[Int]]
      errorAtDepth2: [[Int]]
    }
    type OtherThing implements Poly {
      id: Int
    }
    interface Poly {
      id: Int
    }
    type Query {
      thing: Thing
      poly: [Poly]
    }
  `,
  objects: {
    Thing: {
      plans: {
        safe() {
          return each(
            constant([
              [1, 2],
              [3, 4],
            ]),
            ($i) => each($i, ($j) => $j),
          );
        },
        error() {
          throw new GraphQLError("Direct error");
        },
        errorAtDepth1() {
          return each(
            constant([
              [1, 2],
              [3, 4],
            ]),
            ($i) => {
              throw new GraphQLError("Error at depth 1");
            },
          );
        },
        errorAtDepth2() {
          return each(
            constant([
              [1, 2],
              [3, 4],
            ]),
            ($i) =>
              each($i, ($j) => {
                throw new GraphQLError("Error at depth 2");
              }),
          );
        },
      },
    },
    Query: {
      plans: {
        thing() {
          return constant(THING);
        },
        poly() {
          return constant([THING, OTHER_THING]);
        },
      },
    },
    Poly: {
      planType($poly) {
        const $__typename = lambda($poly, getTypeNameFromPoly);
        return {
          $__typename,
          planForType(t) {
            if (t.name === "Thing") {
              return $poly;
            } else {
              throw new GraphQLError("Error in polymorphism plan");
            }
          },
        };
      },
    },
  },
  enableDeferStream: true,
});

function getTypeNameFromPoly(poly: Poly) {
  return poly.id < 0 ? "OtherThing" : "Thing";
}

it("resolves the list correctly", async () => {
  const source = /* GraphQL */ `
    {
      __typename
      thing {
        safe
      }
    }
  `;
  const result = (await grafast({
    schema,
    source,
    requestContext,
    resolvedPreset,
  })) as ExecutionResult;
  if (result.errors) {
    console.dir(result.errors);
  }
  expect(result.errors).to.be.undefined;
  expect(result.data).to.deep.equal({
    __typename: "Query",
    thing: {
      safe: [
        [1, 2],
        [3, 4],
      ],
    },
  });
});

it("catches field error at field level", async () => {
  const source = /* GraphQL */ `
    {
      __typename
      thing {
        error
      }
    }
  `;
  const result = (await grafast({
    schema,
    source,
    requestContext,
    resolvedPreset,
  })) as ExecutionResult;
  expect(result.errors).to.have.length(1);
  expect(result.errors![0]).to.deep.contain({
    message: "Direct error",
    path: ["thing", "error"],
  });
  expect(result.data).to.deep.equal({
    __typename: "Query",
    thing: {
      error: null,
    },
  });
});

it("catches field error at list level", async () => {
  const source = /* GraphQL */ `
    {
      __typename
      thing {
        errorAtDepth1
      }
    }
  `;
  const result = (await grafast({
    schema,
    source,
    requestContext,
    resolvedPreset,
  })) as ExecutionResult;
  expect(result.errors).to.have.length(2);
  expect(result.errors![1]).to.deep.contain({
    message: "Error at depth 1",
    path: ["thing", "errorAtDepth1", 1],
  });
  expect(result.data).to.deep.equal({
    __typename: "Query",
    thing: {
      errorAtDepth1: [null, null],
    },
  });
});

it("catches field error at nested list level", async () => {
  const source = /* GraphQL */ `
    {
      __typename
      thing {
        errorAtDepth2
      }
    }
  `;
  const result = (await grafast({
    schema,
    source,
    requestContext,
    resolvedPreset,
  })) as ExecutionResult;
  expect(result.errors).to.have.length(4);
  expect(result.errors![2]).to.deep.contain({
    message: "Error at depth 2",
    path: ["thing", "errorAtDepth2", 1, 0],
  });
  expect(result.data).to.deep.equal({
    __typename: "Query",
    thing: {
      errorAtDepth2: [
        [null, null],
        [null, null],
      ],
    },
  });
});
