import { Client } from 'pg'
import pgPool from './pgPool'
import kitchenSinkSchemaSQL from './kitchenSinkSchemaSQL'

/**
 * Takes a function implementation of a test, and provides it a Postgres
 * client. The client will be connected from the pool at the start of the test,
 * and released back at the end. All changes will be rolled back.
 */
export default function withPGClient (fn: (client: Client) => void | Promise<void>) {
  return async () => {
    // Connect a client from our pool and begin a transaction.
    const client = await pgPool.connect()
    await client.query('begin')
    await client.query(await kitchenSinkSchemaSQL)

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
