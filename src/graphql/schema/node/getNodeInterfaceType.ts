import { GraphQLInterfaceType, GraphQLNonNull, GraphQLID } from 'graphql'
import { memoize1, scrib } from '../../utils'
import BuildToken from '../BuildToken'

// TODO: doc why this is memoized
const getNodeInterfaceType = memoize1(createNodeInterfaceType)

export default getNodeInterfaceType

// TODO: doc
function createNodeInterfaceType (buildToken: BuildToken): GraphQLInterfaceType<mixed> {
  const { options } = buildToken
  return new GraphQLInterfaceType<mixed>({
    name: 'Node',
    description: `An object with a globally unique ${scrib.type(GraphQLID)}.`,
    fields: {
      [options.nodeIdFieldName]: {
        description: 'A globally unique identifier. Can be used in various places throughout the system to identify this single value.',
        type: new GraphQLNonNull(GraphQLID),
      },
    },
  })
}
