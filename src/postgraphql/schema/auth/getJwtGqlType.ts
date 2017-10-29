import { sign as signJwt } from 'jsonwebtoken'
import { GraphQLScalarType } from 'graphql'
import { ObjectType } from '../../../interface'
import { memoize3 } from '../../../graphql/utils'
import BuildToken from '../../../graphql/schema/BuildToken'

const _getJwtGqlType = memoize3(_createJwtGqlType)

/**
 * Gets a JWT GraphQL scalar type from an object type. Every time this type is
 * serialized, a new token will be signed.
 */
function getJwtGqlType <TValue>(buildToken: BuildToken, type: ObjectType<TValue>, jwtSecret: string): GraphQLScalarType {
  return _getJwtGqlType(buildToken, type, jwtSecret)
}

export default getJwtGqlType

// TODO: Can we make a type that represents an object type possible wrapped in
// nullable types? We really need to improve the types for our type system...
export function _createJwtGqlType <TValue>(buildToken: BuildToken, type: ObjectType<TValue>, jwtSecret: string): GraphQLScalarType {
  const formatName = buildToken.options.formatName
  return new GraphQLScalarType({
    name: formatName.type(type.name),
    description:
      'A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519) ' +
      'which securely represents claims between two parties.',
    serialize: value => {
      const token = {}

      type.fields.forEach((field, fieldName) => {
        token[fieldName] = field.getValue(value)
      })

      return signJwt(token, jwtSecret, {
        audience: 'postgraphql',
        issuer: 'postgraphql',
        expiresIn: token['exp'] ? undefined : '1 day',
      })
    },
  })
}
