import { GraphQLObjectType, GraphQLFieldConfig } from 'graphql'
import { buildObject, memoize2 } from '../utils'
import BuildToken from './BuildToken'
import createCollectionMutationFieldEntries from './collection/createCollectionMutationFieldEntries'

/**
 * Gets the mutation type which includes all available mutations for our
 * schema. If there are no mutations, instead of throwing an error we will just
 * return `undefined`.
 */
const getMutationGqlType = memoize2(createMutationGqlType)

export default getMutationGqlType

/**
 * Internal create implementation for `getMutationType`.
 *
 * @private
 */
function createMutationGqlType (buildToken: BuildToken, options: { disableDefaultMutations?: boolean } = {}): GraphQLObjectType<mixed> | undefined {
  const { inventory } = buildToken

  // A list of all the mutations we are able to run.
  const mutationFieldEntries: Array<[string, GraphQLFieldConfig<mixed, mixed>]> = [
    // Add the mutation field entires from our build token hooks.
    ...(
      buildToken._hooks.mutationFieldEntries
        ? buildToken._hooks.mutationFieldEntries(buildToken)
        : []
    ),
    ...(
      options.disableDefaultMutations
        ? []
        : // Get the mutations for all of our collections and creates mutations
          // for them.
          inventory
            .getCollections()
            .map(collection => createCollectionMutationFieldEntries(buildToken, collection))
            .reduce((a, b) => a.concat(b), [])
    ),
  ]

  // If there are no mutation fields, just return to avoid errors.
  if (mutationFieldEntries.length === 0)
    return

  return new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root mutation type which contains root level fields which mutate data.',
    fields: () => buildObject<GraphQLFieldConfig<mixed, mixed>>(mutationFieldEntries),
  })
}
