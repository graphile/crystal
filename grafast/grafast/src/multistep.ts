import type { Thunk } from "./interfaces.ts";
import { Step } from "./step.ts";
import { constant } from "./steps/constant.ts";
import { list } from "./steps/list.ts";
import { object } from "./steps/object.ts";
import { isTuple } from "./utils.ts";

/**
 * When using this, always use `const`! Otherwise tuples will show up as arrays
 * and break things.
 */
export type Multistep =
  | null
  | undefined
  | Step
  | readonly [...(readonly Step[])]
  | Record<string, Step>;

export type UnwrapMultistep<TMultistepSpec extends Multistep> =
  TMultistepSpec extends null
    ? null
    : TMultistepSpec extends undefined
      ? undefined
      : TMultistepSpec extends Step<infer U>
        ? U
        : TMultistepSpec extends readonly [...(readonly any[])]
          ? {
              [index in keyof TMultistepSpec]: TMultistepSpec[index] extends Step<
                infer V
              >
                ? V
                : never;
            }
          : {
              [key in keyof TMultistepSpec]: TMultistepSpec[key] extends Step<
                infer V
              >
                ? V
                : never;
            };

interface MultistepCacheConfig {
  identifier: string;
  cacheSize: number;
}

export function multistep<const TMultistepSpec extends Multistep>(
  specOrThunk: Thunk<TMultistepSpec>,
  stable?: string | true | MultistepCacheConfig,
): Step<UnwrapMultistep<TMultistepSpec>> {
  const spec = typeof specOrThunk === "function" ? specOrThunk() : specOrThunk;
  if (spec == null) {
    return constant(spec) as any;
  } else if (spec instanceof Step) {
    return spec;
  } else if (isTuple(spec)) {
    const config =
      stable === true
        ? { identifier: `multistep` }
        : typeof stable === "string"
          ? { identifier: stable }
          : stable;
    const $step = list(spec, config);
    return $step as any;
  } else {
    const config =
      stable === true
        ? { identifier: `multistep` }
        : typeof stable === "string"
          ? { identifier: stable }
          : stable;
    const $step = object(spec, config);
    return $step as any;
  }
}

export function isMultistep<const TMultistepSpec extends Multistep>(
  spec: any,
): spec is TMultistepSpec {
  if (spec == null) {
    return true;
  } else if (spec instanceof Step) {
    return true;
  } else if (isTuple(spec) && spec.every((s) => s instanceof Step)) {
    return true;
  } else if (
    typeof spec === "object" &&
    Object.values(spec).every((s) => s instanceof Step)
  ) {
    return true;
  } else {
    return false;
  }
}
