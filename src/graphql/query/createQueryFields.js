import { memoize, fromPairs, ary, assign } from 'lodash'
import createAllNodeQueryField from './createAllNodeQueryField.js'
import createTableQueryFields from './createTableQueryFields.js'
import createProcedureQueryField from './createProcedureQueryField.js'

const createQueryFields = memoize(schema => ({
  // Add the node query field.
  node: createAllNodeQueryField(schema),
  // Add fields for procedures.
  ...fromPairs(
    schema
    .getProcedures()
    .filter(({ isMutation }) => !isMutation)
    .filter(procedure => !procedure.hasTableArg())
    .map(procedure => [procedure.getFieldName(), createProcedureQueryField(procedure)])
  ),
  // Add the table query fields.
  ...(
    schema
    .getTables()
    .map(table => createTableQueryFields(table))
    .reduce(ary(assign, 2), {})
  ),
}))

export default createQueryFields
