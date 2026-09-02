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
  inhibitOnEmpty,
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
        inhibitOnEmptyString(value: String): String
        inhibitOnEmptyList(value: [Int!]): [Int]!
        inhibitOnEmptyInput(input: EmptyableInput): String
        inhibitOnEmptyBoolean(value: Boolean): Boolean
        inhibitOnEmptyInt(value: Int): Int
        inhibitIfList(value: [Int!]): [Int]!
        inhibitIfPreservesErrors(setNullToError: Int): Int
        inhibitIfPreservesInhibition(setNullToNull: Int): Int
        mySideEffect: Int
        mySideEffectError: MySideEffectError
        implicitSideEffectErrorIsTrapped: Int
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
          inhibitOnEmptyString(_, { $value }) {
            const $guarded = inhibitOnEmpty($value);
            return trap($guarded, TRAP_INHIBITED, {
              valueForInhibited: "NULL",
            });
          },
          inhibitOnEmptyList(_, { $value }) {
            const $guarded = inhibitOnEmpty($value);
            const $result = lambda(
              $guarded,
              (list) => [0, ...list.map((n: number) => n + 1)],
              true,
            );
            return trap($result, TRAP_INHIBITED, {
              valueForInhibited: "EMPTY_LIST",
            });
          },
          inhibitOnEmptyInput(_, { $input }) {
            const $guarded = inhibitOnEmpty($input);
            const $result = lambda($guarded, () => "NOT_EMPTY", true);
            return trap($result, TRAP_INHIBITED, {
              valueForInhibited: "NULL",
            });
          },
          inhibitOnEmptyBoolean(_, { $value }) {
            const $guarded = inhibitOnEmpty($value);
            return trap($guarded, TRAP_INHIBITED, {
              valueForInhibited: "NULL",
            });
          },
          inhibitOnEmptyInt(_, { $value }) {
            const $guarded = inhibitOnEmpty($value);
            return trap($guarded, TRAP_INHIBITED, {
              valueForInhibited: "NULL",
            });
          },
          inhibitIfList(_, { $value }) {
            const $isEmpty = lambda($value, (list) => list.length === 0, true);
            const $guarded = inhibitIf($value, $isEmpty);
            const $result = lambda(
              $guarded,
              (list) => [0, ...list.map((n: number) => n + 1)],
              true,
            );
            return trap($result, TRAP_INHIBITED, {
              valueForInhibited: "EMPTY_LIST",
            });
          },
          inhibitIfPreservesErrors(_, { $setNullToError }) {
            const $a = assertNotNull($setNullToError, "Null!");
            const $guarded = inhibitIf($a, constant(false));
            return $guarded;
          },
          inhibitIfPreservesInhibition(_, { $setNullToNull }) {
            const $a = inhibitOnNull($setNullToNull);
            const $guarded = inhibitIf($a, constant(false));
            const $result = lambda($guarded, () => 42, true);
            return trap($result, TRAP_INHIBITED, {
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
          implicitSideEffectErrorIsTrapped() {
            const $a = constant(1);
            sideEffect($a, () => {
              throw new Error("Implicit side effect failed");
            });
            const $trapped = trap($a, TRAP_ERROR, {
              valueForError: "NULL",
            });
            return lambda($trapped, (trapped) => {
              return trapped == null ? 42 : trapped;
            });
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
it("traps errors from implicit side effects", async () => {
  const schema = makeSchema();
  const result = (await grafast({
    schema,
    source: /* GraphQL */ `
      query Q {
        implicitSideEffectErrorIsTrapped
      }
    `,
    contextValue: {},
    resolvedPreset,
    requestContext,
  })) as ExecutionResult;
  expect(result).to.deep.equal({
    data: { implicitSideEffectErrorIsTrapped: 42 },
  });
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

it("preserves errors", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query Q {
      preservedError: inhibitIfPreservesErrors(setNullToError: null)
    }
  `;
  const result = (await grafast({ source, schema })) as ExecutionResult;
  expect(result.errors).to.have.length(1);
  const firstError = result.errors![0];
  expect(firstError.path).to.deep.equal(["preservedError"]);
  expect(firstError.message).to.equal("Null!");
  expect(result.data).to.deep.equal({
    preservedError: null, // Also check `errors`
  });
});

it("supports inhibitIf and inhibitOnEmpty", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query Q {
      emptyString: inhibitOnEmptyString(value: "")
      nonEmptyString: inhibitOnEmptyString(value: "hi")
      emptyList: inhibitOnEmptyList(value: [])
      nonEmptyList: inhibitOnEmptyList(value: [1, 2])
      emptyInput: inhibitOnEmptyInput(input: {})
      nonEmptyInput: inhibitOnEmptyInput(input: { a: 1 })
      falseBoolean: inhibitOnEmptyBoolean(value: false)
      trueBoolean: inhibitOnEmptyBoolean(value: true)
      nullBoolean: inhibitOnEmptyBoolean(value: null)
      zeroValue: inhibitOnEmptyInt(value: 0)
      inhibitEmptyList: inhibitIfList(value: [])
      inhibitNonEmptyList: inhibitIfList(value: [3, 4])
      preservedInhibition: inhibitIfPreservesInhibition(setNullToNull: null)
    }
  `;
  const result = (await grafast({ source, schema })) as ExecutionResult;
  expect(result.errors).to.not.exist;
  expect(result.data).to.deep.equal({
    emptyString: null,
    nonEmptyString: "hi",
    emptyList: [], // No `0` prefixed, was inhibited
    nonEmptyList: [0, 2, 3],
    emptyInput: null,
    nonEmptyInput: "NOT_EMPTY",
    falseBoolean: false, // False is not "empty"
    trueBoolean: true,
    nullBoolean: null, // Can't really tell :D
    zeroValue: 0, // 0 is not "empty"
    inhibitEmptyList: [], // No `0` prefixed, so inhibited
    inhibitNonEmptyList: [0, 4, 5],
    preservedInhibition: null, // If inhibition was lost, this would be 42
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
