import { GraphQLOutputType, GraphQLFieldConfig } from 'graphql'
import { Inventory, Type, ObjectType } from '../../interface'

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
interface BuildToken {
  // The `Inventory` we are using to build the GraphQL schema.
  readonly inventory: Inventory,
  // Some options we can use to configure how we build our GraphQL schema.
  readonly options: {
    // Changes the name of the node field id on the node interface. Relay 1,
    // for example, wants the name to be `id`.
    readonly nodeIdFieldName: string,
    // By default, JSON is output as a string in our GraphQL queries. If true
    // then JSON will be output as a dynamic object.
    readonly dynamicJson: boolean,
    // If true then the default mutations for tables (e.g. createMyTable) will
    // not be created
    readonly disableDefaultMutations: boolean,
    // Path to read shcema injections from
    readonly schemaInjection: string,
  },
  // Hooks for adding custom fields/types into our schema.
  readonly _hooks: _BuildTokenHooks,
  // GraphQL type overrides. Currently private API.
  readonly _typeOverrides: _BuildTokenTypeOverrides,
}

/**
 * We want to allow extensibility in our GraphQL schema, so we provide some
 * hooks which allows consumers to add custom fields/types in certain places.
 * Currently hooks are a private API. They will likely change in the future.
 */
export type _BuildTokenHooks = {
  readonly queryFieldEntries?: (_gqlBuildToken: BuildToken) => Array<[string, GraphQLFieldConfig<never, mixed>]>,
  readonly mutationFieldEntries?: (_gqlBuildToken: BuildToken) => Array<[string, GraphQLFieldConfig<never, mixed>]>,
  readonly objectTypeFieldEntries?: <TValue>(type: ObjectType<TValue>, _gqlBuildToken: BuildToken) => Array<[string, GraphQLFieldConfig<TValue, mixed>]>,
}

/**
 * Overrides the GraphQL input and output of certain interface types. Can be
 * used for ‘special’ types that may be created from time to time. Currently
 * this is a private API.
 */
export type _BuildTokenTypeOverrides = Map<Type<mixed>, {
  input?: true,
  output?: GraphQLOutputType,
}>

export default BuildToken
