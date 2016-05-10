import { constant, camelCase } from 'lodash'
import createConnectionType from '../createConnectionType.js'
import createProcedureReturnType from '../createProcedureReturnType.js'
import createProcedureArgs from '../createProcedureArgs.js'
import createConnectionArgs from '../createConnectionArgs.js'
import createProcedureCall from '../createProcedureCall.js'
import resolveProcedure from '../resolveProcedure.js'
import resolveConnection from '../resolveConnection.js'

const createProcedureQueryField = procedure => {
  const argEntries = Array.from(procedure.args)
  const returnTable = procedure.getReturnTable()

  const procedureArgs = createProcedureArgs(procedure)

  // If this is a connection, return a completely different field…
  if (procedure.returnsSet && returnTable) {
    return {
      type: createConnectionType(returnTable),
      description: procedure.description,

      args: {
        // Add the arguments for the procedure.
        ...procedureArgs,
        // Add the arguments for the connection, if this is a connection.
        ...createConnectionArgs(returnTable, true),
      },

      resolve: resolveConnection(
        returnTable,
        constant({}),
        (source, args) => ({
          text: createProcedureCall(procedure),
          values: argEntries.map(([name]) => args[camelCase(name)]),
        }),
      ),
    }
  }

  return {
    type: createProcedureReturnType(procedure),
    description: procedure.description,
    args: procedureArgs,

    resolve: resolveProcedure(
      procedure,
      (source, args) => args,
    ),
  }
}

export default createProcedureQueryField
