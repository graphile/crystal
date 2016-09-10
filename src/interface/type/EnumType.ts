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
   * Determines if the value is a string and that string value is in our enum
   * variants array.
   */
  public isTypeOf (value: any): value is string {
    if (typeof value !== 'string')
      return false

    if (this._variants.indexOf(value) === -1)
      return false

    return true
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
