import Collection from './collection/Collection'
import CollectionKey from './collection/CollectionKey'

/**
 * A relation represents a directed edge between the keys of values in two
 * different collections.
 *
 * The values in the “tail” collection will be able to provide a key for a
 * value in the “head” collection.
 *
 * So for example, say we had a `post` collection and a `person` collection.
 * Let’s also say that the `post` collection has an `author` field which is a
 * collection key for the `person` collection. In this case where `post` is
 * related to `person,` `post` is the tail collection and `person` is the head
 * collection.
 *
 * Or in relational database terms: a `post` table with an `author_id` column
 * and a `person` table with an `id` column. The `post` table is the tail and
 * the `person` table is the head.
 *
 * @see https://en.wikipedia.org/wiki/Directed_graph#Basic_terminology
 */
class Relation<TTailValue, THeadValue, TKey> {
  constructor (
    private _name: string,
    private _tailCollection: Collection<TTailValue>,
    private _headCollectionKey: CollectionKey<THeadValue, TKey>,
    private _getHeadKeyFromTailValue: (value: TTailValue) => TKey,
  ) {}

  /**
   * Gets the name of a relation.
   */
  public getName (): string {
    return this._name
  }

  /**
   * Gets the tail collection in this relationship.
   */
  public getTailCollection (): Collection<TTailValue> {
    return this._tailCollection
  }

  /**
   * Gets the head collection in this relationship.
   */
  public getHeadCollectionKey (): CollectionKey<THeadValue, TKey> {
    return this._headCollectionKey
  }

  /**
   * Gets the key for a value in the head collection from the tail collection
   * value.
   */
  public getHeadKeyFromTailValue (value: TTailValue): TKey {
    return this._getHeadKeyFromTailValue(value)
  }
}

export default Relation
