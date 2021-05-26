import { Pool } from 'pg';
import { parse as parsePgConnectionString } from 'pg-connection-string';

const pgUrl = process.env.TEST_PG_URL || 'postgres:///postgraphile_test';

export const poolConfig = {
  ...parsePgConnectionString(pgUrl),
  max: 15,
  idleTimeoutMillis: 500,
};

const pgPool = new Pool(poolConfig);
pgPool.on('error', () => {/* swallow error */});

export default pgPool;
