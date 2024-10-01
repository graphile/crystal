import { ExecutableStep } from "./step.js";
import { constant } from "./steps/constant.js";
import { list } from "./steps/list.js";
import { object } from "./steps/object.js";
import { isTuple } from "./utils.js";

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
  stable?: string | true,
): ExecutableStep<UnwrapMultistep<TMultistepSpec>> {
  if (spec == null) {
    return constant(spec) as any;
  } else if (spec instanceof ExecutableStep) {
    return spec;
  } else if (isTuple(spec)) {
    const $step = list(spec);
    if (typeof stable === "string") {
      $step.metaKey = `${stable}|list|${spec.length}`;
    } else if (stable === true) {
      $step.metaKey = `multistep|list|${spec.length}`;
    }
    return $step as any;
  } else {
    const $step = object(spec);
    if (typeof stable === "string") {
      $step.metaKey = `${stable}|object|${JSON.stringify(Object.keys(spec))}`;
    } else if (stable === true) {
      $step.metaKey = `multistep|object|${JSON.stringify(Object.keys(spec))}`;
    }
    return $step as any;
  }
}

export function isMultistep<const TMultistepSpec extends Multistep>(
  spec: any,
): spec is TMultistepSpec {
  if (spec == null) {
    return true;
  } else if (spec instanceof ExecutableStep) {
    return true;
  } else if (isTuple(spec) && spec.every((s) => s instanceof ExecutableStep)) {
    return true;
  } else if (
    typeof spec === "object" &&
    Object.values(spec).every((s) => s instanceof ExecutableStep)
  ) {
    return true;
  } else {
    return false;
  }
}
