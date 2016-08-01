import NamedType from './type/NamedType'
import Collection from './collection/Collection'
import Relation from './Relation'

// TODO: Validate catalog function. There are a lot of assumptions we make that
// cannot be statically typed. We should have a test utility function to prove
// those assumptions are correct. We will mostly test things not defined in
// the type system.
// TODO: Is this the right way to do it?
// TODO: Test this!
// TODO: Use a different name. Having a `Catalog` and a `PGCatalog` can be
// confusing!
/**
 * In order to build awesome tools from any database we need an abstract
 * static data definition language. Catalog is the root level interface
 * to this definition.
 *
 * If a database is strongly typed (like PostgreSQL) it may implement the
 * catalog interfaces to expose its underlying data.
 *
 * Believe it or not, a `Catalog` and all of the objects inside it are
 * *mutable*. Scary, I know.
 */
class Catalog {
  private _collections = new Map<string, Collection<any>>()
  private _relations = new Set<Relation<any, any, any>>()

  /**
   * Adds a single collection to our catalog. If a collection with the same
   * name already exists, an error is thrown. If the collection has a
   * different catalog, an error is thrown.
   */
  public addCollection (collection: Collection<any>): this {
    if (collection.getCatalog() !== this)
      throw new Error('Collection is not in this catalog.')

    const name = collection.getName()

    if (this._collections.has(name))
      throw new Error(`Type of name '${name}' already exists in the catalog.`)

    this._collections.set(name, collection)

    return this
  }

  /**
   * Gets all of the collections in our system. A collection will always have
   * an object type, which should be accessible through `getTypes`.
   *
   * Two collections in this set should not have the same name.
   */
  // TODO: Test that the collection object type is returned by `getTypes`.
  // TODO: Test that collections do not have the same name.
  public getCollections (): Collection<any>[] {
    return Array.from(this._collections.values())
  }

  /**
   * Gets a single collection by name.
   */
  public getCollection (name: string): Collection<any> | undefined {
    return this._collections.get(name)
  }

  /**
   * Determines if a *specific* collection has been added to the catalog. If
   * the exact reference to the collection argument exists in the catalog this
   * method returns true, otherwise it returns false.
   */
  public hasCollection (collection: Collection<any>): boolean {
    return this._collections.get(collection.getName()) === collection
  }

  /**
   * Adds a single relation to our catalog. If the related collections are not
   * members of this catalog we fail with an error.
   */
  public addRelation (relation: Relation<any, any, any>): this {
    const tailCollection = relation.getTailCollection()
    const headCollection = relation.getHeadCollectionKey().getCollection()

    if (!this.hasCollection(tailCollection))
      throw new Error(`Tail collection named '${tailCollection.getName()}' is not in this catalog.`)

    if (!this.hasCollection(headCollection))
      throw new Error(`Head collection named '${headCollection.getName()}' is not in this catalog.`)

    this._relations.add(relation)

    return this
  }

  /**
   * Gets all of the relations in our catalog. A relationship is formed when
   * the values of one collection reference another. A relation can be used to
   * track that reference and perform operations using that reference.
   *
   * In a graph representation of our catalog, collections would be nodes and
   * relations would be directed edges.
   */
  public getRelations (): Relation<any, any, any>[] {
    return Array.from(this._relations)
  }
}

export default Catalog
