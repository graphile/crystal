/**
 * A PostgreSQL attribute is exclusively just a single attribute on a class.
 * Most commonly people would know an attribute as a column.
 *
 * @see https://www.postgresql.org/docs/9.5/static/catalog-pg-attribute.html
 */
type PGAttribute = {
  kind: 'attribute',
  classId: string,
  num: number,
  name: string,
  description: string,
  typeId: string,
  isNotNull: boolean,
  hasDefault: boolean,
}

export default PGAttribute
