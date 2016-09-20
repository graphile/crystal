import NamedType from '../NamedType'

/**
 * A singleton boolean type that represents a boolean value. A boolean value
 * can be either “true” or “false.”
 */
const booleanType: NamedType<boolean> = {
  name: 'boolean',
  description:
    'A value with only two possible variants: true or false.',

  getNamedType () { return this },

  isTypeOf: (value: mixed): value is boolean =>
    typeof value === 'boolean',
}

export default booleanType
