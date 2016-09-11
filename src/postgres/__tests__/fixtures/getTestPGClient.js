import { Pool, Client } from 'pg'

const pool = new Pool({
  database: 'postgraphql_test',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 1000,
})

/**
 * @returns {Promise<Client>}
 */
export default async function getPGTestClient () {
  const client = await pool.connect()
  return client
}
