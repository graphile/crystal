import { sql } from '../../../postgres/utils'
import transformValueIntoPGValue from '../../../postgres/inventory/transformValueIntoPGValue'
import { PGProcedureFixtures } from './createPGProcedureFixtures'

/**
 * Creates the actual Postgres procedure call using the fixtures created with
 * `createPGProcedureFixtures`.
 *
 * The input is an array of values. Not GraphQL input values, but actual
 * values that correspond to the procedure arguments.
 *
 * It will also check to see the minimum number of values we can use to call
 * the function. This way defaults can kick in.
 */
// TODO: test
export default function createPGProcedureSQLCall (
  fixtures: PGProcedureFixtures,
  values: Array<mixed>,
): sql.SQL {
  if (values.length !== fixtures.args.length)
    throw new Error('Input tuple is of the incorrect length for procedure call.')

  // The last argument that is not null, excluding the value at this index.
  let lastArgIdx = values.length

  // Reverse loop through our values. We want to see what arguments have
  // defaults that we can skip when generating the call.
  for (let i = values.length - 1; i >= 0; i--) {
    // If the value at this index is nullish, set the `lastArgIdx` to `i` and
    // continue.
    if (values[i] == null) lastArgIdx = i
    // If the value is not nullish, we are done. Break out of our loop.
    else break
  }

  const procedureName = sql.identifier(fixtures.pgNamespace.name, fixtures.pgProcedure.name)
  const procedureArgs = fixtures.args.slice(0, lastArgIdx).map(({ type }, i) => transformValueIntoPGValue(type, values[i]))

  return sql.query`${procedureName}(${sql.join(procedureArgs, ', ')})`
}
