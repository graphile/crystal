import Type from './Type'

/**
 * A list type represents the type of a value of which there may be more than
 * one. In a list there may be no items of a given type, there may be one item
 * of a given type, there may be many items of a given type. A list may contain
 * any number of values and this type represents that construct.
 */
class ListType<TValue, TItemType extends Type<TValue>> extends Type<TValue[]> {
  constructor (
    private _itemType: TItemType
  ) {
    super()
  }

  /**
   * Checks if the value is an array, then checks *every* value in that array
   * making sure that the value is a type of the item type.
   */
  public isTypeOf (value: any): value is TValue[] {
    if (!Array.isArray(value))
      return false

    for (const item of value)
      if (!this._itemType.isTypeOf(item))
        return false

    return true
  }

  /**
   * Get’s the item type for this list type.
   */
  public getItemType (): TItemType {
    return this._itemType
  }
}

export default ListType
