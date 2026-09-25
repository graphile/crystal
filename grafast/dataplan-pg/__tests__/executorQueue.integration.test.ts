import { execute } from "grafast";
import { parse } from "grafast/graphql";
import { Pool } from "pg";

import { PgExecutor } from "../dist/executor.js";
import { makeExampleSchema } from "../src/examples/exampleSchema.ts";
import type { PgClientQuery, WithPgClient } from "../src/index.ts";
import {
  createTestDatabase,
  dropTestDatabase,
  withTestWithPgClient,
} from "./sharedHelpers.ts";

test("a connection page and totalCount share one client lease", async () => {
  const { connectionString, databaseName } = await createTestDatabase();
  const pool = new Pool({ connectionString });
  try {
    const queries: PgClientQuery[] = [];
    await withTestWithPgClient(pool, queries, true, async (withPgClient) => {
      let leases = 0;
      const countedWithPgClient: WithPgClient = (pgSettings, callback) => {
        leases++;
        return withPgClient(pgSettings, callback);
      };
      const result = await execute({
        schema: makeExampleSchema(),
        document: parse(`
          {
            allMessagesConnection(first: 3) {
              nodes { body }
              totalCount
            }
          }
        `),
        contextValue: {
          pgSettings: { "app.test_setting": "queue" },
          withPgClient: countedWithPgClient,
        },
      });

      expect(result.errors).toBeUndefined();
      expect(result.data?.allMessagesConnection?.totalCount).toBe(6);
      expect(result.data?.allMessagesConnection?.nodes).toHaveLength(3);
      expect(leases).toBe(1);
      expect(queries.filter((q) => q.name)).toHaveLength(2);
      expect(queries.filter((q) => q.text === "begin")).toHaveLength(1);
      expect(queries.filter((q) => q.text === "commit")).toHaveLength(1);
    });
  } finally {
    await pool.end();
    await dropTestDatabase(databaseName);
  }
});

test("root fields with the same SQL share a prepared statement client", async () => {
  const { connectionString, databaseName } = await createTestDatabase();
  const pool = new Pool({ connectionString });
  try {
    const queries: PgClientQuery[] = [];
    await withTestWithPgClient(pool, queries, true, async (withPgClient) => {
      let leases = 0;
      const countedWithPgClient: WithPgClient = (pgSettings, callback) => {
        leases++;
        return withPgClient(pgSettings, callback);
      };
      const result = await execute({
        schema: makeExampleSchema(),
        document: parse(`
          {
            featured: allMessagesConnection(
              first: 1,
              condition: { featured: true }
            ) { nodes { body } }
            ordinary: allMessagesConnection(
              first: 1,
              condition: { featured: false }
            ) { nodes { body } }
          }
        `),
        contextValue: {
          pgSettings: { "app.test_setting": "queue" },
          withPgClient: countedWithPgClient,
        },
      });

      expect(result.errors).toBeUndefined();
      expect(result.data?.featured?.nodes).toHaveLength(1);
      expect(result.data?.ordinary?.nodes).toHaveLength(1);
      const statements = queries.filter((q) => q.name);
      expect(statements).toHaveLength(2);
      expect(statements[0].name).toBe(statements[1].name);
      expect(leases).toBe(1);
    });
  } finally {
    await pool.end();
    await dropTestDatabase(databaseName);
  }
});

test("a failed read rolls back before queued reads get a new lease", async () => {
  const { connectionString, databaseName } = await createTestDatabase();
  const pool = new Pool({ connectionString });
  try {
    await withTestWithPgClient(pool, [], true, async (withPgClient) => {
      let leases = 0;
      const countedWithPgClient: WithPgClient = (pgSettings, callback) => {
        leases++;
        return withPgClient(pgSettings, callback);
      };
      const context = {
        pgSettings: { "app.test_setting": "queue" },
        withPgClient: countedWithPgClient,
      };
      const executor = new PgExecutor({
        name: "queueErrorTest",
        context: () => null as any,
      });
      const executionAffinity = Symbol("same select");
      const run = (text: string) =>
        executor.executeWithCache([{ context, queryValues: [] }], {
          text,
          rawSqlValues: [],
          name: text,
          affinity: executionAffinity,
          eventEmitter: undefined,
        });

      const results = await Promise.allSettled([
        run("select 1"),
        run("select 1 / 0"),
        run("select 2"),
      ]);

      expect(results.map((r) => r.status)).toEqual([
        "fulfilled",
        "rejected",
        "fulfilled",
      ]);
      expect(leases).toBe(2);
    });
  } finally {
    await pool.end();
    await dropTestDatabase(databaseName);
  }
});
