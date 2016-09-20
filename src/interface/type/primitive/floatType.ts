import NamedType from '../NamedType'

/**
 * A singleton float type which represents a float value as is specified by
 * [IEEE 754][1].
 *
 * [1]: http://en.wikipedia.org/wiki/IEEE_floating_point
 */
const floatType: NamedType<number> = {
  name: 'float',
  description:
    'A signed number with a fractional component (unlike an integer) as specified ' +
    'by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).',

  getNamedType () { return this },

  isTypeOf: (value: mixed): value is number =>
    typeof value === 'number',
}

export default floatType
