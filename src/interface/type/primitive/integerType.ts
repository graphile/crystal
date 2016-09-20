import NamedType from '../NamedType'

/**
 * A singleton integer type that represents a number which is in integer, or
 * has no decimal values.
 */
const integerType: NamedType<number> = {
  name: 'integer',
  description:
    'A number that can be written without a fractional component. So 21, 4, or 0 ' +
    'would be an integer while 3.14 would not.',

  getNamedType () { return this },

  isTypeOf: (value: mixed): value is number =>
    typeof value === 'number' && Number.isInteger(value),
}

export default integerType
