/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import type { AsyncExecutionResult, ExecutionResult } from "graphql";
import { it } from "mocha";

import type { PromiseOrDirect } from "../dist/index.js";
import {
  constant,
  ExecutableStep,
  grafast,
  lambda,
  makeGrafastSchema,
} from "../dist/index.js";

const makeSchema = (useStreamableStep = false) => {
  return makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        echoListOfString(in: [String]): [String]
        echoListOfNonNullableString(in: [String!]): [String!]
        echoNonNullableListOfNonNullableString(in: [String!]!): [String!]!
        echoNonNullableListOfString(in: [String]!): [String]!
      }
    `,
    plans: {
      Query: {
        echoListOfString(_, { $in }) {
          return $in;
        },
        echoListOfNonNullableString(_, { $in }) {
          return $in;
        },
        echoNonNullableListOfString(_, { $in }) {
          return $in;
        },
        echoNonNullableListOfNonNullableString(_, { $in }) {
          return $in;
        },
      },
    },
    enableDeferStream: false,
  });
};

it("executes with matching types", async () => {
  const schema = makeSchema(true);
  const source = /* GraphQL */ `
    query Q(
      $los1: [String]
      $los2: [String]
      $los3: [String]
      $los4: [String]
      $lonns1: [String!]
      $lonns2: [String!]
      $nnlos1: [String]!
      $nnlos2: [String]!
      $nnlos3: [String]!
      $nnlonns1: [String!]!
    ) {
      los1: echoListOfString(in: $los1)
      los2: echoListOfString(in: $los2)
      los3: echoListOfString(in: $los3)
      los4: echoListOfString(in: $los4)
      lonns1: echoListOfNonNullableString(in: $lonns1)
      lonns2: echoListOfNonNullableString(in: $lonns2)
      nnlos1: echoNonNullableListOfString(in: $nnlos1)
      nnlos2: echoNonNullableListOfString(in: $nnlos2)
      nnlos3: echoNonNullableListOfString(in: $nnlos3)
      nnlonns1: echoNonNullableListOfNonNullableString(in: $nnlonns1)
    }
  `;
  const variableValues = {
    los1: ["1", "2", "3"],
    los2: [null, "2", null],
    los3: [null, null, null],
    los4: null,
    lonns1: ["1", "2", "3"],
    lonns2: null,
    nnlos1: ["1", "2", "3"],
    nnlos2: [null, "2", null],
    nnlos3: [null, null, null],
    nnlonns1: ["1", "2", "3"],
  };
  const result = (await grafast(
    {
      schema,
      source,
      variableValues,
    },
    {},
    {},
  )) as ExecutionResult;
  expect(result.data).to.deep.equal(variableValues);
});

it("executes with stricter inner type", async () => {
  const schema = makeSchema(true);
  const source = /* GraphQL */ `
    query Q(
      $los1: [String!]
      $los4: [String!]
      $lonns1: [String!]
      $lonns2: [String!]
      $nnlos1: [String!]!
      $nnlonns1: [String!]!
    ) {
      los1: echoListOfString(in: $los1)
      los4: echoListOfString(in: $los4)
      lonns1: echoListOfNonNullableString(in: $lonns1)
      lonns2: echoListOfNonNullableString(in: $lonns2)
      nnlos1: echoNonNullableListOfString(in: $nnlos1)
      nnlonns1: echoNonNullableListOfNonNullableString(in: $nnlonns1)
    }
  `;
  const variableValues = {
    los1: ["1", "2", "3"],
    los4: null,
    lonns1: ["1", "2", "3"],
    lonns2: null,
    nnlos1: ["1", "2", "3"],
    nnlonns1: ["1", "2", "3"],
  };
  const result = (await grafast(
    {
      schema,
      source,
      variableValues,
    },
    {},
    {},
  )) as ExecutionResult;
  expect(result.data).to.deep.equal(variableValues);
});

it("executes with stricter outer type", async () => {
  const schema = makeSchema(true);
  const source = /* GraphQL */ `
    query Q(
      $los1: [String]!
      $los2: [String]!
      $los3: [String]!
      $lonns1: [String!]!
      $nnlos1: [String]!
      $nnlos2: [String]!
      $nnlos3: [String]!
      $nnlonns1: [String!]!
    ) {
      los1: echoListOfString(in: $los1)
      los2: echoListOfString(in: $los2)
      los3: echoListOfString(in: $los3)
      lonns1: echoListOfNonNullableString(in: $lonns1)
      nnlos1: echoNonNullableListOfString(in: $nnlos1)
      nnlos2: echoNonNullableListOfString(in: $nnlos2)
      nnlos3: echoNonNullableListOfString(in: $nnlos3)
      nnlonns1: echoNonNullableListOfNonNullableString(in: $nnlonns1)
    }
  `;
  const variableValues = {
    los1: ["1", "2", "3"],
    los2: [null, "2", null],
    los3: [null, null, null],
    lonns1: ["1", "2", "3"],
    nnlos1: ["1", "2", "3"],
    nnlos2: [null, "2", null],
    nnlos3: [null, null, null],
    nnlonns1: ["1", "2", "3"],
  };
  const result = (await grafast(
    {
      schema,
      source,
      variableValues,
    },
    {},
    {},
  )) as ExecutionResult;
  expect(result.data).to.deep.equal(variableValues);
});

it("executes with stricter inner and outer type", async () => {
  const schema = makeSchema(true);
  const source = /* GraphQL */ `
    query Q(
      $los1: [String!]!
      $lonns1: [String!]!
      $nnlos1: [String!]!
      $nnlonns1: [String!]!
    ) {
      los1: echoListOfString(in: $los1)
      lonns1: echoListOfNonNullableString(in: $lonns1)
      nnlos1: echoNonNullableListOfString(in: $nnlos1)
      nnlonns1: echoNonNullableListOfNonNullableString(in: $nnlonns1)
    }
  `;
  const variableValues = {
    los1: ["1", "2", "3"],
    lonns1: ["1", "2", "3"],
    nnlos1: ["1", "2", "3"],
    nnlonns1: ["1", "2", "3"],
  };
  const result = (await grafast(
    {
      schema,
      source,
      variableValues,
    },
    {},
    {},
  )) as ExecutionResult;
  expect(result.data).to.deep.equal(variableValues);
});
