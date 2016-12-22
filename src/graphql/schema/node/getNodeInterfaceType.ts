import { GraphQLInterfaceType, GraphQLNonNull, GraphQLID } from 'graphql'
import { memoize1, scrib } from '../../utils'
import getQueryGqlType, { $$isQuery } from '../getQueryGqlType'
import BuildToken from '../BuildToken'

export const $$nodeType = Symbol('nodeType')

const getNodeInterfaceType = memoize1(createNodeInterfaceType)

export default getNodeInterfaceType

function createNodeInterfaceType (buildToken: BuildToken): GraphQLInterfaceType<mixed> {
  const { options } = buildToken
  return new GraphQLInterfaceType<mixed>({
    name: 'Node',
    description: `An object with a globally unique ${scrib.type(GraphQLID)}.`,
    resolveType: (value: {}) => value === $$isQuery ? getQueryGqlType(buildToken) : value[$$nodeType],
    fields: {
      [options.nodeIdFieldName]: {
        description: 'A globally unique identifier. Can be used in various places throughout the system to identify this single value.',
        type: new GraphQLNonNull(GraphQLID),
      },
    },
  })
}
