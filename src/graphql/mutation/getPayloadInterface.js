import { memoize } from 'lodash'
import { GraphQLInterfaceType } from 'graphql'
import { payloadClientMutationId } from './clientMutationId.js'
import createViewerField from '../createViewerField.js'

const getPayloadInterface = memoize(schema =>
  new GraphQLInterfaceType({
    name: 'Payload',
    description: 'The payload of any mutation which contains a few important fields.',

    // We really don’t care about resolving a payload’s type, so just return null.
    resolveType: () => null,

    fields: {
      clientMutationId: payloadClientMutationId,
      viewer: createViewerField(schema),
    },
  })
)

export default getPayloadInterface
