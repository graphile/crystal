import PgCatalogObject from './object/PgCatalogObject'
import PgCatalogNamespace from './object/PgCatalogNamespace'
import PgCatalogClass from './object/PgCatalogClass'
import PgCatalogAttribute from './object/PgCatalogAttribute'
import PgCatalogType from './object/PgCatalogType'
import PgCatalogConstraint from './object/PgCatalogConstraint'
import { PgCatalogForeignKeyConstraint } from './object/PgCatalogConstraint'
import PgCatalogProcedure from './object/PgCatalogProcedure'

/**
 * A utility class for interacting with the `PgCatalogObject`s returned from the
 * introspection query.
 */
class PgCatalog {
  private _namespaces: Map<string, PgCatalogNamespace> = new Map()
  private _classes: Map<string, PgCatalogClass> = new Map()
  private _attributes: Map<string, PgCatalogAttribute> = new Map()
  private _types: Map<string, PgCatalogType> = new Map()
  private _constraints: Set<PgCatalogConstraint> = new Set()
  private _procedures: Set<PgCatalogProcedure> = new Set()

  constructor (objects: Array<PgCatalogObject>) {
    const foundConstraints: Set<String> = new Set()
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
          const constraint: PgCatalogForeignKeyConstraint = object as PgCatalogForeignKeyConstraint
          const constraintKey = JSON.stringify({
            type: constraint.type,
            classId: constraint.classId,
            foreignClassId: constraint.foreignClassId,
            keyAttributeNums: constraint.keyAttributeNums,
            foreignKeyAttributeNums: constraint.foreignKeyAttributeNums,
          })
          if (!foundConstraints.has(constraintKey)) {
            foundConstraints.add(constraintKey)
            this._constraints.add(object)
          }
          break
        case 'procedure':
          this._procedures.add(object)
          break
        default:
          throw new Error(`Object of kind '${object['kind']}' is not allowed.`)
      }
    }
  }

  /**
   * Gets all of the namespace objects.
   */
  public getNamespaces (): Array<PgCatalogNamespace> {
    return Array.from(this._namespaces.values())
  }

  /**
   * Gets a single namespace object of the provided id.
   */
  public getNamespace (id: string): PgCatalogNamespace | undefined {
    return this._namespaces.get(id)
  }

  /**
   * Gets a single namespace object by the provided id, and if no namespace
   * object exists an error is thrown instead of returning `undefined`.
   */
  public assertGetNamespace (id: string): PgCatalogNamespace {
    const namespace = this.getNamespace(id)

    if (!namespace)
      throw new Error(`No namespace was found with id ${id}`)

    return namespace
  }

  /**
   * Gets a namespace by its name. Helpful in tests where we know the name, but
   * not the id it has been assigned, and it is helpful for user input.
   */
  public getNamespaceByName (namespaceName: string): PgCatalogNamespace | undefined {
    return this.getNamespaces().find(namespace => namespace.name === namespaceName)
  }

  /**
   * Gets all of the class objects.
   */
  public getClasses (): Array<PgCatalogClass> {
    return Array.from(this._classes.values())
  }

  /**
   * Gets a single class object of the provided id.
   */
  public getClass (id: string): PgCatalogClass | undefined {
    return this._classes.get(id)
  }

  /**
   * Gets a single class object by the provided id, and if no class object
   * exists an error is thrown instead of returning `undefined`.
   */
  public assertGetClass (id: string): PgCatalogClass {
    const clazz = this.getClass(id)

    if (!clazz)
      throw new Error(`No class was found with id ${id}`)

    return clazz
  }

  /**
   * Gets a class by its name, also use the namespace name to ensure
   * there are no naming collisions. Helpful in tests where we know the name,
   * but not the id it has been assigned, and it is helpful for user input.
   */
  public getClassByName (namespaceName: string, className: string): PgCatalogClass | undefined {
    const namespace = this.getNamespaceByName(namespaceName)
    if (!namespace) return
    return this.getClasses().find(klass => klass.namespaceId === namespace.id && klass.name === className)
  }

  /**
   * Gets all of the attribute objects.
   */
  public getAttributes (): Array<PgCatalogAttribute> {
    return Array.from(this._attributes.values())
  }

  /**
   * Gets a single attribute object by the provided class id and number.
   */
  public getAttribute (classId: string, num: number): PgCatalogAttribute | undefined {
    return this._attributes.get(`${classId}-${num}`)
  }

  /**
   * Gets a single attribute object by the provided class id and position
   * number. If no attribute object exists an error is thrown instead of
   * returning `undefined`.
   */
  public assertGetAttribute (classId: string, num: number): PgCatalogAttribute {
    const attribute = this.getAttribute(classId, num)

    if (!attribute)
      throw new Error(`No attribute found for class ${classId} in position ${num}`)

    return attribute
  }

  /**
   * Gets all of the attributes for a single class.
   *
   * If provided an array of `nums`, we will get only those attributes in the
   * enumerated order. Otherwise we get all attributes in the order of their
   * definition.
   */
  public getClassAttributes (classId: string, nums?: Array<number>): Array<PgCatalogAttribute> {
    // Currently if we get a `nums` array we use a completely different
    // implementation to preserve the `nums` order..
    if (nums)
      return nums.map(num => this.assertGetAttribute(classId, num))

    return Array.from(this._attributes.values()).filter(pgAttribute => pgAttribute.classId === classId)
  }

  /**
   * Gets an attribute by its name and the name of the class and namespace it
   * is in. This is helpful in tests where we know the name of an attribute,
   * but not its `classId` or `num`.
   */
  public getAttributeByName (namespaceName: string, className: string, attributeName: string): PgCatalogAttribute | undefined {
    const klass = this.getClassByName(namespaceName, className)
    if (!klass) return
    return this.getAttributes().find(attribute => attribute.classId === klass.id && attribute.name === attributeName)
  }

  /**
   * Gets all of the type objects.
   */
  public getTypes (): Array<PgCatalogType> {
    return Array.from(this._types.values())
  }

  /**
   * Gets a single type object by the provided id.
   */
  public getType (id: string): PgCatalogType | undefined {
    return this._types.get(id)
  }

  /**
   * Determines if our instance has this *exact* `PgType` instance.
   */
  public hasType (type: PgCatalogType): boolean {
    return this._types.get(type.id) === type
  }

  /**
   * Gets a single type object by the provided id, and if no type object
   * exists an error is thrown instead of returning `undefined`.
   */
  public assertGetType (id: string): PgCatalogType {
    const type = this.getType(id)

    if (!type)
      throw new Error(`No type was found with id ${id}`)

    return type
  }

  /**
   * Gets a type by its name, also use the namespace name to ensure
   * there are no naming collisions. Helpful in tests where we know the name,
   * but not the id it has been assigned, and it is helpful for user input.
   */
  public getTypeByName (namespaceName: string, typeName: string): PgCatalogType | undefined {
    const namespace = this.getNamespaceByName(namespaceName)
    if (!namespace) return
    return this.getTypes().find(type => type.namespaceId === namespace.id && type.name === typeName)
  }

  /**
   * Gets all of the constraints found by our catalog.
   */
  public getConstraints (): Array<PgCatalogConstraint> {
    return Array.from(this._constraints)
  }

  /**
   * Returns all of the procedures in our catalog.
   */
  public getProcedures (): Array<PgCatalogProcedure> {
    return Array.from(this._procedures)
  }

  /**
   * Gets a procedure by its name, also use the namespace name to ensure
   * there are no naming collisions. Helpful in tests where we know the name,
   * but not the id it has been assigned, and it is helpful for user input.
   */
  public getProcedureByName (namespaceName: string, procedureName: string): PgCatalogProcedure | undefined {
    const namespace = this.getNamespaceByName(namespaceName)
    if (!namespace) return
    return this.getProcedures().find(procedure => procedure.namespaceId === namespace.id && procedure.name === procedureName)
  }
}

export default PgCatalog
