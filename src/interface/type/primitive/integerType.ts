import NamedType from '../NamedType'

/**
 * The singleton class used to instantiate `integerType`.
 *
 * @private
 */
class IntegerType extends NamedType<number> {}

/**
 * A singleton integer type that represents a number which is in integer, or
 * has no decimal values.
 */
const integerType =
  new IntegerType('integer')
  .setDescription(
    'A number that can be written without a fractional component. So 21, 4, or 0 ' +
    'would be an integer while 3.14 would not.'
  )

export default integerType
