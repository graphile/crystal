import { camelCase } from 'lodash'
import { $$rowTable } from '../symbols.js'

const resolveProcedure = (procedure, getProcedureArgs) => {
  // If this type is a table type, this variable will be a reference to that table.
  const returnTable = procedure.returnType.isTableType && procedure.returnType.table

  const argEntries = Array.from(procedure.args)

  // Construct the qualified procedure name.
  const procedureName = `"${procedure.schema.name}"."${procedure.name}"`

  // Construct the argument list for the procedure call.
  const procedureArgsList = argEntries.map(([name, type], i) => {
    const placeholder = `$${i + 1}`

    // If the type of this argument is a table type, we will be expecting JSON
    // but we need that JSON to be a table. Therefore we run it through
    // `json_populate_record`.
    if (type.isTableType)
      return `json_populate_record(null::"${type.table.schema.name}"."${type.table.name}", ${placeholder})`

    return placeholder
  }).join(', ')

  // Add the procedure name with the procedure argument list.
  const procedureCall = `${procedureName}(${procedureArgsList})`

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

    const values = argEntries.map(([name]) => procedureArgs[camelCase(name)])

    // Actuall run the procedure using our arguments.
    const result = await client.queryAsync({
      name: query.name,
      text: query.text,
      values,
    })

    // If the procedure returns a set, return all of the rows.
    if (procedure.returnsSet)
      return result.rows.map(getOutput)

    return getOutput(result.rows[0])
  }
}

export default resolveProcedure
