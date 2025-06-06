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
      direct: [[Int]]
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
          return each(constant([[1]]), ($i) => each($i, ($j) => $j));
        },
        direct() {
          throw new GraphQLError("Direct error");
        },
        errorAtDepth1() {
          return each(constant([[1]]), () => {
            throw new GraphQLError("Error at depth 1");
          });
        },
        errorAtDepth2() {
          return each(constant([[1]]), ($i) =>
            each($i, () => {
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
    thing: {
      safe: [[1]],
    },
  });
});
