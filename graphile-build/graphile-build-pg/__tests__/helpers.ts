import type { Pool, PoolClient } from "pg";
import pg from "pg";

import {
  createTestDatabase,
  dropTestDatabase,
} from "../../../grafast/dataplan-pg/__tests__/sharedHelpers.ts";

let pgPool: Pool | null = null;
let connectionString = "";
let databaseName = "";

beforeAll(async () => {
  ({ connectionString, databaseName } = await createTestDatabase());
  pgPool = new pg.Pool({
    connectionString,
  });
  pgPool.on("connect", (client) => {
    client.on("error", () => {});
    client.query(`set TimeZone to '+04:00'`).catch(() => {});
  });
  pgPool.on("error", (e) => {
    console.error("Pool error:", e);
  });
});

afterAll(async () => {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
  await dropTestDatabase(databaseName);
});

/** Run a test with a pooled client, rolling back its changes afterwards. */
export async function withPgClientTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pgPool!.connect();
  try {
    await client.query("begin");
    try {
      return await callback(client);
    } finally {
      await client.query("rollback");
    }
  } finally {
    client.release();
  }
}
