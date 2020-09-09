import { PoolClient } from 'pg';
import pgPool from './pgPool';
import kitchenSinkSchemaSql from './kitchenSinkSchemaSql';

/**
 * Takes a function implementation of a test, and provides it a Postgres
 * client. The client will be connected from the pool at the start of the test,
 * and released back at the end. All changes will be rolled back.
 */
export default function withPgClient<T>(
  fn: (client: PoolClient) => T | Promise<T>,
): () => Promise<T> {
  return async (): Promise<T> => {
    let result: T | undefined;

    // Connect a client from our pool and begin a transaction.
    const client = await pgPool.connect();

    // There’s some wierd behavior with the `pg` module here where an error
    // is resolved correctly.
    //
    // @see https://github.com/brianc/node-postgres/issues/1142
    if ((client as Record<string, any>)['errno']) throw client;

    await client.query('begin');
    await client.query("set local timezone to '+04:00'");

    // Run our kichen sink schema Sql, if there is an error we should report it
    try {
      await client.query(await kitchenSinkSchemaSql);
    } catch (error) {
      // Release the client if an error was thrown.
      await client.query('rollback');
      client.release();
      // Log the error for debugging purposes.
      console.error(error.stack || error); // tslint:disable-line no-console
      throw error;
    }

    // Mock the query function.
    client.query = jest.fn(client.query);

    // Try to run our test, if it fails we still want to cleanup the client.
    try {
      result = await fn(client);
    } finally {
      // Always rollback our changes and release the client, even if the test
      // fails.
      await client.query('rollback');
      client.release();
    }

    // We will always define our result in the above block. It appears that
    // TypeScript cannot detect that so we need to tell it with the bang.
    return result!;
  };
}
