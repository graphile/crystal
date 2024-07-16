import type { Equals } from "tsafe";
import { assert } from "tsafe";

import type {
  __ValueStep,
  ConstantStep,
  DataFromObjectSteps,
  ExecutableStep,
  ListStep,
} from "../dist/index.js";

type Expected = {
  test: number[];
};
type Test = DataFromObjectSteps<{ test: ListStep<ConstantStep<number>[]> }>;
assert<Equals<Test, Expected>>();

type TStep = __ValueStep<Grafast.Context>;
type TCtx = TStep extends ExecutableStep<infer U> ? U : never;
assert<Equals<TCtx, Grafast.Context>>();
