import DataLoader = require('dataloader')
import { Client } from 'pg'
import { CollectionKey } from '../../../interface'
import { sql, memoizeMethod } from '../../utils'
import { PGCatalog, PGCatalogNamespace, PGCatalogClass, PGCatalogAttribute, PGCatalogPrimaryKeyConstraint, PGCatalogUniqueConstraint } from '../../introspection'
import Options from '../Options'
import pgClientFromContext from '../pgClientFromContext'
import transformPGValueIntoValue from '../transformPGValueIntoValue'
import transformValueIntoPGValue from '../transformValueIntoPGValue'
import PGObjectType from '../type/PGObjectType'
import PGCollection from './PGCollection'

/**
 * Creates a key from some types of Postgres constraints including primary key
 * constraints and unique constraints.
 */
class PGCollectionKey implements CollectionKey<PGObjectType.Value> {
  constructor (
    public collection: PGCollection,
    public pgConstraint: PGCatalogPrimaryKeyConstraint | PGCatalogUniqueConstraint,
  ) {}

  // Steal the options and catalog reference from our collection ;)
  private _options: Options = this.collection._options
  private _pgCatalog: PGCatalog = this.collection._pgCatalog
  private _pgClass: PGCatalogClass = this._pgCatalog.assertGetClass(this.pgConstraint.classId)
  private _pgNamespace: PGCatalogNamespace = this._pgCatalog.assertGetNamespace(this._pgClass.namespaceId)
  private _pgKeyAttributes: Array<PGCatalogAttribute> = this._pgCatalog.getClassAttributes(this.pgConstraint.classId, this.pgConstraint.keyAttributeNums)

  /**
   * A type used to represent a key value. Consumers can then use this
   * information to construct intelligent inputs.
   *
   * We can assume that the fields of `keyType` have the same number and order
   * as our Postgres key attributes.
   */
  public keyType: PGObjectType = new PGObjectType({
    // We prefix the name with an underscore because we consider this type to
    // be private. The name could change at any time.
    name: `_${this.pgConstraint.name}`,
    pgCatalog: this._pgCatalog,
    pgAttributes: new Map(this._pgKeyAttributes.map<[string, PGCatalogAttribute]>(pgAttribute =>
      [this._options.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name, pgAttribute]
    )),
  })

  /**
   * Creates a name based on combining all of the key attribute names seperated
   * by the word “and”.
   */
  // Note that we define `name` under `keyType`. This is so that we can use the
  // `keyType` field names when making our name instead of the plain Postgres
  // attribute names.
  public name: string = Array.from(this.keyType.fields.keys()).join('_and_')

  /**
   * We don’t have a great way to get the description for a key at the moment…
   */
  public description: undefined = undefined

  /**
   * Because `Array.from` may potentially be an extra operation we really don’t
   * want to run in hot code paths, we cache its result here.
   *
   * @private
   */
  // TODO: Remove all references to `Array.from` from the codebase. Iterables
  // forever!
  private _keyTypeFields: Array<[string, PGObjectType.Field<mixed>]> = Array.from(this.keyType.fields)

  /**
   * Extracts the key value from an object. In the case of this key, we are
   * just extracting a subset of the value.
   */
  public getKeyFromValue (value: PGObjectType.Value): PGObjectType.Value {
    return new Map<string, mixed>(
      this._keyTypeFields
        .map<[string, mixed]>(([fieldName]) => [fieldName, value.get(fieldName)])
    )
  }

  /**
   * Takes a key value and transforms it into a SQL condition which can be used
   * in the `where` clause of `select`s, `update`s, and `delete`s.
   *
   * @private
   */
  private _getSQLSingleKeyCondition (key: PGObjectType.Value): sql.SQL {
    return sql.join(this._keyTypeFields.map(([fieldName, field]) =>
      sql.query`${sql.identifier(field.pgAttribute.name)} = ${transformValueIntoPGValue(field.type, key.get(fieldName))}`
    ), ' and ')
  }

  /**
   * Reads a value if a user can select from this class. Batches requests to
   * the same client in the background.
   */
  public read: ((context: mixed, key: PGObjectType.Value) => Promise<PGObjectType.Value | null>) | null = (
    !this._pgClass.isSelectable
      ? null
      : (context: mixed, key: PGObjectType.Value): Promise<PGObjectType.Value | null> =>
        this._getSelectLoader(pgClientFromContext(context)).load(key)
  )

