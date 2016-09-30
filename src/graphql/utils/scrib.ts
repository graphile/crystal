import { GraphQLType, getNamedType, GraphQLNonNull, GraphQLList } from 'graphql'

/**
 * Utilities for writing GraphQL descriptions. The name “scrib” is a play on
 * the word “describe.” We didn’t want to call these tools “description”
 * because that may clash with local definitions, and “describe” clashes with
 * many testing frameworks (including Jest). “scrib” is also short which is a
 * bonus.
 *
 * “scrib” has no technical meaning whatsoever.
 */
// TODO: test
namespace scrib {
  /**
   * Renders a markdown inline code snippet (text inside backticks) for the
   * name of the given type. Will use standard GraphQL syntax like bangs and
   * brackets for non-null and list types appropriately.
   */
  export function type (type: GraphQLType<mixed>) {
    return `\`${getTypeName(type)}\``
  }

  /**
   * Gets the standard GraphQL type string representation.
   *
   * @private
   */
  function getTypeName (type: GraphQLType<mixed>): string {
    // Return an empty string for tests.
    if (type == null) return ''
    // If this is a named type, just return the type’s name.
    if (type === getNamedType(type)) return type.name
    // If this is non-null return the nullable type’s name.
    if (type instanceof GraphQLNonNull) return getTypeName(type.ofType)
    // If this is a list, wrap the name with `[]`.
    if (type instanceof GraphQLList) return `[${getTypeName(type.ofType)}]`

    throw new Error('Unrecognized unnamed GraphQL type.')
  }
}

export default scrib
