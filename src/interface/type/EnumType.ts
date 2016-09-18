import NamedType from './NamedType'

/**
 * An enum type represents a type for which the domain is a set of
 * predetermined string values called variants.
 */
class EnumType extends NamedType<string> {
  constructor (
    name: string,
    private _variants: string[],
  ) {
    super(name)
  }

  /**
   * Gets all of the variants of our enum type.
   */
  public getVariants (): string[] {
    // Do a shallow coppy of the variants array before returning so that the
    // variants array cannot be changed.
    return this._variants.slice()
  }
}

export default EnumType
