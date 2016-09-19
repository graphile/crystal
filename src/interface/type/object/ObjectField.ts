import Type from '../Type'

/**
 * An object field represents a single typed field on an object type. The
 * field will contain a name which is unique to the object containing the field
 * and a value of any type.
 */
abstract class ObjectField<TObjectValue, TFieldValue, TFieldType extends Type<TFieldValue>> {
  private _description: string | undefined = undefined

  constructor (
    private _name: string,
    private _type: TFieldType,
  ) {}

  /**
   * Gets the name of our field.
   */
  public getName (): string {
    return this._name
  }

  /**
   * Sets the description for our field.
   */
  public setDescription (description: string | undefined): this {
    this._description = description
    return this
  }

  /**
   * Gets the optional description for our field.
   */
  public getDescription (): string | undefined {
    return this._description
  }

  /**
   * Gets the type of our field.
   */
  public getType (): TFieldType {
    return this._type
  }

  /**
   * This method takes the object value for this field, and extracts the field
   * value from it.
   */
  public abstract getFieldValueFromObject (object: TObjectValue): TFieldValue
}

export default ObjectField
