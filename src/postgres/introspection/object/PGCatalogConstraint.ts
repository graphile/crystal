/**
 * A Postgres constraint is any ruleset that can be defined for a class
 * (table). Constraints include check constraints, foreign key constraints,
 * primary key constraints, unique constraints and more. We only care about a
 * few constraint types.
 *
 * @see https://www.postgresql.org/docs/9.5/static/catalog-pg-constraint.html
 */
type PGCatalogConstraint =
  PGCatalogForeignKeyConstraint |
  PGCatalogPrimaryKeyConstraint |
  PGCatalogUniqueConstraint

export default PGCatalogConstraint

/**
 * A foreign key constrains the columns of a table to reference the columns of another
 * table.
 */
export interface PGCatalogForeignKeyConstraint extends PGCatalogBaseConstraint {
  readonly type: 'f'
  readonly classId: string
  readonly foreignClassId: string
  readonly keyAttributeNums: Array<number>
  readonly foreignKeyAttributeNums: Array<number>
}

/**
 * A primary key indicates the main columns used to identify a single row in a
 * table.
 */
export interface PGCatalogPrimaryKeyConstraint extends PGCatalogBaseConstraint {
  readonly type: 'p'
  readonly classId: string
  readonly keyAttributeNums: Array<number>
}

/**
 * Enforces a unique constraint on some columns. No distinct duplicate values
 * will be allowed in the columns specified by this constraint.
 */
export interface PGCatalogUniqueConstraint extends PGCatalogBaseConstraint {
  readonly type: 'u'
  readonly classId: string
  readonly keyAttributeNums: Array<number>
}

/**
 * The base constraint type which contains common fields.
 *
 * @private
 */
interface PGCatalogBaseConstraint {
  readonly kind: 'constraint'
  readonly name: string
}
