import { $$pgClient } from '../postgres/inventory/pgClientFromContext'
import debugPgClient from './http/debugPgClient'
import setupPgClientTransaction from './setupPgClientTransaction'

/*

This is intended to be called similar to this:

    const result = await withPostGraphQLContext({ ...options, pgPool, jwtToken }, async context => (
      await graphql(
        schema,
        query,
        null,
        {  ...context },
        variables,
        operationName,
      )
    ))

*/

export default async function withPostGraphQLContext({pgPool, jwtToken, ...options}, functionToRun) {
  // Connect a new Postgres client and start a transaction.
  const pgClient = await pgPool.connect()

  // Enhance our Postgres client with debugging stuffs.
  debugPgClient(pgClient)

  // Begin our transaction and set it up.
  await pgClient.query('begin')
  const pgRole = await setupPgClientTransaction(jwtToken, pgClient, options)

  // Run the function with a context object that can be passed through
  try {
    return await functionToRun({
      [$$pgClient]: pgClient,
      pgRole,
    })
  }
  // Cleanup our Postgres client by ending the transaction and releasing
  // the client back to the pool. Always do this even if the query fails.
  finally {
    await pgClient.query('commit')
    pgClient.release()
  }
};
