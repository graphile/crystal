import { AliasType, stringType } from '../../../../interface'

/**
 * The type for a universal identifier as defined by [RFC 4122][1].
 *
 * [1]: https://tools.ietf.org/html/rfc4122
 */
const pgUuidType = new AliasType({
  name: 'uuid',
  description: 'A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).',
  baseType: stringType,
})

export default pgUuidType
