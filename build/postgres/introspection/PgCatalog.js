"use strict";
/**
 * A utility class for interacting with the `PgCatalogObject`s returned from the
 * introspection query.
 */
class PgCatalog {
    constructor(objects) {
        this._namespaces = new Map();
        this._classes = new Map();
        this._attributes = new Map();
        this._types = new Map();
        this._constraints = new Set();
        this._procedures = new Set();
        // Build an in-memory index of all our objects for ease of use:
        for (const object of objects) {
            switch (object.kind) {
                case 'namespace':
                    this._namespaces.set(object.id, object);
                    break;
                case 'class':
                    this._classes.set(object.id, object);
                    break;
                case 'attribute':
                    this._attributes.set(`${object.classId}-${object.num}`, object);
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
                    throw new Error(`Object of kind '${object['kind']}' is not allowed.`);
            }
        }
    }
    /**
     * Gets all of the namespace objects.
     */
    getNamespaces() {
        return Array.from(this._namespaces.values());
    }
    /**
     * Gets a single namespace object of the provided id.
     */
    getNamespace(id) {
        return this._namespaces.get(id);
    }
    /**
     * Gets a single namespace object by the provided id, and if no namespace
     * object exists an error is thrown instead of returning `undefined`.
     */
    assertGetNamespace(id) {
        const namespace = this.getNamespace(id);
        if (!namespace)
            throw new Error(`No namespace was found with id ${id}`);
        return namespace;
    }
    /**
     * Gets a namespace by its name. Helpful in tests where we know the name, but
     * not the id it has been assigned, and it is helpful for user input.
     */
    getNamespaceByName(namespaceName) {
        return this.getNamespaces().find(namespace => namespace.name === namespaceName);
    }
    /**
     * Gets all of the class objects.
     */
    getClasses() {
        return Array.from(this._classes.values());
    }
    /**
     * Gets a single class object of the provided id.
     */
    getClass(id) {
        return this._classes.get(id);
    }
    /**
     * Gets a single class object by the provided id, and if no class object
     * exists an error is thrown instead of returning `undefined`.
     */
    assertGetClass(id) {
        const clazz = this.getClass(id);
        if (!clazz)
            throw new Error(`No class was found with id ${id}`);
        return clazz;
    }
    /**
     * Gets a class by its name, also use the namespace name to ensure
     * there are no naming collisions. Helpful in tests where we know the name,
     * but not the id it has been assigned, and it is helpful for user input.
     */
    getClassByName(namespaceName, className) {
        const namespace = this.getNamespaceByName(namespaceName);
        if (!namespace)
            return;
        return this.getClasses().find(klass => klass.namespaceId === namespace.id && klass.name === className);
    }
    /**
     * Gets all of the attribute objects.
     */
    getAttributes() {
        return Array.from(this._attributes.values());
    }
    /**
     * Gets a single attribute object by the provided class id and number.
     */
    getAttribute(classId, num) {
        return this._attributes.get(`${classId}-${num}`);
    }
    /**
     * Gets a single attribute object by the provided class id and position
     * number. If no attribute object exists an error is thrown instead of
     * returning `undefined`.
     */
    assertGetAttribute(classId, num) {
        const attribute = this.getAttribute(classId, num);
        if (!attribute)
            throw new Error(`No attribute found for class ${classId} in position ${num}`);
        return attribute;
    }
    /**
     * Gets all of the attributes for a single class.
     *
     * If provided an array of `nums`, we will get only those attributes in the
     * enumerated order. Otherwise we get all attributes in the order of their
     * definition.
     */
    getClassAttributes(classId, nums) {
        // Currently if we get a `nums` array we use a completely different
        // implementation to preserve the `nums` order..
        if (nums)
            return nums.map(num => this.assertGetAttribute(classId, num));
        return Array.from(this._attributes.values()).filter(pgAttribute => pgAttribute.classId === classId);
    }
    /**
     * Gets an attribute by its name and the name of the class and namespace it
     * is in. This is helpful in tests where we know the name of an attribute,
     * but not its `classId` or `num`.
     */
    getAttributeByName(namespaceName, className, attributeName) {
        const klass = this.getClassByName(namespaceName, className);
        if (!klass)
            return;
        return this.getAttributes().find(attribute => attribute.classId === klass.id && attribute.name === attributeName);
    }
    /**
     * Gets all of the type objects.
     */
    getTypes() {
        return Array.from(this._types.values());
    }
    /**
     * Gets a single type object by the provided id.
     */
    getType(id) {
        return this._types.get(id);
    }
    /**
     * Determines if our instance has this *exact* `PgType` instance.
     */
    hasType(type) {
        return this._types.get(type.id) === type;
    }
    /**
     * Gets a single type object by the provided id, and if no type object
     * exists an error is thrown instead of returning `undefined`.
     */
    assertGetType(id) {
        const type = this.getType(id);
        if (!type)
            throw new Error(`No type was found with id ${id}`);
        return type;
    }
    /**
     * Gets a type by its name, also use the namespace name to ensure
     * there are no naming collisions. Helpful in tests where we know the name,
     * but not the id it has been assigned, and it is helpful for user input.
     */
    getTypeByName(namespaceName, typeName) {
        const namespace = this.getNamespaceByName(namespaceName);
        if (!namespace)
            return;
        return this.getTypes().find(type => type.namespaceId === namespace.id && type.name === typeName);
    }
    /**
     * Gets all of the constraints found by our catalog.
     */
    getConstraints() {
        return Array.from(this._constraints);
    }
    /**
     * Returns all of the procedures in our catalog.
     */
    getProcedures() {
        return Array.from(this._procedures);
    }
    /**
     * Gets a procedure by its name, also use the namespace name to ensure
     * there are no naming collisions. Helpful in tests where we know the name,
     * but not the id it has been assigned, and it is helpful for user input.
     */
    getProcedureByName(namespaceName, procedureName) {
        const namespace = this.getNamespaceByName(namespaceName);
        if (!namespace)
            return;
        return this.getProcedures().find(procedure => procedure.namespaceId === namespace.id && procedure.name === procedureName);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgCatalog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDYXRhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludHJvc3BlY3Rpb24vUGdDYXRhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQTs7O0dBR0c7QUFDSDtJQVFFLFlBQWEsT0FBK0I7UUFQcEMsZ0JBQVcsR0FBb0MsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUN4RCxhQUFRLEdBQWdDLElBQUksR0FBRyxFQUFFLENBQUE7UUFDakQsZ0JBQVcsR0FBb0MsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUN4RCxXQUFNLEdBQStCLElBQUksR0FBRyxFQUFFLENBQUE7UUFDOUMsaUJBQVksR0FBNkIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNsRCxnQkFBVyxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFBO1FBR3RELCtEQUErRDtRQUMvRCxHQUFHLENBQUMsQ0FBQyxNQUFNLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixLQUFLLFdBQVc7b0JBQ2QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQTtvQkFDdkMsS0FBSyxDQUFBO2dCQUNQLEtBQUssT0FBTztvQkFDVixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFBO29CQUNwQyxLQUFLLENBQUE7Z0JBQ1AsS0FBSyxXQUFXO29CQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUE7b0JBQy9ELEtBQUssQ0FBQTtnQkFDUCxLQUFLLE1BQU07b0JBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FB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