import { Pool } from 'pg'
import { parse as parsePgConnectionString } from 'pg-connection-string'

const pgUrl = process.env.TEST_PG_URL || 'postgres://localhost:5432/postgraphile_test'

const pgPool = new Pool({
  ...parsePgConnectionString(pgUrl),
  max: 15,
  idleTimeoutMillis: 500,
})

export default pgPool
