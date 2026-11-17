import type { Equals } from "tsafe";
import { assert } from "tsafe";

import type {
  __ValueStep,
  BatchFunction,
  ConstantStep,
  DataFromObjectSteps,
  ExecutionDetails,
  FieldPlanResolver,
  ListStep,
  LoadManyCallback,
  LoadOneCallback,
  PromiseOrDirect,
  Step,
} from "../dist/index.js";
import {
  access,
  constant,
  defineBatchExecutor,
  get,
  loadOne,
} from "../dist/index.js";
import { executeLoad } from "../dist/steps/_loadCommon.js";

type Expected = {
  test: number[];
};
type Test = DataFromObjectSteps<{ test: ListStep<ConstantStep<number>[]> }>;
assert<Equals<Test, Expected>>();

type TStep = __ValueStep<Grafast.Context>;
type TCtx = TStep extends Step<infer U> ? U : never;
assert<Equals<TCtx, Grafast.Context>>();

type StepValue<T extends Step> = T extends Step<infer U> ? U : never;
const _myPlan: FieldPlanResolver = () => {
  const $dependency = constant(1);
  const $record = loadOne($dependency, (dependencies) =>
    dependencies.map(() => ({ a: 1, b: 2, c: 3 })),
  );
  const _$a1 = get($record, "a");
  assert<Equals<StepValue<typeof _$a1>, number>>();
  const _$a2 = $record.get("a");
  assert<Equals<StepValue<typeof _$a2>, number>>();
  const _$a3 = access($record, "a");
  assert<Equals<StepValue<typeof _$a3>, number>>();

  const $nullableRecord = loadOne($dependency, (dependencies) =>
    dependencies.map(() => ({ a: 1 }) as { a: number } | null),
  );
  const _$nullableA1 = get($nullableRecord, "a");
  assert<Equals<StepValue<typeof _$nullableA1>, number | undefined>>();
  const _$nullableA2 = $nullableRecord.get("a");
  assert<Equals<StepValue<typeof _$nullableA2>, number | undefined>>();
  const _$nullableA3 = access($nullableRecord, "a");
  assert<Equals<StepValue<typeof _$nullableA3>, number | undefined>>();
  return constant(null);
};

// Internal adapter types must preserve the same guarantees as the public loaders.
const _batchTypes = (batch: BatchFunction) => {
  const executor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "type-test",
    callback: (options: { prefix: string }, keys: readonly number[]) =>
      keys.map((key) => options.prefix + key),
    optionsMatch: (left, right) => {
      assert<Equals<typeof left, { prefix: string }>>();
      assert<Equals<typeof right, { prefix: string }>>();
      return left.prefix === right.prefix;
    },
  });
  const _result = batch(executor, [1], { prefix: "x" });
  assert<Equals<typeof _result, PromiseOrDirect<readonly string[]>>>();
  // @ts-expect-error Options are required by this executor.
  batch(executor, [1]);
  // @ts-expect-error Incorrect options type.
  batch(executor, [1], { prefix: 123 });
  // @ts-expect-error Incorrect keyset type.
  batch(executor, ["wrong"], { prefix: "x" });
  // @ts-expect-error Every executor must explicitly declare keyset equality.
  defineBatchExecutor({
    name: "missing-equality",
    callback: executor.callback,
  });
  const optionalExecutor = defineBatchExecutor({
    keysetEquality: "strict",
    name: "optional-type-test",
    callback: (
      options: { prefix: string } | undefined,
      keys: readonly number[],
    ) => keys.map((key) => `${options?.prefix}:${key}`),
  });
  batch(optionalExecutor, [1]);
  batch(optionalExecutor, [1], { prefix: "x" });
  batch(optionalExecutor, [1], undefined);
  // @ts-expect-error Options must be a record, not an array.
  batch(optionalExecutor, [1], []);
  // @ts-expect-error Options must be a record, not a primitive.
  batch(optionalExecutor, [1], "x");
  // @ts-expect-error Null is not a valid options record.
  batch(optionalExecutor, [1], null);
  defineBatchExecutor({
    keysetEquality: "strict",
    name: "invalid-tuple-options",
    // @ts-expect-error Executors cannot declare tuple options.
    callback: (_options: readonly [string], keys: readonly number[]) => keys,
  });
};

const _executeLoadTypes = (
  details: ExecutionDetails<readonly [number, ...unknown[]]>,
  wrongDetails: ExecutionDetails<readonly [string, ...unknown[]]>,
  one: LoadOneCallback<
    number,
    { id: number },
    { id: number } | null,
    { limit: number },
    { tenant: string }
  >,
  many: LoadManyCallback<
    number,
    { id: number },
    readonly { id: number }[],
    { limit: number },
    { tenant: string }
  >,
) => {
  type Item = { id: number };
  type Params = { limit: number };
  type Shared = { tenant: string };
  const executeOne = executeLoad<number, Item, Item | null, Params, Shared>;
  const _result = executeOne(
    details,
    1,
    { limit: 2 },
    { attributes: ["id"] },
    one,
    "strict",
  );
  assert<
    Equals<
      typeof _result,
      PromiseOrDirect<ReadonlyArray<PromiseOrDirect<Item | null>>>
    >
  >();
  const _inferred = executeLoad(
    details,
    1,
    { limit: 2 },
    { attributes: ["id"] },
    one,
    "strict",
  );
  assert<Equals<typeof _inferred, typeof _result>>();
  executeOne(
    // @ts-expect-error The lookup dependency must yield the callback's key type.
    wrongDetails,
    1,
    { limit: 2 },
    { attributes: ["id"] },
    one,
    "strict",
  );
  executeOne(
    details,
    1,
    { limit: 2 },
    // @ts-expect-error Attributes must belong to the loaded item type.
    { attributes: ["missing"] },
    one,
    "strict",
  );
  // @ts-expect-error A loadMany callback cannot yield a loadOne result.
  executeOne(details, 1, { limit: 2 }, { attributes: ["id"] }, many, "strict");
  const _results = executeLoad<number, Item, readonly Item[], Params, Shared>(
    details,
    1,
    { limit: 2 },
    { attributes: ["id"] },
    many,
    "strict",
  );
  assert<
    Equals<
      typeof _results,
      PromiseOrDirect<ReadonlyArray<PromiseOrDirect<readonly Item[]>>>
    >
  >();
};
