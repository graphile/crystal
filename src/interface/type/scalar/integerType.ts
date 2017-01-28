import ScalarType from '../ScalarType'

/**
 * A singleton integer type that represents a number which is in integer, or
 * has no decimal values.
 */
const integerType: ScalarType<number> = {
  kind: 'SCALAR',
  name: 'integer',
  description:
    'A number that can be written without a fractional component. So 21, 4, or 0 ' +
    'would be an integer while 3.14 would not.',

  isTypeOf: (value: mixed): value is number =>
    typeof value === 'number' && Number.isInteger(value),

  fromInput: value => {
    if (typeof value !== 'number')
      throw new Error(`Type of input value must be 'number', not '${typeof value}'.`)

    if (Number.isInteger(value))
      throw new Error(`Input number value must be an integer, instead got number '${value}'. Perhaps you meant '${Math.round(value)}'?`)

    return value
  },

  intoOutput: value => value,
}

export default integerType
