"use strict";
var interface_1 = require("../../interface");
var idSerde;
(function (idSerde) {
    /**
     * This function will take an id object and turn it into an opaque string
     * that can be deserialized. Type information is lost in serialization.
     */
    function serialize(
        // A `primaryKey` is required whereas in a normal collection it is not
        // required.
        collection, value) {
        var primaryKey = collection.primaryKey;
        // If there is no primary key, error.
        if (!primaryKey)
            throw new Error("A primary key is required for collection '" + collection.name + "' to create an id.");
        var keyType = primaryKey.keyType;
        var keyValue = primaryKey.getKeyFromValue(value);
        if (keyValue == null)
            throw new Error('Could not get a key from the value.');
        var defaultCase = function () { return new Buffer(JSON.stringify([collection.name, keyValue])).toString('base64'); };
        return interface_1.switchType(keyType, {
            // If the type is an object type, we convert the key into a tuple array
            // and spread it inside our array to save space.
            object: function (type) {
                var keyTuple = Array.from(type.fields.values()).map(function (field) { return field.getValue(keyValue); });
                return new Buffer(JSON.stringify([collection.name].concat(keyTuple))).toString('base64');
            },
            // Otherwise, let’s just use the single key value.
            nullable: defaultCase,
            list: defaultCase,
            alias: defaultCase,
            enum: defaultCase,
            scalar: defaultCase,
        });
    }
    idSerde.serialize = serialize;
    /**
     * This function will take a serialized `ID` object and deserialize the string
     * back into an ID object. Type information is lost in serialization and it
     * doesn’t come back in deserialization.
     */
    function deserialize(inventory, idString) {
        var _a = JSON.parse(new Buffer(idString, 'base64').toString()), collectionName = _a[0], keyTuple = _a.slice(1);
        var collection = inventory.getCollection(collectionName);
        if (!collection)
            throw new Error("A collection named '" + collectionName + "' does not exist.");
        if (!collection.primaryKey)
            throw new Error("Collection named '" + collectionName + "' does not have a primary key.");
        var collectionKey = collection.primaryKey;
        var defaultCase = function () { return keyTuple[0]; };
        var keyValue = interface_1.switchType(collectionKey.keyType, {
            // If the key type is an object type, we spread out the values in the id,
            // so we have to reconstruct the key value.
            object: function (keyType) {
                return keyType.fromFields(new Map(Array.from(keyType.fields.keys()).map(function (fieldName, i) { return [fieldName, keyTuple[i]]; })));
            },
            // Otherwise, the first item in the key tuple is the correct value.
            nullable: defaultCase,
            list: defaultCase,
            alias: defaultCase,
            enum: defaultCase,
            scalar: defaultCase,
        });
        return { collection: collection, keyValue: keyValue };
    }
    idSerde.deserialize = deserialize;
})(idSerde || (idSerde = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = idSerde;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRTZXJkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3V0aWxzL2lkU2VyZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDZDQUE4RjtBQUU5RixJQUFVLE9BQU8sQ0E4RWhCO0FBOUVELFdBQVUsT0FBTztJQUNmOzs7T0FHRztJQUNIO1FBQ0Usc0VBQXNFO1FBQ3RFLFlBQVk7UUFDWixVQUE4QixFQUM5QixLQUFhO1FBRWIsSUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQTRELENBQUE7UUFFMUYscUNBQXFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBNkMsVUFBVSxDQUFDLElBQUksdUJBQW9CLENBQUMsQ0FBQTtRQUVuRyxJQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFBO1FBQ2xDLElBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFbEQsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQztZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUE7UUFFeEQsSUFBTSxXQUFXLEdBQUcsY0FBTSxPQUFBLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQTFFLENBQTBFLENBQUE7UUFFcEcsTUFBTSxDQUFDLHNCQUFVLENBQVMsT0FBTyxFQUFFO1lBQ2pDLHVFQUF1RTtZQUN2RSxnREFBZ0Q7WUFDaEQsTUFBTSxFQUFFLFVBQUMsSUFBc0I7Z0JBQzdCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQTtnQkFDeEYsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLElBQUksU0FBSyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUN0RixDQUFDO1lBRUQsa0RBQWtEO1lBQ2xELFFBQVEsRUFBRSxXQUFXO1lBQ3JCLElBQUksRUFBRSxXQUFXO1lBQ2pCLEtBQUssRUFBRSxXQUFXO1lBQ2xCLElBQUksRUFBRSxXQUFXO1lBQ2pCLE1BQU0sRUFBRSxXQUFXO1NBQ3BCLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFuQ2UsaUJBQVMsWUFtQ3hCLENBQUE7SUFFRDs7OztPQUlHO0lBQ0gscUJBQTJDLFNBQW9CLEVBQUUsUUFBZ0I7UUFDekUsSUFBQSwwREFBcUYsRUFBcEYsc0JBQWMsRUFBRSxzQkFBVyxDQUF5RDtRQUUzRixJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBbUMsQ0FBQTtRQUU1RixFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXVCLGNBQWMsc0JBQW1CLENBQUMsQ0FBQTtRQUUzRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBcUIsY0FBYyxtQ0FBZ0MsQ0FBQyxDQUFBO1FBRXRGLElBQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxVQUF5QyxDQUFBO1FBRTFFLElBQU0sV0FBVyxHQUFHLGNBQU0sT0FBQSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxDQUFBO1FBRXJDLElBQU0sUUFBUSxHQUFHLHNCQUFVLENBQU8sYUFBYSxDQUFDLE9BQU8sRUFBRTtZQUN2RCx5RUFBeUU7WUFDekUsMkNBQTJDO1lBQzNDLE1BQU0sRUFBRSxVQUFDLE9BQXlCO2dCQUNoQyxPQUFBLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFrQixVQUFDLFNBQVMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDLENBQUM7WUFBL0gsQ0FBK0g7WUFFakksbUVBQW1FO1lBQ25FLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLElBQUksRUFBRSxXQUFXO1lBQ2pCLEtBQUssRUFBRSxXQUFXO1lBQ2xCLElBQUksRUFBRSxXQUFXO1lBQ2pCLE1BQU0sRUFBRSxXQUFXO1NBQ3BCLENBQUMsQ0FBQTtRQUVGLE1BQU0sQ0FBQyxFQUFFLFVBQVUsWUFBQSxFQUFFLFFBQVEsVUFBQSxFQUFFLENBQUE7SUFDakMsQ0FBQztJQTlCZSxtQkFBVyxjQThCMUIsQ0FBQTtBQUNILENBQUMsRUE5RVMsT0FBTyxLQUFQLE9BQU8sUUE4RWhCOztBQUVELGtCQUFlLE9BQU8sQ0FBQSJ9