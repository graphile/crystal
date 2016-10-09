import { GraphQLSchema, GraphQLOutputType, GraphQLInputType } from 'graphql'
import { Inventory, Type } from '../../interface'
import getCollectionGQLType from './collection/getCollectionGQLType'
import BuildToken, { _BuildTokenHooks } from './BuildToken'
import getQueryGQLType from './getQueryGQLType'
import getMutationGQLType from './getMutationGQLType'

export type SchemaOptions = {
  // The exact name for the node id field. In the past Relay wanted this to
  // be `id`, but there are some movements in the GraphQL standard to
  // standardize an `__id` field.
  nodeIdFieldName?: string,
  // If true then any literal will be accepted to this type and its output will
  // be plain JSON.
  dynamicJson?: boolean,
  // Some hooks to allow extension of the schema. Currently this API is
  // private. Use at your own risk.
  _hooks?: _BuildTokenHooks,
}

/**
 * Creates a GraphQL schema using an instance of `Inventory`.
 */
export default function createGQLSchema (inventory: Inventory, options: SchemaOptions = {}): GraphQLSchema {
  // We take our user-friendly arguments to `createGraphqlSchema` and convert them
  // into a build token. One nice side effect of always creating our own
  // build token object is that we have the guarantee that every build token
  // will always maintain its own memoization map.
  const buildToken: BuildToken = {
    inventory,
    options: {
      nodeIdFieldName: options.nodeIdFieldName || '__id',
      dynamicJson: options.dynamicJson || false,
    },
    _hooks: options._hooks || {},
  }

  return new GraphQLSchema({
    query: getQueryGQLType(buildToken),
    mutation: getMutationGQLType(buildToken),
    types: [
      // Make sure to always include the types for our collections, even if
      // they have no other output.
      ...inventory.getCollections().map(collection => getCollectionGQLType(buildToken, collection)),
    ],
  })
}
