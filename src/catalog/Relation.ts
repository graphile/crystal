import Collection from './collection/Collection'
import CollectionKey from './collection/CollectionKey'
import Condition from './collection/Condition'

/**
 * A relation represents a directed edge between the keys of values in two
 * different collections.
 *
 * The values in the “tail” collection will be able to provide a key for a
 * value in the “head” collection. In a more visual language you could think of
 * it like this:
 *
 * ```
 * tail => head
 * ```
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
    private _getTailConditionFromHeadValue: (value: THeadValue) => Condition,
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

  /**
   * This method can look super confusing, so let’s break it down. The
   * `Relation` object has a way to select a head value from a tail value,
   * that’s the way the arrow normally points, `tail => head`. But what if we
   * want to select the other way around? What if we want to take a “head”
   * value and get *all* the “tail” values that point at it.
   *
   * That’s where this method comes in.
   *
   * It takes a head value (similar to how `Relation#getHeadKeyFromTailValue`
   * takes a tail value) and returns a condition. Now why would it return a
   * condition, you may very well ask.
   *
   * Well, there always could be many tail values for a single head value (thus
   * is the nature of a directional relationship) so we’d need to query a set
   * of values. In our `Collection` object we query a set of values with
   * `Paginator`s. So why don’t we just return a paginator from here? The
   * reason we don’t is we don’t want to bust caches. Ideally we’d like to use
   * the same `Paginator` instance (the one in the tail collection
   * specifically) so our interface consumers have to derive less information
   * from two seperate paginator instances. Instead we return a condition that
   * can be used *with* the already created paginator.
   */
  // TODO: Is returning a condition correct here, or should we return a paginator?
  public getTailConditionFromHeadValue (value: THeadValue): Condition {
    return this._getTailConditionFromHeadValue(value)
  }
}

export default Relation
