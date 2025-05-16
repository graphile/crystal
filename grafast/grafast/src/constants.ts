export const $$hooked = Symbol("hookArgsApplied");

export const $$grafastContext = Symbol("context");
export const $$planResults = Symbol("planResults");
export const $$id = Symbol("id");
/** Return the value verbatim, don't execute */
export const $$verbatim = Symbol("verbatim");
/**
 * If we're sure the data is the right shape and valid, we can set this key and
 * it can be returned directly
 */
export const $$bypassGraphQL = Symbol("bypassGraphQL");
export const $$data = Symbol("data");
/**
 * For attaching additional metadata to the GraphQL execution result, for
 * example details of the plan or SQL queries or similar that were executed.
 */
export const $$extensions = Symbol("extensions");

/**
 * Set this key on a type if that type's serialization is idempotent (that is
 * to say `serialize(serialize(thing)) === serialize(thing)`). This means we
 * don't have to "roll-back" serialization if we need to fallback to graphql-js
 * execution.
 */
export const $$idempotent = Symbol("idempotent");

/**
 * The event emitter used for outputting execution events.
 */
export const $$eventEmitter = Symbol("executionEventEmitter");

/**
 * Used to indicate that an array has more results available via a stream.
 */
export const $$streamMore = Symbol("streamMore");

export const $$proxy = Symbol("proxy");

/**
 * If an error has this property set then it's safe to send through to the user
 * without being masked.
 */
export const $$safeError = Symbol("safeError");

/** The layerPlan used as a subroutine for this step */
export const $$subroutine = Symbol("subroutine");

/** For tracking the timeout a TimeoutError happened from */
export const $$timeout = Symbol("timeout");

/** For tracking _when_ the timeout happened (because once the JIT has warmed it might not need so long) */
export const $$ts = Symbol("timestamp");

/**
 * @internal
 */
export const $$deepDepSkip = Symbol("deepDepSkip_experimental");

export const $$queryCache = Symbol("queryCache");

/**
 * We store the cache directly onto the GraphQLSchema so that it gets garbage
 * collected along with the schema when it's not needed any more. To do so, we
 * attach it using this symbol.
 */
export const $$cacheByOperation = Symbol("cacheByOperation");

export const $$contextPlanCache = Symbol("contextPlanCache");

/**
 * A bitwise number representing a number of flags:
 *
 * - 0: normal execution value
 * - 1: errored (trappable)
 * - 2: null (trappable)
 * - 4: inhibited (trappable)
 * - 8: disabled due to polymorphism (untrappable)
 * - 16: stopped (untrappable) - e.g. due to fatal (unrecoverable) error
 * - 32: ...
 */
export type ExecutionEntryFlags = number & { readonly tsBrand?: unique symbol };

function flag(f: number): ExecutionEntryFlags {
  return f as ExecutionEntryFlags;
}

export const NO_FLAGS = flag(0); // 0
export const FLAG_ERROR = flag(1 << 0); // 1
export const FLAG_NULL = flag(1 << 1); // 2
export const FLAG_INHIBITED = flag(1 << 2); // 4
export const FLAG_POLY_SKIPPED = flag(1 << 3); // 8
export const FLAG_STOPPED = flag(1 << 4); // 16
export const ALL_FLAGS = flag(
  FLAG_ERROR | FLAG_NULL | FLAG_INHIBITED | FLAG_POLY_SKIPPED | FLAG_STOPPED,
);

/** By default, accept null values as an input */
export const DEFAULT_ACCEPT_FLAGS = flag(FLAG_NULL);
export const TRAPPABLE_FLAGS = flag(FLAG_ERROR | FLAG_NULL | FLAG_INHIBITED);
export const DEFAULT_FORBIDDEN_FLAGS = flag(ALL_FLAGS & ~DEFAULT_ACCEPT_FLAGS);
export const FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS = flag(
  FLAG_NULL | FLAG_POLY_SKIPPED,
);
// TODO: make `FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS = flag(FLAG_ERROR | FLAG_NULL | FLAG_POLY_SKIPPED | FLAG_INHIBITED | FLAG_STOPPED);`
// Currently this isn't enabled because the bucket has to exist for the output
// plan to throw the error; really the root should be evaluated before
// descending into the output plan rather than as part of descending?
