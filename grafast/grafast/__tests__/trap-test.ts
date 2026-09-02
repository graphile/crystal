/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import { FLAG_ERROR } from "../dist/constants.js";
import type { ExecutionDetails } from "../dist/index.js";
import {
  assertNotNull,
  constant,
  context,
  grafast,
  inhibitIf,
  inhibitOnEmpty,
  inhibitOnNull,
  lambda,
  list,
  makeGrafastSchema,
  sideEffect,
  Step,
  trap,
  TRAP_ERROR,
  TRAP_INHIBITED,
  UnbatchedStep,
} from "../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

class ForcedUnbatchedStep extends UnbatchedStep<number> {
  isSyncAndSafe = true;

  add($step: Step) {
    this.addDependency($step);
  }

  unbatchedExecute(): number {
    throw new Error("ForcedUnbatchedStep should not execute");
  }
}

class FlagInspectorStep extends Step<number> {
  isSyncAndSafe = true;

  add($step: Step) {
    this.addDependency({
      step: $step,
      acceptFlags: TRAP_ERROR | TRAP_INHIBITED,
    });
  }

  execute({ values: [v], indexMap }: ExecutionDetails<[unknown]>) {
    return indexMap((i) => v._flagsAt(i));
  }
}

declare global {
  namespace Grafast {
    interface Context {
      beforeTrap?: boolean;
    }
  }
}

