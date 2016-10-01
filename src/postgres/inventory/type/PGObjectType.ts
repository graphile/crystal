import { ObjectType, NullableType } from '../../../interface'
import { PGCatalog, PGCatalogAttribute } from '../../introspection'
import transformPGValue, { $$transformPGValue } from '../transformPGValue'
import getTypeFromPGType from './getTypeFromPGType'

/**
 * `PGObjectType` is very much like `ObjectType` except it does a few extra
 * Postgres related things. First it takes a set of `PGCatalogAttribute`s and
 * uses that to setup the type’s fields instead of expecting the fields to be
 * manually defined every time.
 *
 * This type also adds a custom field type which contains a few extra
 * properties. Such as the `PGCatalogAttribute` that was used to make the
 * field.
 *
 * Users of this type are still expected to provide their own name and
 * description.
 */
class PGObjectType extends ObjectType {
  // Overrides the `fields` type so that we recognize our custom field type.
  public readonly fields: Map<string, PGObjectType.Field<mixed>>

  /**
   * Private maps which act as indexes of the relationship between field names
   * and Postgres attribute names.
   *
   * @private
   */
  private _fieldNameToPGAttributeName = new Map<string, string>()
  private _pgAttributeNameToFieldName = new Map<string, string>()

  constructor (config: {
    name: string,
    description?: string | undefined,
    pgCatalog: PGCatalog,
    pgAttributes: Array<PGCatalogAttribute> | Map<string, PGCatalogAttribute>,
  }) {
    super({
      name: config.name,
      description: config.description,
      fields: new Map<string, PGObjectType.Field<mixed>>(
        // Creates fields using the provided `pgAttributes` array.
        Array.from(
          Array.isArray(config.pgAttributes)
            ? new Map(config.pgAttributes.map<[string, PGCatalogAttribute]>(pgAttribute => [pgAttribute.name, pgAttribute]))
            : config.pgAttributes
        ).map<[string, PGObjectType.Field<mixed>]>(([fieldName, pgAttribute]) =>
          [fieldName, {
            description: pgAttribute.description,

            // Make sure that if our attribute specifies that it is non-null,
            // that we remove the types nullable wrapper if it exists.
            type: (() => {
              const pgType = config.pgCatalog.assertGetType(pgAttribute.typeId)
              const type = getTypeFromPGType(config.pgCatalog, pgType)

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
          }]
        )
      ),
    })

    // Create our indexes of `fieldName` to `pgAttribute.name`. We can use
    // these indexes to rename keys where appropriate.
    for (const [fieldName, { pgAttribute }] of this.fields) {
      if (this._pgAttributeNameToFieldName.has(pgAttribute.name))
        throw new Error('Cannot use a Postgres attribute with the same name twice in a single object type.')

      this._fieldNameToPGAttributeName.set(fieldName, pgAttribute.name)
      this._pgAttributeNameToFieldName.set(pgAttribute.name, fieldName)
    }
  }

  /**
   * Converts a row returned by Postgres into the correct value object.
   */
  public [$$transformPGValue] (row: { [key: string]: mixed }): PGObjectType.Value {
    const value = new Map<string, mixed>()

    for (const [fieldName, { type: fieldType, pgAttribute }] of this.fields)
      value.set(fieldName, transformPGValue(fieldType, row[pgAttribute.name]))

    return value
  }

  /**
   * Converts a field name into the appropriate Postgres attribute name.
   */
  public getPGAttributeNameFromFieldName (fieldName: string): string | undefined {
    return this._fieldNameToPGAttributeName.get(fieldName)
  }

  /**
   * Converts a Postgres attribute name to the appropriate field name.
   */
  public getFieldNameFromPGAttributeName (pgAttributeName: string): string | undefined {
    return this._pgAttributeNameToFieldName.get(pgAttributeName)
  }
}

namespace PGObjectType {
  // Re-export the `ObjectType` value type for ease of access.
  export type Value = ObjectType.Value

  /**
   * The Postgres object type will add a `PGCatalogAttribute` to its fields for
   * future reference.
   */
  export interface Field<TFieldValue> extends ObjectType.Field<TFieldValue> {
    readonly pgAttribute: PGCatalogAttribute
  }
}

export default PGObjectType
