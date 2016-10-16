/**
 * A narrower type than `any` that won’t swallow errors from assumptions about
 * code.
 *
 * For example `(x as any).anything()` is ok. That function then returns `any`
 * as well so the problem compounds into `(x as any).anything().else()` and the
 * problem just goes from there. `any` is a type black hole that swallows any
 * useful type information and shouldn’t be used unless you know what you’re
 * doing.
 *
 * With `mixed` you must *prove* the type is what you want to use.
 *
 * The `mixed` type is identical to the `mixed` type in Flow.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/9999
 * @see https://flowtype.org/docs/builtins.html#mixed
 */
declare type mixed = {} | string | number | boolean | undefined | null
