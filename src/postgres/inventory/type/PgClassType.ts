import { ObjectType, getNonNullableType } from '../../../interface'
import { PgCatalog, PgCatalogClass, PgCatalogCompositeType, PgCatalogAttribute } from '../../introspection'
import { sql } from '../../utils'
import getTypeFromPgType from './getTypeFromPgType'
import PgType from './PgType'

// We use an interface here to hide the implementation destails.
interface PgRow extends Map<string, mixed> {}

class PgClassType extends PgType<PgRow> implements ObjectType<PgRow> {
  public readonly kind: 'OBJECT' = 'OBJECT'
  public readonly name: string
  public readonly description: string | undefined
  public readonly fields: Map<string, PgClassType.Field<mixed>>
  public readonly pgClass: PgCatalogClass
  public readonly pgType: PgCatalogCompositeType

  constructor (
    pgCatalog: PgCatalog,
    pgClass: PgCatalogClass,
    config: { name?: string, renameIdToRowId?: boolean } = {},
  ) {
    super()
    const pgType = pgCatalog.assertGetType(pgClass.typeId) as PgCatalogCompositeType

    this.name = config.name || pgClass.name || pgType.name
    this.description = pgClass.description || pgType.description
    this.pgClass = pgClass
    this.pgType = pgType

    this.fields = (
      new Map(pgCatalog.getClassAttributes(pgClass.id).map<[string, PgClassType.Field<mixed>]>(pgAttribute => {
        const fieldName = config.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name
        return [fieldName, {
          description: pgAttribute.description,

          // Make sure that if our attribute specifies that it is non-null,
          // that we remove the types nullable wrapper if it exists.
          type: (() => {
            const pgAttributeType = pgCatalog.assertGetType(pgAttribute.typeId)
            const type = getTypeFromPgType(pgCatalog, pgAttributeType)

            // If the attribute is not null, but the type we got was
            // nullable, extract the non null variant and return that.
            if (pgAttribute.isNotNull)
              return getNonNullableType(type) as PgType<mixed>

            return type
          })(),

          // // Pass along the `hasDefault` information.
          hasDefault: pgAttribute.hasDefault,

          // Notice how we add an extra `pgAttribute` property here as per
          // our custom field type.
          pgAttribute,

          // Get the value from our Postgres row.
          getValue: value => value.get(fieldName),
        }]
      }))
    )
  }

  public isTypeOf (_value: mixed): _value is PgRow {
    throw new Error('Unimplemented')
  }

  public fromFields (fields: Map<string, mixed>): PgRow {
    return fields
  }

  /**
   * Transforms a Postgres value into an internal value for this type.
   */
  public transformPgValueIntoValue (pgValue: mixed): PgRow {
    if (pgValue == null)
      throw new Error('Postgres value of object type may not be nullish.')

    if (typeof pgValue !== 'object')
      throw new Error(`Postgres value of object type must be an object, not '${typeof pgValue}'.`)

    // Parse official pg fields
    const obj = {};
    Array.from(this.fields).filter<[string, mixed]>(([fieldName, field]) => pgValue.hasOwnProperty(field.pgAttribute.name)).map<[string, mixed]>(([fieldName, field]) => {
      obj[fieldName] = field.type.transformPgValueIntoValue(pgValue[field.pgAttribute.name])
    })
    // Pass through other fields unchanged
    for (const key in pgValue) {
      obj[key] = pgValue[key];
    }

    const pairs = [];
    for (const key in obj) {
      pairs.push([key, obj[key]]);
    }
    return new Map(pairs)
  }

  /**
   * Transforms our internal value into a Postgres SQL query.
   */
  public transformValueIntoPgValue (value: PgRow): sql.Sql {
    // We can depend on fields being in the correct tuple order for
    // `PgObjectType`, so we just build a tuple using our fields.
    return sql.query`(${sql.join(Array.from(this.fields).map(([fieldName, field]) =>
      field.type.transformValueIntoPgValue(value.get(fieldName)),
    ), ', ')})::${sql.identifier(this.pgType.namespaceName, this.pgType.name)}`
  }
}

namespace PgClassType {
  /**
   * The value which our class type uses internally.
   */
  export type Value = PgRow

  /**
   * The Postgres object type will add a `PgCatalogAttribute` to its fields for
   * future reference.
   */
  export interface Field<TValue> extends ObjectType.Field<PgRow, TValue> {
    readonly type: PgType<TValue>
    readonly pgAttribute: PgCatalogAttribute
  }
}

export default PgClassType
