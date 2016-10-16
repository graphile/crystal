/**
 * A PostgreSql attribute is exclusively just a single attribute on a class.
 * Most commonly people would know an attribute as a column.
 *
 * @see https://www.postgresql.org/docs/9.5/static/catalog-pg-attribute.html
 */
interface PgCatalogAttribute {
  readonly kind: 'attribute'
  readonly classId: string
  readonly num: number
  readonly name: string
  readonly description: string
  readonly typeId: string
  readonly isNotNull: boolean
  readonly hasDefault: boolean
}

export default PgCatalogAttribute
