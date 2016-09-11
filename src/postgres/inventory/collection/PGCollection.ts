import {
  Collection,
  NullableType,
  ObjectType,
  BasicObjectType,
  BasicObjectField,
} from '../../../interface'

import pluralize = require('pluralize')
import DataLoader from 'dataloader'
import { memoize, sql } from '../../utils'
import { PGCatalog, PGClassObject, PGNamespaceObject, PGAttributeObject } from '../../introspection'
import isPGContext from '../isPGContext'
import typeFromPGType from '../typeFromPGType'
import PGCollectionType from './PGCollectionType'

/**
 * The PostgreSQL collection, or in relational terms, table.
 */
class PGCollection extends Collection<PGCollectionType.Value> {
  constructor (
    pgCatalog: PGCatalog,
    private _pgClass: PGClassObject,
  ) {
    super(pluralize(_pgClass.name), new PGCollectionType(pgCatalog, _pgClass))

    const pgNamespace = pgCatalog.assertGetNamespace(_pgClass.namespaceId)
    const pgAttributes = pgCatalog.getClassAttributes(_pgClass.id)

    const pgIdentifier = sql.identifier(pgNamespace.name, _pgClass.name)

    this._insertQuery = sql.compile(
      `${this._pgClass.name}_insert_many`,
      sql.query`
        insert into ${pgIdentifier}
        (${sql.join(pgAttributes.map(({ name }) => sql.identifier(name)), ', ')})
        select * from json_populate_recordset(null::${pgIdentifier}, ${sql.placeholder('rows')})
        returning *
      `,
    )
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
   * The query to be used when inserting rows into the database.
   *
   * @private
   */
  private _insertQuery: sql.QueryThunk

  /**
   * Get’s a loader for inserting rows into the database. This function is
   * memoized so there is one loader for every unique context.
   *
   * @private
   */
  @memoize
  private _getInsertLoader (context: mixed): DataLoader<PGCollectionType.Value, PGCollectionType.Value> {
    if (!isPGContext(context)) throw isPGContext.error()

    const type = this.getType()
    const { client } = context

    return new DataLoader<PGCollectionType.Value, PGCollectionType.Value>(
      async (values: Array<PGCollectionType.Value>): Promise<Array<PGCollectionType.Value>> => {
        const query = this._insertQuery({ rows: values.map(value => type.toRow(value)) })
        const { rows } = await client.query(query)
        return rows.map(row => type.fromRow(row))
      }
    )
  }

  /**
   * Creates a row in our collection. Batching is done in the background.
   */
  public create (context: mixed, value: PGCollectionType.Value): Promise<PGCollectionType.Value> {
    return this._getInsertLoader(context).load(value)
  }
}

export default PGCollection
