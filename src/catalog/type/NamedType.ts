import Type from './Type'

/**
 * A named type is any type which has a name and an optional description. These
 * types make up the core of our system, so most types can be expected to be
 * named. More interesting are the unnamed types. The unnamed types are
 * abstractions *over* named types. Like the `NullableType` or `ListType`.
 */
abstract class NamedType<TValue> extends Type<TValue> {
  private _description: string | undefined = undefined

  constructor (
    private _name: string,
  ) {
    super()
  }

  /**
   * Gets the name for our type. Every type must have a name.
   */
  public getName (): string {
    return this._name
  }

  /**
   * Sets the description for our type.
   */
  public setDescription (description: string | undefined): this {
    this._description = description
    return this
  }

  /**
   * Gets an optional description for our type.
   */
  public getDescription (): string | undefined {
    return this._description
  }
}

export default NamedType
