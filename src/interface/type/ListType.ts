import Type from './Type'
import NamedType from './NamedType'

/**
 * A list type represents the type of a value of which there may be more than
 * one. In a list there may be no items of a given type, there may be one item
 * of a given type, there may be many items of a given type. A list may contain
 * any number of values and this type represents that construct.
 */
class ListType<TValue> extends Type<TValue[]> {
  constructor (
    private _itemType: Type<TValue>
  ) {
    super()
  }

  /**
   * Get’s the item type for this list type.
   */
  public getItemType (): Type<TValue> {
    return this._itemType
  }

  /**
   * Returns the item type.
   */
  public getNamedType (): NamedType<any> {
    return this._itemType.getNamedType()
  }
}

export default ListType
