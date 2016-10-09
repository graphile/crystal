import { GraphQLScalarType, Kind } from 'graphql'

/**
 * The GraphQL JWT type. It’s basically for ceremony only, using a string type
 * would do the exact same thing.
 */
// tslint:disable-next-line variable-name
const GraphQLJWT = new GraphQLScalarType<string>({
  name: 'Jwt',
  description:
    'A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519) ' +
    'which securely represents claims between two parties.',
  serialize: String,
  parseValue: String,
  parseLiteral: ast => ast.kind === Kind.STRING ? ast.value : null,
})

export default GraphQLJWT
