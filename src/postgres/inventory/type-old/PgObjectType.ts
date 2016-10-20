import { ObjectType, NullableType } from '../../../interface'
import { PgCatalog, PgCatalogAttribute } from '../../introspection'
import transformPgValueIntoValue, { $$transformPgValueIntoValue } from '../transformPgValueIntoValue'
import getTypeFromPgType from './getTypeFromPgType'

/**
 * `PgObjectType` is very much like `ObjectType` except it does a few extra
 * Postgres related things. First it takes a set of `PgCatalogAttribute`s and
 * uses that to setup the type’s fields instead of expecting the fields to be
 * manually defined every time.
 *
 * This type also adds a custom field type which contains a few extra
 * properties. Such as the `PgCatalogAttribute` that was used to make the
 * field.
 *
 * Users of this type are still expected to provide their own name and
 * description.
 */
// TODO: Refactor this and `PgClassObjectType`
class PgObjectType extends ObjectType {
  // Overrides the `fields` type so that we recognize our custom field type.
  public readonly fields: Map<string, PgObjectType.Field<mixed>>

  /**
   * Private maps which act as indexes of the relationship between field names
   * and Postgres attribute names.
   *
   * @private
   */
  private _fieldNameToPgAttributeName: Map<string, string> = new Map()
  private _pgAttributeNameToFieldName: Map<string, string> = new Map()

  constructor (config: {
    name: string,
    description?: string | undefined,
    pgCatalog: PgCatalog,
    pgAttributes: Array<PgCatalogAttribute> | Map<string, PgCatalogAttribute>,
  }) {
    super({
      name: config.name,
      description: config.description,
      fields: new Map<string, PgObjectType.Field<mixed>>(
        // Creates fields using the provided `pgAttributes` array.
        Array.from(
          Array.isArray(config.pgAttributes)
            ? new Map(config.pgAttributes.map<[string, PgCatalogAttribute]>(pgAttribute => [pgAttribute.name, pgAttribute]))
            : config.pgAttributes,
        ).map<[string, PgObjectType.Field<mixed>]>(([fieldName, pgAttribute]) =>
          [fieldName, {
            description: pgAttribute.description,

            // Make sure that if our attribute specifies that it is non-null,
            // that we remove the types nullable wrapper if it exists.
            type: (() => {
              const pgType = config.pgCatalog.assertGetType(pgAttribute.typeId)
              const type = getTypeFromPgType(config.pgCatalog, pgType)

              // If the attribute is not null, but the type we got was
              // nullable, extract the non null variant and return that.
              if (pgAttribute.isNotNull && type instanceof NullableType)
                return type.nonNullType

              return type
            })(),

            // Pass along the `hasDefault` information.
            hasDefault: pgAttribute.hasDefault,

            // Notice how we add an extra `pgAttribute` property here as per
            // our custom field type.
            pgAttribute,
          }],
        ),
      ),
    })

    // Create our indexes of `fieldName` to `pgAttribute.name`. We can use
    // these indexes to rename keys where appropriate.
    for (const [fieldName, { pgAttribute }] of Array.from(this.fields)) {
      if (this._pgAttributeNameToFieldName.has(pgAttribute.name))
        throw new Error('Cannot use a Postgres attribute with the same name twice in a single object type.')

      this._fieldNameToPgAttributeName.set(fieldName, pgAttribute.name)
      this._pgAttributeNameToFieldName.set(pgAttribute.name, fieldName)
    }
  }

  /**
   * Converts a row returned by Postgres into the correct value object.
   */
  public [$$transformPgValueIntoValue] (row: { [key: string]: mixed }): PgObjectType.Value {
    const value = new Map<string, mixed>()

    for (const [fieldName, { type: fieldType, pgAttribute }] of Array.from(this.fields))
      value.set(fieldName, transformPgValueIntoValue(fieldType, row[pgAttribute.name]))

    return value
  }

  /**
   * Converts a field name into the appropriate Postgres attribute name.
   */
  public getPgAttributeNameFromFieldName (fieldName: string): string | undefined {
    return this._fieldNameToPgAttributeName.get(fieldName)
  }

  /**
   * Converts a Postgres attribute name to the appropriate field name.
   */
  public getFieldNameFromPgAttributeName (pgAttributeName: string): string | undefined {
    return this._pgAttributeNameToFieldName.get(pgAttributeName)
  }
}

namespace PgObjectType {
  // Re-export the `ObjectType` value type for ease of access.
  export type Value = ObjectType.Value

  /**
   * The Postgres object type will add a `PgCatalogAttribute` to its fields for
   * future reference.
   */
  export interface Field<TFieldValue> extends ObjectType.Field<TFieldValue> {
    readonly pgAttribute: PgCatalogAttribute
  }
}

export default PgObjectType
