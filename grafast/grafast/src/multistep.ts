import { ExecutableStep } from "./step.js";
import { constant } from "./steps/constant.js";
import { list } from "./steps/list.js";
import { object } from "./steps/object.js";

/**
 * When using this, always use `const`! Otherwise tuples will show up as arrays
 * and break things.
 */
export type Multistep =
  | null
  | undefined
  | ExecutableStep
  | readonly [...(readonly ExecutableStep[])]
  | Record<string, ExecutableStep>;

export type UnwrapMultistep<TMultistepSpec extends Multistep> =
  TMultistepSpec extends null
    ? null
    : TMultistepSpec extends undefined
    ? undefined
    : TMultistepSpec extends ExecutableStep<infer U>
    ? U
    : TMultistepSpec extends readonly [...(readonly any[])]
    ? {
        [index in keyof TMultistepSpec]: TMultistepSpec[index] extends ExecutableStep<
          infer V
        >
          ? V
          : never;
      }
    : {
        [key in keyof TMultistepSpec]: TMultistepSpec[key] extends ExecutableStep<
          infer V
        >
          ? V
          : never;
      };

export function multistep<const TMultistepSpec extends Multistep>(
  spec: TMultistepSpec,
): ExecutableStep<UnwrapMultistep<TMultistepSpec>> {
  if (spec == null) {
    return constant(spec) as any;
  } else if (spec instanceof ExecutableStep) {
    return spec;
  } else if (isTuple(spec)) {
    return list(spec) as any;
  } else {
    return object(spec) as any;
  }
}

function isTuple<T extends readonly [...(readonly any[])]>(t: any | T): t is T {
  return Array.isArray(t);
}
