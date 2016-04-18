import { GraphQLString } from 'graphql'

export const inputClientMutationId = {
  type: GraphQLString,
  description:
    'An optional mutation ID for client’s to use in tracking mutations. ' +
    'This field has no meaning to the server and is simply returned as ' +
    'is.',
}

export const payloadClientMutationId = {
  type: GraphQLString,
  description:
    'If the mutation was passed a `clientMutationId` in the input object this ' +
    'is the exact same value echoed back.',
  resolve: ({ clientMutationId }) => clientMutationId,
}
