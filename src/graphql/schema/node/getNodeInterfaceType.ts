import { GraphQLInterfaceType, GraphQLNonNull, GraphQLID } from 'graphql'
import { memoize1 } from '../../utils/memoize'
import Context from '../Context'

// TODO: doc why this is memoized
const getNodeInterfaceType = memoize1(createNodeInterfaceType)

export default getNodeInterfaceType

// TODO: doc
function createNodeInterfaceType (context: Context): GraphQLInterfaceType<mixed> {
  const { options } = context
  return new GraphQLInterfaceType<mixed>({
    name: 'Node',
    // TODO: description
    fields: {
      [options.nodeIdFieldName]: {
        type: new GraphQLNonNull(GraphQLID),
        // TODO: description
      },
    },
  })
}
