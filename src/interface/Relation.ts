import Collection from './collection/Collection'
import CollectionKey from './collection/CollectionKey'
import Paginator from './collection/Paginator'
import Condition from './collection/Condition'
import ObjectType from './type/ObjectType'

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
 * The “tail” would be the “many” in a many-to-one relation and the “head”
 * would be the “one” in a many-to-one relation.
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
interface Relation<TKey> {
  /**
   * The name of the relation.
   */
  readonly name: string

  /**
   * The tail collection in this relationship.
   */
  readonly tailCollection: Collection

  /**
   * The head collection in this relationship.
   */
  readonly headCollection: Collection

  /**
   * The head collection key in this relationship.
   */
  readonly headCollectionKey: CollectionKey<TKey>

  /**
   * Gets the key for a value in the head collection from the tail collection
   * value. This allows us to see the “one” in a many-to-one mental model.
   */
  getHeadKeyFromTailValue (value: ObjectType.Value): TKey

  // /**
  //  * Gets the paginator for values in the tail collection which we will use
  //  * with a condition from `Relation#getTailConditionFromHeadValue`.
  //  *
  //  * The reason we have two seperate methods (one for the paginator, one for
  //  * the condition) is that we need to statically know information about the
  //  * paginator. Such as orderings, type, and name information.
  //  *
  //  * @see Relation#getTailConditionFromHeadValue
  //  */
  // // TODO: Is this really the right way to do this?
  // public getTailPaginator (): Paginator<TTailValue, mixed> | undefined {
  //   return this._tailPaginator
  // }

  // /**
  //  * Gets a condition which will be used with the tail paginator from
  //  * `Relation#getTailPaginator` to select all of the tail values from the
  //  * single head value. This allows us to see the “many” in a one-to-many
  //  * mental model.
  //  *
  //  * @see Relation#getTailPaginator
  //  */
  // public abstract getTailConditionFromHeadValue (value: THeadValue): Condition
}

export default Relation
