// TODO: Make this a Typescript file when we have types for the `Pool` type
// in `pg`.

import { resolve as resolvePath } from 'path'
import { readFile } from 'fs'
import { Pool, Client } from 'pg'

const minify = require('pg-minify')

const pool = new Pool({
  database: 'postgraphql_test',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 500,
})

const kitchenSinkSchema = new Promise((resolve, reject) => {
  readFile(resolvePath(__dirname, 'kitchen-sink-schema.sql'), (error, data) => {
    if (error) reject(error)
    else resolve(minify(data.toString()))
  })
})

let clients = []

/**
 * Acquires a client that connects to our test database from a connection pool.
 * The clients acquired will automatically be released at the end of each test
 * so you don’t need to worry about releasing it yourself on a test-by-test
 * basis.
 *
 * This function also will automatically add the kitchen sink schema which
 * will be rolled back at the end of each test.
 *
 * This function also will automatically setup a transaction that will be
 * rolled back upon test completion.
 *
 * @returns {Promise<Client>}
 */
export default async function getTestPGClient ({ noKitchenSinkSchema } = {}) {
  const client = await pool.connect()
  clients.push(client)
  await client.query('begin')

  // If the user does not opt out of the kitchen sink schema, let’s apply it.
  if (!noKitchenSinkSchema) {
    try {
      await client.query(await kitchenSinkSchema)
    }
    catch (error) {
      // Make sure we log any errors we might run into. If we don’t do this
      // log, the thrown error is pretty cryptic.
      console.error('Failed to execute kitchen sink SQL:', error.stack)
      throw error
    }
  }

  // Wrap the query function in a Jest mock so that users in tests can inspect
  // what’s happening.
  client.query = jest.fn(client.query)

  return client
}

afterEach(async () => {
  await Promise.all(clients.map(async client => {
    await client.query('rollback')
    client.release()
  }))
  clients = []
})
