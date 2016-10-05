import { GraphQLFieldConfig } from 'graphql'
import { Inventory, ObjectType } from '../../interface'

// TODO: doc
type BuildToken = {
  // TODO: doc
  inventory: Inventory,
  // TODO: doc
  options: {
    nodeIdFieldName: string,
  },
  // TODO: doc
  _hooks: _BuildTokenHooks,
}

// TODO: doc
export type _BuildTokenHooks = {
  queryFieldEntries?: (_gqlBuildToken: BuildToken) => Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>,
  mutationFieldEntries?: (_gqlBuildToken: BuildToken) => Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>,
  objectTypeFieldEntries?: (type: ObjectType, _gqlBuildToken: BuildToken) => Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>,
}

export default BuildToken
