import { ObjectType, NullableType } from '../../../interface'
import { PGCatalog, PGCatalogAttribute } from '../../introspection'
import getTypeFromPGType from '../getTypeFromPGType'

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
// TODO: test
class PGObjectType extends ObjectType {
  // Overrides the `fields` type so that we recognize our custom field type.
  public readonly fields: Map<string, PGObjectType.Field<mixed>>

  constructor (config: {
    name: string,
    description?: string | undefined,
    pgCatalog: PGCatalog,
    pgAttributes: Array<PGCatalogAttribute>,
    renameIdToRowId?: boolean,
  }) {
    super({
      name: config.name,
      description: config.description,
      fields: new Map<string, PGObjectType.Field<mixed>>(
        // Creates fields using the provided `pgAttributes` array.
        config.pgAttributes.map<[string, PGObjectType.Field<mixed>]>(pgAttribute => {
          const fieldName = config.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name
          return [fieldName, {
            description: pgAttribute.description,

            // Make sure that if our attribute specifies that it is non-null,
            // that we remove the types nullable wrapper if it exists.
            type: (() => {
              const pgType = config.pgCatalog.assertGetType(pgAttribute.typeId)
              const type = getTypeFromPGType(config.pgCatalog, pgType)

              if (pgAttribute.isNotNull && type instanceof NullableType)
                return type.nonNullType

              return type
            })(),

            // Notice how we add an extra `pgAttribute` property here as per
            // our custom field type.
            pgAttribute,
          }]
        })
      ),
    })
  }

  // TODO: This was added for the sketchy `PGRelation` implementation.
  // Implement it better!
  public getPGAttributeFieldName (pgAttribute: PGCatalogAttribute): string | undefined {
    const fieldEntry = Array.from(this.fields).find(([fieldName, field]) => field.pgAttribute === pgAttribute)
    return fieldEntry && fieldEntry[0]
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
