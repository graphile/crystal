import ScalarType from '../ScalarType'

/**
 * A singleton string type that represents a string value. Simply, a string can
 * be defined as an array of characters.
 */
const jsonType: ScalarType<mixed> = {
  kind: 'SCALAR',
  name: 'json',
  description:
    'A JavaScript object encoded in the JSON format as specified by ' +
    '[ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',

  isTypeOf: (_value: mixed): _value is mixed => true,

  fromInput: value => value,
  intoOutput: value => value,
}

export default jsonType
