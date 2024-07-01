import type { Equals } from "tsafe";
import { assert } from "tsafe";

import type {
  ConstantStep,
  DataFromObjectSteps,
  ListStep,
} from "../dist/index.js";

type Expected = {
  test: number[];
};

type Test = DataFromObjectSteps<{ test: ListStep<ConstantStep<number>[]> }>;

assert<Equals<Test, Expected>>();
