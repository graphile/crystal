/**
 * A PostgreSQL type can be any type within the PostgreSQL database. We use a
 * union type so that we can use Typescript’s discriminated union powers.
 * Instead of using interfaces with `extend`, we’ll instead use the `&` type
 * operator.
 *
 * @see https://www.postgresql.org/docs/9.5/static/catalog-pg-type.html
 */
// TODO: We should probably make a special case for range types.
type PGType =
  PGCompositeType |
  PGDomainType |
  PGEnumType |
  (_PGType & {
    type: 'b' | 'p' | 'r',
  })

export default PGType

/**
 * A composite type is a type with an associated class. So any type which may
 * have attributes (or fields).
 */
type PGCompositeType = _PGType & {
  type: 'c',
  classId: string,
}

/**
 * A domain type is a named alias of another type with some extra constraints
 * added on top. One such constraint is the `is_not_null` constraint.
 */
type PGDomainType = _PGType & {
  type: 'd',
  baseTypeId: string,
  isNotNull: boolean,
}

/**
 * An enum type is a type with a set of predefined string values. A value of
 * an enum type may only be one of those values.
 */
type PGEnumType = _PGType & {
  type: 'e',
  enumVariants: string[],
}

/**
 * The internal type of common properties on all `PGType`s. Really you care
 * about `PGType`, `PGType` just uses this definition internally to avoid code
 * reuse.
 *
 * @private
 * @see PGType
 */
type _PGType = {
  kind: 'type',
  id: string,
  name: string,
  description: string | undefined,
  namespaceId: string,
  itemId: string | null,
  // The category property is used by the parser to do implicit type casting.
  // This is helpful for us as we don’t need to create catalog types for every
  // PostgreSQL type. Rather we can group types into “buckets” using this
  // property.
  //
  // @see https://www.postgresql.org/docs/9.5/static/catalog-pg-type.html#CATALOG-TYPCATEGORY-TABLE
  category: 'A' | 'B' | 'C' | 'D' | 'E' | 'G' | 'I' | 'N' | 'P' | 'S' | 'T' | 'U' | 'V' | 'X',
}
