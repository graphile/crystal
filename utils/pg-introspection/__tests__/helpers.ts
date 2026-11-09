import { after as afterAll, before as beforeAll } from "node:test";

import {
  createTestDatabaseWithPool,
  type TestDb,
  withTestDbPgClientTransaction,
} from "@localrepo/test-helpers";
import type { PoolClient } from "pg";

import type { RunQuery } from "../dist/interfaces.js";

/** Postgres pool */
let testDb: TestDb | undefined;

beforeAll(async () => {
  testDb = await createTestDatabaseWithPool();
});

afterAll(async () => {
  await testDb?.release();
  testDb = undefined;
});

/** Run a test in a transaction, rolling back and releasing its client afterwards. */
export async function withPgClientTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  return withTestDbPgClientTransaction(testDb, callback);
}

export function makeRunQuery(client: PoolClient): RunQuery {
  return async function runQuery(text, values) {
    const { rows } = await client.query<{ introspection: string }>({
      text,
      values,
    });
    return rows[0].introspection;
  };
}
