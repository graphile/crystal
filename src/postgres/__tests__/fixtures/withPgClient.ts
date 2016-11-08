import { Client } from 'pg'
import pgPool from './pgPool'
import kitchenSinkSchemaSql from './kitchenSinkSchemaSql'

/**
 * Takes a function implementation of a test, and provides it a Postgres
 * client. The client will be connected from the pool at the start of the test,
 * and released back at the end. All changes will be rolled back.
 */
export default function withPgClient (fn: (client: Client) => void | Promise<void>): () => Promise<void> {
  return async (): Promise<void> => {
    // Connect a client from our pool and begin a transaction.
    const client = await pgPool.connect()

    // There’s some wierd behavior with the `pg` module here where an error
    // is resolved correctly.
    //
    // @see https://github.com/brianc/node-postgres/issues/1142
    if (client['errno'])
      throw client

    await client.query('begin')
    await client.query('set local timezone to \'EDT\'')

    // Run our kichen sink schema Sql, if there is an error we should report it
    try {
      await client.query(await kitchenSinkSchemaSql)
    }
    catch (error) {
      // tslint:disable-next-line no-console
      console.error(error.stack || error)
      throw error
    }

    // Mock the query function.
    client.query = jest.fn(client.query)

    // Try to run our test, if it fails we still want to cleanup the client.
    try {
      await fn(client)
    }
    // Always rollback our changes and release the client, even if the test
    // fails.
    finally {
      await client.query('rollback')
      client.release()
    }
  }
}
