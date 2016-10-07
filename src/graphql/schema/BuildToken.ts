import { GraphQLFieldConfig } from 'graphql'
import { Inventory, ObjectType } from '../../interface'

/**
 * A `BuildToken` is a plain object that gets passed around to all of the
 * functions used to create a GraphQL schema. The `BuildToken` contains a copy
 * of the `Inventory`, some options, and some extra hooks.
 *
 * The reason we use this pattern is twofold:
 *
 * 1. When we memoize, all memoizations will be invalid with different
 *    `BuildToken`s allowing us to build the schema multiple times just with
 *    different tokens.
 * 2. The `BuildToken` provides context to all of the functions. Being able to
 *    access `Inventory` and other options from arbitrary functions is
 *    necessary, a `BuildToken` makes that possible.
 */
type BuildToken = {
  // The `Inventory` we are using to build the GraphQL schema.
  inventory: Inventory,
  // Some options we can use to configure how we build our GraphQL schema.
  options: {
    // Changes the name of the node field id on the `Node` interface. Relay 1,
    // for example, wants the name to be `id`. Soon in the GraphQL spec, an
    // `__id` field will be standardized.
    nodeIdFieldName: string,
    // By default, JSON is output as a string in our GraphQL queries. If true
    // then JSON will be output as a dynamic object.
    dynamicJson: boolean,
  },
  // Hooks for adding custom fields/types into our schema.
  _hooks: _BuildTokenHooks,
}

/**
 * We want to allow extensibility in our GraphQL schema, so we provide some
 * hooks which allows consumers to add custom fields/types in certain places.
 * Currently hooks are a private API. They will likely change in the future.
 *
 * @private
 */
export type _BuildTokenHooks = {
  queryFieldEntries?: (_gqlBuildToken: BuildToken) => Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>,
  mutationFieldEntries?: (_gqlBuildToken: BuildToken) => Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>,
  objectTypeFieldEntries?: (type: ObjectType, _gqlBuildToken: BuildToken) => Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>,
}

export default BuildToken
