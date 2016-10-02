import { GraphQLObjectType, GraphQLFieldConfig } from 'graphql'
import { Inventory } from '../../interface'
import { buildObject, memoize1 } from '../utils'
import BuildToken from './BuildToken'
import createCollectionMutationFieldEntries from './collection/createCollectionMutationFieldEntries'
import createProcedureMutationGQLFieldEntry from './procedure/createProcedureMutationGQLFieldEntry'

/**
 * Gets the mutation type which includes all available mutations for our
 * schema. If there are no mutations, instead of throwing an error we will just
 * return `undefined`.
 */
const getGQLMutationType = memoize1(createGQLMutationType)

export default getGQLMutationType

/**
 * Internal create implementation for `getMutationType`.
 *
 * @private
 */
function createGQLMutationType (buildToken: BuildToken): GraphQLObjectType<mixed> | undefined {
  const { inventory } = buildToken

  // A list of all the mutations we are able to run.
  const mutationFieldEntries: Array<[string, GraphQLFieldConfig<mixed, mixed>]> = [
    ...(
      // Gets all the unstable procedures in our inventory and creates
      // appropriate mutations for them all. If a procedure has `isStable` set
      // to true, it will not have a mutation.
      inventory
        .getProcedures()
        .filter(procedure => !procedure.isStable)
        .map(procedure => createProcedureMutationGQLFieldEntry(buildToken, procedure))
    ),
    ...(
      // Get the mutations for all of our collections and creates mutations
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
