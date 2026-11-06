import { Pool, PoolClient } from "pg";
import {
  createTestDatabase,
  dropTestDatabase,
} from "../../../grafast/dataplan-pg/__tests__/sharedHelpers.ts";
import { after as afterAll, before as beforeAll } from "node:test";

/** Postgres pool */
let pgPool: Pool | null = null;
let connectionString = "";
let databaseName = "";

beforeAll(async () => {
  ({ connectionString, databaseName } = await createTestDatabase());
  pgPool = new Pool({
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
  await pgPool!.end();
  await dropTestDatabase(databaseName);
  const p = pgPool as any;
  if (p._clients.length > 0) {
    console.warn(`Warning: ${p._clients.length} clients are still in the pool`);
  }
  pgPool = null;
});

/** Run a test in a transaction, rolling back and releasing its client afterwards. */
export async function withPgClientTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  if (!pgPool) {
    throw new Error("Test pool has not been initialized");
  }
  const client = await pgPool.connect();
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
