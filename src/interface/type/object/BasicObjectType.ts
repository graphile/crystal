import ObjectType from './ObjectType'
import ObjectField from './ObjectField'
import BasicObjectField from './BasicObjectField'

/**
 * The value for the basic object type is just a plain‘ol JavaScript object
 * map.
 */
export type BasicObjectValue = {
  [type: string]: any
}

/**
 * The basic object just represents a normal object. Nothing exciting going
 * on, just an object here. There may be more interesting `ObjectType`
 * implementations elsewhere.
 *
 * The reason this is it’s own class and not the default implementation of
 * `ObjectType` is that in order for this to work, we need a to specify a
 * `TValue`. We want `ObjectType` to be able to have different internal value
 * representations. If `BasicObjectType` were the default implementation
 * `TValue` would be set and couldn’t be customized.
 */
class BasicObjectType extends ObjectType<BasicObjectValue> {
  private _fields = new Map<string, ObjectField<BasicObjectValue, any>>()

  /**
   * To determine if the value is of this type, we loop through all of our
   * fields and do a `isTypeOf` check on the property of `value` with the same
   * name as our field. If just one field is not the correct type, the check
   * fails. If the value has extra properties we don’t care.
   */
  public isTypeOf (value: any): value is BasicObjectValue {
    if (value == null || typeof value !== 'object')
      return false

    for (const field of this.getFields())
      if (!field.getType().isTypeOf(value[field.getName()]))
        return false

    return true
  }

  /**
   * Adds a field to our object type. If there is already a field with the same
   * name on our object type, we can’t add the field and an error is thrown.
   *
   * The order in which fields get added is preserved.
   */
  public addField (field: BasicObjectField<any>): this {
    const name = field.getName()

    if (this._fields.has(name))
      throw new Error(`Field with name '${name}' already exists on this object.`)

    this._fields.set(name, field)

    return this
  }

  /**
   * Gets all of the fields on our object type. Returned in the order the
   * fields were added in.
   */
  public getFields (): ObjectField<BasicObjectValue, any>[] {
    return Array.from(this._fields.values())
  }

  /**
   * Creates a basic object from the field values. Just loops over the entries
   * as key/value pairs and adds them to an object. Performs an `isTypeOf`
   * check at the end. If it fails than an error is thrown.
   */
  public createFromFieldValueInputs (fieldValues: [string, any][]): BasicObjectValue {
    const object = {}

    for (const [key, value] of fieldValues)
      object[key] = value

    if (!this.isTypeOf(object))
      throw new Error('Provided fields did not create an object of the correct type.')

    return object
  }
}

export default BasicObjectType