const implicitSideEffectErrorPlan = (
  mode: "trap" | "inhibit",
  $condition?: Step<boolean>,
) => {
  const $context = context();
  const $a = constant(1);
  sideEffect($a, () => {
    throw new Error("Implicit side effect failed");
  });
  sideEffect([$a, $context], ([a, context]) => {
    context.beforeTrap = true;
    return a + 1;
  });
  const $trapped =
    mode === "trap"
      ? trap($a, TRAP_ERROR, {
          if: $condition ?? undefined,
          valueForError: "NULL",
        })
      : inhibitOnNull($a);
  return lambda($a, (a) => a + 3, true);
};

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
        trapInhibitedAfterSideEffect(someList: [Int!]): [Int]
        doesNotInheritInhibitionFromSideEffect(someList: [Int!]): Int
        inhibitIfList(value: [Int!]): [Int]!
        inhibitIfPreservesErrors(setNullToError: Int): Int
        inhibitIfPreservesInhibition(setNullToNull: Int): Int
        mySideEffect: Int
        mySideEffectError: MySideEffectError
        forcedUnbatchedErrorFlags: Int
        implicitSideEffectErrorIsTrapped: Int
        implicitSideEffectErrorIsConditionallyTrapped(condition: Boolean!): Int
        implicitSideEffectErrorIsConditionallyNotTrapped(
          condition: Boolean!
        ): Int
        implicitSideEffectErrorIsNotTrapped: Int
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
          trapInhibitedAfterSideEffect(_, { $someList }) {
            const $a = inhibitOnEmpty($someList);
            sideEffect($a, () => {
              throw new Error("This side effect should be inhibited");
            });
            const $b = lambda(
              $a,
              (list: number[]) => list.map((n) => n + 1),
              true,
            );
            return trap($b, TRAP_INHIBITED, {
              valueForInhibited: "EMPTY_LIST",
            });
          },
          doesNotInheritInhibitionFromSideEffect(_, { $someList }) {
            const $a = inhibitOnEmpty($someList);
            sideEffect($a, () => {
              throw new Error("This side effect should be inhibited");
            });
            return lambda(null, () => 42);
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
          forcedUnbatchedErrorFlags() {
            const $forced = new ForcedUnbatchedStep();
            const $inspector = new FlagInspectorStep();
            const $a = constant(1);
            sideEffect($a, () => {
              throw new Error("Forced unbatched error");
            });
            const $errored = lambda($a, (a) => a + 1, true);
            $forced.add($errored);
            $inspector.add($forced);
            return $inspector;
          },
          implicitSideEffectErrorIsTrapped() {
            return implicitSideEffectErrorPlan("trap");
          },
          implicitSideEffectErrorIsConditionallyTrapped(_, { $condition }) {
            return implicitSideEffectErrorPlan("trap", $condition);
          },
          implicitSideEffectErrorIsConditionallyNotTrapped(_, { $condition }) {
            const $context = context();
            const $a = constant(1);
            const $se1 = sideEffect($a, () => {
              throw new Error("Implicit side effect failed");
            });
            const $se2 = sideEffect([$a, $context], ([a, context]) => {
              context.beforeTrap = true;
              return a + 1;
            });
            const $trapped = trap($a, TRAP_ERROR, {
              if: $condition,
              valueForError: "NULL",
            });
            expect($se2.implicitSideEffectStep).to.equal($se1);
            expect($trapped.hasSideEffects).to.equal(true);
            // The constructor makes this implicit dependency explicit.
            expect($trapped.implicitSideEffectStep).to.equal(null);
            expect(
              ($trapped as unknown as { dependencies: readonly Step[] })
                .dependencies[2],
            ).to.equal($se2);
            const $afterTrap = lambda($a, (a) => a + 3, true);
            expect($afterTrap.implicitSideEffectStep).to.equal($trapped);
            return $afterTrap;
          },
          implicitSideEffectErrorIsNotTrapped() {
            return implicitSideEffectErrorPlan("inhibit");
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
const executeImplicitSideEffectError = async (
  fieldName: string,
  condition?: boolean,
) => {
  const schema = makeSchema();
  const contextValue = {} as Grafast.Context;
  const result = (await grafast({
    schema,
    source: /* GraphQL */ `
      query Q${condition === undefined ? "" : "($condition: Boolean!)"} {
        ${fieldName}${condition === undefined ? "" : "(condition: $condition)"}
      }
    `,
    variableValues: condition === undefined ? undefined : { condition },
    contextValue,
    resolvedPreset,
    requestContext,
  })) as ExecutionResult;
  return { contextValue, result };
};

it("does not add inhibition to forced errors in unbatched steps", async () => {
  const result = await grafast({
    schema: makeSchema(),
    source: /* GraphQL */ `
      query Q {
        forcedUnbatchedErrorFlags
      }
    `,
    contextValue: {} as Grafast.Context,
    resolvedPreset,
    requestContext,
  });
  expect(result).to.deep.equal({
    data: {
      forcedUnbatchedErrorFlags:
        FLAG_ERROR /* Explicitly NOT FLAG_ERROR | FLAG_INHIBITED */,
    },
  });
});

it("traps errors from implicit side effects", async () => {
  const { contextValue, result } = await executeImplicitSideEffectError(
    "implicitSideEffectErrorIsTrapped",
  );
  expect(result).to.deep.equal({
    data: { implicitSideEffectErrorIsTrapped: 4 },
  });
  expect(contextValue.beforeTrap).to.be.undefined;
});

it("conditionally traps errors from implicit side effects", async () => {
  const { contextValue, result } = await executeImplicitSideEffectError(
    "implicitSideEffectErrorIsConditionallyTrapped",
    true,
  );
  expect(result).to.deep.equal({
    data: { implicitSideEffectErrorIsConditionallyTrapped: 4 },
  });
  expect(contextValue.beforeTrap).to.be.undefined;
});

it("does not trap errors from implicit side effects with inhibitOnNull", async () => {
  const { contextValue, result } = await executeImplicitSideEffectError(
    "implicitSideEffectErrorIsNotTrapped",
  );
  expect(result.data).to.deep.equal({
    implicitSideEffectErrorIsNotTrapped: null,
  });
  expect(result.errors?.map((error) => error.message)).to.deep.equal([
    "Implicit side effect failed",
  ]);
  expect(contextValue.beforeTrap).to.be.undefined;
});

it("does not trap errors when the conditional trap condition is false", async () => {
  const { contextValue, result } = await executeImplicitSideEffectError(
    "implicitSideEffectErrorIsConditionallyNotTrapped",
    false,
  );
  expect(result.data).to.deep.equal({
    implicitSideEffectErrorIsConditionallyNotTrapped: null,
  });
  expect(result.errors?.map((error) => error.message)).to.deep.equal([
    "Implicit side effect failed",
  ]);
  expect(contextValue.beforeTrap).to.be.undefined;
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

it("traps inhibition inherited through a side effect", async () => {
  const result = (await grafast({
    source: /* GraphQL */ `
      query Q {
        trapInhibitedAfterSideEffect(someList: [])
      }
    `,
    schema: makeSchema(),
  })) as ExecutionResult;
  expect(result).to.deep.equal({
    data: { trapInhibitedAfterSideEffect: [] },
  });
});

it("does not inherit inhibition from an implicit side effect", async () => {
  const result = (await grafast({
    source: /* GraphQL */ `
      query Q {
        doesNotInheritInhibitionFromSideEffect(someList: [])
      }
    `,
    schema: makeSchema(),
  })) as ExecutionResult;
  expect(result).to.deep.equal({
    data: { doesNotInheritInhibitionFromSideEffect: 42 },
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
