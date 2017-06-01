import pluralize = require('pluralize')
import DataLoader = require('dataloader')
import { Client } from 'pg'
import { Collection } from '../../../interface'
import { sql, memoizeMethod } from '../../utils'
import { PgCatalog, PgCatalogNamespace, PgCatalogClass, PgCatalogAttribute } from '../../introspection'
import PgClassType from '../type/PgClassType'
import Options from '../Options'
import pgClientFromContext from '../pgClientFromContext'
import PgCollectionPaginator from '../paginator/PgCollectionPaginator'
import PgCollectionKey from './PgCollectionKey'
import {getFieldsFromResolveInfo, getSelectFragmentFromFields} from '../paginator/getSelectFragment'

/**
 * Creates a collection object for Postgres that can be used to access the
 * data. A collection aligns fairly well with a Postgres “class” that is
 * selectable. Non-selectable classes are generally compound types.
 */
class PgCollection implements Collection<PgClassType.Value> {
  constructor (
    public _options: Options,
    public _pgCatalog: PgCatalog,
    public pgClass: PgCatalogClass,
  ) {}

  /**
   * Instantiate some private dependencies of our collection using our instance
   * of `PgCatalog`.
   */
  private _pgNamespace: PgCatalogNamespace = this._pgCatalog.assertGetNamespace(this.pgClass.namespaceId)
  private _pgAttributes: Array<PgCatalogAttribute> = this._pgCatalog.getClassAttributes(this.pgClass.id)

  /**
   * The name of this collection. A pluralized version of the class name. We
   * expect class names to be singular.
   *
   * If a class with the pluralized version of the name exists, we won’t
   * pluralize the class name.
   */
  public name: string = (() => {
    const pluralName = pluralize(this.pgClass.name)
    let pluralNameExists = false

    for (const pgNamespace of this._pgCatalog.getNamespaces())
      if (this._pgCatalog.getClassByName(pgNamespace.name, pluralName))
        pluralNameExists = true

    return pluralNameExists ? this.pgClass.name : pluralName
  })()

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
  public type: PgClassType = new PgClassType(this._pgCatalog, this.pgClass, {
    // Singularize the name of our type, *unless* a class already exists in our
    // catalog with that name. If a class already has the name we will just
    // cause a conflict.
    name: (() => {
      const singularName = pluralize(this.pgClass.name, 1)
      let singularNameExists = false

      for (const pgNamespace of this._pgCatalog.getNamespaces())
        if (this._pgCatalog.getClassByName(pgNamespace.name, singularName))
          singularNameExists = true

      return singularNameExists ? this.pgClass.name : singularName
    })(),
    renameIdToRowId: this._options.renameIdToRowId,
  })

  /**
   * An array of all the keys which can be used to uniquely identify a value
   * in our collection.
   *
   * The keys are a representation of the primary key constraints and unique
   * constraints in Postgres on the table.
   */
  public keys: Array<PgCollectionKey> = (
    this._pgCatalog.getConstraints()
      // We only want the constraints that apply to this Postgres class.
      .filter(pgConstraint => pgConstraint.classId === this.pgClass.id)
      // Tell TypeScript our constraint is ok (verified in the filter above)
      // with `as any`.
      .map(pgConstraint =>
        // We also only want primary key constraints and unique constraints.
        pgConstraint.type === 'p' || pgConstraint.type === 'u'
          ? new PgCollectionKey(this, pgConstraint)
          // If the constraint wasn’t a primary key or unique constraint,
          // return null. Since the null is filtered away we can safely mark
          // the type as `never`.
          : null as never,
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
  public primaryKey: PgCollectionKey | undefined = this.keys.find(key => key.pgConstraint.type === 'p')

  public paginator: PgCollectionPaginator = new PgCollectionPaginator(this)

  // If we can’t insert into this class, there should be no `create`
  // function. Otherwise our `create` method is pretty basic.
  public create: ((context: mixed, value: PgClassType.Value, resolveInfo: mixed, collectionGqlType: mixed) => Promise<PgClassType.Value>) | null = (
    !this.pgClass.isInsertable
      ? null
      : (context: mixed, value: PgClassType.Value, resolveInfo: mixed, collectionGqlType: mixed): Promise<PgClassType.Value> =>
        this._getInsertLoader(pgClientFromContext(context)).load({value, resolveInfo, collectionGqlType})
  )

  /**
   * Gets a loader for inserting rows into the database. We create a
   * memoized version of this function to ensure we get consistent data
   * loaders.
   *
   * @private
   */
  @memoizeMethod
  private _getInsertLoader (client: Client): DataLoader<PgClassType.Value, PgClassType.Value> {
    return new DataLoader<PgClassType.Value, PgClassType.Value>(
      async (valuesAndStuff: Array<PgClassType.Value>): Promise<Array<PgClassType.Value>> => {
        const insertionIdentifier = Symbol()
        const values = valuesAndStuff.map(({value}) => value)
        const fieldses = valuesAndStuff.map(
          ({resolveInfo, collectionGqlType}) =>
            getFieldsFromResolveInfo(resolveInfo, insertionIdentifier, collectionGqlType)
        )
        const fields = Object.assign({}, ...fieldses)

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
              sql.query`(${sql.join(Array.from(this.type.fields.values()).map(field => {
                const fieldValue = field.getValue(value)
                return typeof fieldValue === 'undefined' ? sql.query`default` : field.type.transformValueIntoPgValue(fieldValue)
              }), ', ')})`,
            ), ', ')}

            -- Finally, return everything.
            returning *
          )
          -- We use a subquery with our insert so we can turn the result into JSON.
          select ${getSelectFragmentFromFields(fields, insertionIdentifier)} as object
          from ${sql.identifier(insertionIdentifier)}
        `)

        const { rows } = await client.query(query)
        return rows.map(({ object }) => this.type.transformPgValueIntoValue(object))
      },
    )
  }
}

export default PgCollection
