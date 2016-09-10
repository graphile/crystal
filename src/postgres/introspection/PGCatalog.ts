import PGObject from './object/PGObject'
import PGNamespaceObject from './object/PGNamespaceObject'
import PGClassObject from './object/PGClassObject'
import PGAttributeObject from './object/PGAttributeObject'
import PGTypeObject from './object/PGTypeObject'

/**
 * A utility class for interacting with the `PGObject`s returned from the
 * introspection query.
 */
class PGCatalog {
  private _namespaces = new Map<string, PGNamespaceObject>()
  private _classes = new Map<string, PGClassObject>()
  private _attributes = new Map<string, PGAttributeObject>()
  private _types = new Map<string, PGTypeObject>()

  constructor (objects: Array<PGObject>) {
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
        default:
          throw new Error(`Object of kind '${object['kind']}' is not allowed.`)
      }
    }
  }

  /**
   * Gets all of the namespace objects.
   */
  public getNamespaces (): Array<PGNamespaceObject> {
    return Array.from(this._namespaces.values())
  }

  /**
   * Gets a single namespace object of the provided id.
   */
  public getNamespace (id: string): PGNamespaceObject | undefined {
    return this._namespaces.get(id)
  }

  /**
   * Gets a single namespace object by the provided id, and if no namespace
   * object exists an error is thrown instead of returning `undefined`.
   */
  public assertGetNamespace (id: string): PGNamespaceObject {
    const namespace = this.getNamespace(id)

    if (!namespace)
      throw new Error(`No namespace was found with id ${id}`)

    return namespace
  }

  /**
   * Gets all of the class objects.
   */
  public getClasses (): Array<PGClassObject> {
    return Array.from(this._classes.values())
  }

  /**
   * Gets a single class object of the provided id.
   */
  public getClass (id: string): PGClassObject | undefined {
    return this._classes.get(id)
  }

  /**
   * Gets a single class object by the provided id, and if no class object
   * exists an error is thrown instead of returning `undefined`.
   */
  public assertGetClass (id: string): PGClass {
    const clazz = this.getClass(id)

    if (!clazz)
      throw new Error(`No class was found with id ${id}`)

    return clazz
  }

  /**
   * Gets all of the attribute objects.
   */
  public getAttributes (): Array<PGAttributeObject> {
    return Array.from(this._attributes.values())
  }

  /**
   * Gets a single attribute object by the provided class id and number.
   */
  public getAttribute (classId: string, num: number): PGAttributeObject | undefined {
    return this._attributes.get(`${classId}-${num}`)
  }

  /**
   * Gets all of the attributes for a single class.
   */
  public getClassAttributes (classId: string): Array<PGAttributeObject> {
    return Array.from(this._attributes.values()).filter(attribute => attribute.classId === classId)
  }

  /**
   * Gets all of the type objects.
   */
  public getTypes (): Array<PGTypeObject> {
    return Array.from(this._types.values())
  }

  /**
   * Gets a single type object by the provided id.
   */
  public getType (id: string): PGTypeObject | undefined {
    return this._types.get(id)
  }

  /**
   * Determines if our instance has this *exact* `PGType` instance.
   */
  public hasType (type: PGTypeObject): boolean {
    return this._types.get(type.id) === type
  }

  /**
   * Gets a single type object by the provided id, and if no type object
   * exists an error is thrown instead of returning `undefined`.
   */
  public assertGetType (id: string): PGTypeObject {
    const type = this.getType(id)

    if (!type)
      throw new Error(`No type was found with id ${id}`)

    return type
  }
}

export default PGCatalog
