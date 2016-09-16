import {
  Collection,
  NullableType,
  ObjectType,
  BasicObjectType,
  BasicObjectField,
} from '../../../interface'

import pluralize = require('pluralize')
import DataLoader = require('dataloader')
import { Client } from 'pg'
import { memoize, sql } from '../../utils'
import { PGCatalog, PGClassObject, PGNamespaceObject, PGAttributeObject } from '../../introspection'
import isPGContext from '../isPGContext'
import typeFromPGType from '../typeFromPGType'
import PGCollectionType from './PGCollectionType'

/**
 * The PostgreSQL collection, or in relational terms, table.
 */
class PGCollection extends Collection<PGCollectionType.Value> {
  private _pgNamespace: PGNamespaceObject
  private _pgAttributes: Array<PGAttributeObject>

  constructor (
    pgCatalog: PGCatalog,
    private _pgClass: PGClassObject,
  ) {
    super(pluralize(_pgClass.name), new PGCollectionType(pgCatalog, _pgClass))

    this._pgNamespace = pgCatalog.assertGetNamespace(_pgClass.namespaceId)
    this._pgAttributes = pgCatalog.getClassAttributes(_pgClass.id)
  }

  // We redefine `getType` only so that we can manually specify the return type
  // as `PGCollectionType`.
  public getType (): PGCollectionType {
    return super.getType() as any
  }

  /**
   * True if we can insert rows into the class.
   */
  public canCreate (): boolean {
    return this._pgClass.isInsertable
  }

  /**
   * Get’s a loader for inserting rows into the database. This function is
   * memoized so there is one loader for every unique context.
   *
   * @private
   */
  @memoize
  private _getInsertLoader (client: Client): DataLoader<PGCollectionType.Value, PGCollectionType.Value> {
    const type = this.getType()

    return new DataLoader<PGCollectionType.Value, PGCollectionType.Value>(
      async (values: Array<PGCollectionType.Value>): Promise<Array<PGCollectionType.Value>> => {
        // Create our insert query.
        const query = sql.compile(sql.query`
          -- Start by defining our header which will be the class we are
          -- inserting into (prefixed by namespace of course).
          insert into ${sql.identifier(this._pgNamespace.name, this._pgClass.name)}

          -- Next, add all of our value tuples.
          values ${sql.join(values.map(value => {
            const row = type.toRow(value)
            // Make sure we have one value for every attribute in the class,
            // if there was no such value defined, we should just use
            // `default` and use the database’s default value.
            return sql.query`(${sql.join(this._pgAttributes.map(({ name }) =>
              row.hasOwnProperty(name) ? sql.value(row[name]) : sql.raw('default')
            ), ', ')})`
          }), ', ')}

          -- Finally, return everything.
          -- TODO: This shouldn’t return *…
          returning *
        `)()

        const { rows } = await client.query(query)
        return rows.map(row => type.fromRow(row))
      }
    )
  }

  /**
   * Creates a row in our collection. Batching is done in the background.
   */
  public create (context: mixed, value: PGCollectionType.Value): Promise<PGCollectionType.Value> {
    if (!isPGContext(context)) throw isPGContext.error()
    return this._getInsertLoader(context.client).load(value)
  }
}

export default PGCollection
