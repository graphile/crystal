import { fromPairs, camelCase, upperFirst, lowerFirst, assign } from 'lodash'
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
        Array.from(procedure.args).map(([name, type]) => [camelCase(name), {
          type: procedure.isStrict ?
            new GraphQLNonNull(getType(type)) :
            getType(type),
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
  const returnsTable = procedure.returnType.isTableType
  const argEntries = Array.from(procedure.args)

  // Construct the procedure call. It is pretty long so having it on multiple
  // lines is helpful.
  const procedureName = `"${procedure.schema.name}"."${procedure.name}"`
  const procedureArgs = argEntries.map((entry, i) => `$${i + 1}`).join(', ')
  const procedureCall = `${procedureName}(${procedureArgs})`

  // Construct the query.
  //
  // If the procedure returns a table type let’s select all of its values
  // instead of just a tuple.
  const query = {
    name: `procedure_${procedure.name}`,
    text: returnsTable ?
      `select * from ${procedureCall}` :
      `select ${procedureCall} as "returnValue"`,
  }

  return async (source, args, { client }) => {
    const { input } = args
    const { clientMutationId } = input

    // Actuall run the procedure using our arguments.
    const result = await client.queryAsync({
      name: query.name,
      text: query.text,
      values: argEntries.map(([name]) => input[camelCase(name)]),
    })

    return {
      clientMutationId,
      // If this is a table type, the return value is the entire object.
      returnValue: returnsTable ?
        assign(result.rows[0], { table: procedure.returnType.table }) :
        result.rows[0].returnValue,
    }
  }
}
