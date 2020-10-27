import type { Pool } from 'pg';
import type { PostGraphileOptions } from '../../';

// Connection string (or pg.Pool) for PostGraphile to use
export const database: string | Pool = process.env.DATABASE_URL || 'postgraphile';

// Database schemas to use
export const schemas: string | string[] = ['public'];

// PostGraphile options; see https://www.graphile.org/postgraphile/usage-library/#api-postgraphilepgconfig-schemaname-options
export const options: PostGraphileOptions = {
  watchPg: true,
  graphiql: true,
  enhanceGraphiql: true,
  subscriptions: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  showErrorStack: 'json',
  extendedErrors: ['hint', 'detail', 'errcode'],
  allowExplain: true,
  legacyRelations: 'omit',
};

export const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
