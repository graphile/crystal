import { camelCase, assign } from 'lodash'

const resolveProcedure = (procedure, getProcedureArgs) => {
  const returnsTable = procedure.returnType.isTableType
  const argEntries = Array.from(procedure.args)

  // Construct the procedure call. It is pretty long so having it on multiple
  // lines is helpful.
  const procedureName = `"${procedure.schema.name}"."${procedure.name}"`
  const procedureArgsList = argEntries.map((entry, i) => `$${i + 1}`).join(', ')
  const procedureCall = `${procedureName}(${procedureArgsList})`

  // Construct the query.
  //
  // If the procedure returns a table type let’s select all of its values
  // instead of just a tuple.
  const query = {
    name: `procedure_${procedure.name}`,
    text: returnsTable ?
      `select * from ${procedureCall}` :
      `select ${procedureCall} as "output"`,
  }

  // If this is a table type, the return value is the entire object.
  const getOutput = row => (
    returnsTable ?
      assign(row, { table: procedure.returnType.table }) :
      row.output
  )

  return async (source, args, { client }) => {
    const procedureArgs = getProcedureArgs(source, args)

    // Actuall run the procedure using our arguments.
    const result = await client.queryAsync({
      name: query.name,
      text: query.text,
      values: argEntries.map(([name]) => procedureArgs[camelCase(name)]),
    })

    return procedure.returnsSet ?
      result.rows.map(getOutput) :
      getOutput(result.rows[0])
  }
}

export default resolveProcedure
