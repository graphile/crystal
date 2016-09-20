import NamedType from '../NamedType'

/**
 * A singleton string type that represents a string value. Simply, a string can
 * be defined as an array of characters.
 */
const stringType: NamedType<string> = {
  name: 'string',
  description:
    'A sequence of characters. This type is often used to represent textual, ' +
    'human readable data.',

  getNamedType () { return this },

  isTypeOf: (value: mixed): value is string =>
    typeof value === 'string',
}

export default stringType
