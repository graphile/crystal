import { fromPairs, camelCase, upperFirst, lowerFirst } from 'lodash'
import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInputObjectType } from 'graphql'
import getType from '../getType.js'
import { inputClientMutationId, payloadClientMutationId } from './clientMutationId.js'

const createProcedureMutationField = procedure => ({
  type: createPayloadType(procedure),
  description: procedure.description,

  args: {
    input: {
      type: new GraphQLNonNull(createInputType(procedure)),
    },
  },

  resolve: resolveProcedure(procedure),
})

export default createProcedureMutationField

const createInputType = procedure =>
  new GraphQLInputObjectType({
    name: `${upperFirst(camelCase(procedure.name))}Input`,
    description: `The input object for the ${procedure.getMarkdownFieldName()} procedure.`,

    fields: {
      ...fromPairs(
        // For all of our argument types, make a key/value pair which will
        // eventually be transformed into a GraphQL argument object. We use the
        // name from `argNames` and the type from `argTypes` (we also assume they
        // are arrays of equal lengths). If the procedure is marked as strict, all
        // arguments also must be required.
        procedure.argTypes.map((argType, i) => [camelCase(procedure.argNames[i]), {
          type: procedure.isStrict ?
            new GraphQLNonNull(getType(argType)) :
            getType(argType),
        }])
      ),
      clientMutationId: inputClientMutationId,
    },
  })

const createPayloadType = procedure => {
  const returnType = getType(procedure.returnType)

  return new GraphQLObjectType({
    name: `${upperFirst(camelCase(procedure.name))}Payload`,
    description: `The payload returned by the ${procedure.getMarkdownFieldName()}`,

    // Our payload has two fields, one is the return type. The name of which is
    // the type name, so a `Circle` would have a field name of `circle` and a
    // `Person` would have a field name of `person`. And the Relay required
    // `clientPayloadId` field.
    fields: {
      [lowerFirst(returnType.name)]: {
        // Get the GraphQL return type for the procedure’s return type. If the
        // procedure is to return a set, we need to reflect that in our GraphQL type
        // as well.
        type: procedure.returnsSet ? new GraphQLList(returnType) : returnType,
        description: `The actual value returned by ${procedure.getMarkdownFieldName()}`,
        resolve: source => source.returnValue,
      },
      clientMutationId: payloadClientMutationId,
    },
  })
}

const resolveProcedure = procedure => {
  // Construct the query. The actual procedure call is pretty long so we split
  // it into two lines.
  const query = {
    name: `procedure_${procedure.name}`,
    text:
      `select "${procedure.schema.name}"."${procedure.name}"` +
      `(${procedure.argTypes.map((type, i) => `$${i + 1}`)}) ` +
      'as "returnValue"',
  }

  return async (source, args, { client }) => {
    const { input } = args
    const { clientMutationId } = args

    // Actuall run the procedure using our arguments.
    const result = await client.queryAsync({
      name: query.name,
      text: query.text,
      values: procedure.argNames.map(name => input[camelCase(name)]),
    })

    return {
      returnValue: result.rows[0].returnValue,
      clientMutationId,
    }
  }
}
