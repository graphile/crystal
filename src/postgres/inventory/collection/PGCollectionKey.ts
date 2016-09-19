import DataLoader = require('dataloader')
import { Client } from 'pg'
import { CollectionKey, Type, ObjectType, ObjectField } from '../../../interface'
import { sql, memoizeMethod } from '../../utils'
import { PGCatalog, PGCatalogClass, PGCatalogAttribute, PGCatalogPrimaryKeyConstraint, PGCatalogUniqueConstraint } from '../../introspection'
import getTypeFromPGType from '../getTypeFromPGType'
import isPGContext from '../isPGContext'

type PGCollectionValue = { [key: string]: mixed }
type PGCollectionKeyValue = Array<mixed>

/**
 * Creates a key from some types of Postgres constraints including primary key
 * constraints and unique constraints.
 */
class PGCollectionKey implements CollectionKey<PGCollectionValue, PGCollectionKeyValue, PGCollectionKeyType> {
  constructor (
    private _pgCatalog: PGCatalog,
    private _pgConstraint: PGCatalogPrimaryKeyConstraint | PGCatalogUniqueConstraint,
  ) {}

  private _pgClass = this._pgCatalog.assertGetClass(this._pgConstraint.classId)
  private _pgNamespace = this._pgCatalog.assertGetNamespace(this._pgClass.namespaceId)

  private _pgKeyAttributes = (
    this._pgConstraint.keyAttributeNums
      .map(num => this._pgCatalog.assertGetAttribute(this._pgConstraint.classId, num))
  )

  /**
   * Creates a name based on combining all of the key attribute names seperated
   * by the word “and”.
   */
  public name = this._pgKeyAttributes.map(attribute => attribute.name).join('_and_')

  /**
   * We don’t have a great way to get the description for a key at the moment…
   */
  public description = undefined

  /**
   * A type used to represent a key value. Consumers can then use this
   * information to construct intelligent inputs.
   */
  public type = new PGCollectionKeyType(
    // We put an underscore in front of the name for this type to indicate the
    // type as private which allows us to change the type name at any time and
    // make it public.
    `_${this._pgConstraint.name}`,
    this._pgCatalog,
    this._pgKeyAttributes,
  )

  /**
   * Extracts the key value from an object. In the case of this key, we are
   * just extracting a subset of the value.
   */
  public getKeyFromValue (value: PGCollectionValue): PGCollectionKeyValue {
    return this.type.getFields().map(field => value[field.getName()])
  }

  /**
   * Reads a value if a user can select from this class. Batches requests to
   * the same client in the background.
   */
  public read = (
    !this._pgClass.isSelectable
      ? null
      : (context: mixed, key: PGCollectionKeyValue): Promise<PGCollectionValue | null> => {
        if (!isPGContext(context)) throw isPGContext.error()
        return this._getSelectLoader(context.client).load(key)
      }
  )

  /**
   * Gets a loader for the client which will load single values using some
   * keys.
   *
   * @private
   */
  @memoizeMethod
  private _getSelectLoader (client: Client): DataLoader<PGCollectionKeyValue, PGCollectionValue | null> {
    return new DataLoader<PGCollectionKeyValue, PGCollectionValue | null>(
      async (keys: Array<PGCollectionKeyValue>): Promise<Array<PGCollectionValue | null>> => {
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
          ${sql.join(keys.map(key =>
            // We wrap our actual selection in another select to allow a
            // local `limit` clause.
            sql.query`
              select (
                -- Select our rows as JSON objects.
                select row_to_json(x) as object
                from ${sql.identifier(this._pgNamespace.name, this._pgClass.name)} as x

                -- For all of our key attributes we need to test equality with a
                -- key value. Note though, if we don’t find a match no row will
                -- be emit for this key. We loop through our keys below to
                -- safeguard this from happening.
                where
                  ${sql.join(this._pgKeyAttributes.map((pgAttribute, i) =>
                    sql.query`${sql.identifier(pgAttribute.name)} = ${sql.value(key[i])}`
                  ), ' and ')}

                -- Combine our selected row with a single null and a limit.
                -- This way if our where clause misses, we’ll get the null. If
                -- our where clause does not miss we will get the row and no
                -- null.
                union all
                select null
                limit 1
              )
            `
          ), ' union all ')}
        `)()

        const { rows } = await client.query(query)
        return rows.map(({ object }) => object)
      }
    )
  }
}

export default PGCollectionKey

/**
 * The collection key type is just a thin wrapper around an array. Instead of
 * representing objects as a JavaScript object, the key type will represent
 * object as an array.
 */
class PGCollectionKeyType extends ObjectType<
  PGCollectionKeyValue,
  PGCollectionKeyField<mixed, Type<mixed>>,
> {
  constructor (
    name: string,
    private _pgCatalog: PGCatalog,
    private _pgKeyAttributes: Array<PGCatalogAttribute>,
  ) {
    super(name)
  }

  @memoizeMethod
  public getFields (): Array<PGCollectionKeyField<mixed, Type<mixed>>> {
    return this._pgKeyAttributes.map((pgAttribute, i) =>
      new PGCollectionKeyField(this._pgCatalog, pgAttribute, i)
    )
  }

  public createFromFieldValues (fieldValues: Map<string, mixed>): PGCollectionKeyValue {
    return this.getFields().map(field => fieldValues.get(field.getName()))
  }
}

class PGCollectionKeyField<
  TFieldValue,
  TFieldType extends Type<TFieldValue>,
> extends ObjectField<
  PGCollectionKeyValue,
  TFieldValue,
  TFieldType,
> {
  constructor (
    pgCatalog: PGCatalog,
    pgAttribute: PGCatalogAttribute,
    private _i: number,
  ) {
    super(
      pgAttribute.name,
      getTypeFromPGType(pgCatalog, pgCatalog.assertGetType(pgAttribute.typeId)) as any,
    )
  }

  public getFieldValueFromObject (object: PGCollectionKeyValue): TFieldValue {
    return object[this._i] as any
  }
}
