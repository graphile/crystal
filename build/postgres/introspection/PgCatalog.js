"use strict";
/**
 * A utility class for interacting with the `PgCatalogObject`s returned from the
 * introspection query.
 */
var PgCatalog = (function () {
    function PgCatalog(objects) {
        this._namespaces = new Map();
        this._classes = new Map();
        this._attributes = new Map();
        this._types = new Map();
        this._constraints = new Set();
        this._procedures = new Set();
        // Build an in-memory index of all our objects for ease of use:
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var object = objects_1[_i];
            switch (object.kind) {
                case 'namespace':
                    this._namespaces.set(object.id, object);
                    break;
                case 'class':
                    this._classes.set(object.id, object);
                    break;
                case 'attribute':
                    this._attributes.set(object.classId + "-" + object.num, object);
                    break;
                case 'type':
                    this._types.set(object.id, object);
                    break;
                case 'constraint':
                    this._constraints.add(object);
                    break;
                case 'procedure':
                    this._procedures.add(object);
                    break;
                default:
                    throw new Error("Object of kind '" + object['kind'] + "' is not allowed.");
            }
        }
    }
    /**
     * Gets all of the namespace objects.
     */
    PgCatalog.prototype.getNamespaces = function () {
        return Array.from(this._namespaces.values());
    };
    /**
     * Gets a single namespace object of the provided id.
     */
    PgCatalog.prototype.getNamespace = function (id) {
        return this._namespaces.get(id);
    };
    /**
     * Gets a single namespace object by the provided id, and if no namespace
     * object exists an error is thrown instead of returning `undefined`.
     */
    PgCatalog.prototype.assertGetNamespace = function (id) {
        var namespace = this.getNamespace(id);
        if (!namespace)
            throw new Error("No namespace was found with id " + id);
        return namespace;
    };
    /**
     * Gets a namespace by its name. Helpful in tests where we know the name, but
     * not the id it has been assigned, and it is helpful for user input.
     */
    PgCatalog.prototype.getNamespaceByName = function (namespaceName) {
        return this.getNamespaces().find(function (namespace) { return namespace.name === namespaceName; });
    };
    /**
     * Gets all of the class objects.
     */
    PgCatalog.prototype.getClasses = function () {
        return Array.from(this._classes.values());
    };
    /**
     * Gets a single class object of the provided id.
     */
    PgCatalog.prototype.getClass = function (id) {
        return this._classes.get(id);
    };
    /**
     * Gets a single class object by the provided id, and if no class object
     * exists an error is thrown instead of returning `undefined`.
     */
    PgCatalog.prototype.assertGetClass = function (id) {
        var clazz = this.getClass(id);
        if (!clazz)
            throw new Error("No class was found with id " + id);
        return clazz;
    };
    /**
     * Gets a class by its name, also use the namespace name to ensure
     * there are no naming collisions. Helpful in tests where we know the name,
     * but not the id it has been assigned, and it is helpful for user input.
     */
    PgCatalog.prototype.getClassByName = function (namespaceName, className) {
        var namespace = this.getNamespaceByName(namespaceName);
        if (!namespace)
            return;
        return this.getClasses().find(function (klass) { return klass.namespaceId === namespace.id && klass.name === className; });
    };
    /**
     * Gets all of the attribute objects.
     */
    PgCatalog.prototype.getAttributes = function () {
        return Array.from(this._attributes.values());
    };
    /**
     * Gets a single attribute object by the provided class id and number.
     */
    PgCatalog.prototype.getAttribute = function (classId, num) {
        return this._attributes.get(classId + "-" + num);
    };
    /**
     * Gets a single attribute object by the provided class id and position
     * number. If no attribute object exists an error is thrown instead of
     * returning `undefined`.
     */
    PgCatalog.prototype.assertGetAttribute = function (classId, num) {
        var attribute = this.getAttribute(classId, num);
        if (!attribute)
            throw new Error("No attribute found for class " + classId + " in position " + num);
        return attribute;
    };
    /**
     * Gets all of the attributes for a single class.
     *
     * If provided an array of `nums`, we will get only those attributes in the
     * enumerated order. Otherwise we get all attributes in the order of their
     * definition.
     */
    PgCatalog.prototype.getClassAttributes = function (classId, nums) {
        var _this = this;
        // Currently if we get a `nums` array we use a completely different
        // implementation to preserve the `nums` order..
        if (nums)
            return nums.map(function (num) { return _this.assertGetAttribute(classId, num); });
        return Array.from(this._attributes.values()).filter(function (pgAttribute) { return pgAttribute.classId === classId; });
    };
    /**
     * Gets an attribute by its name and the name of the class and namespace it
     * is in. This is helpful in tests where we know the name of an attribute,
     * but not its `classId` or `num`.
     */
    PgCatalog.prototype.getAttributeByName = function (namespaceName, className, attributeName) {
        var klass = this.getClassByName(namespaceName, className);
        if (!klass)
            return;
        return this.getAttributes().find(function (attribute) { return attribute.classId === klass.id && attribute.name === attributeName; });
    };
    /**
     * Gets all of the type objects.
     */
    PgCatalog.prototype.getTypes = function () {
        return Array.from(this._types.values());
    };
    /**
     * Gets a single type object by the provided id.
     */
    PgCatalog.prototype.getType = function (id) {
        return this._types.get(id);
    };
    /**
     * Determines if our instance has this *exact* `PgType` instance.
     */
    PgCatalog.prototype.hasType = function (type) {
        return this._types.get(type.id) === type;
    };
    /**
     * Gets a single type object by the provided id, and if no type object
     * exists an error is thrown instead of returning `undefined`.
     */
    PgCatalog.prototype.assertGetType = function (id) {
        var type = this.getType(id);
        if (!type)
            throw new Error("No type was found with id " + id);
        return type;
    };
    /**
     * Gets a type by its name, also use the namespace name to ensure
     * there are no naming collisions. Helpful in tests where we know the name,
     * but not the id it has been assigned, and it is helpful for user input.
     */
    PgCatalog.prototype.getTypeByName = function (namespaceName, typeName) {
        var namespace = this.getNamespaceByName(namespaceName);
        if (!namespace)
            return;
        return this.getTypes().find(function (type) { return type.namespaceId === namespace.id && type.name === typeName; });
    };
    /**
     * Gets all of the constraints found by our catalog.
     */
    PgCatalog.prototype.getConstraints = function () {
        return Array.from(this._constraints);
    };
    /**
     * Returns all of the procedures in our catalog.
     */
    PgCatalog.prototype.getProcedures = function () {
        return Array.from(this._procedures);
    };
    /**
     * Gets a procedure by its name, also use the namespace name to ensure
     * there are no naming collisions. Helpful in tests where we know the name,
     * but not the id it has been assigned, and it is helpful for user input.
     */
    PgCatalog.prototype.getProcedureByName = function (namespaceName, procedureName) {
        var namespace = this.getNamespaceByName(namespaceName);
        if (!namespace)
            return;
        return this.getProcedures().find(function (procedure) { return procedure.namespaceId === namespace.id && procedure.name === procedureName; });
    };
    return PgCatalog;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgCatalog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDYXRhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludHJvc3BlY3Rpb24vUGdDYXRhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQTs7O0dBR0c7QUFDSDtJQVFFLG1CQUFhLE9BQStCO1FBUHBDLGdCQUFXLEdBQW9DLElBQUksR0FBRyxFQUFFLENBQUE7UUFDeEQsYUFBUSxHQUFnQyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2pELGdCQUFXLEdBQW9DLElBQUksR0FBRyxFQUFFLENBQUE7UUFDeEQsV0FBTSxHQUErQixJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQzlDLGlCQUFZLEdBQTZCLElBQUksR0FBRyxFQUFFLENBQUE7UUFDbEQsZ0JBQVcsR0FBNEIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUd0RCwrREFBK0Q7UUFDL0QsR0FBRyxDQUFDLENBQWlCLFVBQU8sRUFBUCxtQkFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztZQUF2QixJQUFNLE1BQU0sZ0JBQUE7WUFDZixNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsS0FBSyxXQUFXO29CQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUE7b0JBQ3ZDLEtBQUssQ0FBQTtnQkFDUCxLQUFLLE9BQU87b0JBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQTtvQkFDcEMsS0FBSyxDQUFBO2dCQUNQLEtBQUssV0FBVztvQkFDZCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBSSxNQUFNLENBQUMsT0FBTyxTQUFJLE1BQU0sQ0FBQyxHQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7b0JBQy9ELEtBQUssQ0FBQTtnQkFDUCxLQUFLLE1BQU07b0JBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQTtvQkFDbEMsS0FBSyxDQUFBO2dCQUNQLEtBQUssWUFBWTtvQkFDZixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtvQkFDN0IsS0FBSyxDQUFBO2dCQUNQLEtBQUssV0FBVztvQkFDZCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtvQkFDNUIsS0FBSyxDQUFBO2dCQUNQO29CQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQW1CLE1BQU0sQ0FBQyxNQUFNLENBQUMsc0JBQW1CLENBQUMsQ0FBQTtZQUN6RSxDQUFDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxpQ0FBYSxHQUFwQjtRQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUM5QyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxnQ0FBWSxHQUFuQixVQUFxQixFQUFVO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNqQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksc0NBQWtCLEdBQXpCLFVBQTJCLEVBQVU7UUFDbkMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUV2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQWtDLEVBQUksQ0FBQyxDQUFBO1FBRXpELE1BQU0sQ0FBQyxTQUFTLENBQUE7SUFDbEIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHNDQUFrQixHQUF6QixVQUEyQixhQUFxQjtRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFoQyxDQUFnQyxDQUFDLENBQUE7SUFDakYsQ0FBQztJQUVEOztPQUVHO0lBQ0ksOEJBQVUsR0FBakI7UUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVEOztPQUVHO0lBQ0ksNEJBQVEsR0FBZixVQUFpQixFQUFVO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUM5QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksa0NBQWMsR0FBckIsVUFBdUIsRUFBVTtRQUMvQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBOEIsRUFBSSxDQUFDLENBQUE7UUFFckQsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksa0NBQWMsR0FBckIsVUFBdUIsYUFBcUIsRUFBRSxTQUFpQjtRQUM3RCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDeEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFBQyxNQUFNLENBQUE7UUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsV0FBVyxLQUFLLFNBQVMsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQTlELENBQThELENBQUMsQ0FBQTtJQUN4RyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxpQ0FBYSxHQUFwQjtRQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUM5QyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxnQ0FBWSxHQUFuQixVQUFxQixPQUFlLEVBQUUsR0FBVztRQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUksT0FBTyxTQUFJLEdBQUssQ0FBQyxDQUFBO0lBQ2xELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksc0NBQWtCLEdBQXpCLFVBQTJCLE9BQWUsRUFBRSxHQUFXO1FBQ3JELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBRWpELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBZ0MsT0FBTyxxQkFBZ0IsR0FBSyxDQUFDLENBQUE7UUFFL0UsTUFBTSxDQUFDLFNBQVMsQ0FBQTtJQUNsQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksc0NBQWtCLEdBQXpCLFVBQTJCLE9BQWUsRUFBRSxJQUFvQjtRQUFoRSxpQkFPQztRQU5DLG1FQUFtRTtRQUNuRSxnREFBZ0Q7UUFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxLQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFyQyxDQUFxQyxDQUFDLENBQUE7UUFFL0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFBLFdBQVcsSUFBSSxPQUFBLFdBQVcsQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUEvQixDQUErQixDQUFDLENBQUE7SUFDckcsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxzQ0FBa0IsR0FBekIsVUFBMkIsYUFBcUIsRUFBRSxTQUFpQixFQUFFLGFBQXFCO1FBQ3hGLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBQzNELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFBO1FBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsU0FBUyxJQUFJLE9BQUEsU0FBUyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsRUFBRSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFsRSxDQUFrRSxDQUFDLENBQUE7SUFDbkgsQ0FBQztJQUVEOztPQUVHO0lBQ0ksNEJBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQkFBTyxHQUFkLFVBQWdCLEVBQVU7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFRDs7T0FFRztJQUNJLDJCQUFPLEdBQWQsVUFBZ0IsSUFBbUI7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUE7SUFDMUMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGlDQUFhLEdBQXBCLFVBQXNCLEVBQVU7UUFDOUIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUU3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLEVBQUksQ0FBQyxDQUFBO1FBRXBELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLGlDQUFhLEdBQXBCLFVBQXNCLGFBQXFCLEVBQUUsUUFBZ0I7UUFDM0QsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ3hELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQUMsTUFBTSxDQUFBO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUEzRCxDQUEyRCxDQUFDLENBQUE7SUFDbEcsQ0FBQztJQUVEOztPQUVHO0lBQ0ksa0NBQWMsR0FBckI7UUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7SUFDdEMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksaUNBQWEsR0FBcEI7UUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDckMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxzQ0FBa0IsR0FBekIsVUFBMkIsYUFBcUIsRUFBRSxhQUFxQjtRQUNyRSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDeEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFBQyxNQUFNLENBQUE7UUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxTQUFTLElBQUksT0FBQSxTQUFTLENBQUMsV0FBVyxLQUFLLFNBQVMsQ0FBQyxFQUFFLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQTFFLENBQTBFLENBQUMsQ0FBQTtJQUMzSCxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBek9ELElBeU9DOztBQUVELGtCQUFlLFNBQVMsQ0FBQSJ9