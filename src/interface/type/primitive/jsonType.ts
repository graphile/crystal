import NamedType from '../NamedType'

/**
 * A singleton string type that represents a string value. Simply, a string can
 * be defined as an array of characters.
 */
const jsonType: NamedType<string> = {
  name: 'string',
  description:
    'A JavaScript object encoded in the JSON format as specified by ' +
    '[ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',

  getNamedType: (): NamedType<string> =>
    jsonType,

  isTypeOf: (value: mixed): value is string =>
    typeof value === 'string',
}

export default jsonType
