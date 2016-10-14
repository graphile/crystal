/**
 * A memoization cache object. It optionally contains a cached value (generated
 * by calling a memoized function) and another map for storing caches for
 * arguments of a higher arity.
 *
 * We have two “next” maps, `nextObjects` and `nextPrimitives`. This is because
 * a `WeakMap` can’t hold a reference to a primitive value, but primitive
 * values may still be function arguments. You can consider the two maps to be
 * one, they just hold different things.
 *
 * @private
 */
type Cache<T> = {
  isSet: boolean,
  value?: T,
  nextObjects: WeakMap<mixed, Cache<T>>,
  nextPrimitives: Map<mixed, Cache<T>>,
}

/**
 * Creates an empty cache object.
 *
 * @private
 */
function createEmptyCache <T>(): Cache<T> {
  return {
    isSet: false,
    value: undefined,
    nextObjects: new WeakMap<mixed, Cache<T>>(),
    nextPrimitives: new Map<mixed, Cache<T>>(),
  }
}

/**
 * A memoization implementation that will memoize any number of function
 * arguments using `WeakMap`s so memory isn’t abused.
 *
 * The memoization cache is in a tree shape where each node may have a cached
 * value and child nodes. If you call a memoized function with 3 arguments, the
 * memoized tree will be 3 nodes deep.
 *
 * @private
 */
// TODO: Have this use variadic types when they are added to Typescript. Then
// we shouldn’t need `memoize1`, `memoize2`, etc.
export function _memoize <T>(fn: (...args: Array<mixed>) => T): (...args: Array<mixed>) => T {
  const initialCache: Cache<T> = createEmptyCache<T>()

  return (...args: Array<mixed>): T => {
    const finalCache = args.reduce<Cache<T>>((cache, arg) => {
      // Because we can’t insert primitive values into `WeakMap`s, we need a
      // seperate map for primitive values. Here we select the appropriate map
      // for our argument type.
      const next = typeof arg === 'object'
        ? cache.nextObjects
        : cache.nextPrimitives

      // If we need a cache for this position and none has been set, we need
      // to create a cache object that has not yet had a value set.
      if (!next.has(arg))
        next.set(arg, createEmptyCache<T>())

      // Grab the cache for this argument, we know it exists because we create
      // it in the last step if it doesn’t exist.
      return next.get(arg)!
    }, initialCache)

    // If no value has been set in our cache, we actually need to run the
    // function.
    if (!finalCache.isSet) {
      finalCache.value = fn(...args)
      finalCache.isSet = true
    }

    // Return the final value!
    return finalCache.value!
  }
}

export const memoize1 = <T, A>(fn: (a: A) => T): (a: A) => T => _memoize(fn)
export const memoize2 = <T, A, B>(fn: (a: A, b: B) => T): (a: A, b: B) => T => _memoize(fn)
export const memoize3 = <T, A, B, C>(fn: (a: A, b: B, c: C) => T): (a: A, b: B, c: C) => T => _memoize(fn)
export const memoize4 = <T, A, B, C, D>(fn: (a: A, b: B, c: C, d: D) => T): (a: A, b: B, c: C, d: D) => T => _memoize(fn)
