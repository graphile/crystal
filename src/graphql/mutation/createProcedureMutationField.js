import { camelCase, upperFirst, memoize } from 'lodash'
import { GraphQLObjectType, GraphQLNonNull, GraphQLInputObjectType } from 'graphql'
import createProcedureReturnType from '../createProcedureReturnType.js'
import createProcedureArgs from '../createProcedureArgs.js'
import resolveProcedure from '../resolveProcedure.js'
import { inputClientMutationId, payloadClientMutationId } from './clientMutationId.js'

const createProcedureMutationField = procedure => ({
  type: createPayloadType(procedure),
  description: procedure.description,

  args: {
    input: {
      type: new GraphQLNonNull(createInputType(procedure)),
    },
  },

  resolve: async (source, args, context) => {
    const { input } = args
    const { clientMutationId } = input
    return {
      output: await getResolveProcedure(procedure)(source, args, context),
      clientMutationId,
    }
  },
})

export default createProcedureMutationField

const createInputType = procedure =>
  new GraphQLInputObjectType({
    name: `${upperFirst(camelCase(procedure.name))}Input`,
    description: `The input object for the ${procedure.getMarkdownFieldName()} procedure.`,

    fields: {
      ...createProcedureArgs(procedure),
      clientMutationId: inputClientMutationId,
    },
  })

const createPayloadType = procedure =>
  new GraphQLObjectType({
    name: `${upperFirst(camelCase(procedure.name))}Payload`,
    description: `The payload returned by the ${procedure.getMarkdownFieldName()}`,

    // Our payload has two fields, one is the return type. The name of which is
    // the type name, so a `Circle` would have a field name of `circle` and a
    // `Person` would have a field name of `person`. And the Relay required
    // `clientPayloadId` field.
    fields: {
      output: {
        // Get the GraphQL return type for the procedure’s return type. If the
        // procedure is to return a set, we need to reflect that in our GraphQL type
        // as well.
        type: createProcedureReturnType(procedure),
        description: `The actual value returned by ${procedure.getMarkdownFieldName()}`,
        resolve: ({ output }) => output,
      },
      clientMutationId: payloadClientMutationId,
    },
  })

const getResolveProcedure = memoize(procedure => resolveProcedure(
  procedure,
  (source, { input }) => input,
))
