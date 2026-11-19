import type { FieldArgs } from "../dist/index.js";
import { lambda } from "../dist/index.js";

// TODO: ensure this test file is typechecked

function _typecheckLambdaFieldArgs(fieldArgs: FieldArgs<{ arr: string[] }>) {
  return lambda(fieldArgs.getRaw(), (args) => {
    const { arr } = args;
    // @ts-expect-error `arr` is a string array, not a number.
    const _notANumber: number = arr;
    return arr.length;
  });
}
