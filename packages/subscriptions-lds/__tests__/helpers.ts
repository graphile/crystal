import * as pg from "pg";
import { LDSLiveSource } from "../src/PgLDSSourcePlugin";

export const DATABASE_URL = process.env.LDS_TEST_DATABASE_URL || "lds_test";
export { PoolClient } from "pg";

export async function withClient<T = void>(
  connectionString: string,
  callback: (pgClient: pg.PoolClient) => Promise<T>
): Promise<T> {
  const pool = new pg.Pool({
    connectionString,
  });
  try {
    const client = await pool.connect();
    try {
      return await callback(client);
    } finally {
      await client.release();
    }
  } finally {
    await pool.end();
  }
}

export async function query(text: string, values: Array<any> = []) {
  return withClient(DATABASE_URL, pgClient => pgClient.query(text, values));
}

export async function withLiveSource<T = void>(
  callback: (liveSource: LDSLiveSource) => Promise<T>
): Promise<T> {
  const liveSource = new LDSLiveSource({
    connectionString: DATABASE_URL,
    sleepDuration: 50,
  });
  try {
    await liveSource.init();
    return await callback(liveSource);
  } finally {
    await liveSource.close();
  }
}

export async function withLiveSourceAndClient<T = void>(
  callback: (ls: LDSLiveSource, pgClient: pg.PoolClient) => Promise<T>
): Promise<T> {
  return withClient(DATABASE_URL, pgClient =>
    withLiveSource(liveSource => callback(liveSource, pgClient))
  );
}
