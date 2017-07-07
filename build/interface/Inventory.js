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
var Inventory = (function () {
    function Inventory() {
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
    Inventory.prototype.addCollection = function (collection) {
        var name = collection.name;
        if (this._collections.has(name))
            throw new Error("Collection of name '" + name + "' already exists in the inventory.");
        this._collections.set(name, collection);
        return this;
    };
    /**
     * Gets all of the collections in our system. A collection will always have
     * an object type, which should be accessible through `getTypes`.
     *
     * Two collections in this set should not have the same name.
     */
    Inventory.prototype.getCollections = function () {
        return Array.from(this._collections.values());
    };
    /**
     * Gets a single collection by name.
     */
    Inventory.prototype.getCollection = function (name) {
        return this._collections.get(name);
    };
    /**
     * Determines if a *specific* collection has been added to the inventory. If
     * the exact reference to the collection argument exists in the inventory this
     * method returns true, otherwise it returns false.
     */
    Inventory.prototype.hasCollection = function (collection) {
        return this._collections.get(collection.name) === collection;
    };
    /**
     * Gets a collection in our inventory for the given type. If a collection in
     * our inventory has this type it will be returned. Otherwise nothing will be
     * returned.
     */
    Inventory.prototype.getCollectionForType = function (type) {
        return this.getCollections().find(function (collection) { return collection.type === type; });
    };
    /**
     * Adds a single relation to our inventory. If the related collections are not
     * members of this inventory we fail with an error.
     */
    Inventory.prototype.addRelation = function (relation) {
        var name = relation.name, tailCollection = relation.tailCollection, headCollectionKey = relation.headCollectionKey;
        var keyName = tailCollection.name + "-" + headCollectionKey.collection.name + "-" + name;
        if (!this.hasCollection(tailCollection))
            throw new Error("Tail collection named '" + tailCollection.name + "' is not in this inventory.");
        if (!this.hasCollection(headCollectionKey.collection))
            throw new Error("Head collection named '" + headCollectionKey.collection.name + "' is not in this inventory.");
        if (this._relations.has(keyName))
            throw new Error("Relation of name '" + name + "' already exists between head collection '" + headCollectionKey.collection.name + "' and tail collection '" + tailCollection.name + "' in the inventory.");
        this._relations.set(keyName, relation);
        return this;
    };
    /**
     * Gets all of the relations in our inventory. A relationship is formed when
     * the values of one collection reference another. A relation can be used to
     * track that reference and perform operations using that reference.
     *
     * In a graph representation of our inventory, collections would be nodes and
     * relations would be directed edges.
     */
    Inventory.prototype.getRelations = function () {
        return Array.from(this._relations.values());
    };
    return Inventory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Inventory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVyZmFjZS9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUlBOzs7Ozs7Ozs7O0dBVUc7QUFDSDtJQUFBO1FBQ1UsaUJBQVksR0FBbUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUN4RCxlQUFVLEdBQStDLElBQUksR0FBRyxFQUFFLENBQUE7SUF5RjVFLENBQUM7SUF2RkM7Ozs7OztPQU1HO0lBQ0ksaUNBQWEsR0FBcEIsVUFBOEIsVUFBOEI7UUFDbEQsSUFBQSxzQkFBSSxDQUFlO1FBRTNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXVCLElBQUksdUNBQW9DLENBQUMsQ0FBQTtRQUVsRixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUE7UUFFdkMsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLGtDQUFjLEdBQXJCO1FBQ0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0lBQy9DLENBQUM7SUFFRDs7T0FFRztJQUNJLGlDQUFhLEdBQXBCLFVBQXNCLElBQVk7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksaUNBQWEsR0FBcEIsVUFBOEIsVUFBOEI7UUFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxVQUFVLENBQUE7SUFDOUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSx3Q0FBb0IsR0FBM0IsVUFBcUMsSUFBd0I7UUFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxVQUFVLElBQUksT0FBQSxVQUFVLENBQUMsSUFBSSxLQUFLLElBQUksRUFBeEIsQ0FBd0IsQ0FBbUMsQ0FBQTtJQUM3RyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksK0JBQVcsR0FBbEIsVUFBb0IsUUFBdUM7UUFDakQsSUFBQSxvQkFBSSxFQUFFLHdDQUFjLEVBQUUsOENBQWlCLENBQWE7UUFFNUQsSUFBTSxPQUFPLEdBQU0sY0FBYyxDQUFDLElBQUksU0FBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxTQUFJLElBQU0sQ0FBQTtRQUVyRixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBMEIsY0FBYyxDQUFDLElBQUksZ0NBQTZCLENBQUMsQ0FBQTtRQUU3RixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEQsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBMEIsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksZ0NBQTZCLENBQUMsQ0FBQTtRQUUzRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUFxQixJQUFJLGtEQUE2QyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSwrQkFBMEIsY0FBYyxDQUFDLElBQUksd0JBQXFCLENBQUMsQ0FBQTtRQUU1TCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFFdEMsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksZ0NBQVksR0FBbkI7UUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDN0MsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQTNGRCxJQTJGQzs7QUFFRCxrQkFBZSxTQUFTLENBQUEifQ==