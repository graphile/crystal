import { PGCatalogAttribute } from '../../introspection'
import { sql } from '../../utils'
import PGObjectType from '../type/PGObjectType'
import PGCollection from './PGCollection'
import PGPaginator from './PGPaginator'

class PGCollectionPaginator extends PGPaginator<PGObjectType.Value> {
  constructor (
    public collection: PGCollection,
  ) {
    super()
  }

  // Steal some stuff from our collection…
  private _pgCatalog = this.collection._pgCatalog
  private _pgClass = this.collection._pgClass
  private _pgNamespace = this._pgCatalog.assertGetNamespace(this._pgClass.namespaceId)

  // Define some of the property stuffs that are easy property copies.
  public name = this.collection.name
  public type = this.collection.type

  /**
   * An array of the orderings a user may choose from to be used with this
   * paginator. Each ordering must have a unique name.
   */
  public orderings = ((): Array<PGPaginator.Ordering> => {
    // Fetch some useful things from our Postgres catalog.
    const pgClassAttributes = this._pgCatalog.getClassAttributes(this._pgClass.id)
    const pgPrimaryKeyConstraint = this._pgCatalog.getConstraints().find(pgConstraint => pgConstraint.type === 'p' && pgConstraint.classId === this._pgClass.id)
    const pgPrimaryKeyAttributes = pgPrimaryKeyConstraint && this._pgCatalog.getClassAttributes(this._pgClass.id, pgPrimaryKeyConstraint.keyAttributeNums)

    // We can use this to simplify `map` functions as it takes our constant
    // `descending` property and return a transform function which creates
    // ordering attributes.
    const attributeOrderingHelper = (descending: boolean) => (pgAttribute: PGCatalogAttribute) =>
      ({ pgAttribute, descending })

    return [
      // If this collection has a primary key, we are going to add two
      // orderings. One where all primary key attributes are arranged in
      // ascending order, and the other where all primary key attributes are
      // arranged in descending order.
      //
      // We will only add these orderings if our primary key has two or more
      // attributes.
      ...(pgPrimaryKeyAttributes
        ? [
          { type: 'ATTRIBUTES', name: 'primary_key_asc', descending: false, pgAttributes: pgPrimaryKeyAttributes || [] },
          { type: 'ATTRIBUTES', name: 'primary_key_desc', descending: true, pgAttributes: pgPrimaryKeyAttributes || [] },
        ] as Array<PGPaginator.Ordering>
        : []
      ),

      // We include one basic natural ordering which will get whatever order
      // the database gives it.
      { type: 'OFFSET', name: 'natural' },

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
          .map<Array<PGPaginator.Ordering>>(pgAttribute => [
            // Note how we use `Array.from(new Set(…))` here, that will remove
            // duplicate attributes as the elements in a set must be unique.
            { type: 'ATTRIBUTES', name: `${pgAttribute.name}_asc`, descending: false, pgAttributes: Array.from(new Set([pgAttribute, ...(pgPrimaryKeyAttributes || [])])) },
            { type: 'ATTRIBUTES', name: `${pgAttribute.name}_desc`, descending: true, pgAttributes: Array.from(new Set([pgAttribute, ...(pgPrimaryKeyAttributes || [])])) },
          ])
          .reduce((a, b) => a.concat(b), [])
      ),
    ]
  })()

  /**
   * The first ordering of our generated orderings array is our default
   * ordering. The first ordering will always be the ascending primary key, or
   * else it will be the natural ordering.
   */
  public defaultOrdering = this.orderings[0]

  /**
   * The `from` entry for a collection paginator is simply the namespaced
   * table name of its collection.
   */
  public getFromEntrySQL (): sql.SQL {
    return sql.query`${sql.identifier(this._pgNamespace.name, this._pgClass.name)}`
  }

  /**
   * Runs the `rowToValue` method of its type on the value it got back.
   */
  public transformPGValue (value: { [key: string]: mixed }): PGObjectType.Value {
    return this.type.rowToValue(value)
  }
}

export default PGCollectionPaginator
