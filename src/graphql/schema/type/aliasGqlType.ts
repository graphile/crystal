import { GraphQLType, GraphQLInputType, GraphQLNonNull, GraphQLList } from 'graphql'

// TODO: test
export default function aliasGqlType (gqlType: GraphQLInputType, name: string, description?: string | undefined): GraphQLInputType
export default function aliasGqlType (gqlType: GraphQLType, name: string, description?: string | undefined): GraphQLType {
  if (gqlType instanceof GraphQLNonNull)
    return new GraphQLNonNull(aliasGqlType(gqlType.ofType, name, description))

  if (gqlType instanceof GraphQLList)
    return new GraphQLList(aliasGqlType(gqlType.ofType, name, description))

  // Use prototypes to inherit all of the methods from the type we are
  // aliasing, then set the `name` and `description` properties to the aliased
  // properties.
  return Object.assign(Object.create(gqlType), { name, description })
}
