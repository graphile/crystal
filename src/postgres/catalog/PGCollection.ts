import {
  Collection,
  NullableType,
  ObjectType,
  BasicObjectType,
  BasicObjectField,
} from '../../catalog'

import { Client } from 'pg'
import DataLoader from 'dataloader'
import { memoize, sql } from '../utils'
import PGCatalog from '../introspection/PGCatalog'
import PGClass from '../introspection/object/PGClass'
import PGNamespace from '../introspection/object/PGNamespace'
import PGAttribute from '../introspection/object/PGAttribute'
import typeFromPGType from './typeFromPGType'

/**
 * The context to be provided to all collection execution methods.
 *
 * @private
 */
interface Context {
  client: Client
}

/**
 * The internal type for values in a PostgreSQL collection.
 *
 * @private
 */
type Value = {
  [key: string]: any,
}

/**
 * The PostgreSQL collection, or in relational terms, table.
 */
class PGCollection extends Collection<Value> {
  /**
   * Creates the object type that our collection uses. Instead of such a type
   * getting passed in through a parameter, we create it instead.
   *
   * @private
   */
  private static _createType (pgCatalog: PGCatalog, pgClass: PGClass): ObjectType<Value> {
    // Note that we use the class name and description and not the type name
    // and description. This is a stylistic choice for PostgreSQL.
    const objectType = new BasicObjectType(pgClass.name).setDescription(pgClass.description)

    for (const pgAttribute of pgCatalog.getClassAttributes(pgClass.id)) {
      const pgType = pgCatalog.assertGetType(pgAttribute.typeId)
      let type = typeFromPGType(pgCatalog, pgType)

      // Make sure that if the `NOT NULL` constraint was set, the type is not
      // nullable.
      if (pgAttribute.isNotNull && type instanceof NullableType)
        type = type.getBaseType()

      const field = new BasicObjectField(pgAttribute.name, type).setDescription(pgAttribute.description)

      objectType.addField(field)
    }

    return objectType
  }

  private _pgNamespace: PGNamespace
  private _pgClass: PGClass
  private _pgAttributes: PGAttribute[]

  constructor (
    pgCatalog: PGCatalog,
    pgClass: PGClass,
  ) {
    super(pgClass.name, PGCollection._createType(pgCatalog, pgClass))
    this._pgNamespace = pgCatalog.assertGetNamespace(pgClass.namespaceId)
    this._pgClass = pgClass
    this._pgAttributes = pgCatalog.getClassAttributes(pgClass.id)
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
   * Turns a value into a row object that we can send to our PostgreSQL
   * database.
   *
   * @private
   * @see PGCollection#_rowToValue
   */
  private _valueToRow (value: Value): any {
    // In the current implementation, values and rows have the same type
    // thanks to `BasicObjectType` (see `PGCollection._createType`). Therefore
    // the implementation of this function can just be an identity function.
    //
    // There is a more “correct” way to implement this with
    // `field.getFieldValueFromObject`, but since we have the opportunity to
    // get a free optimization, let’s do it!
    return value
  }

  /**
   * Turns a row of this collection from PostgreSQL into the internal value
   * type.
   *
   * @private
   * @see PGCollection#_valueToRow
   */
  private _rowToValue (row: any): Value {
    // See the comment inside `PGCollection#_rowToValue`. It applies here too.
    return row
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
  private _getInsertLoader ({ client }: Context): DataLoader<Value, Value> {
    return new DataLoader<Value, Value>(async (values: Value[]): Promise<Value[]> => {
      const query = this._insertQuery({ rows: values.map(value => this._valueToRow(value)) })
      const { rows } = await client.query(query)
      return rows.map(row => this._rowToValue(row))
    })
  }

  /**
   * Creates a row in our collection. Batching is done in the background.
   */
  public create (context: Context, value: Value): Promise<Value> {
    return this._getInsertLoader(context).load(value)
  }

  /**
   * True if we can select rows from the class.
   */
  public canReadMany (): boolean {
    return this._pgClass.isSelectable
  }

  // public readMany ({ client }: Context, { condition, limit, skip }: Selection): Observable<Value> {

  // }
}

export default PGCollection
