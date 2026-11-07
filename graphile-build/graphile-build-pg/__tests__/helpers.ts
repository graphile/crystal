import {
  createTestDatabaseWithPool,
  type TestDb,
  withTestDbPgClientTransaction,
} from "@localrepo/test-helpers";
import type { PoolClient } from "pg";

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
