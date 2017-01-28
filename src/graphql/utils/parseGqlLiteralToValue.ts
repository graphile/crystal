import { Kind, ValueNode } from 'graphql'

/**
 * Parses a GraphQL AST literal into a JavaScript value.
 *
 * @private
 */
export default function parseGqlLiteralToValue (ast: ValueNode): mixed {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value)
    case Kind.OBJECT: {
      return ast.fields.reduce((object, field) => {
        object[field.name.value] = parseGqlLiteralToValue(field.value)
        return object
      }, {})
    }
    case Kind.LIST:
      return ast.values.map(value => parseGqlLiteralToValue(value))
    default:
      return null
  }
}
