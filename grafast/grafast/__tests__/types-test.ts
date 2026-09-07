import type { Equals } from "tsafe";
import { assert } from "tsafe";

import type {
  __ValueStep,
  ConstantStep,
  DataFromObjectSteps,
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

const $dependency = constant(1);
const $record = loadOne($dependency, (dependencies) =>
  dependencies.map(() => ({ a: 1, b: 2, c: 3 })),
);
const $a1 = get($record, "a");
const $a2 = $record.get("a");
const $a3 = access($record, "a");
