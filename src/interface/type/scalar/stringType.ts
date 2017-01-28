import ScalarType from '../ScalarType'

/**
 * A singleton string type that represents a string value. Simply, a string can
 * be defined as an array of characters.
 */
const stringType: ScalarType<string> = {
  kind: 'SCALAR',
  name: 'string',
  description:
    'A sequence of characters. This type is often used to represent textual, ' +
    'human readable data.',

  isTypeOf: (value: mixed): value is string =>
    typeof value === 'string',

  fromInput: value => {
    if (typeof value !== 'string')
      throw new Error(`Type of input value must be 'string', not '${typeof value}'.`)

    return value
  },

  intoOutput: value => value,
}

export default stringType
