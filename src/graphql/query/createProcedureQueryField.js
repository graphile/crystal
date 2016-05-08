import createProcedureReturnType from '../createProcedureReturnType.js'
import createProcedureArgs from '../createProcedureArgs.js'
import resolveProcedure from '../resolveProcedure.js'

const createProcedureQueryField = procedure => ({
  type: createProcedureReturnType(procedure),
  description: procedure.description,

  args: createProcedureArgs(procedure),

  resolve: resolveProcedure(
    procedure,
    (source, args) => args,
  ),
})

export default createProcedureQueryField
