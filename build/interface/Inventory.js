"use strict";
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
    constructor() {
        this._collections = new Map();
        this._relations = new Map();
    }
    /**
     * Adds a single collection to our inventory. If a collection with the same
     * name already exists, an error is thrown. If the collection has a
     * different inventory, an error is thrown.
     *
     * We will also add the type for this collection to the inventory.
     */
    addCollection(collection) {
        const { name } = collection;
        if (this._collections.has(name))
            throw new Error(`Collection of name '${name}' already exists in the inventory.`);
        this._collections.set(name, collection);
        return this;
    }
    /**
     * Gets all of the collections in our system. A collection will always have
     * an object type, which should be accessible through `getTypes`.
     *
     * Two collections in this set should not have the same name.
     */
    getCollections() {
        return Array.from(this._collections.values());
    }
    /**
     * Gets a single collection by name.
     */
    getCollection(name) {
        return this._collections.get(name);
    }
    /**
     * Determines if a *specific* collection has been added to the inventory. If
     * the exact reference to the collection argument exists in the inventory this
     * method returns true, otherwise it returns false.
     */
    hasCollection(collection) {
        return this._collections.get(collection.name) === collection;
    }
    /**
     * Adds a single relation to our inventory. If the related collections are not
     * members of this inventory we fail with an error.
     */
    addRelation(relation) {
        const { name, tailCollection, headCollectionKey } = relation;
        const keyName = `${tailCollection.name}-${headCollectionKey.collection.name}-${name}`;
        if (!this.hasCollection(tailCollection))
            throw new Error(`Tail collection named '${tailCollection.name}' is not in this inventory.`);
        if (!this.hasCollection(headCollectionKey.collection))
            throw new Error(`Head collection named '${headCollectionKey.collection.name}' is not in this inventory.`);
        if (this._relations.has(keyName))
            throw new Error(`Relation of name '${name}' already exists between head collection '${headCollectionKey.collection.name}' and tail collection '${tailCollection.name}' in the inventory.`);
        this._relations.set(keyName, relation);
        return this;
    }
    /**
     * Gets all of the relations in our inventory. A relationship is formed when
     * the values of one collection reference another. A relation can be used to
     * track that reference and perform operations using that reference.
     *
     * In a graph representation of our inventory, collections would be nodes and
     * relations would be directed edges.
     */
    getRelations() {
        return Array.from(this._relations.values());
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Inventory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVyZmFjZS9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBOzs7Ozs7Ozs7O0dBVUc7QUFDSDtJQUFBO1FBQ1UsaUJBQVksR0FBNEIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNqRCxlQUFVLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUE7SUFnRjlELENBQUM7SUE5RUM7Ozs7OztPQU1HO0lBQ0ksYUFBYSxDQUFFLFVBQXNCO1FBQzFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUE7UUFFM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsSUFBSSxvQ0FBb0MsQ0FBQyxDQUFBO1FBRWxGLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQTtRQUV2QyxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksY0FBYztRQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDL0MsQ0FBQztJQUVEOztPQUVHO0lBQ0ksYUFBYSxDQUFFLElBQVk7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksYUFBYSxDQUFFLFVBQXNCO1FBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxDQUFBO0lBQzlELENBQUM7SUFFRDs7O09BR0c7SUFDSSxXQUFXLENBQUUsUUFBeUI7UUFDM0MsTUFBTSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxRQUFRLENBQUE7UUFFNUQsTUFBTSxPQUFPLEdBQUcsR0FBRyxjQUFjLENBQUMsSUFBSSxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFLENBQUE7UUFFckYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLGNBQWMsQ0FBQyxJQUFJLDZCQUE2QixDQUFDLENBQUE7UUFFN0YsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLDZCQUE2QixDQUFDLENBQUE7UUFFM0csRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsSUFBSSw2Q0FBNkMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksMEJBQTBCLGNBQWMsQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUE7UUFFNUwsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBRXRDLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLFlBQVk7UUFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0lBQzdDLENBQUM7QUFDSCxDQUFDO0FBRUQ7a0JBQWUsU0FBUyxDQUFBIn0=