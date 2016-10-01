import { Pool } from 'pg'

const pgPool = new Pool({
  database: 'postgraphql_test',
  port: 5432,
  max: 15,
  idleTimeoutMillis: 500,
})

export default pgPool
