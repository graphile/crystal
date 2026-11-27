import {
  createTestDatabaseWithPool,
  type TestDb,
} from "@localrepo/test-helpers";

/** Provision one isolated database for this Jest suite. */
export function useTestDatabase() {
  let db: TestDb | undefined;
  beforeAll(async () => {
    db = await createTestDatabaseWithPool();
  }, 30000);
  afterAll(async () => {
    await db?.release();
  }, 30000);
  return () => {
    if (db === undefined) {
      throw new Error("Test database has not been initialized");
    }
    return db;
  };
}
