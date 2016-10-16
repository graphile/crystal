import { sign as signJwt } from 'jsonwebtoken'
import { GraphQLScalarType } from 'graphql'
import { Type } from '../../../interface'
import { formatName, memoize2 } from '../../../graphql/utils'
import { mapToObject } from '../../../postgres/utils'

/**
 * Gets a JWT GraphQL scalar type from an object type. Every time this type is
 * serialized, a new token will be signed.
 */
const getJwtGqlType = memoize2(_createJwtGqlType)

export default getJwtGqlType

// TODO: Can we make a type that represents an object type possible wrapped in
// nullable types? We really need to improve the types for our type system...
export function _createJwtGqlType (type: Type<mixed>, jwtSecret: string): GraphQLScalarType<mixed> {
  return new GraphQLScalarType<mixed>({
    name: formatName.type(type.getNamedType().name),
    description:
      'A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519) ' +
      'which securely represents claims between two parties.',
    serialize: value =>
      value instanceof Map ? signJwt(mapToObject(value), jwtSecret, {
        audience: 'postgraphql',
        issuer: 'postgraphql',
        expiresIn: value.get('exp') ? undefined : '1 day',
      }) : null,
  })
}
