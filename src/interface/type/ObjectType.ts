import Type from './Type'
import NamedType from './NamedType'

/**
 * An object type is a composite type which contains many values. Each value
 * has an associated unique string name (‘key’, or ‘field name’) and a type.
 * The data access patterns for an object value are similar to that of objects
 * in other languages.
 */
interface ObjectType<TValue> extends NamedType<TValue> {
  // The unique tag for our object.
  readonly kind: 'OBJECT'

  /**
   * All of the fields in our object associated by their name. Each field will have a
   * type and a way to extract that field from the value.
   */
  readonly fields: Map<string, ObjectType.Field<TValue, mixed>>

  /**
   * Creates an object value from the values of its fields. Implementors may
   * choose how loosely they interpret this `Map`.
   */
  // TODO: Explore more typesafe ways to do this in `ObjectType.Field`? Perhaps
  // reducers?
  fromFields (fieldValues: Map<string, mixed>): TValue
}

namespace ObjectType {
  /**
   * A field for our object type. Each distinct value that our object contains
   * will have a field object.
   */
  export interface Field<TObjectValue, TValue> {
    /**
     * An optional description of this field.
     */
    readonly description?: string | undefined

    /**
     * The required type of the values for this field.
     */
    readonly type: Type<TValue>

    /**
     * Extracts the value for this field from the object value.
     */
    getValue (objectValue: TObjectValue): TValue
  }
}

export default ObjectType
