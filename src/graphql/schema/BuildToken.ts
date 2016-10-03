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
  _hooks: {
    queryFieldEntries: () => Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>,
    mutationFieldEntries: () => Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>,
    objectTypeFieldEntries: (type: ObjectType) => Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>,
  },
}

export default BuildToken
