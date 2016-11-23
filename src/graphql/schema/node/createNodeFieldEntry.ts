import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import { Collection, ObjectType } from '../../../interface'
import { idSerde, scrib } from '../../utils'
import BuildToken from '../BuildToken'
import { $$isQuery } from '../getQueryGqlType'
import getNodeInterfaceType from './getNodeInterfaceType'

export const $$nodeValueCollection = Symbol('nodeValueCollection')

// TODO: doc
export default function createNodeFieldEntry (buildToken: BuildToken): [string, GraphQLFieldConfig<mixed, mixed>] {
  const { inventory, options } = buildToken
  return ['node', {
    description: `Fetches an object given its globally unique ${scrib.type(GraphQLID)}.`,
    type: getNodeInterfaceType(buildToken),
    args: {
      [options.nodeIdFieldName]: {
        description: `The globally unique ${scrib.type(GraphQLID)}.`,
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    async resolve (_source: mixed, args: { [key: string]: mixed }, context: mixed): Promise<ObjectType.Value | Symbol | null> {
      let deserializationResult: { collection: Collection, keyValue: mixed }
      const idString = args[options.nodeIdFieldName]

      if (typeof idString !== 'string')
        throw new Error('ID argument must be a string.')

      // If the id is simply `query`, we want to give back our root query type.
      // For now this is needed for Relay 1 mutations, maybe deprecate this in
      // the future?
      if (idString === 'query')
        return $$isQuery

      // Try to deserialize the id we got from our argument. If we fail to
      // deserialize the id, we should just return null and ignore the error.
      try {
        deserializationResult = idSerde.deserialize(inventory, idString)
      }
      catch (error) {
        return null
      }

      const { collection, keyValue } = deserializationResult
      const primaryKey = collection.primaryKey

      if (!primaryKey || !primaryKey.read)
        throw new Error(`Invalid id, no readable primary key on collection named '${name}'.`)

      const value = await primaryKey.read(context, keyValue)

      // If the value is null, end early.
      if (value == null)
        return value

      // Add the collection to the value so we can accurately determine the
      // type. This way we will know exactly which collection this is for and
      // can avoid ambiguous `isTypeOf` checks.
      value[$$nodeValueCollection] = collection

      return value
    },
  }]
}
