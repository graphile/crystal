const createProcedureCall = procedure => {
  // Construct the qualified procedure name.
  const procedureName = `"${procedure.schema.name}"."${procedure.name}"`

  // Construct the argument list for the procedure call.
  const procedureArgsList = Array.from(procedure.args).map(([name, type], i) => {
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

  return procedureCall
}

export default createProcedureCall
