import { randomBytes } from "node:crypto";
import { after, before } from "node:test";
import { setTimeout } from "node:timers/promises";

import type { PoolClient } from "pg";
import pg from "pg";

const databaseName = `gctestdb_${randomBytes(8).toString("hex")}`;
let ownerPool: pg.Pool;
let testPool: pg.Pool | undefined;
let databaseCreated = false;

before(async () => {
  ownerPool = new pg.Pool({
    connectionString: `postgres:///${process.env.OWNER_DATABASE ?? "postgres"}`,
  });
  ownerPool.on("error", (error) => {
    console.error("Owner pool error:", error);
  });
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await ownerPool.query(
        `create database ${databaseName} with owner graphilecrystaltest template = graphilecrystaltest_template`,
      );
      databaseCreated = true;
      break;
    } catch (error) {
      if (attempt === 4) {
        throw error;
      }
      await setTimeout((attempt + 1) * 200);
    }
  }
  testPool = new pg.Pool({
    database: databaseName,
    user: "graphilecrystaltest",
    password: "test",
    host: process.env.PGHOST ?? "localhost",
  });
  testPool.on("error", (error) => {
    console.error("Test pool error:", error);
  });
});

after(async () => {
  try {
    await testPool?.end();
    if (databaseCreated) {
      await ownerPool.query(`drop database ${databaseName}`);
    }
  } finally {
    await ownerPool?.end();
  }
});

/** Run a test in a transaction, rolling back and releasing its client afterwards. */
export async function withPgClientTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  if (!testPool) {
    throw new Error("Test pool has not been initialized");
  }
  const client = await testPool.connect();
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
