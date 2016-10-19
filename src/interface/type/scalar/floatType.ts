import ScalarType from '../ScalarType'

/**
 * A singleton float type which represents a float value as is specified by
 * [IEEE 754][1].
 *
 * [1]: http://en.wikipedia.org/wiki/IEEE_floating_point
 */
const floatType: ScalarType<number> = {
  kind: 'SCALAR',
  name: 'float',
  description:
    'A signed number with a fractional component (unlike an integer) as specified ' +
    'by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).',

  isTypeOf: (value: mixed): value is number =>
    typeof value === 'number',

  fromInput: value => {
    if (typeof value !== 'number')
      throw new Error(`Type of input value must be 'number', not '${typeof value}'.`)

    return value
  },

  intoOutput: value => value,
}

export default floatType
