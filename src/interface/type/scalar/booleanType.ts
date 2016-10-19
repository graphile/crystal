import ScalarType from '../ScalarType'

/**
 * A singleton boolean type that represents a boolean value. A boolean value
 * can be either “true” or “false.”
 */
const booleanType: ScalarType<boolean> = {
  kind: 'SCALAR',
  name: 'boolean',
  description:
    'A value with only two possible variants: true or false.',

  isTypeOf: (value: mixed): value is boolean =>
    typeof value === 'boolean',

  fromInput: value => {
    if (typeof value !== 'boolean')
      throw new Error(`Type of input value must be 'boolean', not '${typeof value}'.`)

    return value
  },

  intoOutput: value => value,
}

export default booleanType
