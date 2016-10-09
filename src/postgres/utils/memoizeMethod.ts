import { _memoize } from '../../graphql/utils/memoize'

/**
 * Memoizes an object method with any number of arguments. This will not change
 * the method type signature.
 *
 * This decorator will also capture `this` and memoize against that object as
 * well.
 */
// TODO: Decorator could use some variadic types as its function call.
export default function memoizeMethod (target: mixed, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): void {
  if (!descriptor.value)
    throw new Error('No method defined to memoize.')

  // Extract the internal method.
  const internalMethod = descriptor.value

  // Use the special `memoize` implementation which allows us to memoize a
  // function with any number of arguments, including the `thisArg` argument.
  const memoizedMethod = _memoize((thisArg: mixed, ...args: Array<mixed>) => {
    return internalMethod.apply(thisArg, args)
  })

  // Create a function which redirects to the `memoizedMethod` using the
  // `this` context as the first argument.
  // tslint:disable-next-line only-arrow-functions
  descriptor.value = function memoizeRedirectMethod (...args: Array<mixed>): mixed {
    // tslint:disable-next-line no-invalid-this
    return memoizedMethod(this, ...args)
  }
}
