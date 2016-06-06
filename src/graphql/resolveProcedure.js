import { camelCase, isArray, mapValues } from 'lodash'
import { $$rowTable } from '../symbols.js'
import createProcedureCall from './createProcedureCall.js'

function asPgValue (value) {
  const newValue = isArray(value) ? `{${value.map(i => JSON.stringify(i)).join(',')}}` : value
  return newValue
}

const resolveProcedure = (procedure, getProcedureArgs) => {
  // If this type is a table type, this variable will be a reference to that table.
  const returnTable = procedure.getReturnTable()
  const argEntries = Array.from(procedure.args)
  const procedureCall = createProcedureCall(procedure)

  // Construct the query.
  //
  // If the procedure returns a table type let’s select all of its values
  // instead of just a tuple.
  const query = {
    name: `procedure_${procedure.name}`,
    text: returnTable ?
      `select row_to_json(${procedureCall}) as "output"` :
      `select ${procedureCall} as "output"`,
  }

  // Gets the output from a row returned by our query.
  const getOutput = ({ output }) => {
    if (!output) return null

    // If we are returning a table, we need to make sure to add the row table
    // identifier property to our output object.
    if (returnTable)
      output[$$rowTable] = returnTable

    return output
  }

  return async (source, args, { client }) => {
    const procedureArgs = getProcedureArgs(source, args)

    const values = argEntries.map(([name, type]) => {
      const obj = procedureArgs[camelCase(name)]

      // See https://github.com/calebmer/postgraphql/pull/58
      if (type.isTableType) {
        mapValues(obj, (val, key) => {
          obj[key] = asPgValue(val)
        })
      }

      return obj
    })

    // Actuall run the procedure using our arguments.
    const result = await client.queryAsync({ ...query, values })

    // If the procedure returns a set, return all of the rows.
    if (procedure.returnsSet)
      return result.rows.map(getOutput)

    return getOutput(result.rows[0])
  }
}

export default resolveProcedure
