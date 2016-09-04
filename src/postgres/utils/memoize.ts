/**
 * Decorator that memoizes a function so that for the each referentially
 * identical input, there is the *exact* same output.
 */
export default function memoize <T, I, O>(
  target: T,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(input: I) => O>,
) {
  if (!descriptor.value)
    throw new Error('No method defined to memoize.')

  const caches = new WeakMap<T, WeakMap<I, O>>()
  const internalMethod = descriptor.value

  descriptor.value = function memoizedMethod (input: I): O {
    if (!caches.has(this))
      caches.set(this, new WeakMap())

    const cache = caches.get(this)!

    if (!cache.has(input))
      cache.set(input, internalMethod.call(this, input))

    return cache.get(input)!
  }
}
