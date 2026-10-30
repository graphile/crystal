import type { Equals } from "tsafe";
import { assert } from "tsafe";

import type {
  __ValueStep,
  ConstantStep,
  DataFromObjectSteps,
  FieldPlanResolver,
  ListStep,
  Step,
} from "../dist/index.js";
import { access, constant, get, loadOne } from "../dist/index.js";

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
