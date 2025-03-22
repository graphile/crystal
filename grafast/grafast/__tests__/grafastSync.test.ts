/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import {
  ObjectPlans,
  grafastSync,
  lambda,
  makeGrafastSchema,
} from "../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

const makeSchema = () => {
  return makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Mutation {
        addTwoNumbers(a: Int!, b: Int!): Int
      }

      type Query {
        addTwoNumbers(a: Int!, b: Int!): Int
      }
    `,
    plans: {
      Mutation: {
        addTwoNumbers(parentStep, fieldArgs) {
          return lambda(
            [fieldArgs.getRaw("a"), fieldArgs.getRaw("b")],
            ([a, b]) => a + b,
          );
        },
      } as ObjectPlans,
      Query: {
        addTwoNumbers(parentStep, fieldArgs) {
          return lambda(
            [fieldArgs.getRaw("a"), fieldArgs.getRaw("b")],
            ([a, b]) => a + b,
          );
        },
      } as ObjectPlans,
    },
    enableDeferStream: false,
  });
};

it("query works sync", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query AddTwoNumbers($a: Int!, $b: Int!) {
      addTwoNumbers(a: $a, b: $b)
    }
  `;
  const variableValues = { a: 7, b: 13 };
  const result = grafastSync({
    schema,
    source,
    variableValues,
    contextValue: {},
    resolvedPreset,
    requestContext,
  }) as ExecutionResult;
  expect(result.errors).not.to.exist;
  expect(result.data).to.deep.equal({ addTwoNumbers: 20 });
});

it("mutation works sync", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    mutation AddTwoNumbers($a: Int!, $b: Int!) {
      addTwoNumbers(a: $a, b: $b)
    }
  `;
  const variableValues = { a: 9, b: 12 };
  const result = grafastSync({
    schema,
    source,
    variableValues,
    contextValue: {},
    resolvedPreset,
    requestContext,
  }) as ExecutionResult;
  expect(result.errors).not.to.exist;
  expect(result.data).to.deep.equal({ addTwoNumbers: 21 });
});
