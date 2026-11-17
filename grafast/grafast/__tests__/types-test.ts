import type { Equals } from "tsafe";
import { assert } from "tsafe";

import type {
  __ValueStep,
  BatchFunction,
  ConstantStep,
  DataFromObjectSteps,
  FieldPlanResolver,
  ListStep,
  Step,
} from "../dist/index.js";
import {
  access,
  constant,
  defineBatchExecutor,
  get,
  loadOne,
} from "../dist/index.js";

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

const _batchTypes = (batch: BatchFunction) => {
  const executor = defineBatchExecutor({
    name: "type-test",
    callback: (options: { prefix: string }, keys: readonly number[]) =>
      keys.map((key) => options.prefix + key),
    optionsMatch: (left, right) => left.prefix === right.prefix,
  });
  const _result = batch(executor, [1], { prefix: "x" });
  assert<Equals<typeof _result, Promise<readonly string[]>>>();
  // @ts-expect-error Options are required by this executor.
  batch(executor, [1]);
  // @ts-expect-error Incorrect options type.
  batch(executor, [1], { prefix: 123 });
  // @ts-expect-error Incorrect keyset type.
  batch(executor, ["wrong"], { prefix: "x" });
  const optionalExecutor = defineBatchExecutor({
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
    name: "invalid-tuple-options",
    // @ts-expect-error Executors cannot declare tuple options.
    callback: (_options: readonly [string], keys: readonly number[]) => keys,
  });
};
