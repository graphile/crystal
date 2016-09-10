import {
  Collection,
  NullableType,
  ObjectType,
  BasicObjectType,
  BasicObjectField,
} from '../../../interface'

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
    super(_pgClass.name, new PGCollectionType(pgCatalog, _pgClass))
    this._pgNamespace = pgCatalog.assertGetNamespace(_pgClass.namespaceId)
    this._pgAttributes = pgCatalog.getClassAttributes(_pgClass.id)
  }

  /**
   * Some helpful private properties.
   *
   * @private
   */
  private _pgNamespace: PGNamespaceObject
  private _pgAttributes: Array<PGAttributeObject>

  public getType (): PGCollectionType {
    return super.getType() as any
  }

  /**
   * The escaped class identifier that we will use in SQL to reference
   * this collection. The identifier is just the namespace name followed by a
   * dot and the class name. So for a namespace name of `forum` and a class
   * name of `person`, the SQL identifier would be `"forum"."person"`.
   *
   * @private
   */
  private _pgIdentifier: sql.SQLItem = sql.identifier(this._pgNamespace.name, this._pgClass.name)

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
  private _insertQuery = sql.compile(
    `${this._pgClass.name}_insert_many`,
    sql.query`
      insert into ${this._pgIdentifier}
      (${sql.join(this._pgAttributes.map(({ name }) => sql.identifier(name)), ', ')})
      select * from json_populate_recordset(null::${this._pgIdentifier}, ${sql.placeholder('rows')})
      returning *
    `,
  )

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
