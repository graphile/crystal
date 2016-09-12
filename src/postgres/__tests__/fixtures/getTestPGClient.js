import { Pool, Client } from 'pg'

const pool = new Pool({
  database: 'postgraphql_test',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 500,
})

let clients = []

/**
 * Acquires a client that connects to our test database from a connection pool.
 * The clients acquired will automatically be released at the end of each test
 * so you don’t need to worry about releasing it yourself on a test-by-test
 * basis.
 *
 * @returns {Promise<Client>}
 */
export default async function getTestPGClient () {
  const client = await pool.connect()
  clients.push(client)
  return client
}

afterEach(() => {
  clients.forEach(client => client.release())
  clients = []
})
