"use strict";
const interface_1 = require('../../interface');
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
        const primaryKey = collection.primaryKey;
        // If there is no primary key, error.
        if (!primaryKey)
            throw new Error(`A primary key is required for collection '${collection.name}' to create an id.`);
        const keyType = primaryKey.keyType;
        const keyValue = primaryKey.getKeyFromValue(value);
        if (keyValue == null)
            throw new Error('Could not get a key from the value.');
        // If the type is an object type, we convert the key into a tuple array
        // and spread it inside our array to save space.
        if (keyType instanceof interface_1.ObjectType && keyValue instanceof Map) {
            const keyTuple = Array.from(keyType.fields.keys()).map(fieldName => keyValue.get(fieldName));
            return new Buffer(JSON.stringify([collection.name, ...keyTuple])).toString('base64');
        }
        else {
            return new Buffer(JSON.stringify([collection.name, keyValue])).toString('base64');
        }
    }
    idSerde.serialize = serialize;
    /**
     * This function will take a serialized `ID` object and deserialize the string
     * back into an ID object. Type information is lost in serialization and it
     * doesn’t come back in deserialization.
     */
    function deserialize(inventory, idString) {
        const [collectionName, ...keyTuple] = JSON.parse(new Buffer(idString, 'base64').toString());
        const collection = inventory.getCollection(collectionName);
        if (!collection)
            throw new Error(`A collection named '${collectionName}' does not exist.`);
        if (!collection.primaryKey)
            throw new Error(`Collection named '${collectionName}' does not have a primary key.`);
        const collectionKey = collection.primaryKey;
        let keyValue;
        // If the key type is an object type, we spread out the values in the id,
        // so we have to reconstruct the key value.
        if (collectionKey.keyType instanceof interface_1.ObjectType) {
            // tslint:disable-next-line no-any
            keyValue = new Map(Array.from(collectionKey.keyType.fields.keys()).map((fieldName, i) => [fieldName, keyTuple[i]]));
        }
        else {
            keyValue = keyTuple[0];
        }
        // Make sure to check the type of this value. If its not the correct type
        // we need to throw an error.
        if (!collectionKey.keyType.isTypeOf(keyValue))
            throw new Error('Key provided in id is not of the correct type.');
        return { collection, keyValue };
    }
    idSerde.deserialize = deserialize;
})(idSerde || (idSerde = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = idSerde;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRTZXJkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3V0aWxzL2lkU2VyZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRCQUFpRSxpQkFFakUsQ0FBQyxDQUZpRjtBQUVsRixJQUFVLE9BQU8sQ0F3RWhCO0FBeEVELFdBQVUsT0FBTyxFQUFDLENBQUM7SUFDakI7OztPQUdHO0lBQ0g7UUFDRSxzRUFBc0U7UUFDdEUsWUFBWTtRQUNaLFVBQXNCLEVBQ3RCLEtBQXVCO1FBRXZCLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUF5RCxDQUFBO1FBRXZGLHFDQUFxQztRQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLFVBQVUsQ0FBQyxJQUFJLG9CQUFvQixDQUFDLENBQUE7UUFFbkcsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQTtRQUNsQyxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRWxELEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO1FBRXhELHVFQUF1RTtRQUN2RSxnREFBZ0Q7UUFDaEQsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLHNCQUFVLElBQUksUUFBUSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0QsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7WUFDNUYsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN0RixDQUFDO1FBRUQsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNuRixDQUFDO0lBQ0gsQ0FBQztJQTVCZSxpQkFBUyxZQTRCeEIsQ0FBQTtJQUVEOzs7O09BSUc7SUFDSCxxQkFBd0MsU0FBb0IsRUFBRSxRQUFnQjtRQUM1RSxNQUFNLENBQUMsY0FBYyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUUzRixNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBRTFELEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsY0FBYyxtQkFBbUIsQ0FBQyxDQUFBO1FBRTNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixjQUFjLGdDQUFnQyxDQUFDLENBQUE7UUFFdEYsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFVBQXNDLENBQUE7UUFDdkUsSUFBSSxRQUFtQixDQUFBO1FBRXZCLHlFQUF5RTtRQUN6RSwyQ0FBMkM7UUFDM0MsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sWUFBWSxzQkFBVSxDQUFDLENBQUMsQ0FBQztZQUNoRCxrQ0FBa0M7WUFDbEMsUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQWtCLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFRLENBQUE7UUFDN0ksQ0FBQztRQUVELElBQUksQ0FBQyxDQUFDO1lBQ0osUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN4QixDQUFDO1FBRUQseUVBQXlFO1FBQ3pFLDZCQUE2QjtRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtRQUVuRSxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUE7SUFDakMsQ0FBQztJQS9CZSxtQkFBVyxjQStCMUIsQ0FBQTtBQUNILENBQUMsRUF4RVMsT0FBTyxLQUFQLE9BQU8sUUF3RWhCO0FBRUQ7a0JBQWUsT0FBTyxDQUFBIn0=