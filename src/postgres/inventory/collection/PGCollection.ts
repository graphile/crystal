import pluralize = require('pluralize')
import DataLoader = require('dataloader')
import { Client } from 'pg'
import { Collection, Type, NullableType } from '../../../interface'
import { memoize1, sql, memoizeMethod } from '../../utils'
import { PGCatalog, PGCatalogClass, PGCatalogNamespace, PGCatalogAttribute } from '../../introspection'
import PGObjectType from '../type/PGObjectType'
import Options from '../Options'
import pgClientFromContext from '../pgClientFromContext'
import transformPGValue from '../transformPGValue'
import PGCollectionPaginator from '../paginator/PGCollectionPaginator'
import PGCollectionKey from './PGCollectionKey'

/**
 * Creates a collection object for Postgres that can be used to access the
 * data. A collection aligns fairly well with a Postgres “class” that is
 * selectable. Non-selectable classes are generally compound types.
 */
class PGCollection implements Collection {
  constructor (
    public _options: Options,
    public _pgCatalog: PGCatalog,
    public _pgClass: PGCatalogClass,
  ) {}

  /**
   * Instantiate some private dependencies of our collection using our instance
   * of `PGCatalog`.
   */
  private _pgNamespace = this._pgCatalog.assertGetNamespace(this._pgClass.namespaceId)
  private _pgAttributes = this._pgCatalog.getClassAttributes(this._pgClass.id)

  /**
   * The name of this collection. A pluralized version of the class name. We
   * expect class names to be singular.
   */
  public name = pluralize(this._pgClass.name)

  /**
   * The description of this collection taken from the Postgres class’s
   * comment.
   */
  public description = this._pgClass.description

  /**
   * Gets the type for our collection using the composite type for this class.
   * We can depend on this type having the exact same number of fields as there
   * are Postgres attributes and in the exact same order.
   */
  public type = new PGObjectType({
    name: pluralize(this._pgClass.name, 1),
    description: this._pgClass.description,
    pgCatalog: this._pgCatalog,
    pgAttributes: new Map(this._pgAttributes.map<[string, PGCatalogAttribute]>(pgAttribute =>
      [this._options.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name, pgAttribute]
    )),
  })

  /**
   * An array of all the keys which can be used to uniquely identify a value
   * in our collection.
   *
   * The keys are a representation of the primary key constraints and unique
   * constraints in Postgres on the table.
   */
  public keys = (
    this._pgCatalog.getConstraints()
      .filter(pgConstraint =>
        // We only want the constraints that apply to this Postgres class.
        pgConstraint.classId === this._pgClass.id &&
        // …and the constraints that are either a primary key constraint or a
        // unique constraint.
        (pgConstraint.type === 'p' || pgConstraint.type === 'u')
      )
      // Tell TypeScript our constraint is ok (verified in the filter above)
      // with `as any`.
      .map(pgConstraint => new PGCollectionKey(this, pgConstraint as any))
  )

  /**
   * The primary key for our collection is just an instance of `CollectionKey`
   * representing the single primary key constraint in Postgres. We choose one
   * key to be our primary key so that consumers have a clear choice in what id
   * should be used.
   */
  public primaryKey = this.keys.find(key => key._pgConstraint.type === 'p')

  public paginator = new PGCollectionPaginator(this)

  // If we can’t insert into this class, there should be no `create`
  // function. Otherwise our `create` method is pretty basic.
  public create = (
    !this._pgClass.isInsertable
      ? null
      : (context: mixed, value: PGObjectType.Value): Promise<PGObjectType.Value> =>
        this._getInsertLoader(pgClientFromContext(context)).load(value)
  )

  /**
   * Gets a loader for inserting rows into the database. We create a
   * memoized version of this function to ensure we get consistent data
   * loaders.
   *
   * @private
   */
  @memoizeMethod
  private _getInsertLoader (client: Client): DataLoader<PGObjectType.Value, PGObjectType.Value> {
    return new DataLoader<PGObjectType.Value, PGObjectType.Value>(
      async (values: Array<PGObjectType.Value>): Promise<Array<PGObjectType.Value>> => {
        const insertionIdentifier = Symbol()

        // Create our insert query.
        const query = sql.compile(sql.query`
          with ${sql.identifier(insertionIdentifier)} as (
            -- Start by defining our header which will be the class we are
            -- inserting into (prefixed by namespace of course).
            insert into ${sql.identifier(this._pgNamespace.name, this._pgClass.name)}

            -- Add all of our attributes as columns to be inserted into. This is
            -- helpful in case the columns differ from what we expect.
            (${sql.join(this._pgAttributes.map(({ name }) => sql.identifier(name)), ', ')})

            -- Next, add all of our value tuples.
            values ${sql.join(values.map(value =>
              // Make sure we have one value for every attribute in the class,
              // if there was no such value defined, we should just use
              // `default` and use the user’s default value.
              sql.query`(${sql.join(Array.from(this.type.fields).map(([fieldName]) =>
                value.has(fieldName) ? sql.value(value.get(fieldName)) : sql.raw('default')
              ), ', ')})`
            ), ', ')}

            -- Finally, return everything.
            returning *
          )
          -- We use a subquery with our insert so we can turn the result into JSON.
          select row_to_json(${sql.identifier(insertionIdentifier)}) as object from ${sql.identifier(insertionIdentifier)}
        `)

        const { rows } = await client.query(query)
        return rows.map(({ object }) => transformPGValue(this.type, object))
      }
    )
  }
}

export default PGCollection
