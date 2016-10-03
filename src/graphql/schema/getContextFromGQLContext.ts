export const $$interfaceContext = Symbol('interface/context')

/**
 * Gets the interface context from the GraphQL context.
 */
// TODO: Rename to Ardite context.
export default function getInterfaceContext (context: mixed): Map<Symbol, mixed> {
  if (context == null || typeof context !== 'object')
    throw new Error('Context must be an object.')

  const interfaceContext = context[$$interfaceContext]

  if (!interfaceContext)
    throw new Error('Interface context has not been defined.')

  if (!(interfaceContext instanceof Map))
    throw new Error('Interface context must be a map.')

  return interfaceContext
}