  /**
   * Gets a loader for the client which will load single values using some
   * keys.
   *
   * @private
   */
  @memoizeMethod
  private _getSelectLoader (client: Client): DataLoader<PGObjectType.Value, PGObjectType.Value | null> {
    return new DataLoader<PGObjectType.Value, PGObjectType.Value | null>(
      async (keys: Array<PGObjectType.Value>): Promise<Array<PGObjectType.Value | null>> => {
        const aliasIdentifier = Symbol()

        // For every key we have, generate a select statement then combine
        // those select statements with `union all`. This approach has a
        // number of advantages:
        //
        // 1. We get our rows back in the same order as our keys.
        // 2. We can take advantage of Postgres index scans.
        //
        // The disadvantage of this approach is that when we get a lot of
        // keys, we’ll be generating and sending a fairly large query. Not
        // only will our query minimization step have more work, but it may
        // take longer for Postgres to parse. However, at this point in time
        // the tradeoffs seem good.
        // TODO: There are many ways to write this query. `union all` seems
        // like the best method at the moment of writing without data.
        // *Test this assumption*.
        // TODO: If query minimization turns out to be expensive, refactor this
        // query to remove whitespace and disable query minimization when
        // compiling.
        const query = sql.compile(sql.query`
          -- Select our rows as JSON objects.
          select row_to_json(${sql.identifier(aliasIdentifier)}) as object
          from ${sql.identifier(this._pgNamespace.name, this._pgClass.name)} as ${sql.identifier(aliasIdentifier)}

          -- For all of our key attributes we need to test equality with a
          -- key value. If we only have one key type field, we make anoptimization.
          where ${this._keyTypeFields.length === 1
            // Our optimization will allow us to pass an array of single key
            // values. Once we get into the world of arrays of compound types,
            // that’s where this approach gets tricky. By far this method
            // appears to be the fastest.
            ? sql.query`${sql.identifier(this._keyTypeFields[0][1].pgAttribute.name)} = any(${sql.value(keys.map(key => key.get(this._keyTypeFields[0][0])))})`
            // Otherwise we send all of our keys as parametized values for
            // compound keys. This could be optimized, it would appear as if
            // the approach above will almost always be fastest.
            : sql.query`
              (${sql.join(this._keyTypeFields.map(([, field]) => sql.identifier(field.pgAttribute.name)), ', ')})
              in (${sql.join(keys.map(key =>
                sql.query`(${sql.join(this._keyTypeFields.map(([fieldName, field]) =>
                  transformValueIntoPGValue(field.type, key.get(fieldName))
                ), ', ')})`
              ), ', ')})
            `
          }

          -- Throw in a limit for good measure.
          limit ${sql.value(keys.length)}
        `)

        const { rows } = await client.query(query)

        const values = new Map(rows.map<[string, PGObjectType.Value]>(({ object }) => {
          const value = transformPGValueIntoValue(this.collection.type, object) as PGObjectType.Value
          const keyString = this._keyTypeFields.map(([fieldName]) => value.get(fieldName)).join('-')
          return [keyString, value]
        }))

        return keys.map(key => {
          const keyString = this._keyTypeFields.map(([fieldName]) => key.get(fieldName)).join('-')
          return values.get(keyString) || null
        })

        // tslint:disable-next-line no-any
        // return rows.map(({ object }) => object == null ? null : transformPGValueIntoValue(this.collection.type, object) as any)
      }
    )
  }

  /**
   * Updates a value in our Postgres database using a patch object. If no
   * value could be updated we should throw an error to let the user know.
   *
   * This method, unlike many of the other asynchronous actions in Postgres
   * collections, is not batched.
   */
  public update: ((context: mixed, key: PGObjectType.Value, patch: Map<string, mixed>) => Promise<PGObjectType.Value | null>) | null = (
    !this._pgClass.isUpdatable
      ? null
      : async (context: mixed, key: PGObjectType.Value, patch: Map<string, mixed>): Promise<PGObjectType.Value> => {
        const client = pgClientFromContext(context)

        const updatedIdentifier = Symbol()

        const query = sql.compile(sql.query`
          -- Put our updated rows in a with statement so that we can select
          -- our result as JSON rows before returning it.
          with ${sql.identifier(updatedIdentifier)} as (
            update ${sql.identifier(this._pgNamespace.name, this._pgClass.name)}

            -- Using our patch object we construct the fields we want to set and
            -- the values we want to set them to.
            set ${sql.join(Array.from(patch).map(([fieldName, value]) => {
              const field = this.collection.type.fields.get(fieldName)!
              const pgAttributeName = this.collection.type.getPGAttributeNameFromFieldName(fieldName)

              if (pgAttributeName == null)
                throw new Error(`Cannot update field named '${fieldName}' because it does not exist in collection '${this.collection.name}'.`)

              // Use the actual name of the Postgres attribute when
              // comparing, not the field name which may be different.
              return sql.query`${sql.identifier(pgAttributeName)} = ${transformValueIntoPGValue(field.type, value)}`
            }), ', ')}

            where ${this._getSQLSingleKeyCondition(key)}
            returning *
          )
          select row_to_json(${sql.identifier(updatedIdentifier)}) as object from ${sql.identifier(updatedIdentifier)}
        `)

        const result = await client.query(query)

        if (result.rowCount < 1)
          throw new Error(`No values were updated in collection '${this.collection.name}' using key '${this.name}' because no values were found.`)

        // tslint:disable-next-line no-any
        return transformPGValueIntoValue(this.collection.type, result.rows[0]['object']) as any
      }
  )

  /**
   * Deletes a value in our Postgres database using a given key. If no value
   * could be deleted, an error will be thrown.
   *
   * This method, unlike many others in Postgres collections, is not batched.
   */
  public delete: ((context: mixed, key: PGObjectType.Value) => Promise<PGObjectType.Value | null>) | null = (
    !this._pgClass.isDeletable
      ? null
      : async (context: mixed, key: PGObjectType.Value): Promise<PGObjectType.Value> => {
        const client = pgClientFromContext(context)

        const deletedIdentifier = Symbol()

        // This is a pretty simple query. Delete the row that matches our key
        // and return the deleted row.
        const query = sql.compile(sql.query`
          with ${sql.identifier(deletedIdentifier)} as (
            delete from ${sql.identifier(this._pgNamespace.name, this._pgClass.name)}
            where ${this._getSQLSingleKeyCondition(key)}
            returning *
          )
          select row_to_json(${sql.identifier(deletedIdentifier)}) as object from ${sql.identifier(deletedIdentifier)}
        `)

        const result = await client.query(query)

        if (result.rowCount < 1)
          throw new Error(`No values were deleted in collection '${this.collection.name}' because no values were found.`)

        // tslint:disable-next-line no-any
        return transformPGValueIntoValue(this.collection.type, result.rows[0]['object']) as any
      }
  )
}

export default PGCollectionKey
