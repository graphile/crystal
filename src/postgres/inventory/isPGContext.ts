import { Client } from 'pg'

/**
 * The context object we’d expect when using Postgres. The thing is, it’s also
 * private. The only way to use this context is with `isPGContext`.
 *
 * @private
 */
type PGContext = {
  client: Client,
}

interface IsPGContextFn {
  (value: mixed): value is PGContext
  error (): Error
}

/**
 * Checks to see if any JavaScript value is a `PGContext`. Use like so for
 * maximum value:
 *
 * ```js
 * if (!isPGContext(context)) throw isPGContext.error()
 * ```
 *
 * Thanks to TypeScript, the rest of your code will be typed with the the
 * assumption that `context` is `PGContext` allowing you to use all of the
 * properties therein.
 */
function isPGContext (value: mixed): value is PGContext {
  return (
    value != null &&
    typeof value === 'object' &&
    value['client'] instanceof Client
  )
}

isPGContext['error'] = () => new Error('Must pass a correct context for Postgres.')

// Export the function as a different type which includes extra properties
// alongside the function.
export default isPGContext as IsPGContextFn
