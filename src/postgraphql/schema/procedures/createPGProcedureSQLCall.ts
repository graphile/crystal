import { sql } from '../../../postgres/utils'
import transformGQLInputValue from '../../../graphql/schema/transformGQLInputValue'
import transformValueIntoPGValue from '../../../postgres/inventory/transformValueIntoPGValue'
import { PGProcedureFixtures } from './createPGProcedureFixtures'

/**
 * Creates the actual Postgres procedure call using the fixtures created with `createPGProcedureFixtures`.
 */
export default function createPGProcedureSQLCall (
  fixtures: PGProcedureFixtures,
  input: { [key: string]: mixed },
): sql.SQL {
  const procedureName = sql.identifier(fixtures.pgNamespace.name, fixtures.pgProcedure.name)
  const procedureArgs = fixtures.args.map(({ inputName, gqlType, type }) => transformValueIntoPGValue(type, transformGQLInputValue(gqlType, input[inputName])))
  return sql.query`${procedureName}(${sql.join(procedureArgs, ', ')})`
}
