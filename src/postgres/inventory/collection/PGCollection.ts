import {
  Collection,
  Type,
  NullableType,
  ObjectType,
  BasicObjectType,
  BasicObjectField,
} from '../../../interface'

import pluralize = require('pluralize')
import DataLoader = require('dataloader')
import { Client } from 'pg'
import { memoize1, sql, memoizeMethod } from '../../utils'
import { PGCatalog, PGCatalogClass, PGCatalogNamespace, PGCatalogAttribute } from '../../introspection'
import isPGContext from '../isPGContext'
import getTypeFromPGAttribute from '../getTypeFromPGAttribute'

/**
 * Creates a collection object for Postgres that can be used to access the
 * data. A collection aligns fairly well with a Postgres “class” that is
 * selectable. Non-selectable classes are generally compound types.
 */
class PGCollection implements Collection<BasicObjectType.Value, BasicObjectType<BasicObjectField<mixed, Type<mixed>>>> {
  constructor (
    private _pgCatalog: PGCatalog,
    private _pgClass: PGCatalogClass,
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
   */
  public type = this._pgAttributes.reduce(
    (type, pgAttribute) => type.addField(
      new BasicObjectField(
        pgAttribute.name,
        getTypeFromPGAttribute(this._pgCatalog, pgAttribute),
      )
        .setDescription(pgAttribute.description)
    ),
    new BasicObjectType(this._pgClass.name).setDescription(this._pgClass.description)
  )

  public keys = new Set()
  public primaryKey = null
  public paginator = null

  // If we can’t insert into this class, there should be no `create`
  // function. Otherwise our `create` method is pretty basic.
  public create = (
    !this._pgClass.isInsertable
      ? null
      : (context: mixed, value: BasicObjectType.Value): Promise<BasicObjectType.Value> => {
        if (!isPGContext(context)) throw isPGContext.error()
        return this._getInsertLoader(context.client).load(value)
      }
  )

  /**
   * Gets a loader for inserting rows into the database. We create a
   * memoized version of this function to ensure we get consistent data
   * loaders.
   *
   * @private
   */
  @memoizeMethod
  private _getInsertLoader (client: Client): DataLoader<BasicObjectType.Value, BasicObjectType.Value> {
    return new DataLoader<BasicObjectType.Value, BasicObjectType.Value>(
      async (values: Array<BasicObjectType.Value>): Promise<Array<BasicObjectType.Value>> => {
        // Create our insert query.
        const query = sql.compile(sql.query`
          with insertion as (
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
              sql.query`(${sql.join(this.type.getFields().map(field =>
                value.hasOwnProperty(field.getName()) ? sql.value(value[field.getName()]) : sql.raw('default')
              ), ', ')})`
            ), ', ')}

            -- Finally, return everything.
            returning *
          )
          -- We use a subquery with our insert so we can turn the result into JSON.
          select row_to_json(i) as object from insertion as i
        `)()

        const { rows } = await client.query(query)
        return rows.map(({ object }) => object)
      }
    )
  }
}

export default PGCollection
