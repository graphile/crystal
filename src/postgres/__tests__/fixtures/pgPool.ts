import { Pool } from 'pg'
import { parse as parsePGConnectionString } from 'pg-connection-string'

const pgUrl = process.env.TEST_PG_URL || 'postgres://localhost:5432/postgraphql_test'

const pgPool = new Pool(Object.assign({}, parsePGConnectionString(pgUrl), {
  max: 15,
  idleTimeoutMillis: 500,
}))

export default pgPool
