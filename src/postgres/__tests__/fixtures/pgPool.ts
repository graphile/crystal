import { Pool } from 'pg'
import { parse as parsePgConnectionString } from 'pg-connection-string'

const pgUrl = process.env.TEST_Pg_URL || 'postgres://localhost:5432/postgraphql_test'

const pgPool = new Pool(Object.assign({}, parsePgConnectionString(pgUrl), {
  max: 15,
  idleTimeoutMillis: 500,
}))

export default pgPool
