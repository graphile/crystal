import NamedType from '../NamedType'

/**
 * The singleton class used to instantiate `floatType`.
 *
 * @private
 */
// TODO: Should this be called “Float”? Maybe “Fractional” or just “Number”?
class FloatType extends NamedType<number> {
  public isTypeOf (value: any): value is number {
    return typeof value === 'number'
  }
}

/**
 * A singleton float type which represents a float value as is specified by
 * [IEEE 754][1].
 *
 * [1]: http://en.wikipedia.org/wiki/IEEE_floating_point
 */
const floatType =
  new FloatType('float')
  .setDescription(
    'A signed number with a fractional component (unlike an integer) as specified ' +
    'by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).'
  )

export default floatType
