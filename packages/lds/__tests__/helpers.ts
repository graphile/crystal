import * as pg from "pg";
import PgLogicalDecoding from "../src/pg-logical-decoding";

export const DATABASE_URL = process.env.LDS_TEST_DATABASE_URL || "lds_test";
export { PoolClient } from "pg";

export async function tryDropSlot(slotName: string) {
  try {
    await withClient(DATABASE_URL, pgClient =>
      pgClient.query("select pg_drop_replication_slot($1)", [slotName])
    );
  } catch (e) {
    // Noop
  }
}

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

export async function withLdAndClient<T = void>(
  callback: (ld: PgLogicalDecoding, client: pg.PoolClient) => Promise<T>
): Promise<T> {
  return withClient(DATABASE_URL, pgClient =>
    withLd(ld => callback(ld, pgClient))
  );
}

export async function withLd<T = void>(
  callback: (ld: PgLogicalDecoding) => Promise<T>
): Promise<T> {
  const slotName = "get_ld";
  const ld = new PgLogicalDecoding(DATABASE_URL, {
    slotName,
    temporary: true,
  });
  await ld.createSlot();
  try {
    return await callback(ld);
  } finally {
    await ld.close();
  }
}
