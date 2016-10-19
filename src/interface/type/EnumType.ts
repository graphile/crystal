import NamedType from './NamedType'

/**
 * An enum type represents a type for which the domain is a set of
 * predetermined values called variants. Each variant must have a
 * unique name.
 *
 * Values themselves must not necessarily be unique, but the string names must
 * be unique.
 */
interface EnumType<TValue> extends NamedType<TValue> {
  // The unique tag for this type.
  readonly kind: 'ENUM'

  /**
   * A map of string enum names to their values. These values can be used to
   * represent anything, but string names must be unique identifiers for those
   * arbitrary values.
   */
  readonly variants: Map<string, TValue>
}

export default EnumType
