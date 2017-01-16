import Collection from './collection/Collection'
import Relation from './collection/Relation'

/**
 * In order to build awesome tools from any database we need an abstract
 * static data definition language. Inventory is the root level interface
 * to this definition.
 *
 * If a database is strongly typed (like PostgreSql) it may implement the
 * inventory interfaces to expose its underlying data.
 *
 * Believe it or not, a `Inventory` and all of the objects inside it are
 * *mutable*. Scary, I know.
 */
class Inventory {
  private _collections: Map<string, Collection> = new Map()
  private _relations: Map<string, Relation<mixed>> = new Map()

  /**
   * Adds a single collection to our inventory. If a collection with the same
   * name already exists, an error is thrown. If the collection has a
   * different inventory, an error is thrown.
   *
   * We will also add the type for this collection to the inventory.
   */
  public addCollection (collection: Collection): this {
    const { name } = collection

    if (this._collections.has(name))
      throw new Error(`Collection of name '${name}' already exists in the inventory.`)

    this._collections.set(name, collection)

    return this
  }

  /**
   * Gets all of the collections in our system. A collection will always have
   * an object type, which should be accessible through `getTypes`.
   *
   * Two collections in this set should not have the same name.
   */
  public getCollections (): Array<Collection> {
    return Array.from(this._collections.values())
  }

  /**
   * Gets a single collection by name.
   */
  public getCollection (name: string): Collection | undefined {
    return this._collections.get(name)
  }

  /**
   * Determines if a *specific* collection has been added to the inventory. If
   * the exact reference to the collection argument exists in the inventory this
   * method returns true, otherwise it returns false.
   */
  public hasCollection (collection: Collection): boolean {
    return this._collections.get(collection.name) === collection
  }

  /**
   * Gets a collection in our inventory for the given type. If a collection in
   * our inventory has this type it will be returned. Otherwise nothing will be
   * returned.
   */
  // TODO: Don’t use `any`
  public getCollectionForType (type: any): Collection | undefined {
    return this.getCollections().find(collection => collection.type === type)
  }

  /**
   * Adds a single relation to our inventory. If the related collections are not
   * members of this inventory we fail with an error.
   */
  public addRelation (relation: Relation<mixed>): this {
    const { name, tailCollection, headCollectionKey } = relation

    const keyName = `${tailCollection.name}-${headCollectionKey.collection.name}-${name}`

    if (!this.hasCollection(tailCollection))
      throw new Error(`Tail collection named '${tailCollection.name}' is not in this inventory.`)

    if (!this.hasCollection(headCollectionKey.collection))
      throw new Error(`Head collection named '${headCollectionKey.collection.name}' is not in this inventory.`)

    if (this._relations.has(keyName))
      throw new Error(`Relation of name '${name}' already exists between head collection '${headCollectionKey.collection.name}' and tail collection '${tailCollection.name}' in the inventory.`)

    this._relations.set(keyName, relation)

    return this
  }

  /**
   * Gets all of the relations in our inventory. A relationship is formed when
   * the values of one collection reference another. A relation can be used to
   * track that reference and perform operations using that reference.
   *
   * In a graph representation of our inventory, collections would be nodes and
   * relations would be directed edges.
   */
  public getRelations (): Array<Relation<mixed>> {
    return Array.from(this._relations.values())
  }
}

export default Inventory
