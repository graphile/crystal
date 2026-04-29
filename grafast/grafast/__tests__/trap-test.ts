/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import {
  assertNotNull,
  constant,
  grafast,
  inhibitIf,
  inhibitIfEmpty,
  inhibitOnNull,
  lambda,
  list,
  makeGrafastSchema,
  sideEffect,
  trap,
  TRAP_ERROR,
  TRAP_INHIBITED,
} from "../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

const makeSchema = () => {
  return makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Error {
        message: String
      }
      type Query {
        unhandledError(setNullToError: Int): Int
        errorToNull(setNullToError: Int): Int
        errorToEmptyList(setNullToError: Int): [Int]
        errorToError(setNullToError: Int): Error
        inhibitIfEmptyString(value: String): String
        inhibitIfEmptyList(value: [Int!]): [Int]!
        inhibitIfEmptyInput(input: EmptyableInput): String
        inhibitIfEmptyBoolean(value: Boolean): Boolean
        inhibitIfEmptyInt(value: Int): Int
        inhibitIfList(value: [Int!]): [Int]!
        inhibitIfPreservesErrors(setNullToError: Int): Int
        inhibitIfPreservesInhibition(setNullToNull: Int): Int
        mySideEffect: Int
        mySideEffectError: MySideEffectError
      }
      input EmptyableInput {
        a: Int
      }
      type MySideEffectError {
        message: String!
        errcode: Int!
        detail: String!
      }
    `,
    objects: {
      Query: {
        plans: {
          unhandledError(_, { $setNullToError }) {
            const $a = assertNotNull($setNullToError, "Null!");
            return $a;
          },
          errorToNull(_, { $setNullToError }) {
            const $a = assertNotNull($setNullToError, "Null!");
            return trap($a, TRAP_ERROR, { valueForError: "NULL" });
          },
          errorToEmptyList(_, { $setNullToError }) {
            const $a = assertNotNull($setNullToError, "Null!");
            const $list = list([$a]);
            return trap($list, TRAP_ERROR, { valueForError: "EMPTY_LIST" });
          },
          errorToError(_, { $setNullToError }) {
            const $a = assertNotNull($setNullToError, "Null!");
            const $derived = lambda($a, () => null, true);
            return trap($derived, TRAP_ERROR, {
              valueForError: "PASS_THROUGH",
            });
          },
          inhibitIfEmptyString(_, { $value }) {
            const $guarded = inhibitIfEmpty($value);
            return trap($guarded, TRAP_INHIBITED, {
              valueForInhibited: "NULL",
            });
          },
          inhibitIfEmptyList(_, { $value }) {
            const $guarded = inhibitIfEmpty($value);
            const $result = lambda(
              $guarded,
              (list) => list.map((n: number) => n + 1),
              true,
            );
            return trap($result, TRAP_INHIBITED, {
              valueForInhibited: "EMPTY_LIST",
            });
          },
          inhibitIfEmptyInput(_, { $input }) {
            const $guarded = inhibitIfEmpty($input);
            const $result = lambda($guarded, () => "NOT_EMPTY", true);
            return trap($result, TRAP_INHIBITED, {
              valueForInhibited: "NULL",
            });
          },
          inhibitIfEmptyBoolean(_, { $value }) {
            const $guarded = inhibitIfEmpty($value);
            return trap($guarded, TRAP_INHIBITED, {
              valueForInhibited: "NULL",
            });
          },
          inhibitIfEmptyInt(_, { $value }) {
            const $guarded = inhibitIfEmpty($value);
            return trap($guarded, TRAP_INHIBITED, {
              valueForInhibited: "NULL",
            });
          },
          inhibitIfList(_, { $value }) {
            const $isEmpty = lambda($value, (list) => list.length === 0, true);
            const $guarded = inhibitIf($value, $isEmpty);
            const $result = lambda(
              $guarded,
              (list) => list.map((n: number) => n + 1),
              true,
            );
            return trap($result, TRAP_INHIBITED, {
              valueForInhibited: "EMPTY_LIST",
            });
          },
          inhibitIfPreservesErrors(_, { $setNullToError }) {
            const $a = assertNotNull($setNullToError, "Null!");
            const $guarded = inhibitIf($a, constant(false));
            return trap($guarded, TRAP_ERROR, { valueForError: "NULL" });
          },
          inhibitIfPreservesInhibition(_, { $setNullToNull }) {
            const $a = inhibitOnNull($setNullToNull);
            const $guarded = inhibitIf($a, constant(false));
            return trap($guarded, TRAP_INHIBITED, {
              valueForInhibited: "NULL",
            });
          },
          mySideEffect() {
            const $sideEffect = sideEffect(null, () => {
              throw new Error("Test");
            });
            const $trap = trap($sideEffect, TRAP_ERROR, {
              valueForError: "PASS_THROUGH",
            });
            return lambda($trap, () => {
              return 1;
            });
          },
          mySideEffectError() {
            const $sideEffect = sideEffect(null, () => {
              throw Object.assign(new Error("Test 2"), {
                errcode: 42,
                detail: "Goodbye, and thanks for all the fish!",
              });
            });
            const $errorValue = trap($sideEffect, TRAP_ERROR, {
              valueForError: "PASS_THROUGH",
            });
            return $errorValue;
          },
        },
      },
    },
    enableDeferStream: false,
  });
};

it("schema works as expected", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query Q {
      nonError: unhandledError(setNullToError: 2)
      error: unhandledError(setNullToError: null)
    }
  `;
  const variableValues = {};
  const result = (await grafast({
    schema,
    source,
    variableValues,
    contextValue: {},
    resolvedPreset,
    requestContext,
  })) as ExecutionResult;
  expect(result.errors).to.exist;
  expect(result.errors).to.have.length(1);
  expect(result.errors![0].path).to.deep.equal(["error"]);
  expect(result.errors![0].message).to.equal("Null!");
  expect(result.data).to.deep.equal({ nonError: 2, error: null });
});
it("enables trapping an error to null", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query Q {
      nonError: errorToNull(setNullToError: 2)
      error: errorToNull(setNullToError: null)
    }
  `;
  const variableValues = {};
  const result = (await grafast({
    schema,
    source,
    variableValues,
    contextValue: {},
    resolvedPreset,
    requestContext,
  })) as ExecutionResult;
  expect(result.errors).to.not.exist;
  expect(result.data).to.deep.equal({ nonError: 2, error: null });
});
it("enables trapping an error to emptyList", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query Q {
      nonError: errorToEmptyList(setNullToError: 2)
      error: errorToEmptyList(setNullToError: null)
    }
  `;
  const variableValues = {};
  const result = (await grafast({
    schema,
    source,
    variableValues,
    contextValue: {},
    resolvedPreset,
    requestContext,
  })) as ExecutionResult;
  expect(result.errors).to.not.exist;
  expect(result.data).to.deep.equal({ nonError: [2], error: [] });
});
it("enables trapping an error to error", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query Q {
      nonError: errorToError(setNullToError: 2) {
        message
      }
      error: errorToError(setNullToError: null) {
        message
      }
    }
  `;
  const variableValues = {};
  const result = (await grafast({
    schema,
    source,
    variableValues,
    contextValue: {},
    resolvedPreset,
    requestContext,
  })) as ExecutionResult;
  expect(result.errors).to.not.exist;
  expect(result.data).to.deep.equal({
    nonError: null,
    error: { message: "Null!" },
  });
});

it("supports inhibitIf and inhibitIfEmpty", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query Q {
      emptyString: inhibitIfEmptyString(value: "")
      nonEmptyString: inhibitIfEmptyString(value: "hi")
      emptyList: inhibitIfEmptyList(value: [])
      nonEmptyList: inhibitIfEmptyList(value: [1, 2])
      emptyInput: inhibitIfEmptyInput(input: {})
      nonEmptyInput: inhibitIfEmptyInput(input: { a: 1 })
      falseValue: inhibitIfEmptyBoolean(value: false)
      zeroValue: inhibitIfEmptyInt(value: 0)
      inhibitEmptyList: inhibitIfList(value: [])
      inhibitNonEmptyList: inhibitIfList(value: [3, 4])
      preservedError: inhibitIfPreservesErrors(setNullToError: null)
      preservedInhibition: inhibitIfPreservesInhibition(setNullToNull: null)
    }
  `;
  const result = (await grafast({ source, schema })) as ExecutionResult;
  expect(result.errors).to.not.exist;
  expect(result.data).to.deep.equal({
    emptyString: null,
    nonEmptyString: "hi",
    emptyList: [],
    nonEmptyList: [2, 3],
    emptyInput: null,
    nonEmptyInput: "NOT_EMPTY",
    falseValue: false,
    zeroValue: 0,
    inhibitEmptyList: [],
    inhibitNonEmptyList: [4, 5],
    preservedError: null,
    preservedInhibition: null,
  });
});

it("traps errors thrown in side effects in the chain", async () => {
  const schema = makeSchema();

  const source = /* GraphQL */ `
    query withSideEffects {
      mySideEffect
    }
  `;
  const result = await grafast({ source, schema });
  expect(result).to.deep.equal({ data: { mySideEffect: 1 } });
});

it("traps errors thrown in side effects in the chain and allows pass-through", async () => {
  const schema = makeSchema();

  const source = /* GraphQL */ `
    query withSideEffects {
      mySideEffectError {
        message
        errcode
        detail
      }
    }
  `;
  const result = await grafast({ source, schema });
  expect(result).to.deep.equal({
    data: {
      mySideEffectError: {
        message: "Test 2",
        errcode: 42,
        detail: "Goodbye, and thanks for all the fish!",
      },
    },
  });
});
