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
  Step,
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
    type Thing implements Poly & Poly2 {
      id: Int
      safe: [[Int]]
      error: [[Int]]
      errorAtDepth1: [[Int]]
      errorAtDepth2: [[Int]]
      errorAtDepth2NN: [[Int!]]
    }
    type OtherThing implements Poly & Poly2 {
      id: Int
    }
    interface Poly {
      id: Int
    }
    interface Poly2 {
      id: Int
    }
    type Query {
      thing: Thing
      poly: [Poly]
      poly2: [Poly2]
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
        errorAtDepth2NN() {
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
        poly2() {
          return constant([THING, OTHER_THING]);
        },
      },
    },
  },
  interfaces: {
    Poly: {
      planType($poly: Step<Poly>) {
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
    Poly2: {
      planType($poly) {
        throw new GraphQLError("Poly2 error");
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

it("catches planning error at field level", async () => {
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

it("catches planning error at list level", async () => {
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

it("catches planning error at nested list level", async () => {
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

it("raises planning error from non-nullable nested list level", async () => {
  const source = /* GraphQL */ `
    {
      __typename
      thing {
        errorAtDepth2NN
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
    message: "Error at depth 2",
    path: ["thing", "errorAtDepth2NN", 1, 0],
  });
  expect(result.data).to.deep.equal({
    __typename: "Query",
    thing: {
      errorAtDepth2NN: [null, null],
    },
  });
});

it("raises planning error from bad poly planType", async () => {
  const source = /* GraphQL */ `
    {
      __typename
      poly2 {
        id
        ... on Thing {
          safe
        }
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
    message: "Poly2 error",
    path: ["poly2", 1],
  });
  expect(result.data).to.deep.equal({
    __typename: "Query",
    poly2: [null, null],
  });
});

it("raises planning error from bad poly planForType", async () => {
  const source = /* GraphQL */ `
    {
      __typename
      poly {
        id
        ... on Thing {
          safe
        }
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
    message: "Error in polymorphism plan",
    path: ["poly", 1],
  });
  expect(result.data).to.deep.equal({
    __typename: "Query",
    poly: [
      {
        id: 1,
        safe: [
          [1, 2],
          [3, 4],
        ],
      },
      null,
    ],
  });
});
