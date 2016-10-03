/**
 * A PostgreSQL type can be any type within the PostgreSQL database. We use a
 * union type so that we can use Typescript’s discriminated union powers.
 * Instead of using interfaces with `extend`, we’ll instead use the `&` type
 * operator.
 *
 * @see https://www.postgresql.org/docs/9.5/static/catalog-pg-type.html
 */
// TODO: We should probably make a special case for range types.
type PGCatalogType =
  PGCatalogCompositeType |
  PGCatalogDomainType |
  PGCatalogEnumType |
  (PGCatalogBaseType & {
    readonly type: 'b' | 'p' | 'r',
  })

export default PGCatalogType

/**
 * A composite type is a type with an associated class. So any type which may
 * have attributes (or fields).
 */
export interface PGCatalogCompositeType extends PGCatalogBaseType {
  readonly type: 'c'
  readonly classId: string
}

/**
 * A domain type is a named alias of another type with some extra constraints
 * added on top. One such constraint is the `is_not_null` constraint.
 */
export interface PGCatalogDomainType extends PGCatalogBaseType {
  readonly type: 'd'
  readonly baseTypeId: string
  readonly isNotNull: boolean
}

/**
 * An enum type is a type with a set of predefined string values. A value of
 * an enum type may only be one of those values.
 */
export interface PGCatalogEnumType extends PGCatalogBaseType {
  readonly type: 'e'
  readonly enumVariants: Array<string>
}

/**
 * The internal type of common properties on all `PGType`s. Really you care
 * about `PGType`, `PGType` just uses this definition internally to avoid code
 * reuse.
 *
 * @private
 */
interface PGCatalogBaseType {
  readonly kind: 'type'
  readonly id: string
  readonly name: string
  readonly description: string | undefined
  readonly namespaceId: string
  readonly itemId: string | null
  // The category property is used by the parser to do implicit type casting.
  // This is helpful for us as we don’t need to create catalog types for every
  // PostgreSQL type. Rather we can group types into “buckets” using this
  // property.
  //
  // @see https://www.postgresql.org/docs/9.5/static/catalog-pg-type.html#CATALOG-TYPCATEGORY-TABLE
  readonly category: 'A' | 'B' | 'C' | 'D' | 'E' | 'G' | 'I' | 'N' | 'P' | 'S' | 'T' | 'U' | 'V' | 'X'
}
