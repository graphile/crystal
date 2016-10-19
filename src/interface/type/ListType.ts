import Type from './Type'

/**
 * A list type represents the type of a value of which there may be more than
 * one. In a list there may be no items of a given type, there may be one item
 * of a given type, there may be many items of a given type. A list may contain
 * any number of values and this type represents that construct.
 *
 * Note that internally, a list does not have to be an array.
 */
interface ListType<
  TValue,
  TItemValue,
> extends Type<TValue> {
  // The unique kind for this type.
  readonly kind: 'LIST'

  /**
   * The item type for this list. Every item in the list must adhere to this
   * type.
   */
  readonly itemType: Type<TItemValue>

  // /**
  //  * Will get the count of items in the list. Works the same as `array.length`.
  //  */
  // getLength (value: TValue): number

  // /**
  //  * Will get the single item at the given index in the list starting at 0.
  //  * Returns an item if it exists and returns undefined if no item exists.
  //  *
  //  * `type.getItemAt(array, 0)` would be analagous to `array[0]`.
  //  */
  // getItemAt (value: TValue, index: number): TItemValue | undefined

  /**
   * Turns a list value into an array of items.
   */
  intoArray (value: TValue): Array<TItemValue>

  /**
   * Takes an array of values and turns it into an internal list type.
   */
  fromArray (array: Array<TItemValue>): TValue
}

export default ListType
