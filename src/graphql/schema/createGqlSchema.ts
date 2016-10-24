import { GraphQLSchema } from 'graphql'
import { Inventory } from '../../interface'
import BuildToken, { _BuildTokenHooks, _BuildTokenTypeOverrides } from './BuildToken'
import getQueryGqlType from './getQueryGqlType'
import getMutationGqlType from './getMutationGqlType'

export type SchemaOptions = {
  // The exact name for the node id field. In the past Relay wanted this to
  // be `id`, but there are some movements in the GraphQL standard to
  // standardize an `__id` field.
  nodeIdFieldName?: string,
  // If true then any literal will be accepted to this type and its output will
  // be plain JSON.
  dynamicJson?: boolean,
  // If true then the default mutations for tables (e.g. createMyTable) will
  // not be created
  disableDefaultMutations?: boolean,
  // Some hooks to allow extension of the schema. Currently this API is
  // private. Use at your own risk.
  _hooks?: _BuildTokenHooks,
  // GraphQL types that override the default type generation. Currently this
  // API is private. Use at your own risk.
  _typeOverrides?: _BuildTokenTypeOverrides,
}

/**
 * Creates a GraphQL schema using an instance of `Inventory`.
 */
export default function createGqlSchema (inventory: Inventory, options: SchemaOptions = {}): GraphQLSchema {
  // We take our user-friendly arguments to `createGraphqlSchema` and convert them
  // into a build token. One nice side effect of always creating our own
  // build token object is that we have the guarantee that every build token
  // will always maintain its own memoization map.
  const buildToken: BuildToken = {
    inventory,
    options: {
      nodeIdFieldName: options.nodeIdFieldName || '__id',
      dynamicJson: options.dynamicJson || false,
      disableDefaultMutations: options.disableDefaultMutations || false,
    },
    _hooks: options._hooks || {},
    _typeOverrides: options._typeOverrides || new Map(),
  }

  return new GraphQLSchema({
    query: getQueryGqlType(buildToken),
    mutation: getMutationGqlType(buildToken),
  })
}
