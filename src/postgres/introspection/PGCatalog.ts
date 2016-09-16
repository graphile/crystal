import PGCatalogObject from './object/PGCatalogObject'
import PGCatalogNamespace from './object/PGCatalogNamespace'
import PGCatalogClass from './object/PGCatalogClass'
import PGCatalogAttribute from './object/PGCatalogAttribute'
import PGCatalogType from './object/PGCatalogType'
import PGCatalogConstraint from './object/PGCatalogConstraint'

/**
 * A utility class for interacting with the `PGCatalogObject`s returned from the
 * introspection query.
 */
class PGCatalog {
  private _namespaces = new Map<string, PGCatalogNamespace>()
  private _classes = new Map<string, PGCatalogClass>()
  private _attributes = new Map<string, PGCatalogAttribute>()
  private _types = new Map<string, PGCatalogType>()
  private _constraints = new Set<PGCatalogConstraint>()

  constructor (objects: Array<PGCatalogObject>) {
    // Build an in-memory index of all our objects for ease of use:
    for (const object of objects) {
      switch (object.kind) {
        case 'namespace':
          this._namespaces.set(object.id, object)
          break
        case 'class':
          this._classes.set(object.id, object)
          break
        case 'attribute':
          this._attributes.set(`${object.classId}-${object.num}`, object)
          break
        case 'type':
          this._types.set(object.id, object)
          break
        case 'constraint':
          this._constraints.add(object)
          break
        default:
          throw new Error(`Object of kind '${object['kind']}' is not allowed.`)
      }
    }
  }

  /**
   * Gets all of the namespace objects.
   */
  public getNamespaces (): Array<PGCatalogNamespace> {
    return Array.from(this._namespaces.values())
  }

  /**
   * Gets a single namespace object of the provided id.
   */
  public getNamespace (id: string): PGCatalogNamespace | undefined {
    return this._namespaces.get(id)
  }

  /**
   * Gets a single namespace object by the provided id, and if no namespace
   * object exists an error is thrown instead of returning `undefined`.
   */
  public assertGetNamespace (id: string): PGCatalogNamespace {
    const namespace = this.getNamespace(id)

    if (!namespace)
      throw new Error(`No namespace was found with id ${id}`)

    return namespace
  }

  /**
   * Gets a namespace by its name. Helpful in tests where we know the name, but
   * not the id it has been assigned.
   */
  public getNamespaceByName (namespaceName: string): PGCatalogNamespace | undefined {
    return this.getNamespaces().find(namespace => namespace.name === namespaceName)
  }

  /**
   * Gets all of the class objects.
   */
  public getClasses (): Array<PGCatalogClass> {
    return Array.from(this._classes.values())
  }

  /**
   * Gets a single class object of the provided id.
   */
  public getClass (id: string): PGCatalogClass | undefined {
    return this._classes.get(id)
  }

  /**
   * Gets a single class object by the provided id, and if no class object
   * exists an error is thrown instead of returning `undefined`.
   */
  public assertGetClass (id: string): PGCatalogClass {
    const clazz = this.getClass(id)

    if (!clazz)
      throw new Error(`No class was found with id ${id}`)

    return clazz
  }

  /**
   * Gets a class by its name, also use the namespace name to ensure
   * there are no naming collisions. Helpful in tests where we know the name,
   * but not the id it has been assigned.
   */
  public getClassByName (namespaceName: string, className: string): PGCatalogClass | undefined {
    const namespace = this.getNamespaceByName(namespaceName)
    if (!namespace) return
    return this.getClasses().find(klass => klass.namespaceId === namespace.id && klass.name === className)
  }

  /**
   * Gets all of the attribute objects.
   */
  public getAttributes (): Array<PGCatalogAttribute> {
    return Array.from(this._attributes.values())
  }

  /**
   * Gets a single attribute object by the provided class id and number.
   */
  public getAttribute (classId: string, num: number): PGCatalogAttribute | undefined {
    return this._attributes.get(`${classId}-${num}`)
  }

  /**
   * Gets all of the attributes for a single class.
   */
  public getClassAttributes (classId: string): Array<PGCatalogAttribute> {
    return Array.from(this._attributes.values()).filter(attribute => attribute.classId === classId)
  }

  /**
   * Gets an attribute by its name and the name of the class and namespace it
   * is in. This is helpful in tests where we know the name of an attribute,
   * but not its `classId` or `num`.
   */
  public getAttributeByName (namespaceName: string, className: string, attributeName: string): PGCatalogAttribute | undefined {
    const klass = this.getClassByName(namespaceName, className)
    if (!klass) return
    return this.getAttributes().find(attribute => attribute.classId === klass.id && attribute.name === attributeName)
  }

  /**
   * Gets all of the type objects.
   */
  public getTypes (): Array<PGCatalogType> {
    return Array.from(this._types.values())
  }

  /**
   * Gets a single type object by the provided id.
   */
  public getType (id: string): PGCatalogType | undefined {
    return this._types.get(id)
  }

  /**
   * Determines if our instance has this *exact* `PGType` instance.
   */
  public hasType (type: PGCatalogType): boolean {
    return this._types.get(type.id) === type
  }

  /**
   * Gets a single type object by the provided id, and if no type object
   * exists an error is thrown instead of returning `undefined`.
   */
  public assertGetType (id: string): PGCatalogType {
    const type = this.getType(id)

    if (!type)
      throw new Error(`No type was found with id ${id}`)

    return type
  }

  /**
   * Gets a type by its name, also use the namespace name to ensure
   * there are no naming collisions. Helpful in tests where we know the name,
   * but not the id it has been assigned.
   */
  public getTypeByName (namespaceName: string, typeName: string): PGCatalogType | undefined {
    const namespace = this.getNamespaceByName(namespaceName)
    if (!namespace) return
    return this.getTypes().find(type => type.namespaceId === namespace.id && type.name === typeName)
  }

  /**
   * Gets all of the constraints found by our catalog.
   */
  public getConstraints (): Array<PGCatalogConstraint> {
    return Array.from(this._constraints)
  }
}

export default PGCatalog
