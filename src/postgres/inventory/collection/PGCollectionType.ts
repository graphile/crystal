import { ObjectType, ObjectField, Type, NullableType } from '../../../interface'
import { PGCatalog, PGCatalogClass, PGCatalogAttribute } from '../../introspection'
import typeFromPGType from '../typeFromPGType'

/**
 * The interface type of all values to flow through a Postgres collection.
 */
class PGCollectionType extends ObjectType<PGCollectionValue> {
  constructor (
    pgCatalog: PGCatalog,
    private _pgClass: PGCatalogClass,
  ) {
    super(_pgClass.name)

    for (const pgAttribute of pgCatalog.getClassAttributes(_pgClass.id)) {
      // Get the type from our attribute’s type.
      const pgType = pgCatalog.assertGetType(pgAttribute.typeId)
      let type = typeFromPGType(pgCatalog, pgType)

      // Make sure that if the `NOT NULL` constraint was set, the type is not
      // nullable.
      if (pgAttribute.isNotNull && type instanceof NullableType)
        type = type.getBaseType()

      // Finally, instantiate the field and return it.
      const field = new PGCollectionObjectField(pgAttribute, type).setDescription(pgAttribute.description)

      // Add it to our fields.
      this._fields.set(field.getName(), field)
    }
  }

  /**
   * Turns a row into a Postgres collection value *without performing safety
   * checks*. This method should not be used with user input.
   */
  public fromRow (row: PGRow): PGCollectionValue {
    return new PGCollectionValue(this, row)
  }

  /**
   * Turns a Postgres collection value into a row.
   */
  public toRow (value: PGCollectionValue): PGRow {
    return value._getRow()
  }

  /**
   * A map of field names to the field it represents. Useful when parsing
   * inputs.
   *
   * @private
   */
  private _fields: Map<string, PGCollectionObjectField<mixed>> = new Map()

  public getFields (): Array<PGCollectionObjectField<mixed>> {
    return Array.from(this._fields.values()).sort((a, b) => {
      const aNum = a.getPGAttribute().num
      const bNum = b.getPGAttribute().num
      if (aNum > bNum) return 1
      if (aNum < bNum) return -1
      return 0
    })
  }

  /**
   * A strict implementation of `createFromFieldValues` which makes sure all
   * fields have correct values.
   */
  public createFromFieldValues (fieldValues: Map<string, mixed>): PGCollectionValue {
    // Initialize two variables, a `fieldsLeft` variable which tracks how many
    // of our internal fields have been detected so far, and the actual row
    // object.
    let fieldsLeft = this._fields.size
    const row = Object.create(null)

    // For all of the provided field values…
    for (const [fieldName, value] of fieldValues.entries()) {
      const field = this._fields.get(fieldName)

      // If there was no field for this name, throw an error.
      if (!field)
        throw new Error(`Field name '${fieldName}' does not correspond to an actual field on the object.`)

      // If the value has an incorrect type, throw an error.
      if (!field.getType().isTypeOf(value))
        throw new Error(`The value given for field '${fieldName}' is invalid.`)

      // Decrement our fields left count and correctly set the value on the
      // row using the Postgres attribute’s name.
      fieldsLeft -= 1
      row[field.getPGAttribute().name] = value
    }

    // If we didn’t find some fields, throw an error.
    if (fieldsLeft !== 0)
      throw new Error('A value was not provided for all fields.')

    // Instantiate our final value and return it.
    return new PGCollectionValue(this, row)
  }

  public isTypeOf (value: mixed): value is PGCollectionValue {
    // If the value is a `PGCollectionValue` and its type is `this`, we’re
    // good.
    return value instanceof PGCollectionValue && value._getType() === this
  }
}

// Export the type for our value so that it may be referenced outside of this
// module. We don’t want external modules instantiating it however.
namespace PGCollectionType {
  export type Value = PGCollectionValue
}

export default PGCollectionType

/**
 * The internal row type returned by `pg`.
 *
 * @private
 */
type PGRow = { [key: string]: mixed }

/**
 * The value of a collection item in Postgres. This will always correspond with
 * a row. The value also stores some type information so we can identify it.
 *
 * @private
 */
class PGCollectionValue {
  constructor (
    private _type: PGCollectionType,
    private _row: PGRow,
  ) {}

  /**
   * Returns this internal value’s type.
   */
  public _getType (): PGCollectionType {
    return this._type
  }

  /**
   * Gets the raw Postgres row value.
   */
  public _getRow (): PGRow {
    return this._row
  }
}

/**
 * A single field of the `PGCollectionType` object.
 *
 * @private
 */
class PGCollectionObjectField<T> extends ObjectField<PGCollectionValue, T> {
  constructor (
    private _pgAttribute: PGCatalogAttribute,
    type: Type<T>,
  ) {
    super(_pgAttribute.name, type)
  }

  public getPGAttribute (): PGCatalogAttribute {
    return this._pgAttribute
  }

  public getFieldValueFromObject (object: PGCollectionValue): T {
    // Extract the value from the internal row.
    const value = object._getRow()[this._pgAttribute.name]

    // Perform a type check for TypeScript.
    if (!this.getType().isTypeOf(value))
      throw new Error(`Row attribute '${this._pgAttribute.name}' has an incorrect type.`)

    return value
  }
}
