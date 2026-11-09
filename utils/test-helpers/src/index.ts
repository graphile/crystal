import { randomBytes } from "node:crypto";

import type { PoolClient } from "pg";
import { Client, Pool } from "pg";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runSqlAsRoot(sql: string, maxAttempts = 1) {
  let error: Error | undefined;
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    if (attempts > 0) {
      // Randomize to avoid thundering herd
      await sleep((0.5 + Math.random()) * attempts * 200);
    }
    try {
      const rootClient = new Client(
        `postgres:///${process.env.OWNER_DATABASE ?? "postgres"}`,
      );
      await rootClient.connect();
      try {
        await rootClient.query(sql);
      } finally {
        await rootClient.end();
      }
      return;
    } catch (e) {
      error = e;
    }
  }
  throw error ?? new Error("Failed to run SQL as root");
}

export async function createTestDatabase() {
  const databaseName = `gctestdb_${randomBytes(8).toString("hex")}`;

  await runSqlAsRoot(
    `create database ${databaseName} with owner graphilecrystaltest template = graphilecrystaltest_template;`,
    5,
  );

  const host = process.env.PGHOST ?? "localhost";

  const connectionString = host.includes("/")
    ? `socket://graphilecrystaltest:test@${host}?db=${encodeURIComponent(
        databaseName,
      )}`
    : `postgres://graphilecrystaltest:test@${host}/${databaseName}`;
  return { databaseName, connectionString };
}

export async function dropTestDatabase(databaseName: string) {
  if (!databaseName) {
    return;
  }
  try {
    await runSqlAsRoot(`drop database ${databaseName};`, 2);
  } catch {
    // Noop
  }
}

export async function createTestDatabaseWithPool() {
  const { connectionString, databaseName } = await createTestDatabase();
  const pgPool = new Pool({
    connectionString,
  });
  pgPool.on("connect", (client) => {
    client.on("error", () => {});
    client.query(`set TimeZone to '+04:00'`).catch(() => {});
  });
  pgPool.on("error", (e) => {
    console.error("Pool error:", e);
  });

  return {
    connectionString,
    databaseName,
    pgPool,
    async release() {
      try {
        await pgPool.end();
      } finally {
        await dropTestDatabase(databaseName);
      }
      if (pgPool.totalCount > 0) {
        console.warn(
          `Warning: ${pgPool.totalCount} clients are still in the pool`,
        );
      }
    },
  };
}

export type TestDb = Awaited<ReturnType<typeof createTestDatabaseWithPool>>;

export async function withTestDbPgClientTransaction<T>(
  testDb: TestDb | undefined,
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  if (!testDb) {
    throw new Error("Test DB has not been initialized");
  }
  const client = await testDb.pgPool.connect();
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
