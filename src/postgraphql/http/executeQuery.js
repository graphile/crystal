import debugPgClient from './debugPgClient'
import setupRequestPgClientTransaction from './setupRequestPgClientTransaction'
import { $$pgClient } from '../../postgres/inventory/pgClientFromContext'
import {
  Source,
  parse as parseGraphql,
  validate as validateGraphql,
  execute as executeGraphql,
  getOperationAST,
  formatError as defaultFormatError,
  print as printGraphql,
} from 'graphql'

export default async function(
  pgPool,
  options,
  jwtToken,
  gqlSchema,
  queryDocumentAst,
  variables,
  operationName,
) {

  // Connect a new Postgres client and start a transaction.
  const pgClient = await pgPool.connect()

  // Enhance our Postgres client with debugging stuffs.
  debugPgClient(pgClient)

  // Begin our transaction and set it up.
  await pgClient.query('begin')
  let pgRole = await setupRequestPgClientTransaction(jwtToken, pgClient, {
    jwtSecret: options.jwtSecret,
    pgDefaultRole: options.pgDefaultRole,
  })

  let result
  try {
    result = await executeGraphql(
      gqlSchema,
      queryDocumentAst,
      null,
      { [$$pgClient]: pgClient },
      variables,
      operationName,
    )
  }
  // Cleanup our Postgres client by ending the transaction and releasing
  // the client back to the pool. Always do this even if the query fails.
  finally {
    await pgClient.query('commit')
    pgClient.release()

  }
  return {result, pgRole}
}
