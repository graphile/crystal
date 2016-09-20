import NamedType from './NamedType'

/**
 * An enum type represents a type for which the domain is a set of
 * predetermined string values called variants.
 */
class EnumType extends NamedType<string> {
  /**
   * A ser of unique variations of this enum.
   */
  public readonly variants: Set<string>

  constructor (config: {
    name: string,
    description?: string | undefined,
    variants: Set<string>,
  }) {
    super(config)
    this.variants = config.variants
  }

  /**
   * Checks if the value is a string and that string is one of this enum’s
   * variants.
   */
  public isTypeOf (value: mixed): value is string {
    return typeof value === 'string' && this.variants.has(value)
  }
}

export default EnumType
