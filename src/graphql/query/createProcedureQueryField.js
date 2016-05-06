import { GraphQLList } from 'graphql'
import getType from '../getType.js'
import createProcedureArgs from '../createProcedureArgs.js'
import resolveProcedure from '../resolveProcedure.js'

const createProcedureQueryField = procedure => {
  const returnType = getType(procedure.returnType)
  return {
    type: procedure.returnsSet ? new GraphQLList(returnType) : returnType,
    description: procedure.description,

    args: createProcedureArgs(procedure),

    resolve: resolveProcedure(
      procedure,
      (source, args) => args,
    ),
  }
}

export default createProcedureQueryField
