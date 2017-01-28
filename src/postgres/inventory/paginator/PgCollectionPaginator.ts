import { Paginator, Condition } from '../../../interface'
import { PgCatalog, PgCatalogNamespace, PgCatalogClass } from '../../introspection'
import { sql } from '../../utils'
import PgClassType from '../type/PgClassType'
import conditionToSql from '../conditionToSql'
import PgCollection from '../collection/PgCollection'
import PgPaginator from './PgPaginator'
import PgPaginatorOrderingAttributes from './PgPaginatorOrderingAttributes'
import PgPaginatorOrderingOffset from './PgPaginatorOrderingOffset'

/**
 * The Postgres collection paginator is a paginator explicitly for collections.
 * Collections have a `Condition` as there input and objects as their item
 * values. This implementation leverages that knowledge to create an effective
 * paginator.
 */
class PgCollectionPaginator extends PgPaginator<Condition, PgClassType.Value> {
  constructor (
    public collection: PgCollection,
  ) {
    super()
  }

  // Steal some stuff from our collection…
  private _pgCatalog: PgCatalog = this.collection._pgCatalog
  private _pgClass: PgCatalogClass = this.collection.pgClass
  private _pgNamespace: PgCatalogNamespace = this._pgCatalog.assertGetNamespace(this._pgClass.namespaceId)

  // Define some of the property stuffs that are easy property copies.
  public name: string = this.collection.name
  public itemType: PgClassType = this.collection.type

  /**
   * The `from` entry for a collection paginator is simply the namespaced
   * table name of its collection.
   */
  public getFromEntrySql (): sql.Sql {
    return sql.query`${sql.identifier(this._pgNamespace.name, this._pgClass.name)}`
  }

  /**
   * The condition for this paginator will simply be whatever condition was
   * the input value.
   */
  public getConditionSql (condition: Condition): sql.Sql {
    return conditionToSql(condition, [], Boolean(this.collection._options.renameIdToRowId && this.collection.primaryKey))
  }

  /**
   * An array of the orderings a user may choose from to be used with this
   * paginator. Each ordering must have a unique name.
   */
  public orderings: Map<string, Paginator.Ordering<Condition, PgClassType.Value, mixed>> = (() => {
    // Fetch some useful things from our Postgres catalog.
    const pgClassAttributes = this._pgCatalog.getClassAttributes(this._pgClass.id)
    const pgPrimaryKeyConstraint = this._pgCatalog.getConstraints().find(pgConstraint => pgConstraint.type === 'p' && pgConstraint.classId === this._pgClass.id)
    const pgPrimaryKeyAttributes = pgPrimaryKeyConstraint && this._pgCatalog.getClassAttributes(this._pgClass.id, pgPrimaryKeyConstraint.keyAttributeNums)

    return new Map([
      // If this collection has a primary key, we are going to add two
      // orderings. One where all primary key attributes are arranged in
      // ascending order, and the other where all primary key attributes are
      // arranged in descending order.
      //
      // We will only add these orderings if our primary key has two or more
      // attributes.
      ...(pgPrimaryKeyAttributes
        ? [
          ['primary_key_asc', new PgPaginatorOrderingAttributes({
            pgPaginator: this,
            descending: false,
            pgAttributes: pgPrimaryKeyAttributes || [],
          })],
          ['primary_key_desc', new PgPaginatorOrderingAttributes({
            pgPaginator: this,
            descending: true,
            pgAttributes: pgPrimaryKeyAttributes || [],
          })],
        ]
        : []
      ),

      // We include one basic natural ordering which will get whatever order
      // the database gives it.
      ['natural', new PgPaginatorOrderingOffset({ pgPaginator: this })],

      ...(
        // For all of the Postgres class attributes, create two orderings. One
        // for the ascending ordering of that attribute, and one for the
        // descending order of that attribute.
        //
        // The primary key is also included as attributes (if one exists). This
        // allows us to generate cursors that are truly unique on a row-by-row
        // basis instead of relying on the attribute we are ordering by to be
        // unique.
        //
        // @see https://github.com/calebmer/postgraphql/issues/93
        // @see https://github.com/calebmer/postgraphql/pull/95
        pgClassAttributes
          .map<Array<[string, Paginator.Ordering<Condition, PgClassType.Value, mixed>]>>(pgAttribute => [
            // Note how we use `Array.from(new Set(…))` here, that will remove
            // duplicate attributes as the elements in a set must be unique.
            [`${pgAttribute.name}_asc`, new PgPaginatorOrderingAttributes({
              pgPaginator: this,
              descending: false,
              pgAttributes: Array.from(new Set([pgAttribute, ...(pgPrimaryKeyAttributes || [])])),
            })],
            [`${pgAttribute.name}_desc`, new PgPaginatorOrderingAttributes({
              pgPaginator: this,
              descending: true,
              pgAttributes: Array.from(new Set([pgAttribute, ...(pgPrimaryKeyAttributes || [])])),
            })],
          ])
          .reduce((a, b) => a.concat(b), [])
      ),
    ] as Array<[string, Paginator.Ordering<Condition, PgClassType.Value, mixed>]>)
  })()

  /**
   * The first ordering of our generated orderings array is our default
   * ordering. The first ordering will always be the ascending primary key, or
   * else it will be the natural ordering.
   */
  public defaultOrdering: Paginator.Ordering<Condition, PgClassType.Value, mixed> = Array.from(this.orderings.values())[0]
}

export default PgCollectionPaginator
