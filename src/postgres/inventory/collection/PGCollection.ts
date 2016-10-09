import pluralize = require('pluralize')
import DataLoader = require('dataloader')
import { Client } from 'pg'
import { Collection } from '../../../interface'
import { sql, memoizeMethod } from '../../utils'
import { PGCatalog, PGCatalogNamespace, PGCatalogClass, PGCatalogAttribute } from '../../introspection'
import PGObjectType from '../type/PGObjectType'
import PGClassObjectType from '../type/PGClassObjectType'
import Options from '../Options'
import pgClientFromContext from '../pgClientFromContext'
import transformPGValueIntoValue from '../transformPGValueIntoValue'
import transformValueIntoPGValue from '../transformValueIntoPGValue'
import PGCollectionPaginator from '../paginator/PGCollectionPaginator'
import PGCollectionKey from './PGCollectionKey'

/**
 * Creates a collection object for Postgres that can be used to access the
 * data. A collection aligns fairly well with a Postgres “class” that is
 * selectable. Non-selectable classes are generally compound types.
 */
class PGCollection implements Collection {
  constructor (
    options: Options,
    pgCatalog: PGCatalog,
    pgClass: PGCatalogClass,
  ) {
    this._options = options
    this._pgCatalog = pgCatalog
    this.pgClass = pgClass
  }

  /**
   * Instantiate some private dependencies of our collection using our instance
   * of `PGCatalog`.
   */
  public _options: Options
  public _pgCatalog: PGCatalog
  public pgClass: PGCatalogClass
  private _pgNamespace: PGCatalogNamespace = this._pgCatalog.assertGetNamespace(this.pgClass.namespaceId)
  private _pgAttributes: Array<PGCatalogAttribute> = this._pgCatalog.getClassAttributes(this.pgClass.id)

  /**
   * The name of this collection. A pluralized version of the class name. We
   * expect class names to be singular.
   */
  public name: string = pluralize(this.pgClass.name)

  /**
   * The description of this collection taken from the Postgres class’s
   * comment.
   */
  public description: string | undefined = this.pgClass.description

  /**
   * Gets the type for our collection using the composite type for this class.
   * We can depend on this type having the exact same number of fields as there
   * are Postgres attributes and in the exact same order.
   */
  public type: PGClassObjectType = new PGClassObjectType(this._pgCatalog, this.pgClass, {
    name: pluralize(this.pgClass.name, 1),
    renameIdToRowId: this._options.renameIdToRowId,
  })

  /**
   * An array of all the keys which can be used to uniquely identify a value
   * in our collection.
   *
   * The keys are a representation of the primary key constraints and unique
   * constraints in Postgres on the table.
   */
  public keys: Array<PGCollectionKey> = (
    this._pgCatalog.getConstraints()
      // We only want the constraints that apply to this Postgres class.
      .filter(pgConstraint => pgConstraint.classId === this.pgClass.id)
      // Tell TypeScript our constraint is ok (verified in the filter above)
      // with `as any`.
      .map(pgConstraint =>
        // We also only want primary key constraints and unique constraints.
        pgConstraint.type === 'p' || pgConstraint.type === 'u'
          ? new PGCollectionKey(this, pgConstraint)
          // If the constraint wasn’t a primary key or unique constraint,
          // return null. Since the null is filtered away we can safely mark
          // the type as `never`.
          : null as never
      )
      // Filter out nulls.
      .filter(Boolean)
  )

  /**
   * The primary key for our collection is just an instance of `CollectionKey`
   * representing the single primary key constraint in Postgres. We choose one
   * key to be our primary key so that consumers have a clear choice in what id
   * should be used.
   */
  public primaryKey: PGCollectionKey | undefined = this.keys.find(key => key.pgConstraint.type === 'p')

  public paginator: PGCollectionPaginator = new PGCollectionPaginator(this)

  // If we can’t insert into this class, there should be no `create`
  // function. Otherwise our `create` method is pretty basic.
  public create: ((context: mixed, value: PGObjectType.Value) => Promise<PGObjectType.Value>) | null = (
    !this.pgClass.isInsertable
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
            insert into ${sql.identifier(this._pgNamespace.name, this.pgClass.name)}

            -- Add all of our attributes as columns to be inserted into. This is
            -- helpful in case the columns differ from what we expect.
            (${sql.join(this._pgAttributes.map(({ name }) => sql.identifier(name)), ', ')})

            -- Next, add all of our value tuples.
            values ${sql.join(values.map(value =>
              // Make sure we have one value for every attribute in the class,
              // if there was no such value defined, we should just use
              // `default` and use the user’s default value.
              sql.query`(${sql.join(Array.from(this.type.fields).map(([fieldName, field]) =>
                value.has(fieldName) ? transformValueIntoPGValue(field.type, value.get(fieldName)) : sql.query`default`
              ), ', ')})`
            ), ', ')}

            -- Finally, return everything.
            returning *
          )
          -- We use a subquery with our insert so we can turn the result into JSON.
          select row_to_json(${sql.identifier(insertionIdentifier)}) as object from ${sql.identifier(insertionIdentifier)}
        `)

        const { rows } = await client.query(query)
        // tslint:disable-next-line no-any
        return rows.map(({ object }) => transformPGValueIntoValue(this.type, object) as any)
      }
    )
  }
}

export default PGCollection
