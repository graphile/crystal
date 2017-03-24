import { Pool } from 'pg'
import { parse as parsePgConnectionString } from 'pg-connection-string'

const pgCfg = process.env.TEST_PG_URL || null

if (pgCfg) {
  pgCfg = parsePgConnectionString(pgCfg)
} else {
  // be careful to not stomp on PG* environment variables
  pgCfg = {database: process.env.PGDATABASE || 'postgraphql_test'}
}

const pgPool = new Pool(Object.assign({}, pgCfg, {
  max: 15,
  idleTimeoutMillis: 500,
}))

export default pgPool
