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
      `select * from ${procedureCall}` :
      `select ${procedureCall} as "output"`,
  }

  // If this is a table type, the return value is the entire object.
  const getOutput = row => (
    returnTable ?
      (row[$$rowTable] = returnTable, row) :
      row.output
  )

  return async (source, args, { client }) => {
    const procedureArgs = getProcedureArgs(source, args)

    const values = argEntries.map(([name]) => procedureArgs[camelCase(name)])

    // Actuall run the procedure using our arguments.
    const result = await client.queryAsync({
      name: query.name,
      text: query.text,
      values,
    })

    return procedure.returnsSet ?
      result.rows.map(getOutput) :
      getOutput(result.rows[0])
  }
}

export default resolveProcedure
