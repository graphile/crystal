import Type from './Type'
import NamedType from './NamedType'

/**
 * A list type represents the type of a value of which there may be more than
 * one. In a list there may be no items of a given type, there may be one item
 * of a given type, there may be many items of a given type. A list may contain
 * any number of values and this type represents that construct.
 */
class ListType<TValue extends Array<TItemValue>, TItemValue> extends Type<TValue> {
  constructor (public readonly itemType: Type<TItemValue>) {
    super()
  }

  /**
   * Checks if the value is an array and if it is an array checks if every item
   * is one of the composite item type.
   */
  public isTypeOf (values: mixed): values is TValue {
    return Array.isArray(values) && values.every(value => this.itemType.isTypeOf(value))
  }

  /**
   * Returns the named type inside this list type’s item type.
   */
  public getNamedType (): NamedType<mixed> {
    return this.itemType.getNamedType()
  }
}

export default ListType
